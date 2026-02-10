import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Edit2, X, Trash2, MapPin, 
  ExternalLink, Image as ImageIcon, CheckCircle, 
  ChevronDown, MessageSquare, Info, Star, ChevronRight, Clock,
  Coins, PlaneTakeoff, Heart, AlertCircle, Coffee, Anchor
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
      { id: 'a1', time: '10:00', description: '抵達宿霧麥克坦機場', notes: '提領行李、換匯、購買網卡
