export interface Video {
  id: string;
  url: string;
  platform: string;
  date_added: string;
  status: string;
  title: string;
  brand: string;
  feedback: { vote: number; by: string; reason?: string } | null;
  source: string;
  why?: string;
  vo_excerpt?: string;
}

export interface FeedbackEntry {
  videoId: string;
  action: 'thumbsup' | 'thumbsdown' | 'shortlist';
  timestamp: string;
  note?: string;
}
