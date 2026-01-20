
export enum Difficulty {
  EASY = 'Easy',
  MODERATE = 'Moderate',
  CHALLENGING = 'Challenging',
  EXTREME = 'Extreme'
}

export enum ActivityType {
  CYCLING = 'Cycling',
  SCUBA = 'Scuba',
  TREKKING = 'Trekking',
  SURFING = 'Surfing',
  SKIING = 'Skiing'
}

export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  type: 'image' | 'video';
  activity: ActivityType;
  location: string;
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  destination: string;
  country: string;
  activity: ActivityType;
  duration: string;
  difficulty: Difficulty;
  basePrice: number;
  mainImage: string;
  galleryImages: string[];
  itinerary: ItineraryItem[];
  featured: boolean;
  addons: AddOn[];
  tags: string[];
}

export interface Inquiry {
  id: string;
  tripId: string;
  name: string;
  email: string;
  mobile: string;
  message: string;
  selectedAddons: string[];
  status: 'new' | 'contacted' | 'booked';
  date: string;
}
