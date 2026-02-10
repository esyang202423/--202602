import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Edit2, X, Trash2, MapPin, 
  ExternalLink, Image as ImageIcon, CheckCircle, 
  ChevronDown, MessageSquare, Info, Star, ChevronRight, Clock,
  Coins, PlaneTakeoff, Heart, Upload, Link as LinkIcon, MessageCircleQuestion
} from 'lucide-react';

// --- 1. 定義類型 ---
interface Activity {
  id: string;
  time: string;
  description: string;
  locationUrl?: string; // 地圖連結
  imageUrl?: string;    // 照片連結 (Base64)
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
    title: '八里卡薩跳島與海豚 (旅行社包)',
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
  };return (
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
                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-lg focus:ring-2 focus:ring-sky-200 outline-none text-gray-700"
                value={phpAmount}
                onChange={(e) => setPhpAmount(e.target.value)}
              />
            </div>
            <div className="flex-shrink-0 mt-5 text-gray-300">
              <ChevronRight />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-gray-400 font-bold mb-1 block">TWD (台幣)</label>
              <div className="w-full bg-sky-50 border-none rounded-xl py-3 px-4 font-bold text-lg text-sky-600">
                ≈ {phpAmount ? (Number(phpAmount) * rate).toFixed(0) : '0'}
              </div>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-3 text-center">依參考匯率 1 PHP ≈ 0.56 TWD 計算</p>
        </section>

        {/* Taiwan Reminders */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4 px-2">
            <PlaneTakeoff className="text-sky-600" size={20} />
            <h3 className="font-bold text-gray-800">台灣出發小叮嚀</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
             {KEY_TIPS.map((tip) => (
               <button 
                 key={tip.title}
                 onClick={() => setActiveTip(tip)}
                 className="bg-white p-4 rounded-3xl border border-gray-50 shadow-sm text-left hover:border-sky-200 active:scale-95 transition-all"
               >
                 <span className="text-2xl mb-2 block">{tip.icon}</span>
                 <h4 className="font-bold text-xs text-gray-800 line-clamp-1">{tip.title}</h4>
                 <p className="text-[10px] text-gray-400 mt-1">詳情點擊</p>
               </button>
             ))}
          </div>
        </section>

        {/* Itinerary Timeline */}
        <div className="space-y-14">
          {trip.map((day) => (
            <div 
              key={day.id} 
              ref={(el) => { if(el) observerRefs.current.set(day.id, el) }}
              className="opacity-0 translate-y-10 transition-all duration-700 ease-out"
            >
              {/* Day Header */}
              <div className="flex items-end justify-between mb-8 px-2">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-3xl bg-gradient-to-r from-sky-400 to-cyan-300 rotate-3 flex flex-col items-center justify-center text-white font-bold shadow-lg shadow-sky-200">
                      <span className="text-[10px] opacity-80 leading-none mb-0.5">{day.date.split('/')[0]}月</span>
                      <span className="text-xl leading-none">{day.date.split('/')[1]}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">{day.title}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Scheduled</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day Activities */}
              <div className="space-y-5 border-l-2 border-dashed border-sky-100 ml-7 pl-8">
                {day.activities.map((activity) => (
                  <div key={activity.id} className="relative group">
                    {/* Time Indicator dot */}
                    <div className="absolute -left-[41px] top-6 w-4 h-4 rounded-full bg-white border-[3px] border-sky-400 z-10"></div>
                    
                    <div className="bg-white p-5 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-sky-900/5 transition-all active:scale-[0.98]">
                      {editingActivity?.activityId === activity.id ? (
                        <div className="space-y-4">
                          <input 
                            className="w-full p-3 bg-gray-50 border-none rounded-2xl text-sm" 
                            value={activity.time} 
                            onChange={(e) => handleUpdateActivity(day.id, activity.id, { time: e.target.value })}
                            placeholder="時間"
                          />
                          <input 
                            className="w-full p-3 bg-gray-50 border-none rounded-2xl text-sm font-bold" 
                            value={activity.description} 
                            onChange={(e) => handleUpdateActivity(day.id, activity.id, { description: e.target.value })}
                            placeholder="活動描述 (含 Emoji)"
                          />
                          <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                            <input 
                              className="w-full p-3 pl-10 bg-gray-50 border-none rounded-2xl text-xs text-blue-600" 
                              value={activity.locationUrl || ''} 
                              onChange={(e) => handleUpdateActivity(day.id, activity.id, { locationUrl: e.target.value })}
                              placeholder="貼上 Google Map 連結..."
                            />
                          </div>
                          
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl">
                             <ImageIcon size={16} className="text-gray-400" />
                             <label className="flex-1 text-xs text-gray-500 cursor-pointer hover:text-sky-600">
                               {activity.imageUrl ? "更換照片..." : "上傳活動照片..."}
                               <input 
                                 type="file" 
                                 accept="image/*"
                                 className="hidden"
                                 onChange={(e) => handleImageUpload(e, day.id, activity.id)}
                               />
                             </label>
                          </div>

                          <textarea 
                            className="w-full p-3 bg-gray-50 border-none rounded-2xl text-sm" 
                            rows={3}
                            value={activity.notes || ''} 
                            onChange={(e) => handleUpdateActivity(day.id, activity.id, { notes: e.target.value })}
                            placeholder="行程細節與備忘..."
                          />
                          <div className="flex justify-between items-center pt-2">
                             <button onClick={() => handleDeleteActivity(day.id, activity.id)} className="p-3 text-red-400 bg-red-50 rounded-2xl">
                                <Trash2 size={20} />
                              </button>
                              <button onClick={() => setEditingActivity(null)} className="flex-1 ml-3 py-3 bg-sky-600 text-white rounded-2xl font-bold text-sm shadow-md">
                                完成編輯
                              </button>
                          </div>
                        </div>
                      ) : (
                        <div onClick={() => setEditingActivity({dayId: day.id, activityId: activity.id})}>
                          <div className="flex items-center justify-between mb-3">
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-[10px] font-bold">
                              <Clock size={12} /> {activity.time}
                            </span>
                            <Edit2 size={12} className="text-gray-200" />
                          </div>
                          <h4 className="text-base font-bold text-gray-900 mb-2 leading-snug">{activity.description}</h4>
                          {activity.notes && <p className="text-gray-400 text-[13px] leading-relaxed mb-3">{activity.notes}</p>}
                          
                          {/* 地圖連結按鈕 */}
                          {activity.locationUrl && (
                            <a 
                              href={activity.locationUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 rounded-2xl text-[11px] font-bold mt-1 hover:bg-blue-100 transition-colors"
                            >
                              <MapPin size={12} /> 查看地圖
                            </a>
                          )}

                          {/* 顯示上傳的照片 */}
                          {activity.imageUrl && (
                            <div className="mt-4 rounded-2xl overflow-hidden shadow-inner border border-gray-50">
                              <img src={activity.imageUrl} className="w-full h-auto object-cover max-h-60" alt="Activity Snapshot" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => handleAddActivity(day.id)}
                  className="w-full py-4 border-2 border-dashed border-sky-100 rounded-[2rem] flex items-center justify-center gap-2 text-sky-300 text-xs font-bold hover:bg-white hover:border-sky-300 hover:text-sky-500 transition-all active:scale-95"
                >
                  <Plus size={16} /> 新增行程項目
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Final Conclusion */}
        <section className="mt-32 text-center pb-20 px-4">
          <div className="bg-sky-600 w-16 h-16 rounded-3xl flex items-center justify-center text-white mb-8 mx-auto shadow-xl shadow-sky-200 rotate-12">
            <Star size={32} fill="white" />
          </div>
          <h2 className="text-3xl font-black mb-4 text-gray-900">楊家得意 精彩旅程</h2>
          <p className="text-sm text-gray-400 mb-10 leading-loose">
            所有的規劃，都是在放鬆度假的時刻，<br/>
          </p>
          <button 
            onClick={() => setShowConclusion(true)}
            className="w-full py-5 bg-gradient-to-r from-sky-400 to-cyan-300 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-sky-400/30 flex items-center justify-center gap-3 active:scale-[0.97] transition-all"
          >
            獲取旅程祝福 <Info size={22} />
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-white text-gray-300 text-center text-[10px] font-bold uppercase tracking-widest border-t border-gray-50">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-1 h-1 rounded-full bg-sky-200"></div>
          <span>Bohol Adventure 2025</span>
          <div className="w-1 h-1 rounded-full bg-sky-200"></div>
        </div>
        <p>© 新春楊家得意 開春好運</p>
      </footer>

      {/* Modals */}
      {activeTip && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-10 sm:pb-0 bg-sky-950/40 backdrop-blur-md transition-opacity">
          <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden p-10 animate-in slide-in-from-bottom duration-400">
            <div className="flex justify-between items-start mb-8">
              <span className="text-6xl">{activeTip.icon}</span>
              <button onClick={() => setActiveTip(null)} className="p-3 bg-gray-50 rounded-2xl text-gray-300"><X size={20}/></button>
            </div>
            <h3 className="text-2xl font-black mb-4 text-gray-900">{activeTip.title}</h3>
            <p className="text-gray-500 text-[15px] leading-loose">{activeTip.content}</p>
            <button onClick={() => setActiveTip(null)} className="mt-10 w-full py-5 bg-sky-900 text-white rounded-[2rem] font-black tracking-widest">OK, 沒問題！</button>
          </div>
        </div>
      )}

      {showConclusion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-sky-950/60 backdrop-blur-xl transition-opacity">
          <div className="bg-white w-full max-w-sm rounded-[3.5rem] shadow-2xl overflow-hidden p-12 text-center relative border-[6px] border-sky-50">
            <div className="text-5xl mb-8">🧧</div>
            <h3 className="text-2xl font-black mb-8 text-gray-900 leading-tight">給家人的話</h3>
            <div className="bg-sky-50/50 p-8 rounded-[2.5rem] mb-10 border border-sky-100">
              <p className="text-lg text-sky-900 font-bold italic leading-relaxed">
                「{CORE_CONCLUSION}」
              </p>
            </div>
            <button 
              onClick={() => setShowConclusion(false)}
              className="w-full py-5 bg-gradient-to-r from-sky-400 to-cyan-300 text-white rounded-[2rem] font-black text-lg shadow-lg active:scale-95 transition-all"
            >
              開啟夢幻假期
            </button>
          </div>
        </div>
      )}

      {/* --- AI 懸浮按鈕開始 --- */}
      <a
        href="https://gemini.google.com/gem/1t7EoJwRrG68P_P3OH5kVpUdbqP92BuL_?usp=sharing" 
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-2xl hover:scale-105 transition-all duration-300 animate-bounce"
        style={{ animationDuration: '3s' }}
      >
        <MessageCircleQuestion size={24} fill="white" className="text-purple-600" />
        <span className="font-bold text-sm tracking-wide">問問 AI 導遊</span>
      </a>
      {/* --- AI 懸浮按鈕結束 --- */}

    </div>
  );
};

export default App;
