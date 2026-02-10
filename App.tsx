import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Edit2, X, Trash2, MapPin, 
  ExternalLink, Image as ImageIcon, CheckCircle, 
  ChevronDown, MessageSquare, Info, Star, ChevronRight, Clock,
  Coins, PlaneTakeoff, Heart
} from 'lucide-react';

// --- 1. 定義類型 (原本在 types.ts) ---
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

// --- 2. 定義資料 (原本在 constants.ts) ---
const CORE_CONCLUSION = "享受當下，每一個笑容都是最美的風景。";

const KEY_TIPS: Tip[] = [
  {
    title: "必備文件",
    icon: <div className="text-3xl">📄</div>,
    content: "護照(效期6個月以上)、eTravel QR Code (出發前72hr填寫)、回程機票證明、簽證紙本。"
  },
  {
    title: "換匯攻略",
    icon: <div className="text-3xl">💰</div>,
    content: "建議帶美金大鈔 (100/50 USD) 到當地商場 (如 Ayala Mall) 匯率最好。機場換一點點付車資即可。"
  },
  {
    title: "網卡/交通",
    icon: <div className="text-3xl">📱</div>,
    content: "Grab App 必載 (綁定信用卡方便叫車)。網卡建議 Globe 或 Smart，機場櫃檯或先買好 eSIM。"
  },
  {
    title: "離境稅",
    icon: <div className="text-3xl">✈️</div>,
    content: "宿霧離境稅 850 PHP (通常只收現金)，記得最後要把這筆錢留下來！"
  }
];

const INITIAL_TRIP_DATA: TripDay[] = [
  {
    id: 'day1',
    date: '02/12',
    title: '抵達宿霧 🇵🇭',
    activities: [
      { id: 'a1', time: '10:00', description: '抵達宿霧麥克坦機場', notes: '提領行李、換匯、購買網卡' },
      { id: 'a2', time: '12:00', description: '前往碼頭 / 市區午餐', notes: '搭乘 OceanJet 前往薄荷島 (需提早買票)' },
      { id: 'a3', time: '16:00', description: '抵達薄荷島 & 飯店 Check-in', notes: '入住海邊度假村，享受夕陽' },
    ]
  },
  {
    id: 'day2',
    date: '02/13',
    title: '薄荷島陸地一日遊 🍫',
    activities: [
      { id: 'b1', time: '09:00', description: '巧克力山 Chocolate Hills', notes: '騎乘 ATV 越野車探險' },
      { id: 'b2', time: '11:00', description: '眼鏡猴保護區', notes: '安靜參觀，不可開閃光燈' },
      { id: 'b3', time: '13:00', description: '羅伯河遊船午餐', notes: '享受菲式自助餐與現場音樂' },
    ]
  },
  {
    id: 'day3',
    date: '02/14',
    title: '跳島出海追海龜 🐢',
    activities: [
      { id: 'c1', time: '06:00', description: '早起出海追海豚', notes: '運氣好可以看到成群海豚' },
      { id: 'c2', time: '08:00', description: '巴里卡薩大斷層浮潛', notes: '與海龜共游，欣賞珊瑚礁' },
      { id: 'c3', time: '12:00', description: '處女島 Virgin Island', notes: '絕美月牙灣沙灘拍照' },
    ]
  },
  {
    id: 'day4',
    date: '02/15',
    title: '享受度假村與放鬆 🏖️',
    activities: [
      { id: 'd1', time: '10:00', description: '睡到自然醒 / 飯店早餐', notes: '享受飯店設施、泳池' },
      { id: 'd2', time: '15:00', description: 'Alona Beach 沙灘漫步', notes: '逛逛海邊小店、按摩 SPA' },
      { id: 'd3', time: '18:00', description: '沙灘晚餐', notes: '享用海鮮燒烤與 Live Band' },
    ]
  },
   {
    id: 'day5',
    date: '02/16',
    title: '返回宿霧市區 🚢',
    activities: [
      { id: 'e1', time: '11:00', description: '搭船返回宿霧', notes: '注意碼頭稅與行李費' },
      { id: 'e2', time: '14:00', description: '宿霧市區觀光', notes: '麥哲倫十字架、聖嬰大教堂' },
      { id: 'e3', time: '17:00', description: 'SM City 或 Ayala Mall 購物', notes: '購買伴手禮 (芒果乾)' },
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

  return (
    <div className="min-h-screen bg-[#F8FBFF] flex flex-col">
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
            <Heart size={12} className="text-red-400 fill-red-400" /> Feb 12 - 18, 2025
          </div>
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight leading-tight">
            新春揚揚得意<br/><span className="text-sky-300">菲律賓之旅</span>
          </h1>
          <p className="text-sm font-medium opacity-90 max-w-xs mx-auto leading-relaxed">
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
                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-lg focus:ring-2 focus:ring-sky-200 outline-none"
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
                    {/* 修正點：這裡原本是 ocean-gradient，我改成 Tailwind 原生語法，確保顏色會顯示 */}
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
                          
                          {activity.locationUrl && (
                            <a 
                              href={activity.locationUrl} 
                              target="_blank" 
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 rounded-2xl text-[11px] font-bold mt-1"
                            >
                              <MapPin size={12} /> 查看 Google 地圖
                            </a>
                          )}

                          {activity.imageUrl && (
                            <div className="mt-4 rounded-2xl overflow-hidden shadow-inner border border-gray-50">
                              <img src={activity.imageUrl} className="w-full h-auto object-cover max-h-60" alt="Trip Snapshot" />
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
          <h2 className="text-3xl font-black mb-4 text-gray-900">揚揚得意 精彩旅程</h2>
          <p className="text-sm text-gray-400 mb-10 leading-loose">
            所有的規劃，都是為了在遇見風景的那一刻，<br/>
            能露出最自信燦爛的笑容。
          </p>
          <button 
            onClick={() => setShowConclusion(true)}
            // 修正點：這裡原本是 ocean-gradient，我改成 Tailwind 原生語法
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
        <p>© 新春揚揚得意 菲律賓之旅</p>
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
            <h3 className="text-2xl font-black mb-8 text-gray-900 leading-tight">給親愛旅人的話</h3>
            <div className="bg-sky-50/50 p-8 rounded-[2.5rem] mb-10 border border-sky-100">
              <p className="text-lg text-sky-900 font-bold italic leading-relaxed">
                「{CORE_CONCLUSION}」
              </p>
            </div>
            <button 
              onClick={() => setShowConclusion(false)}
              // 修正點：同樣修正 ocean-gradient
              className="w-full py-5 bg-gradient-to-r from-sky-400 to-cyan-300 text-white rounded-[2rem] font-black text-lg shadow-lg active:scale-95 transition-all"
            >
              開啟夢幻假期
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
