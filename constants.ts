
import { Trip, Difficulty, ActivityType, GalleryImage } from './types';

export const MOCK_ADDONS = [
  { id: '1', name: 'Premium Gear Rental', price: 15000 },
  { id: '2', name: 'Private Professional Coach', price: 25000 },
  { id: '3', name: 'Luxury Spa Upgrade', price: 12000 },
  { id: '4', name: 'Gourmet Private Dining', price: 8000 }
];

export const MOCK_TRIPS: Trip[] = [
  {
    id: 't1',
    title: 'Himalayan High-Altitude Cycling',
    description: 'Traverse the majestic peaks of Ladakh on a world-class carbon frame bike, supported by a luxury mobile base camp.',
    destination: 'Ladakh',
    country: 'India',
    activity: ActivityType.CYCLING,
    duration: '10 Days',
    difficulty: Difficulty.CHALLENGING,
    basePrice: 185000,
    mainImage: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1471506480208-8e93abc3b1ba?auto=format&fit=crop&q=80&w=800'
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Leh', description: 'Acclimatization at 11,500ft with luxury wellness briefing and light meditation.' },
      { day: 2, title: 'Shanti Stupa Ride', description: 'Low intensity warm up ride to iconic landmarks to test equipment and lungs.' },
      { day: 3, title: 'The Indus Trail', description: 'Rolling terrain along the Indus river, passing through ancient monastic villages.' },
      { day: 4, title: 'Khardung La Summit', description: 'The ultimate challenge. Climbing to one of the world\'s highest motorable passes.' }
    ],
    featured: true,
    addons: MOCK_ADDONS,
    tags: ['ladakh', 'cycling', 'india', 'high-altitude', 'luxury']
  },
  {
    id: 't2',
    title: 'Andaman Deep Blue Expedition',
    description: 'Explore untouched reefs in Havelock with private dive masters and stays at eco-luxury villas.',
    destination: 'Havelock, Andamans',
    country: 'India',
    activity: ActivityType.SCUBA,
    duration: '7 Days',
    difficulty: Difficulty.MODERATE,
    basePrice: 145000,
    mainImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [],
    itinerary: [
      { day: 1, title: 'Paradise Arrival', description: 'Speedboat transfer to a private eco-villa nestled between the forest and the sea.' },
      { day: 2, title: 'Refresher Dives', description: 'Checking skills at Nemo Reef followed by a gourmet beach sunset dinner.' },
      { day: 3, title: 'Dixon\'s Pinnacle', description: 'Deep water diving at one of the Andaman\'s most famous sites, home to giant groupers.' },
      { day: 4, title: 'Night Diving', description: 'Witness the bioluminescent magic of the night ocean under expert supervision.' }
    ],
    featured: true,
    addons: MOCK_ADDONS,
    tags: ['andaman', 'diving', 'india', 'island', 'ocean']
  },
  {
    id: 't3',
    title: 'Auli Backcountry Skiing',
    description: 'Expert-led off-piste skiing in the heart of the Garhwal Himalayas with helicopter evacuation standby.',
    destination: 'Auli, Uttarakhand',
    country: 'India',
    activity: ActivityType.SKIING,
    duration: '6 Days',
    difficulty: Difficulty.EXTREME,
    basePrice: 220000,
    mainImage: 'https://images.unsplash.com/photo-1551698618-1fed5d978b47?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [],
    itinerary: [
      { day: 1, title: 'Himalayan Ascent', description: 'Luxury transfer from Dehradun followed by a scenic cable car ride to Auli.' },
      { day: 2, title: 'Powder Assessment', description: 'Safety briefing and avalanche transceiver training on the upper slopes.' },
      { day: 3, title: 'Gorson Bugyal Traverse', description: 'Cross-country skiing through massive alpine meadows with Nanda Devi views.' },
      { day: 4, title: 'Peak Drop', description: 'Advanced descent through pine forests and untouched backcountry powder.' }
    ],
    featured: true,
    addons: MOCK_ADDONS,
    tags: ['skiing', 'himalayas', 'india', 'adventure', 'winter']
  },
  {
    id: 't4',
    title: 'Everest Base Camp Elite',
    description: 'Experience the legendary trek with premium logistics, oxygen support, and private lodges.',
    destination: 'Khumbu Region',
    country: 'Nepal',
    activity: ActivityType.TREKKING,
    duration: '14 Days',
    difficulty: Difficulty.EXTREME,
    basePrice: 320000,
    mainImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [],
    itinerary: [],
    featured: true,
    addons: MOCK_ADDONS,
    tags: ['nepal', 'everest', 'trekking', 'expedition', 'mountain']
  },
  {
    id: 't5',
    title: 'Ha Long Bay Luxury Kayak',
    description: 'Navigate the limestone karsts of Vietnam in high-performance kayaks with a private support cruise.',
    destination: 'Ha Long Bay',
    country: 'Vietnam',
    activity: ActivityType.SURFING, 
    duration: '5 Days',
    difficulty: Difficulty.MODERATE,
    basePrice: 195000,
    mainImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [],
    itinerary: [],
    featured: true,
    addons: MOCK_ADDONS,
    tags: ['vietnam', 'kayaking', 'halong-bay', 'heritage', 'luxury']
  }
];

export const GALLERY_IMAGES: GalleryImage[] = [
  { id: 'g1', url: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=800', type: 'image', activity: ActivityType.CYCLING, location: 'Manali' },
  { id: 'g2', url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=800', type: 'image', activity: ActivityType.SURFING, location: 'Gokarna' },
  { id: 'g3', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800', type: 'image', activity: ActivityType.TREKKING, location: 'Zanskar' },
  { id: 'g4', url: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&q=80&w=800', type: 'image', activity: ActivityType.SCUBA, location: 'Netrani' },
  { id: 'g5', url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800', type: 'image', activity: ActivityType.TREKKING, location: 'Sikkim' },
  { id: 'g6', url: 'https://images.unsplash.com/photo-1533551335337-bb547f3c5a4f?auto=format&fit=crop&q=80&w=800', type: 'image', activity: ActivityType.SKIING, location: 'Gulmarg' },
];
