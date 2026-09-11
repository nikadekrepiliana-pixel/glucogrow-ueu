export interface ChildRecord {
  id: string | number;
  name: string;
  dob: string;
  age: number; // in months
  gender: 'L' | 'P';
  height: number; // cm
  weight: number; // kg
  status: 'Normal' | 'Risiko' | 'Stunting' | 'Gizi Kurang' | 'Gizi Lebih';
  notes?: string;
  history: Array<{
    date: string;
    age: number;
    h: number;
    w: number;
    status?: string;
  }>;
}

export interface ArticleItem {
  id: number;
  title: string;
  category: 'Perkembangan' | 'Nutrisi' | 'Parenting' | 'Imunisasi';
  img: string;
  summary: string;
  content: string;
  readTime: string;
  source: string;
  tags?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  provider?: 'gemini' | 'openai' | 'glucogrow-expert' | 'offline-fallback';
  model?: string;
  timestamp: string;
}

export interface AiStatus {
  gemini: {
    available: boolean;
    model: string;
  };
  openai: {
    available: boolean;
    model: string;
  };
  activeProvider: 'gemini' | 'openai';
}

export interface NutritionItem {
  name: string;
  desc: string;
  category: 'protein' | 'vitamins' | 'carbs';
  portion: string;
  benefit: string;
  sources: string[];
}
