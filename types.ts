
export interface Activity {
  id: string;
  time: string;
  description: string;
  locationUrl?: string;
  notes?: string;
  imageUrl?: string;
}

export interface TripDay {
  id: string;
  date: string;
  title: string;
  activities: Activity[];
}

export interface Tip {
  title: string;
  content: string;
  icon: string;
}
