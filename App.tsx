import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Edit2, X, Trash2, MapPin, 
  ExternalLink, Image as ImageIcon, CheckCircle, 
  ChevronDown, MessageSquare, Info, Star, ChevronRight, Clock,
  Coins, PlaneTakeoff, Heart, Upload, Link as LinkIcon
} from 'lucide-react';

// --- 1. 定義類型 ---
interface Activity {
  id: string;
  time: string;
  description: string;
  locationUrl?: string;
  imageUrl?: string;
  notes?: string;
}

interface TripDay {
  id: string;
  date: string;
  title: string;
  activities: Activity[];
}

interface Tip {
  title: string;
  icon: React.ReactNode;
  content: string;
}

// --- 2. 定義資料 ---
const CORE_CONCLUSION = "最好的旅行，是在未知的風景中發現全新的自己。薄荷島的藍，會成為你今年最難忘的背景色。";

const KEY_TIPS: Tip[] = [
  { 
    title: '簽證與申報', 
    content: '記得辦好電子簽證 (e-visa) 且在出發前 72 小時填寫 eTravel 申報並存下 QR Code。', 
    icon: <div className="text-3xl">📋</div> 
  },
  { 
    title: '換錢與小費', 
    content: '建議帶美金去當地換披索匯率最優。菲律賓是小費制國家，通常床頭或行李小費給 20-50 披索。', 
    icon: <div className="text-3xl">💵</div> 
  },
  { 
    title: '飲水與電壓', 
    content: '水龍頭的水不能直接喝，請買礦泉水。插頭與台灣相同，但電壓是 220V，電子產品通常都有變壓功能但要確認。', 
    icon: <div className="text-3xl">🔌</div> 
  }
];

const INITIAL_TRIP_DATA: TripDay[] = [
  {
    id: 'day-1',
    date: '2/12',
    title: '出發與移動日',
    activities: [
      { id: '1-1', time: '04:00', description: '🚗 誠盛商店出發', notes: '搭車前往桃園機場，開始冒險！' },
      { id: '1-2', time: '06:25', description: '✈️ 開始登機 (JX781)', notes: '星宇航空 TPE - CEB，機上補眠' },
      { id: '1-3', time: '下午', description: '🛍️ 抵達宿霧 & Ayala Mall', notes: '叫 GRAB 前往，購買泳衣、拖鞋等日用品' },
      { id: '1-4', time: '16:20', description: '🚢 碼頭搭船 (Pier 1)', notes: '搭乘商務艙前往薄荷島，欣賞海景' },
      { id: '1-5', time: '18:00', description: '🏨 抵達飯店 Check-in', notes: 'Panglao Pearl Premiere White Sand Resort' },
      { id: '1-6', time: '19:00', description: '🍽️ 飯店內享用晚餐', notes: '吃飽飽迎接明天的行程' }
    ]
  },
  {
    id: 'day-2',
    date: '2/13',
    title: '薄荷島陸地一日遊 (旅行社包)',
    activities: [
      { id: '2-1', time: '08:00', description: '🚐 飯店接送出發', notes: '旅行社專車接送，輕鬆玩' },
      { id: '2-2', time: '上午', description: '🏛️ 血盟紀念碑 & 巴卡榮教堂', notes: '拍美照的好地方' },
      { id: '2-3', time: '12:00', description: '🍱 洛柏河漂流午餐', notes: '在河面上悠閒享用菲律賓自助餐' },
      { id: '2-4', time: '下午', description: '🏎️ 森林 ATV 沙灘車', notes: '體驗穿梭人造森林的刺激感' },
      { id: '2-5', time: '15:00', description: '🐒 眼鏡猴 & 巧克力山', notes: '看超迷你眼鏡猴，登上世界遺產觀景台' },
      { id: '2-6', time: '19:00', description: '🍹 晚餐 @ Udos Bar', notes: '放鬆享受音樂與調酒' }
    ]
  },
  {
    id: 'day-3',
    date: '2/14',
    title: '八里卡薩跳島與海豚',
    activities: [
      { id: '3-1', time: '06:00', description: '🍟 麥當勞集合出發', notes: '早起才有機會看到海豚跳耀哦！' },
      { id: '3-2', time: '上午', description: '🐢 巴里卡薩島浮潛', notes: '找海龜、看絕美大斷層' },
      { id: '3-3', time: '11:00', description: '🍗 點心 Jollibee', notes: '必吃的菲律賓小蜜蜂炸雞' },
      { id: '3-4', time: '下午', description: '💆 飯店休息 / 按摩', notes: 'SPA 舒壓時間' },
      { id: '3-5', time: '18:00', description: '✨ 彈性：看螢火蟲', notes: '或前往 Hinagdanan Cave 洞穴探險' }
    ]
  },
  {
    id: 'day-4',
    date: '2/15',
    title: '自由活動日',
    activities: [
      { id: '4-1', time: '全日', description: '🏝️ 隨心所欲自由行', notes: '建議：可報名鯨鯊共游或 Napaling 看沙丁魚風暴' }
    ]
  },
  {
    id: 'day-5',
    date: '2/16',
    title: '返回宿霧 (除夕)',
    activities: [
      { id: '5-1', time: '09:00', description: '🥐 飯店最後早餐', notes: '享受海島悠閒早晨' },
      { id: '5-2', time: '11:40', description: '⛴️ 搭船返回宿霧', notes: '揮別薄荷島，前進宿霧市區' },
      { id: '5-3', time: '下午', description: '🏠 入住 Park 38', notes: '入住高級大樓 38 Park Avenue (房號代號：UV/VU6)' },
      { id: '5-4', time: '19:00', description: '🧧 除夕年夜飯 Buffet', notes: 'Buffet 101 或 逛超市買零食回飯店慶祝' }
    ]
  },
  {
    id: 'day-6',
    date: '2/17',
    title: '宿霧市區與過年 (初一)',
    activities: [
      { id: '6-1', time: '10:00', description: '🐠 宿霧海洋公園', notes: '室內景點，吹冷氣看各種海洋生物' },
      { id: '6-2', time: '12:00', description: '🍴 公園內午餐', notes: '輕鬆用餐休息' },
      { id: '6-3', time: '14:00', description: '🏢 SM Seaside 逛街', notes: '世界前十大商場，買好買滿' },
      { id: '6-4', time: '19:00', description: '🥩 The Pig and Palm', notes: '美味的現代創意料理' },
      { id: '6-5', time: '晚間', description: '💆 Filia 按摩放鬆', locationUrl: 'https://maps.app.goo.gl/bpdbcQ6sFP7zLNk5A?g_st=il', notes: '初一就要寵愛自己' }
    ]
  },
  {
    id: 'day-7',
    date: '2/18',
    title: '踏上歸途',
    activities: [
      { id: '7-1', time: '07:00', description: '🚖 Park 38 出發', notes: '尖峰時間提早出發避開塞車' },
      { id: '7-2', time: '08:00', description: '📋 機場報到', notes: 'Mactan-Cebu Intl Airport (T2)' },
      { id: '7-3', time: '10:50', description: '✈️ 搭機返回台灣', notes: 'JX782，滿載回憶歸國' }
    ]
  }
];

// --- 3. 主要元件 (App) ---
const App: React.FC = () => {
  const [trip, setTrip] = useState<TripDay[]>(INITIAL_TRIP_DATA);
  const [activeTip, setActiveTip] = useState<Tip | null>(null);
  const [showConclusion, setShowConclusion] = useState(false);
  const [editingActivity, setEditingActivity] = useState<{dayId: string, activityId: string} | null>(null);
  
  // Currency Converter State
  const [phpAmount, setPhpAmount] = useState<string>('');
  const rate = 0.56; // 1 PHP = 0.56 TWD

  const observerRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.05 });

    observerRefs.current.forEach(ref => observer.observe(ref));
    return () => observer.disconnect();
  }, [trip]);

  const handleUpdateActivity = (dayId: string, activityId: string, updates: Partial<Activity>) => {
    setTrip(prev => prev.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          activities: day.activities.map(act => act.id === activityId ? { ...act, ...updates } : act)
        };
      }
      return day;
    }));
  };

  const handleAddActivity = (dayId: string) => {
    const newId = `act-${Date.now()}`;
    const newActivity: Activity = { id: newId, time: '12:00', description: '✨ 新活動內容' };
    setTrip(prev => prev.map(day => {
      if (day.id === dayId) {
        return { ...day, activities: [...day.activities, newActivity] };
      }
      return day;
    }));
    setEditingActivity({ dayId, activityId: newId });
  };

  const handleDeleteActivity = (dayId: string, activityId: string) => {
    if (confirm('確定要刪除這項行程嗎？')) {
      setTrip(prev => prev.map(day => {
        if (day.id === dayId) {
          return { ...day, activities: day.activities.filter(a => a.id !== activityId) };
        }
        return day;
      }));
    }
  };

  // 處理圖片上傳
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, dayId: string, activityId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdateActivity(dayId, activityId, { imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] flex flex-col font-sans">
      {/* Hero Section */}
      <section className="relative h-[55vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=80&w=1974" 
            className="w-full h-full object-cover brightness-[0.7]" 
            alt="Bohol"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F8FBFF]"></div>
        </div>
        <div className="relative z-10 text-center text-white px-6 mt-[-40px]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-white/40 bg-white/20 backdrop-blur-lg rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            <Heart size={12} className="text-red-400 fill-red-400" /> Feb 12 - 18, 2026
          </div>
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight leading-tight drop-shadow-lg">
            新春揚揚得意<br/><span className="text-sky-300">菲律賓之旅</span>
          </h1>
          <p className="text-sm font-medium opacity-90 max-w-xs mx-auto leading-relaxed drop-shadow-md">
            宿霧跨年 ‧ 薄荷海島 ‧ 跳島探險
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow max-w-lg mx-auto w-full px-5 pb-24 mt-[-60px] relative z-20">
        
        {/* Currency Converter Card */}
        <section className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-sky-900/5 border border-white mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 rounded-xl">
              <Coins className="text-amber-500" size={20} />
            </div>
            <h3 className="font-bold text-gray-800">比索即時換算</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-[10px] text-gray-400 font-bold mb-1 block">PHP (比索)</label>
              <input 
                type="number"
                placeholder="輸入金額"
                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-
