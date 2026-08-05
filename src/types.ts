export type NavTab = 'home' | 'ai' | 'explore' | 'create_order' | 'space' | 'profile' | 'gallery' | 'academy' | 'reviews' | 'case_archive';

export interface GalleryItem {
  id: string;
  title: string;
  categoryLabel: 'БАННЕР' | 'АВАТАР' | 'ЛОГОТИП' | 'ПРЕВЬЮ' | '3D МОДЕЛЬ' | 'ИНТЕРФЕЙС';
  categoryKey: 'all' | 'avatars' | 'banners' | 'previews' | 'logos' | 'ui';
  image: string;
  isFeatured?: boolean;
  isNew?: boolean;
  tag?: string;
  description: string;
  software: string;
  resolution: string;
  views: number;
  likes: number;
  date: string;
  author: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  image: string;
  category: 'exterior' | 'interior' | 'spatial_ui' | 'vr_env';
  date: string;
  views: number;
  likes: number;
  client?: string;
  industry?: string;
  timeline?: string;
  budget?: string;
  challenge?: string;
  solution?: string;
  metrics?: { value: string; label: string; change?: string; type?: 'up' | 'down' | 'neutral' }[];
  testimonial?: { quote: string; author: string; role: string; avatar?: string };
  stack?: string[];
  galleryImages?: string[];
  specs: {
    renderer: string;
    lighting: string;
    polygonCount: string;
    resolution: string;
  };
  detailsText: string;
}

export interface UpdateItem {
  id: string;
  title: string;
  time: string;
  type: 'deploy' | 'content' | 'maintenance';
  details: string;
  version?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

export interface Course {
  id: string;
  title: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Masterclass';
  lessonsCount: number;
  progress: number; // 0 to 100
  author: string;
  category: string;
  thumbnail: string;
  description: string;
  lessons: Lesson[];
}

export interface Review {
  id: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  rating: number; // 1-5
  comment: string;
  project: string;
  date: string;
  verified: boolean;
}

export interface OrderDetailData {
  id: string;
  title: string;
  status: string;
  price: string;
  created: string;
  deadline: string;
  progressPercent: number;
  currentStepIndex: number;
  designer: {
    name: string;
    role: string;
    avatar: string;
  };
  files: {
    id: string;
    name: string;
    type: 'document' | 'image' | 'link' | 'folder';
    status: 'Ready' | 'In Review' | 'Pending';
    url?: string;
  }[];
  timeline: {
    title: string;
    time: string;
    active?: boolean;
  }[];
  designerNote?: string;
}

export interface OrderRequest {
  id: string;
  projectType: string;
  environmentStyle: string;
  budget: string;
  timeline: string;
  notes: string;
  name: string;
  email: string;
  telegram?: string;
  status: 'pending' | 'in_review' | 'approved';
  createdAt: string;
}

export interface RenderTask {
  id: string;
  name: string;
  status: 'rendering' | 'queued' | 'completed' | 'paused';
  progress: number;
  node: string;
  renderEngine: string;
  estTimeLeft: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  category: 'Prompts' | 'Logos' | 'Palettes' | 'Typography' | 'Brand' | 'Moodboard';
  timestamp: string;
  image?: string;
  colorSwatches?: string[];
  iconType?: 'logo' | 'typography' | 'prompt' | 'brand' | 'moodboard';
  details?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  category: 'Orders' | 'Messages' | 'Academy' | 'System';
  time: string;
  isUnread: boolean;
  message: string;
  type?: string;
}

