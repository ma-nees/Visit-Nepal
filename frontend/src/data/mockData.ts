export type CategoryLabel =
  | 'All'
  | 'Trekking'
  | 'Cultural'
  | 'Adventure'
  | 'Wildlife'
  | 'Spiritual'
  | 'Lakes & Valleys';

export interface ItineraryDay {
  day: number;
  title: string;
  altitude: string;
  desc: string;
}

export interface Destination {
  id: string;
  title: string;
  location: string;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Difficult';
  altitude: string;
  bestSeason: string;
  price: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  category: CategoryLabel;
  description: string;
  highlights: string[];
  itinerary: ItineraryDay[];
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  price: string;
  priceNum: number;
  rating: number;
  imageUrl: string;
  highlights: string[];
  description: string;
}

export interface Guide {
  id: string;
  name: string;
  role: string;
  summits: string;
  languages: string[];
  experience: string;
  rating: number;
  reviews: number;
  rate: string;
  rateNum: number;
  avatar: string;
  bio: string;
}

export interface Butler {
  id: string;
  name: string;
  role: string;
  rating: number;
  trips: string;
  rate: string;
  avatar: string;
  skills: string[];
}

export interface Activity {
  id: string;
  title: string;
  location: string;
  duration: string;
  price: string;
  rating: number;
  imageUrl: string;
  operator: string;
}

export interface Transport {
  id: string;
  title: string;
  type: string;
  seats: string;
  price: string;
  driver: string;
  rating: number;
}

export interface Permit {
  id: string;
  code: string;
  title: string;
  authority: string;
  cost: string;
  validity: string;
  status: 'Approved' | 'Under Review' | 'Draft';
  approvalDate: string;
}

export interface Booking {
  id: string;
  title: string;
  provider: string;
  category: 'Trek' | 'Stay' | 'Adventure' | 'Transport';
  date: string;
  bookedBy: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  amount: string;
  qrCode: string;
  color: string;
  meetingPoint: string;
  assignedGuide: string;
  contactPhone: string;
}

export interface PostComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timeAgo: string;
  likes: number;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorLocation: string;
  timeAgo: string;
  verified: boolean;
  content: string;
  mediaUrl: string;
  likesCount: number;
  userReaction: string | null;
  commentsCount: number;
  comments: PostComment[];
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  status: 'Online' | 'Away';
  verified: boolean;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: ChatMessage[];
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  color: string;
  read: boolean;
}

export interface ScheduleEvent {
  time: string;
  title: string;
  desc: string;
}

export interface ScheduleDay {
  day: number;
  date: string;
  title: string;
  completed: boolean;
  stay: string;
  alarm: string;
  audioNote: string;
  events: ScheduleEvent[];
}

export const currentUser = {
  id: 'usr_101',
  name: 'Aayush Pradhan',
  email: 'aayush.traveler@visitnepal.com',
  phone: '+977 9841234567',
  nationality: 'Nepali',
  passportNumber: 'NPL-9988221',
  avatar:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  bio: 'Passionate Himalayan trekker, photographer, and tea enthusiast.',
  tripsCompleted: 14,
  reviewsCount: 28,
  badges: ['Himalayan Pioneer', 'Certified Trekker', 'Eco Explorer'],
};

export const categories: CategoryLabel[] = [
  'All',
  'Trekking',
  'Cultural',
  'Adventure',
  'Wildlife',
  'Spiritual',
  'Lakes & Valleys',
];

export const services = [
  {
    title: 'Stays & Lodges',
    category: 'hotel',
    color: '#2563EB',
    count: '180+ Hotels',
  },
  {
    title: 'Mountain Guides',
    category: 'guide',
    color: '#16A34A',
    count: '420+ Certified',
  },
  {
    title: 'Sherpa Butler',
    category: 'butler',
    color: '#9333EA',
    count: '95+ Available',
  },
  {
    title: 'Trek Permits',
    category: 'permit',
    color: '#EA580C',
    count: 'Online Approval',
  },
  {
    title: 'Transport & 4x4',
    category: 'transport',
    color: '#0D9488',
    count: 'Flights & Jeeps',
  },
  {
    title: 'Adventures',
    category: 'activity',
    color: '#DC2626',
    count: '65+ Experiences',
  },
];

export const popularCities = [
  {
    name: 'Pokhara',
    image:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
    subtitle: 'City of Lakes & Annapurnas',
  },
  {
    name: 'Kathmandu',
    image:
      'https://images.unsplash.com/photo-1582650625119-3a31f84183fe?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Valley of Temples & UNESCO Stupas',
  },
  {
    name: 'Mustang',
    image:
      'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Ancient Forbidden Kingdom',
  },
  {
    name: 'Chitwan',
    image:
      'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Rhino Safari & Deep Sal Jungle',
  },
  {
    name: 'Solukhumbu',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Everest Gateway & Sherpa Land',
  },
  {
    name: 'Lumbini',
    image:
      'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Sacred Birthplace of Lord Buddha',
  },
  {
    name: 'Manang & Tilicho',
    image:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
    subtitle: 'High Glacial Lakes & Thorong La',
  },
  {
    name: 'Dolpo & Karnali',
    image:
      'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Crystal Mountain & Turquoise Lakes',
  },
];

export const destinations: Destination[] = [
  {
    id: 'dest_ebc',
    title: 'Everest Base Camp Trek',
    location: 'Solukhumbu, Sagarmatha Region',
    duration: '14 Days',
    difficulty: 'Challenging',
    altitude: '5,364 m',
    bestSeason: 'March - May, Oct - Dec',
    price: 1350,
    rating: 4.95,
    reviewsCount: 428,
    imageUrl:
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=1200&q=85',
    category: 'Trekking',
    description:
      'The legendary journey to the foot of Mt. Everest (8,848m). Trek through Sherpa villages, ancient gompas, suspension bridges draped in prayer flags, and iconic acclimatization stops at Namche Bazaar and Dingboche.',
    highlights: [
      'Dramatic landing at world-famous Lukla Airport',
      'Acclimatization and café culture in Namche Bazaar',
      'Spiritual blessing at Tengboche Monastery',
      'Sunrise view of Mount Everest from Kala Patthar (5,545m)',
      'Touching the historic Everest Base Camp milestone',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Scenic Flight to Lukla & Trek to Phakding',
        altitude: '2,610 m',
        desc: 'Fly from Kathmandu/Ramechhap to Lukla (2,840m) and begin moderate trek along Dudh Koshi river.',
      },
      {
        day: 2,
        title: 'Phakding to Namche Bazaar',
        altitude: '3,440 m',
        desc: 'Cross iconic suspension bridges and ascend to the vibrant capital of the Khumbu region.',
      },
      {
        day: 3,
        title: 'Acclimatization Day in Namche',
        altitude: '3,880 m',
        desc: 'Hike to Everest View Hotel for the first panoramic glimpse of Everest, Lhotse, and Ama Dablam.',
      },
      {
        day: 4,
        title: 'Namche to Tengboche Monastery',
        altitude: '3,860 m',
        desc: 'Trail descends into Rhododendron forests before climbing to Tengboche, the spiritual epicenter of Khumbu.',
      },
      {
        day: 5,
        title: 'Tengboche to Dingboche',
        altitude: '4,410 m',
        desc: 'Trek past mani stones and Pangboche village into the alpine wilderness.',
      },
      {
        day: 6,
        title: 'Dingboche to Lobuche',
        altitude: '4,940 m',
        desc: 'Ascend the memorial ridge at Thokla Pass remembering legendary climbers.',
      },
      {
        day: 7,
        title: 'Gorak Shep & Everest Base Camp',
        altitude: '5,364 m',
        desc: 'Trek on Khumbu Glacier moraines to reach EBC, celebrating under the Khumbu Icefall.',
      },
      {
        day: 8,
        title: 'Kala Patthar Summit & Descent to Pheriche',
        altitude: '5,545 m',
        desc: 'Early morning hike for the ultimate golden sunrise over Everest, then descend to Pheriche.',
      },
    ],
  },
  {
    id: 'dest_act',
    title: 'Annapurna Circuit & Thorong La',
    location: 'Manang & Mustang Districts',
    duration: '12 Days',
    difficulty: 'Difficult',
    altitude: '5,416 m',
    bestSeason: 'Sept - Nov, March - May',
    price: 980,
    rating: 4.92,
    reviewsCount: 356,
    imageUrl:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    category: 'Trekking',
    description:
      'Circling the Annapurna Massif through lush subtropical valleys, high Tibetan plateaus, and over the thrilling Thorong La Pass into sacred Muktinath.',
    highlights: [
      'Crossing the iconic Thorong La Pass (5,416m)',
      'Explore medieval Buddhist monasteries in Manang',
      'Holy temple of Muktinath with eternal flame',
      'Deepest gorge in the world along the Kali Gandaki River',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Kathmandu to Besisahar & Dharapani',
        altitude: '1,860 m',
        desc: 'Scenic jeep drive through cascading waterfalls and terrace farms.',
      },
      {
        day: 2,
        title: 'Dharapani to Chame',
        altitude: '2,670 m',
        desc: 'Forest trail with dramatic cliffs and views of Annapurna II.',
      },
      {
        day: 3,
        title: 'Chame to Pisang',
        altitude: '3,200 m',
        desc: 'Walk past the dramatic Paungda Danda curved rock face.',
      },
      {
        day: 4,
        title: 'Pisang to Manang',
        altitude: '3,540 m',
        desc: 'High altitude route via Upper Pisang offering unbeatable mountain vistas.',
      },
      {
        day: 5,
        title: 'Thorong Phedi to Muktinath via Pass',
        altitude: '5,416 m',
        desc: 'Challenging pre-dawn pass crossing followed by long descent to Muktinath.',
      },
    ],
  },
  {
    id: 'dest_abc',
    title: 'Annapurna Base Camp Sanctuary',
    location: 'Kaski District, Pokhara',
    duration: '8 Days',
    difficulty: 'Moderate',
    altitude: '4,130 m',
    bestSeason: 'Year Round',
    price: 720,
    rating: 4.88,
    reviewsCount: 289,
    imageUrl:
      'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=800&q=80',
    category: 'Trekking',
    description:
      'A 360-degree amphitheater of snow-capped giants including Annapurna I (8,091m), Machapuchare (Fishtail), and Hiunchuli.',
    highlights: [
      'Uninterrupted 360-degree mountain amphitheater',
      'Sunrise view of Annapurna South from Poon Hill',
      'Natural geothermal hot springs at Jhinu Danda',
      'Deep rhododendron and bamboo cloud forests',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Pokhara to Nayapul & Tikhedhunga',
        altitude: '1,540 m',
        desc: 'Drive to Nayapul and gentle warm-up walk along Modi Khola.',
      },
      {
        day: 2,
        title: 'Tikhedhunga to Ghorepani',
        altitude: '2,860 m',
        desc: 'Climb the Ulleri stone stairs through enchanting rhododendron woods.',
      },
      {
        day: 3,
        title: 'Poon Hill Sunrise & Tadapani',
        altitude: '3,210 m',
        desc: 'Golden dawn panoramic views of Dhaulagiri and Annapurna ranges.',
      },
      {
        day: 4,
        title: 'Deurali to Annapurna Base Camp',
        altitude: '4,130 m',
        desc: 'Passing Machapuchare Base Camp to reach the heart of the sanctuary.',
      },
    ],
  },
  {
    id: 'dest_mustang',
    title: 'Upper Mustang Forbidden Kingdom',
    location: 'Lo Manthang, Mustang',
    duration: '10 Days',
    difficulty: 'Moderate',
    altitude: '3,840 m',
    bestSeason: 'May - November',
    price: 1650,
    rating: 4.97,
    reviewsCount: 142,
    imageUrl:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    category: 'Cultural',
    description:
      'Step into an ancient Tibetan Buddhist realm preserved within rainshadow canyons. Walled cities, sky caves, and red ochre monasteries.',
    highlights: [
      'Walled capital city of Lo Manthang & King palace',
      'Centuries-old cliffside sky caves and ancient murals',
      'Vibrant Tiji Festival masked dances',
      'Otherworldly wind-eroded red canyon landscapes',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Flight to Jomsom & Trek to Kagbeni',
        altitude: '2,800 m',
        desc: 'Mountain flight along Kali Gandaki gorge into the gateway of Mustang.',
      },
      {
        day: 2,
        title: 'Kagbeni to Chele',
        altitude: '3,050 m',
        desc: 'Entering the restricted zone along steep sandstone formations.',
      },
      {
        day: 3,
        title: 'Chele to Syangboche & Ghami',
        altitude: '3,520 m',
        desc: 'Passing Tibetan villages and the longest Mani wall in Nepal.',
      },
      {
        day: 4,
        title: 'Arrival in Lo Manthang',
        altitude: '3,840 m',
        desc: 'Reaching the historic walled capital of the Lo kingdom.',
      },
    ],
  },
  {
    id: 'dest_langtang',
    title: 'Langtang Valley & Kyanjin Gompa',
    location: 'Rasuwa District',
    duration: '7 Days',
    difficulty: 'Moderate',
    altitude: '3,870 m',
    bestSeason: 'Sept - Nov, March - May',
    price: 550,
    rating: 4.86,
    reviewsCount: 195,
    imageUrl:
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=85',
    category: 'Trekking',
    description:
      'The valley of glaciers closest to Kathmandu. Renowned for Tamang heritage, yak cheese factories, and soaring peaks of Langtang Lirung.',
    highlights: [
      'Visit Swiss-founded artisanal Yak Cheese Factory',
      'Summit Kyanjin Ri (4,773m) for glacier views',
      'Immerse in indigenous Tamang and Tibetan cultures',
      'Langtang National Park red panda sanctuary',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Drive Kathmandu to Syabrubesi',
        altitude: '1,460 m',
        desc: 'Winding drive through lush hills and Trishuli river valley.',
      },
      {
        day: 2,
        title: 'Syabrubesi to Lama Hotel',
        altitude: '2,470 m',
        desc: 'Gentle ascent alongside the roaring Langtang Khola.',
      },
      {
        day: 3,
        title: 'Lama Hotel to Langtang Village',
        altitude: '3,430 m',
        desc: 'Open valley views as pine forests give way to alpine pastures.',
      },
      {
        day: 4,
        title: 'Langtang Village to Kyanjin Gompa',
        altitude: '3,870 m',
        desc: 'Reach the monastery settlement nestled beneath glaciers.',
      },
    ],
  },
  {
    id: 'dest_chitwan',
    title: 'Chitwan Jungle Safari & Wildlife',
    location: 'Chitwan National Park',
    duration: '3 Days',
    difficulty: 'Easy',
    altitude: '415 m',
    bestSeason: 'October - March',
    price: 320,
    rating: 4.79,
    reviewsCount: 310,
    imageUrl:
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80',
    category: 'Wildlife',
    description:
      'UNESCO World Heritage wildlife sanctuary home to the endangered One-Horned Rhinoceros, Royal Bengal Tiger, and gharial crocodiles.',
    highlights: [
      'Jeep safari deep inside tiger habitat',
      'Canoe ride on Rapti River spotting marsh crocodiles',
      'Tharu cultural stick dance performance',
      'Birdwatching paradise with 500+ resident species',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Tharu Village Walk',
        altitude: '415 m',
        desc: 'Welcome drink, village exploration, and sunset over Rapti river.',
      },
      {
        day: 2,
        title: 'Full Day Jungle Adventure',
        altitude: '415 m',
        desc: 'Canoe safari, elephant breeding center visit, and 4x4 open jeep safari.',
      },
      {
        day: 3,
        title: 'Birdwatching & Departure',
        altitude: '415 m',
        desc: 'Early morning birding tour before return drive to Kathmandu/Pokhara.',
      },
    ],
  },
  {
    id: 'dest_manaslu',
    title: 'Manaslu Circuit & Larkya La Pass',
    location: 'Gorkha, Manaslu Conservation Area',
    duration: '14 Days',
    difficulty: 'Challenging',
    altitude: '5,106 m',
    bestSeason: 'Sept - Nov, March - May',
    price: 1280,
    rating: 4.96,
    reviewsCount: 264,
    imageUrl:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
    category: 'Trekking',
    description:
      'Circling the world’s eighth-highest peak (8,163m) through untouched Budhi Gandaki river gorges, ancient Tibetan Bhotia monasteries, and across the formidable Larkya La Pass.',
    highlights: [
      'Crossing Larkya La Pass (5,106m) with panoramic views of Himlung and Cheo',
      'Ancient Tibetan Buddhist settlements of Samagaon and Samdo',
      'Serene glacial waters of Birendra Tal beneath Mount Manaslu',
      'Low trail traffic with authentic Himalayan village culture',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Kathmandu to Soti Khola',
        altitude: '700 m',
        desc: 'Scenic drive through rural hills along the Budhi Gandaki river.',
      },
      {
        day: 2,
        title: 'Soti Khola to Machha Khola',
        altitude: '870 m',
        desc: 'Trek through subtropical forest trails and suspension bridges.',
      },
      {
        day: 3,
        title: 'Jagat to Deng',
        altitude: '1,860 m',
        desc: 'Enter the restricted conservation area passing Mani walls.',
      },
      {
        day: 4,
        title: 'Deng to Namrung',
        altitude: '2,630 m',
        desc: 'Ascend into Tibetan-influenced villages with carved stone stupas.',
      },
      {
        day: 5,
        title: 'Namrung to Samagaon',
        altitude: '3,530 m',
        desc: 'Stunning direct face view of Mount Manaslu and visit Pungyen Gompa.',
      },
      {
        day: 6,
        title: 'Samdo to Dharamsala (Larkya Phedi)',
        altitude: '4,460 m',
        desc: 'Final pass base camp with glacier views near the Tibetan border.',
      },
      {
        day: 7,
        title: 'Cross Larkya La Pass to Bimthang',
        altitude: '5,106 m',
        desc: 'Pre-dawn summit crossing over Larkya La with sunrise on Annapurna II.',
      },
    ],
  },
  {
    id: 'dest_gokyo',
    title: 'Gokyo Lakes & Cho La Pass Circuit',
    location: 'Khumbu, Sagarmatha National Park',
    duration: '13 Days',
    difficulty: 'Challenging',
    altitude: '5,420 m',
    bestSeason: 'Sept - Nov, March - May',
    price: 1420,
    rating: 4.98,
    reviewsCount: 382,
    imageUrl:
      'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=1200&q=85',
    category: 'Lakes & Valleys',
    description:
      'Traverse the six turquoise sacred glacial lakes of Gokyo Valley, climb Gokyo Ri for panoramic views of four 8,000m giants (Everest, Lhotse, Makalu, Cho Oyu), and navigate glaciated Cho La Pass.',
    highlights: [
      'Six emerald sacred high-altitude glacial lakes',
      'Gokyo Ri (5,357m) summit sunrise view of Everest and Cho Oyu',
      'Crossing the glaciated alpine pass of Cho La (5,420m)',
      'Ngozumpa Glacier, the longest glacier in the Himalayas',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Lukla to Phakding',
        altitude: '2,610 m',
        desc: 'Scenic flight into Lukla and trek along Dudh Koshi river.',
      },
      {
        day: 2,
        title: 'Namche Bazaar to Dole',
        altitude: '4,110 m',
        desc: 'Branch off the main EBC trail into peaceful Gokyo Valley.',
      },
      {
        day: 3,
        title: 'Dole to Machhermo',
        altitude: '4,470 m',
        desc: 'Alpine meadows with direct views of Cho Oyu and Kantega.',
      },
      {
        day: 4,
        title: 'Machhermo to Gokyo Lakes',
        altitude: '4,790 m',
        desc: 'Walk alongside the turquoise glacial lakes to Gokyo settlement.',
      },
      {
        day: 5,
        title: 'Gokyo Ri Dawn Hike & Cho La Crossing',
        altitude: '5,420 m',
        desc: 'Sunrise over four 8,000m peaks and technical glacier crossing to Dzongla.',
      },
    ],
  },
  {
    id: 'dest_mardi',
    title: 'Mardi Himal High Camp & Fishtail Ridge',
    location: 'Kaski, Annapurna Conservation Area',
    duration: '5 Days',
    difficulty: 'Moderate',
    altitude: '4,500 m',
    bestSeason: 'Year Round',
    price: 480,
    rating: 4.89,
    reviewsCount: 412,
    imageUrl:
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=85',
    category: 'Trekking',
    description:
      'The premier short alpine ridge trek in Nepal. Ascends through mossy rhododendron forests to razor-sharp panoramic ridges standing directly beneath the sacred pyramid of Machapuchare (Fishtail).',
    highlights: [
      'Face-to-face proximity to sacred Mount Machapuchare (6,993m)',
      'Sunset and sea-of-clouds vistas at Badal Danda',
      'Mardi Himal Base Camp high-altitude viewpoint (4,500m)',
      'Compact itinerary perfectly accessible from Pokhara',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Pokhara to Kande & Forest Camp',
        altitude: '2,550 m',
        desc: 'Short drive to Kande and climb through tranquil oak and rhododendron woods.',
      },
      {
        day: 2,
        title: 'Forest Camp to Low Camp',
        altitude: '2,970 m',
        desc: 'Ascend along the ridge with emerging vistas of Mount Fishtail.',
      },
      {
        day: 3,
        title: 'Low Camp to High Camp via Badal Danda',
        altitude: '3,580 m',
        desc: 'Ridge walk above the tree line with Annapurna South towering above.',
      },
      {
        day: 4,
        title: 'High Camp to Base Camp & Siding',
        altitude: '4,500 m',
        desc: 'Dawn trek to Mardi Base Camp viewpoint followed by descent to Siding village.',
      },
    ],
  },
  {
    id: 'dest_upper_dolpo',
    title: 'Upper Dolpo & Shey Phoksundo Crystal Mountain',
    location: 'Dolpa, Shey Phoksundo National Park',
    duration: '18 Days',
    difficulty: 'Difficult',
    altitude: '5,350 m',
    bestSeason: 'May - October',
    price: 2450,
    rating: 4.99,
    reviewsCount: 96,
    imageUrl:
      'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=85',
    category: 'Adventure',
    description:
      'Trans-Himalayan wilderness expedition into the realm of the Snow Leopard and pre-Buddhist Bonpo religion. Deep turquoise alpine waters of Lake Phoksundo and ancient 11th-century Shey Gompa.',
    highlights: [
      'Deepest alpine lake in Nepal with crystal turquoise waters',
      'Shey Gompa spiritual circumambulation of Crystal Mountain',
      'Ancient Bonpo gompas with historic yak horns and prayer wheels',
      'True wild camping expedition across high Kang La Pass (5,350m)',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Flight to Juphal & Trek to Dunai',
        altitude: '2,140 m',
        desc: 'Mountain flight into Juphal and trek along Bheri river valley.',
      },
      {
        day: 2,
        title: 'Dunai to Shey Phoksundo Lake (Ringmo)',
        altitude: '3,600 m',
        desc: 'Ascend past waterfalls to reach the stunning turquoise shores of Phoksundo.',
      },
      {
        day: 3,
        title: 'Cross Kang La Pass to Shey Gompa',
        altitude: '5,350 m',
        desc: 'Challenging high pass ascent into the remote spiritual valley of Crystal Mountain.',
      },
    ],
  },
  {
    id: 'dest_kanchenjunga',
    title: 'Kanchenjunga North & South Base Camp Circuit',
    location: 'Taplejung, Eastern Nepal',
    duration: '20 Days',
    difficulty: 'Difficult',
    altitude: '5,143 m',
    bestSeason: 'Oct - Nov, April - May',
    price: 2680,
    rating: 4.94,
    reviewsCount: 88,
    imageUrl:
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=1200&q=85',
    category: 'Adventure',
    description:
      'Circling the world’s third-highest peak (8,586m) in Nepal’s wild eastern frontier. Untouched rhododendron wilderness, Limbu and Rai villages, and both North and South Base Camps.',
    highlights: [
      'Pangpema North Base Camp with front-row view of Kanchenjunga Wedge',
      'Remote Mirgin La and Sele La high alpine pass traverses',
      'Wild Red Panda and Snow Leopard protected biological corridors',
      'Authentic Limbu and Rai cultural hospitality',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Drive from Bhadrapur to Taplejung & Mitlung',
        altitude: '921 m',
        desc: 'Scenic drive through green tea gardens of Ilam into eastern foothills.',
      },
      {
        day: 2,
        title: 'Ghunsa to Kambachen',
        altitude: '4,050 m',
        desc: 'Trek along glacial moraines with views of Jannu (Kumbhakarna).',
      },
      {
        day: 3,
        title: 'Pangpema North Base Camp',
        altitude: '5,143 m',
        desc: 'Reach the foot of Kanchenjunga massive north face.',
      },
    ],
  },
  {
    id: 'dest_rara',
    title: 'Rara Lake & Far-West Wilderness Odyssey',
    location: 'Mugu & Jumla Districts, Karnali',
    duration: '7 Days',
    difficulty: 'Easy',
    altitude: '2,990 m',
    bestSeason: 'Sept - Nov, March - June',
    price: 690,
    rating: 4.87,
    reviewsCount: 174,
    imageUrl:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    category: 'Lakes & Valleys',
    description:
      'The "Queen of Lakes" tucked inside Nepal\'s smallest national park. Deep azure waters reflecting snow-capped peaks, surrounded by aromatic blue pine and spruce forests in remote Karnali.',
    highlights: [
      '10-sq-km pristine azure high-altitude alpine lake',
      'Panoramic hike to Chuchemara Danda (4,087m)',
      'Pristine blue pine, black juniper, and rhododendron flora',
      'Unique historic Khas culture of Sinja Valley',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Flight to Nepalgunj & Talcha Airport (Mugu)',
        altitude: '2,730 m',
        desc: 'Fly into Karnali and short forested trek to Rara Lake shore.',
      },
      {
        day: 2,
        title: 'Rara Lake Exploration & Chuchemara Peak',
        altitude: '4,087 m',
        desc: 'Boating across the lake and ridge hike for panoramic views.',
      },
    ],
  },
  {
    id: 'dest_makalu',
    title: 'Makalu Base Camp & Barun Glacial Valley',
    location: 'Sankhuwasabha, Makalu Barun National Park',
    duration: '16 Days',
    difficulty: 'Difficult',
    altitude: '5,250 m',
    bestSeason: 'Sept - Nov, April - May',
    price: 1780,
    rating: 4.93,
    reviewsCount: 115,
    imageUrl:
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=85',
    category: 'Trekking',
    description:
      'Trek through the untouched Barun River valley under the soaring granite south face of Makalu (8,485m). Extreme vertical topography from tropical jungle waterfalls to towering icefalls.',
    highlights: [
      'Granite cliffs of Barun Valley rising vertically 3,000m',
      'Shipton La Pass (4,210m) crossing with high alpine views',
      'Makalu South Face and Kangshung Face of Everest',
      'Untouched bio-diversity sanctuary with rare Himalayan fauna',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Flight to Tumlingtar & Drive to Num',
        altitude: '1,560 m',
        desc: 'Fly into eastern Nepal and scenic drive through Arun valley.',
      },
      {
        day: 2,
        title: 'Shipton La Pass to Dobato',
        altitude: '4,210 m',
        desc: 'Ascend stone stairs over the dramatic high ridge pass.',
      },
      {
        day: 3,
        title: 'Makalu Base Camp',
        altitude: '5,250 m',
        desc: 'Camp beneath the massive black pyramid of Mount Makalu.',
      },
    ],
  },
  {
    id: 'dest_pikey',
    title: 'Pikey Peak Himalayan Panorama & Sunrise',
    location: 'Lower Solukhumbu Region',
    duration: '6 Days',
    difficulty: 'Moderate',
    altitude: '4,065 m',
    bestSeason: 'Oct - Dec, Feb - May',
    price: 520,
    rating: 4.91,
    reviewsCount: 228,
    imageUrl:
      'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1200&q=85',
    category: 'Spiritual',
    description:
      'Sir Edmund Hillary\'s declared favorite viewpoint of Mount Everest. A gentle, culturally rich trek through ancient Sherpa monasteries of Chiwong and Thupten Chholing with 360-degree Himalayan dawn.',
    highlights: [
      'Panoramic view of six 8,000-meter peaks from Dhaulagiri to Kanchenjunga',
      'Dawn sunrise over Everest, Makalu, and Lhotse',
      'Authentic Thupten Chholing Tibetan nunnery visit',
      'Quiet Sherpa villages with zero flight stress to Lukla',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Drive Kathmandu to Dhap',
        altitude: '2,850 m',
        desc: 'Scenic drive along the Sun Koshi river into Lower Solu.',
      },
      {
        day: 2,
        title: 'Dhap to Jhapre Monastery',
        altitude: '2,820 m',
        desc: 'Walk along the ridge with ancient stupas and rhododendron trees.',
      },
      {
        day: 3,
        title: 'Pikey Peak Summit (4,065m) Sunrise',
        altitude: '4,065 m',
        desc: 'Early morning climb for one of Nepal\'s greatest 360-degree mountain sunrises.',
      },
    ],
  },
  {
    id: 'dest_rara_wilderness',
    title: 'Rara Lake Wilderness Trek',
    location: 'Mugu, Karnali Region',
    duration: '8 Days',
    difficulty: 'Moderate',
    altitude: '2,990 m',
    bestSeason: 'April - June, Sept - Nov',
    price: 890,
    rating: 4.96,
    reviewsCount: 164,
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
    category: 'Lakes & Valleys',
    description: 'Trek to the Queen of Lakes — Nepal’s largest and deepest freshwater lake surrounded by pine and juniper forests in the remote Karnali wilderness.',
    highlights: [
      'Mirror reflection of snow peaks on pristine blue waters',
      'Remote flight into Talcha Airport in Mugu',
      'Wild pine, spruce and rhododendron forest walking trails',
      'Untouched Karnali cultural villages and stargazing'
    ],
    itinerary: [
      { day: 1, title: 'Flight Nepalgunj to Talcha & Trek to Rara', altitude: '2,990 m', desc: 'Thrilling flight into Mugu and gentle forest walk to lake shore.' },
      { day: 2, title: 'Rara Lake Perimeter Trail & Chuchemara Peak', altitude: '4,087 m', desc: 'Climb Chuchemara Danda for panoramic view of the lake and Saipal range.' },
      { day: 3, title: 'Murma Top Sunrise & Village Visit', altitude: '3,690 m', desc: 'Early morning viewpoint climb and interaction with local Khas communities.' }
    ]
  },
  {
    id: 'dest_phoksundo',
    title: 'Shey Phoksundo Lake & Crystal Mountain',
    location: 'Lower & Upper Dolpo',
    duration: '11 Days',
    difficulty: 'Challenging',
    altitude: '3,611 m',
    bestSeason: 'May - October',
    price: 1450,
    rating: 4.98,
    reviewsCount: 112,
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    category: 'Lakes & Valleys',
    description: 'Deep turquoise alpine lake with zero aquatic life, ancient Bon Buddhist monasteries, and dramatic cliffs in the mystical trans-Himalayan Dolpo region.',
    highlights: [
      'Striking turquoise lake that shifts hues with sunlight',
      'Ringmo village with 900-year-old Bon Po Tshowa Monastery',
      'Suligad 167-meter cascading waterfall',
      'Setting of Peter Matthiessen’s The Snow Leopard'
    ],
    itinerary: [
      { day: 1, title: 'Flight Nepalgunj to Juphal & Trek to Dunai', altitude: '2,140 m', desc: 'Scenic flight over green hills and trek along Bheri river.' },
      { day: 2, title: 'Dunai to Chhepka through Suligad Valley', altitude: '2,838 m', desc: 'Enter Shey Phoksundo National Park along dense bamboo and cedar woods.' },
      { day: 3, title: 'Chhepka to Ringmo Village & Phoksundo Lake', altitude: '3,611 m', desc: 'Pass spectacular waterfall and emerge at the edge of the turquoise waters.' }
    ]
  },
  {
    id: 'dest_tilicho',
    title: 'Tilicho Lake & Thorong La Circuit',
    location: 'Manang & Mustang, Annapurna',
    duration: '15 Days',
    difficulty: 'Difficult',
    altitude: '4,919 m',
    bestSeason: 'March - May, Oct - Nov',
    price: 1180,
    rating: 4.94,
    reviewsCount: 310,
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
    category: 'Lakes & Valleys',
    description: 'Expedition to one of the world’s highest glacial lakes nestled beneath the colossal Tilicho Peak, combined with the epic crossing of Thorong La Pass.',
    highlights: [
      'Gazing upon glacial icebergs floating in Tilicho Lake (4,919m)',
      'Traversing the dramatic landslide scree slopes into Tilicho Base Camp',
      'Crossing Thorong La Pass (5,416m) at sunrise',
      'Spiritual descent to holy Muktinath Temple'
    ],
    itinerary: [
      { day: 1, title: 'Manang to Khangsar Village', altitude: '3,734 m', desc: 'Detour from the main circuit trail into ancient Tibetan stone village.' },
      { day: 2, title: 'Khangsar to Tilicho Base Camp', altitude: '4,150 m', desc: 'Cross thrilling scree slopes under jagged limestone pinnacles.' },
      { day: 3, title: 'Hike to Tilicho Lake & Return to Siri Kharka', altitude: '4,919 m', desc: 'Early climb to the sacred turquoise glacial water under Tilicho peak.' }
    ]
  },
  {
    id: 'dest_gosaikunda',
    title: 'Gosaikunda Holy Alpine Lakes Trek',
    location: 'Langtang National Park, Rasuwa',
    duration: '6 Days',
    difficulty: 'Moderate',
    altitude: '4,380 m',
    bestSeason: 'March - May, Sept - Nov',
    price: 580,
    rating: 4.91,
    reviewsCount: 220,
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
    category: 'Lakes & Valleys',
    description: 'Spiritual pilgrimage to a cluster of 108 glacial lakes high in the Langtang Himalayas, sacred to Lord Shiva with breathtaking sunset views over Tibet.',
    highlights: [
      'Sunsets over the clouds from Laurebina ridge (3,900m)',
      'Sacred Shiva trident and waters of Gosaikunda Lake',
      'Panoramic vistas of Langtang Lirung, Ganesh Himal, and Manaslu',
      'Close proximity drive from Kathmandu with no mountain flights needed'
    ],
    itinerary: [
      { day: 1, title: 'Drive Kathmandu to Dhunche', altitude: '1,960 m', desc: 'Scenic mountain highway drive through Trishuli valley.' },
      { day: 2, title: 'Dhunche to Chandanbari (Sing Gompa)', altitude: '3,330 m', desc: 'Forest trail through oak, pine and famous yak cheese factory.' },
      { day: 3, title: 'Chandanbari to Gosaikunda Lake', altitude: '4,380 m', desc: 'Climb above tree line past Laurebina to the sacred emerald waters.' }
    ]
  },
  {
    id: 'dest_kathmandu_unesco',
    title: 'Kathmandu Valley UNESCO Heritage Trail',
    location: 'Kathmandu, Lalitpur, Bhaktapur',
    duration: '4 Days',
    difficulty: 'Easy',
    altitude: '1,400 m',
    bestSeason: 'Year Round',
    price: 380,
    rating: 4.97,
    reviewsCount: 540,
    imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f841807d?auto=format&fit=crop&w=1200&q=85',
    category: 'Cultural',
    description: 'Explore seven UNESCO World Heritage monuments in the historic capital valley: living goddesses, medieval palaces, cremation ghats, and colossal stupas.',
    highlights: [
      'Evening Aarti ceremony on the banks of Bagmati river at Pashupatinath',
      'Circling the world’s largest mandala at Boudhanath Stupa at dusk',
      'Intricate Newari wood carvings of Patan Museum courtyard',
      'The 55-window royal palace and Nyatapola pagoda in Bhaktapur'
    ],
    itinerary: [
      { day: 1, title: 'Historic Kathmandu & Swayambhunath Monkey Temple', altitude: '1,400 m', desc: 'Kathmandu Durbar Square and hilltop stupa overlooking the valley.' },
      { day: 2, title: 'Pashupatinath Temple & Boudhanath Stupa', altitude: '1,400 m', desc: 'Sacred Hindu cremation rituals and Tibetan Buddhist circumambulation.' },
      { day: 3, title: 'Patan Arts City & Bhaktapur Medieval Square', altitude: '1,400 m', desc: 'Living architectural museums, clay pottery square, and curd tasting.' }
    ]
  },
  {
    id: 'dest_bandipur',
    title: 'Bandipur Ancient Newari Hill Settlement',
    location: 'Tanahun District',
    duration: '3 Days',
    difficulty: 'Easy',
    altitude: '1,030 m',
    bestSeason: 'September - May',
    price: 290,
    rating: 4.93,
    reviewsCount: 198,
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
    category: 'Cultural',
    description: 'A preserved 18th-century Newari trading outpost perched on a saddle ridge with zero motorized vehicle traffic, wooden carved balconies, and mountain views.',
    highlights: [
      'Cobbled main street lined with traditional merchant mansions',
      'Spectacular view of Dhaulagiri, Annapurna, and Manaslu ranges',
      'Spelunking in Siddha Cave — Nepal’s largest limestone cavern',
      'Silk farm and peaceful hill village trails'
    ],
    itinerary: [
      { day: 1, title: 'Scenic Drive from Kathmandu/Pokhara to Bandipur', altitude: '1,030 m', desc: 'Ascend from Prithvi Highway to the quiet mountain ridge village.' },
      { day: 2, title: 'Thani Mai Temple Sunrise & Siddha Cave', altitude: '1,120 m', desc: 'Hike to the highest ridge viewpoint and explore subterranean caverns.' }
    ]
  },
  {
    id: 'dest_janakpur',
    title: 'Janakpurdham Mithila Art & Ram Janaki Mandir',
    location: 'Dhanusha, Terai Region',
    duration: '3 Days',
    difficulty: 'Easy',
    altitude: '74 m',
    bestSeason: 'October - April',
    price: 340,
    rating: 4.89,
    reviewsCount: 145,
    imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f841807d?auto=format&fit=crop&w=1200&q=85',
    category: 'Cultural',
    description: 'The ancient capital of the Videha Kingdom and birthplace of Goddess Sita, renowned for grand Mughal-Rajput marble architecture and vibrant Mithila painting.',
    highlights: [
      'Gargantuan three-storey white marble Janaki Temple with 60 rooms',
      'Mithila art workshops and women-led cultural cooperatives',
      'Sacred ponds (Dhanush Sagar and Ganga Sagar) evening light ceremonies',
      'Rich culinary delights including lassi, peda, and Maithil feasts'
    ],
    itinerary: [
      { day: 1, title: 'Fly Kathmandu to Janakpur & Temple Tour', altitude: '74 m', desc: 'Short flight to Terai plains and exploration of Janaki Mandir.' },
      { day: 2, title: 'Mithila Art Center & Historic Sacred Ponds', altitude: '74 m', desc: 'Learn ancient folk painting techniques and participate in Ganga Sagar aarti.' }
    ]
  },
  {
    id: 'dest_muktinath',
    title: 'Muktinath Sacred 108 Water Spouts',
    location: 'Mustang, Annapurna Region',
    duration: '5 Days',
    difficulty: 'Moderate',
    altitude: '3,800 m',
    bestSeason: 'March - June, Sept - Nov',
    price: 680,
    rating: 4.95,
    reviewsCount: 260,
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    category: 'Spiritual',
    description: 'One of the world’s highest temples revered by both Hindus and Buddhists, famed for 108 stone bullhead waterspouts, natural eternal flame, and fossil Shaligram stones.',
    highlights: [
      'Purifying bath beneath the 108 sacred icy mountain water spouts',
      'The miraculous natural gas eternal flame burning inside Jwala Mai',
      'Searching for sacred million-year-old ammonite fossils along Kali Gandaki river',
      'Spectacular desert-mountain backdrop under Nilgiri and Dhaulagiri'
    ],
    itinerary: [
      { day: 1, title: 'Flight Pokhara to Jomsom & Drive to Kagbeni', altitude: '2,800 m', desc: 'Dramatic flight through Kali Gandaki gorge into windswept Mustang.' },
      { day: 2, title: 'Kagbeni to Muktinath Temple Pilgrimage', altitude: '3,800 m', desc: 'Ascend to the sacred shrine and participate in morning puja rituals.' }
    ]
  },
  {
    id: 'dest_namobuddha',
    title: 'Namobuddha Holy Stupa & Monastery Retreat',
    location: 'Kavrepalanchok District',
    duration: '2 Days',
    difficulty: 'Easy',
    altitude: '1,750 m',
    bestSeason: 'Year Round',
    price: 250,
    rating: 4.96,
    reviewsCount: 180,
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
    category: 'Spiritual',
    description: 'One of the three holiest Buddhist pilgrimage sites in Nepal, where Lord Buddha in a previous life sacrificed his body to feed a starving tigress and her cubs.',
    highlights: [
      'Thrangu Tashi Yangtse Monastery chanting and butter lamp meditation',
      'Panoramic sunrise overlooking the eastern Himalayan crest',
      'Gentle ridge walk through Tamang farmsteads and pine forests',
      'Overnight stay inside peaceful monastery guest accommodation'
    ],
    itinerary: [
      { day: 1, title: 'Drive to Panauti & Forest Hike to Namobuddha', altitude: '1,750 m', desc: 'Explore medieval Newari town and walk 3 hours to the holy monastery.' },
      { day: 2, title: 'Dawn Puja Chanting & Dhulikhel Ridge Walk', altitude: '1,600 m', desc: 'Join monks for morning prayers and take scenic ridge trail.' }
    ]
  },
  {
    id: 'dest_bardia',
    title: 'Bardia National Park Wild Tiger Safari',
    location: 'Mid-Far Western Terai',
    duration: '5 Days',
    difficulty: 'Easy',
    altitude: '152 m',
    bestSeason: 'October - April',
    price: 790,
    rating: 4.98,
    reviewsCount: 205,
    imageUrl: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=85',
    category: 'Wildlife',
    description: 'Nepal’s premier untamed wilderness for tracking wild Royal Bengal Tigers on foot, river canoeing with freshwater Gangetic dolphins, and wild elephant tracking.',
    highlights: [
      'Unsurpassed high probability of sighting wild Royal Bengal Tigers',
      'Walking safaris guided by legendary local Tharu naturalists',
      'Drifting down the Karnali river observing Gharial crocodiles and dolphins',
      'Authentic mud-and-thatch Tharu village cultural hospitality'
    ],
    itinerary: [
      { day: 1, title: 'Fly Kathmandu to Nepalgunj & Drive to Bardia', altitude: '152 m', desc: 'Arrive at eco-lodge and evening riverside sunset birdwalk.' },
      { day: 2, title: 'Full-Day Jungle Walking Safari', altitude: '152 m', desc: 'Track tiger pugmarks and wait at animal watchtowers.' },
      { day: 3, title: 'Karnali River Rafting Safari & Dolphin Search', altitude: '152 m', desc: 'Quiet drift boat journey through core national park waters.' }
    ]
  },
  {
    id: 'dest_koshi_tappu',
    title: 'Koshi Tappu Wetlands Birdwatching Sanctuary',
    location: 'Eastern Terai Basin',
    duration: '4 Days',
    difficulty: 'Easy',
    altitude: '80 m',
    bestSeason: 'November - March',
    price: 520,
    rating: 4.88,
    reviewsCount: 110,
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
    category: 'Wildlife',
    description: 'Internationally protected Ramsar wetland harboring over 500 species of migratory birds, wild water buffaloes (Arna), and endangered swamp partridges.',
    highlights: [
      'Boat safari on the vast Sapta Koshi River marshlands',
      'Last remaining habitat of wild water buffalo (Arna) in Nepal',
      'Spotting rare Siberian migratory ducks, storks, and eagles',
      'Elephant-free observation walks along tranquil river banks'
    ],
    itinerary: [
      { day: 1, title: 'Fly Kathmandu to Biratnagar & Transfer to Camp', altitude: '80 m', desc: 'Drive to wetland reserve and afternoon birding stroll.' },
      { day: 2, title: 'Full-Day Riverboat & Marshland Bird Expedition', altitude: '80 m', desc: 'Binocular tracking of rare waterbirds and wild buffalo herds.' }
    ]
  },
  {
    id: 'dest_bungee_kushma',
    title: 'The Cliff Kushma 228m Canyon Bungee & Swing',
    location: 'Kushma, Parbat & Baglung',
    duration: '2 Days',
    difficulty: 'Moderate',
    altitude: '850 m',
    bestSeason: 'September - June',
    price: 210,
    rating: 4.97,
    reviewsCount: 380,
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
    category: 'Adventure',
    description: 'Leap from the world’s second highest bungee suspension bridge (228m) and world’s highest canyon swing across the roaring Kaligandaki River gorge.',
    highlights: [
      'Heart-stopping 228-meter free fall toward the Kaligandaki river',
      'World’s highest canyon tandem and solo swing experience',
      '520-meter long scenic suspension bridge crossing',
      'Glamping resort with campfire terrace directly overlooking the canyon'
    ],
    itinerary: [
      { day: 1, title: 'Scenic Drive Pokhara to Kushma & Jump Prep', altitude: '850 m', desc: 'Safety briefing, harness check, and thrilling afternoon jumps.' },
      { day: 2, title: 'Canyon Swing & Return via Mountain Highway', altitude: '850 m', desc: 'High-speed canyon swing and transfer back to Pokhara.' }
    ]
  },
  {
    id: 'dest_bhotekoshi_raft',
    title: 'Bhotekoshi Extreme White Water Rafting',
    location: 'Sindhupalchok, Tibetan Border',
    duration: '2 Days',
    difficulty: 'Challenging',
    altitude: '900 m',
    bestSeason: 'October - December, March - May',
    price: 160,
    rating: 4.92,
    reviewsCount: 290,
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    category: 'Adventure',
    description: 'Nepal’s steepest and most continuous commercial white water river with non-stop Class IV and IV+ rapids cascading down from the Tibetan plateau.',
    highlights: [
      'Pounding rapids including "Gerbil in the Plumbing" and "Frog in the Blender"',
      'Continuous grade IV rapids requiring intense team paddling',
      'Riverside beach campsite with BBQ and starry night sky',
      'Dramatic emerald canyon gorges draped in waterfalls'
    ],
    itinerary: [
      { day: 1, title: 'Drive to Sukute Beach & First Raft Run', altitude: '900 m', desc: 'Safety drills and afternoon descent through churning rapids.' },
      { day: 2, title: 'Upper Section Rapid Attack & Return to Kathmandu', altitude: '900 m', desc: 'Tackle the most demanding technical drops and drive back.' }
    ]
  },
  {
    id: 'dest_everest_heli',
    title: 'Everest Gourmet Champagne Helicopter Landing',
    location: 'Khumbu Region, Everest',
    duration: '1 Day',
    difficulty: 'Easy',
    altitude: '4,250 m',
    bestSeason: 'October - May',
    price: 1250,
    rating: 4.99,
    reviewsCount: 420,
    imageUrl: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=1200&q=85',
    category: 'Adventure',
    description: 'Fly by private helicopter alongside Mt. Everest, land at Kala Patthar (5,545m) for photo opportunities, and celebrate with a gourmet champagne breakfast.',
    highlights: [
      'Close-up aerial flyover of the Khumbu Icefall, Lhotse, and Nuptse',
      'Landing at Kala Patthar (5,545m) right opposite Everest summit',
      'Champagne breakfast on the terrace of Hotel Everest View in Syangboche',
      'Complete round-trip experience from Kathmandu in under 4 hours'
    ],
    itinerary: [
      { day: 1, title: 'Morning Takeoff from TIA, Everest Landing & Return', altitude: '5,545 m', desc: 'Takeoff at 06:30 AM, touch down at Kala Patthar, breakfast at Kongde, return by 10:30 AM.' }
    ]
  },
  {
    id: 'dest_kanchenjunga_circuit',
    title: 'Kanchenjunga Base Camp Remote Circuit',
    location: 'Taplejung, Far Eastern Nepal',
    duration: '22 Days',
    difficulty: 'Difficult',
    altitude: '5,143 m',
    bestSeason: 'March - May, Oct - Nov',
    price: 2450,
    rating: 4.97,
    reviewsCount: 88,
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
    category: 'Trekking',
    description: 'Epic expedition to the foot of the world’s third highest peak (8,586m) through untouched rhododendron jungles and remote Limbu and Rai villages.',
    highlights: [
      'Touching both North Base Camp (Pangpema) and South Base Camp (Oktang)',
      'Traversing the high Sele La Pass (4,290m) with zero crowds',
      'Prime habitat for elusive Snow Leopards and Red Pandas',
      'Vast cardamom plantations and ancient Tibetan border lifestyle'
    ],
    itinerary: [
      { day: 1, title: 'Flight Kathmandu to Suketar & Trek to Mitlung', altitude: '1,820 m', desc: 'Fly to Taplejung and begin trek down Tamor River valley.' },
      { day: 2, title: 'Mitlung to Chirwa & Cardamom Forest', altitude: '1,790 m', desc: 'Pass traditional Limbu settlements and suspension bridges.' },
      { day: 3, title: 'Pangpema North Base Camp Expedition', altitude: '5,143 m', desc: 'Stand before the colossal north face of Mount Kanchenjunga.' }
    ]
  },

];

export const hotels: Hotel[] = [
  {
    id: 'htl_dwarikas',
    name: "The Dwarika's Hotel",
    location: 'Battisputali, Kathmandu',
    price: '$260 / night',
    priceNum: 260,
    rating: 4.96,
    imageUrl:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'UNESCO Heritage Design',
      'Organic Farm Cuisine',
      'Ayurvedic Spa',
      'Heritage Pool',
      'Heritage Courtyard',
    ],
    description:
      'A living museum of Newari architecture incorporating 13th-century hand-carved terracotta and wood artifacts in central Kathmandu.',
  },
  {
    id: 'htl_barpeepal',
    name: 'Bar Peepal Resort',
    location: 'Sarangkot Road, Pokhara',
    price: '$145 / night',
    priceNum: 145,
    rating: 4.9,
    imageUrl:
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Phewa Lake Panorama',
      'Hillside Infinity Pool',
      'Annapurna Sunrise Views',
      'Organic Garden',
    ],
    description:
      'Perched atop Sarangkot hill overlooking tranquil Phewa Lake and the iconic snow peaks of Fishtail and Annapurna.',
  },
  {
    id: 'htl_yeti_namche',
    name: 'Yeti Mountain Home',
    location: 'Namche Bazaar, Everest',
    price: '$195 / night',
    priceNum: 195,
    rating: 4.92,
    imageUrl:
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Heated Electric Blankets',
      'Oxygen Concentrators',
      'Panoramic Deck',
      'Sherpa Hospitality',
    ],
    description:
      'Luxury mountain comfort at 3,440m altitude with breathtaking views of Kongde Ri and Thamserku.',
  },
  {
    id: 'htl_barahi',
    name: 'Barahi Jungle Lodge',
    location: 'Meghauli, Chitwan',
    price: '$220 / night',
    priceNum: 220,
    rating: 4.88,
    imageUrl:
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Private River Cottages',
      'Naturalist Guides',
      'Infinity Pool on River',
      'Bush Dinners',
      'Riverbank Deck Dining',
      'Jungle Safaris',
    ],
    description:
      'Eco-luxury safari lodge right along the banks of Rapti river bordering Chitwan National Park.',
  },
  {
    id: 'htl_shinta_mani',
    name: 'Shinta Mani Mustang - A Bensley Collection',
    location: 'Marpha & Jomsom, Mustang',
    price: '$850 / night',
    priceNum: 850,
    rating: 4.99,
    imageUrl: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=800&q=80',
    highlights: ['All-Inclusive Luxury', 'Private Mustang Excursions', 'Tibetan Herbal Spa', 'Curated Himalayan Cuisine'],
    description: 'An extraordinary luxury sanctuary designed by Bill Bensley, offering jaw-dropping views of Nilgiri mountain, private butler service, and private helicopter landing pads.'
  },
  {
    id: 'htl_kasara',
    name: 'Kasara Luxury Safari Resort',
    location: 'Patihani, Chitwan National Park',
    price: '$295 / night',
    priceNum: 295,
    rating: 4.93,
    imageUrl: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=800&q=80',
    highlights: ['Private Plunge Pools', 'Canoeing Excursions', 'Elephant-Free Sanctuary', 'Fine Dining'],
    description: 'Minimalist luxury villas integrated into pristine Sal forest borders, with private water gardens and naturalist-led jungle safaris.'
  },
  {
    id: 'htl_pavilions_lake',
    name: 'The Pavilions Himalayas Lake View',
    location: 'Phewa Lake West Bank, Pokhara',
    price: '$280 / night',
    priceNum: 280,
    rating: 4.94,
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    highlights: ['Accessible only by wooden boat', '100% Solar Powered', 'Private Infinity Terraces', 'Annapurna Panorama'],
    description: 'Eight secluded luxury tented villas overlooking the tranquil waters of Phewa lake, accessed exclusively by private boat transfer across the lake.'
  },
  {
    id: 'htl_shanker',
    name: 'Hotel Shanker Heritage Palace',
    location: 'Lazimpat, Kathmandu',
    price: '$140 / night',
    priceNum: 140,
    rating: 4.88,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    highlights: ['Historical 19th-century Rana Palace', 'Neoclassical Architecture', 'Pool Garden Oasis', 'Close to Thamel'],
    description: 'Authentic 1894 Rana royal palace converted into a heritage retreat with grand chandeliers, carved gilded ceilings, and peaceful poolside lawns in central Kathmandu.'
  },
  {
    id: 'htl_fishtail',
    name: 'Fishtail Lodge',
    location: 'Phewa Lake, Pokhara',
    price: '$190 / night',
    priceNum: 190,
    rating: 4.91,
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    highlights: ['Island Pontoons Crossing', 'Machhapuchhre View', 'Historic Royalty Guests', 'Lush Tropical Gardens'],
    description: 'Iconic Pokhara landmark reached by private shuttle rafts, having hosted world leaders and royalty with unmatched reflection views of sacred Mt. Fishtail.'
  },
];

export const guides: Guide[] = [
  {
    id: 'gd_pasang',
    name: 'Pasang Nuru Sherpa',
    role: 'IFMGA Mountain Guide',
    summits: 'Everest x 7, K2 x 2, Manaslu x 5',
    languages: ['English', 'Sherpa', 'Nepali', 'French'],
    experience: '16 Years',
    rating: 4.98,
    reviews: 184,
    rate: '$65 / day',
    rateNum: 65,
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Certified international mountain guide born in Khumjung. Expert in high altitude safety, crevasse rescue, and cultural storytelling.',
  },
  {
    id: 'gd_anita',
    name: 'Anita Gurung',
    role: 'Trekking & Wilderness Guide',
    summits: 'Thorong Peak, Mera Peak, Island Peak',
    languages: ['English', 'Nepali', 'German'],
    experience: '9 Years',
    rating: 4.95,
    reviews: 126,
    rate: '$50 / day',
    rateNum: 50,
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bio: 'Pioneering female wilderness specialist leading eco-treks and female traveler expeditions across Annapurna and Langtang.',
  },
  {
    id: 'gd_mingma',
    name: 'Mingma Dorchi Sherpa',
    role: 'Speed Alpinist & Expedition Leader',
    summits: 'Guinness Record Holder (Everest - Lhotse traverse)',
    languages: ['English', 'Tibetan', 'Hindi', 'Nepali'],
    experience: '14 Years',
    rating: 4.99,
    reviews: 210,
    rate: '$80 / day',
    rateNum: 80,
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bio: 'Renowned Himalayan mountaineer with deep expertise in personalized private expeditions and extreme wilderness navigation.',
  },
  {
    id: 'gd_dawa',
    name: 'Dawa Yangzum Sherpa',
    role: 'First Female IFMGA Mountain Guide',
    summits: 'K2 x 2, Everest x 3, Makalu, Cho Oyu',
    languages: ['English', 'Sherpa', 'Nepali', 'Spanish'],
    experience: '13 Years',
    rating: 4.99,
    reviews: 198,
    rate: '$85 / day',
    rateNum: 85,
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    bio: 'Historic mountaineer from Rolwaling Valley. First woman in Nepal to receive international IFMGA certification, National Geographic Adventurer.',
  },
  {
    id: 'gd_tenzing',
    name: 'Tenzing Chhiri Sherpa',
    role: 'Chief Alpine Safety Director',
    summits: 'Everest x 14, Lhotse x 4, Cho Oyu x 3',
    languages: ['English', 'Nepali', 'Tibetan', 'Sherpa'],
    experience: '22 Years',
    rating: 4.97,
    reviews: 340,
    rate: '$75 / day',
    rateNum: 75,
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    bio: 'Veteran Himalayan expedition leader. Trained 300+ junior Sherpa guides across Nepal in advanced high-angle crevasse evacuation.',
  },
  {
    id: 'gd_pemba',
    name: 'Pemba Tshering Sherpa',
    role: 'Remote High Pass Specialist',
    summits: 'Manaslu x 6, Dhaulagiri x 2, Thorong La x 45',
    languages: ['English', 'Nepali', 'French'],
    experience: '11 Years',
    rating: 4.94,
    reviews: 152,
    rate: '$60 / day',
    rateNum: 60,
    avatar:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    bio: 'Specialist in trans-Himalayan remote exploration across Manaslu, Dolpo, and Mustang with encyclopedic knowledge of alpine flora.',
  },
  {
    id: 'gd_pemba_gelje',
    name: 'Pemba Gelje Sherpa',
    role: 'IFMGA Technical Climbing Specialist',
    summits: 'Everest x 6, Manaslu x 4, Ama Dablam x 8',
    languages: ['English', 'Sherpa', 'Nepali', 'Italian'],
    experience: '15 Years',
    rating: 4.99,
    reviews: 142,
    rate: '$75 / day',
    rateNum: 75,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Lead mountain safety instructor at Nepal Mountain Academy, specializing in steep technical rock, mixed ice, and high-camp management.'
  },
  {
    id: 'gd_karma',
    name: 'Karma Tshering Tamang',
    role: 'Langtang & Helambu Cultural Botanist Guide',
    summits: 'Yala Peak, Baden-Powell Peak, Langshisha Ri',
    languages: ['English', 'Nepali', 'Tamang', 'Japanese'],
    experience: '11 Years',
    rating: 4.93,
    reviews: 98,
    rate: '$45 / day',
    rateNum: 45,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bio: 'Master of alpine medicinal plants, sacred Tamang folklore, and wildlife photography along the Langtang and Gosaikunda circuit.'
  },
  {
    id: 'gd_sunita',
    name: 'Sunita Thapa',
    role: 'Annapurna Wilderness & Birding Naturalist',
    summits: 'Mardi Himal, Tent Peak (Tharpu Chuli)',
    languages: ['English', 'Nepali', 'German'],
    experience: '8 Years',
    rating: 4.96,
    reviews: 114,
    rate: '$55 / day',
    rateNum: 55,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bio: 'Passionate wildlife conservationist leading female trekking groups, solo travelers, and nature photography expeditions across the Annapurnas.'
  },
  {
    id: 'gd_nima',
    name: 'Nima Rinji Sherpa',
    role: '14 Peaks Record Mountaineer & Sirdar',
    summits: 'All 14x 8,000m Peaks (World Record)',
    languages: ['English', 'Sherpa', 'Nepali', 'Hindi'],
    experience: '7 Years',
    rating: 5.0,
    reviews: 86,
    rate: '$95 / day',
    rateNum: 95,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Next-generation mountaineering icon, renowned worldwide for ethical alpine style, sustainable waste management, and extreme altitude guiding.'
  },

];

export const butlers: Butler[] = [
  {
    id: 'btl_pemba',
    name: 'Pemba Tenzing Sherpa',
    role: 'High-Altitude Personal Butler',
    rating: 4.96,
    trips: '80+ Journeys',
    rate: '$45 / day',
    avatar:
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    skills: [
      'Luggage Coordination',
      'Teahouse VIP Bookings',
      'Tea & Coffee Service',
      'First Aid Responder',
    ],
  },
  {
    id: 'btl_karma',
    name: 'Karma Dorje Lama',
    role: 'Expedition Concierge & Medic',
    rating: 4.93,
    trips: '64+ Journeys',
    rate: '$40 / day',
    avatar:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    skills: [
      'Oxygen Management',
      'Photography Assistance',
      'Permit Expediting',
      'Camp Setup',
    ],
  },
  {
    id: 'btl_tsering',
    name: 'Tsering Wangdi',
    role: 'Private High-Altitude VIP Concierge',
    rating: 4.98,
    trips: '68 Expeditions',
    rate: '$50 / day',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    skills: ['Satellite Wi-Fi Station', 'Thermal Gear Warming', 'Gourmet French Press Coffee', 'Daily Vitals Tracking']
  },
  {
    id: 'btl_pasang_kaji',
    name: 'Pasang Kaji Sherpa',
    role: 'Expedition Comms & Solar Logistics Lead',
    rating: 4.97,
    trips: '82 Expeditions',
    rate: '$48 / day',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    skills: ['High-Output Solar Power Bank', 'Garmin inReach SOS Link', 'Down Suit Maintenance', 'Hot Water Delivery']
  },
  {
    id: 'btl_chhewang',
    name: 'Chhewang Sherpa',
    role: 'Alpine Nutritionist & Gourmet Camp Butler',
    rating: 4.99,
    trips: '94 Expeditions',
    rate: '$52 / day',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    skills: ['High-Calorie Organic Meals', 'Hydration Regimen Tracking', 'Teahouse VIP Room Prep', 'Luggage Checkpoint Transit']
  },

];

export const activities: Activity[] = [
  {
    id: 'act_paraglide',
    title: 'Tandem Paragliding over Phewa Lake',
    location: 'Sarangkot, Pokhara',
    duration: '30 Mins Flight',
    price: '$85',
    rating: 4.95,
    imageUrl:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    operator: 'Sunrise Paragliding Pokhara',
  },
  {
    id: 'act_heli',
    title: 'Everest Scenic Helicopter Flight with Breakfast',
    location: 'Tribhuvan Airport -> Kala Patthar',
    duration: '4 Hours',
    price: '$950',
    rating: 4.99,
    imageUrl:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
    operator: 'Simrik Air Helicopters',
  },
  {
    id: 'act_bungee',
    title: '160m Bungee Jump over Bhote Koshi',
    location: 'The Last Resort, Sindhupalchok',
    duration: 'Full Day',
    price: '$110',
    rating: 4.88,
    imageUrl:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    operator: 'The Last Resort Nepal',
  },
  {
    id: 'act_rafting',
    title: 'Trishuli River White Water Rafting (Grade III+)',
    location: 'Charaudi, Dhading',
    duration: '1 Day',
    price: '$60',
    rating: 4.84,
    imageUrl:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
    operator: 'Paddle Nepal River Expeditions',
  },
  {
    id: 'act_heli_kongde',
    title: 'Everest Heli-Breakfast at Kongde (4,250m)',
    location: 'Lukla / Kongde Viewpoint',
    duration: '3.5 Hours',
    price: '$1,150',
    rating: 4.99,
    imageUrl: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=600&q=80',
    operator: 'Air Dynasty Heli Services'
  },
  {
    id: 'act_kushma_bungee',
    title: 'World 2nd Highest Bungee (228m) & Canyon Swing',
    location: 'The Cliff Kushma, Parbat',
    duration: 'Full Day',
    price: '$180',
    rating: 4.98,
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    operator: 'The Cliff Nepal Adventure'
  },
  {
    id: 'act_trishuli_raft',
    title: 'Trishuli River White Water Rafting & Cliff Jump',
    location: 'Charaudi to Fishling, Trishuli River',
    duration: '1 Day',
    price: '$65',
    rating: 4.91,
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    operator: 'Paddle Nepal Rivers'
  },
  {
    id: 'act_bhaktapur_pottery',
    title: 'Bhaktapur Pottery Square & Thangka Masterclass',
    location: 'Bhaktapur Medieval Square',
    duration: '4 Hours',
    price: '$45',
    rating: 4.94,
    imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f841807d?auto=format&fit=crop&w=600&q=80',
    operator: 'Heritage Living Arts Guild'
  },
  {
    id: 'act_bardia_tiger_walk',
    title: 'Bardia Deep Jungle Tiger Tracking on Foot',
    location: 'Bardia National Park Buffer Zone',
    duration: 'Full Day',
    price: '$95',
    rating: 4.99,
    imageUrl: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=600&q=80',
    operator: 'Bardia Eco Naturalist Society'
  },

];

export const transports: Transport[] = [
  {
    id: 'trn_scorpio',
    title: 'Mahindra Scorpio 4WD Mountain Rental',
    type: 'Private Offroad Vehicle',
    seats: '6 Passengers',
    price: '$120 / day',
    driver: 'Includes Experienced Mountain Driver',
    rating: 4.92,
  },
  {
    id: 'trn_flight',
    title: 'Kathmandu to Pokhara Domestic Flight',
    type: 'Buddha Air ATR-72',
    seats: 'Window Seat Priority',
    price: '$115 one-way',
    driver: '25 Mins Flight time',
    rating: 4.85,
  },
  {
    id: 'trn_vipbus',
    title: 'Greenline Super Deluxe VIP Tourist Coach',
    type: 'AC Luxury Sofa Bus',
    seats: 'Reclining 2x1 Sofa Seats',
    price: '$30 / ticket',
    driver: 'Includes Lunch Buffet & WiFi',
    rating: 4.75,
  },
  {
    id: 'tr_hiace',
    title: 'Toyota HiAce Super GL Tourist Microbus',
    type: 'Luxury AC Van',
    seats: '14 Passengers',
    price: '$160 / day',
    driver: 'Rajesh Manandhar (14 Yrs Exp)',
    rating: 4.93
  },
  {
    id: 'tr_staria',
    title: 'Hyundai Staria VIP Recliner Lounge Van',
    type: 'Executive VIP Van',
    seats: '7 Captain Seats',
    price: '$220 / day',
    driver: 'Bikash Tamang (Alpine VIP Driver)',
    rating: 4.97
  },
  {
    id: 'tr_heli_charter',
    title: 'Airbus H125 / B3e Private Helicopter Charter',
    type: 'Himalayan High-Altitude Helicopter',
    seats: '5 Passengers + Oxygen Kit',
    price: '$2,800 / flight hr',
    driver: 'Capt. Bibek Khadka (Senior Flight Commander)',
    rating: 5.0
  },
  {
    id: 'tr_jomsom_flight',
    title: 'Pokhara - Jomsom Mountain Twin Otter Flight',
    type: 'Scheduled Mountain STOL Aircraft',
    seats: '18 Passengers',
    price: '$145 / seat',
    driver: 'Tara Air / Summit Air Certified Flight Crew',
    rating: 4.89
  },

];

export const permits: Permit[] = [
  {
    id: 'pmt_tims',
    code: 'TIMS-2026-9812',
    title: 'TIMS Card (Trekkers Information Management System)',
    authority: 'Nepal Tourism Board (NTB) & TAAN',
    cost: 'NPR 2,000 (~ $15 USD)',
    validity: 'Valid across all non-restricted trekking routes',
    status: 'Approved',
    approvalDate: '24 Oct 2026',
  },
  {
    id: 'pmt_snp',
    code: 'SNP-2026-4401',
    title: 'Sagarmatha National Park Entry Permit',
    authority: 'Department of National Parks & Wildlife',
    cost: 'NPR 3,000 (~ $23 USD)',
    validity: 'Khumbu / Everest Region',
    status: 'Approved',
    approvalDate: '25 Oct 2026',
  },
  {
    id: 'pmt_acap',
    code: 'ACAP-2026-1192',
    title: 'Annapurna Conservation Area Project (ACAP)',
    authority: 'National Trust for Nature Conservation (NTNC)',
    cost: 'NPR 3,000 (~ $23 USD)',
    validity: 'Annapurna, Manang & Mustang',
    status: 'Under Review',
    approvalDate: 'Pending Officer Sign-off',
  },
  {
    id: 'pmt_mustang',
    code: 'RAP-2026-0043',
    title: 'Upper Mustang Restricted Area Special Permit',
    authority: 'Department of Immigration, Kathmandu',
    cost: '$500 USD (First 10 Days)',
    validity: 'Kagbeni to Lo Manthang',
    status: 'Draft',
    approvalDate: 'Requires Licensed Guide Assignment',
  },
  {
    id: 'pmt_mcap',
    code: 'MCAP-2026-9041',
    title: 'Manaslu Conservation Area Permit (MCAP)',
    authority: 'National Trust for Nature Conservation (NTNC)',
    cost: '$30 USD',
    validity: 'Philim to Larkya La & Dharapani',
    status: 'Approved',
    approvalDate: 'Approved for Spring/Autumn 2026'
  },
  {
    id: 'pmt_nar_phu',
    code: 'RAP-NAR-2026-118',
    title: 'Nar Phu Valley Restricted Area Special Permit',
    authority: 'Department of Immigration, Kathmandu',
    cost: '$100 USD (Sept-Nov) / $75 USD (Dec-Aug)',
    validity: 'Koto to Phu Village & Kang La Pass',
    status: 'Approved',
    approvalDate: 'Approved with Registered Agency'
  },
  {
    id: 'pmt_dolpo',
    code: 'RAP-DLP-2026-082',
    title: 'Upper Dolpo Restricted Area Special Permit',
    authority: 'Department of Immigration, Kathmandu',
    cost: '$500 USD (First 10 Days)',
    validity: 'Juphal to Shey Gompa & Saldang',
    status: 'Draft',
    approvalDate: 'Requires Certified Mountain Guide'
  },
  {
    id: 'pmt_langtang',
    code: 'LNP-2026-4402',
    title: 'Langtang National Park Entry Permit',
    authority: 'Department of National Parks (DNPWC)',
    cost: '$30 USD',
    validity: 'Dhunche, Syabrubesi, Kyanjin & Gosaikunda',
    status: 'Approved',
    approvalDate: 'Instant QR Active'
  },

];

export const initialBookings: Booking[] = [
  {
    id: 'BKG-99214',
    title: 'Everest Base Camp Trek (14 Days)',
    provider: 'Himalayan Sherpa Expeditions',
    category: 'Trek',
    date: 'Nov 12 - Nov 25, 2026',
    bookedBy: 'Aayush Pradhan',
    status: 'Confirmed',
    amount: '$1,350',
    qrCode: 'EBC-99214-CONFIRMED-AAYUSH',
    color: '#0552A2',
    meetingPoint: 'Lukla Airport Terminal, 08:30 AM',
    assignedGuide: 'Pasang Nuru Sherpa (IFMGA)',
    contactPhone: '+977 9811223344',
  },
  {
    id: 'BKG-88102',
    title: "The Dwarika's Hotel - Heritage Suite",
    provider: "The Dwarika's Hotel Kathmandu",
    category: 'Stay',
    date: 'Nov 10 - Nov 12, 2026',
    bookedBy: 'Aayush Pradhan',
    status: 'Confirmed',
    amount: '$520',
    qrCode: 'DWARIKAS-SUITE-88102-CHECKIN',
    color: '#16A34A',
    meetingPoint: 'Battisputali Front Desk, 02:00 PM Check-in',
    assignedGuide: 'Front Desk Concierge',
    contactPhone: '+977 1 4479488',
  },
  {
    id: 'BKG-77401',
    title: 'Tandem Paragliding Flight',
    provider: 'Sunrise Paragliding Pokhara',
    category: 'Adventure',
    date: 'Oct 18, 2026',
    bookedBy: 'Aayush Pradhan',
    status: 'Completed',
    amount: '$85',
    qrCode: 'PARA-POK-77401-PAID',
    color: '#64748B',
    meetingPoint: 'Lakeside Center, Pokhara',
    assignedGuide: 'Ramesh Thapa',
    contactPhone: '+977 61 465220',
  },
  {
    id: 'BKG-66319',
    title: 'Private Scorpio 4x4 Transfer Pokhara -> Kathmandu',
    provider: 'Nepal Mountain Wheels',
    category: 'Transport',
    date: 'Oct 10, 2026',
    bookedBy: 'Aayush Pradhan',
    status: 'Cancelled',
    amount: '$120 (Refunded)',
    qrCode: 'VOID-REFUNDED-66319',
    color: '#EF4444',
    meetingPoint: 'Hotel Pickup Pokhara',
    assignedGuide: 'Bikash KC',
    contactPhone: '+977 9801234567',
  },
  {
    id: 'BKG-55208',
    title: 'Annapurna Circuit & Tilicho Lake Trek (16 Days)',
    provider: 'Annapurna Mountain Guides Co.',
    category: 'Trek',
    date: 'Dec 05 - Dec 20, 2026',
    bookedBy: 'Aayush Pradhan',
    status: 'Confirmed',
    amount: '$1,180',
    qrCode: 'ACT-TILICHO-55208-CONFIRMED',
    color: '#0552A2',
    meetingPoint: 'Beshisahar Gate Point, 07:00 AM',
    assignedGuide: 'Anita Gurung (Wilderness Specialist)',
    contactPhone: '+977 9841556677',
  },
  {
    id: 'BKG-44119',
    title: 'Shinta Mani Mustang Luxury Villa (3 Nights)',
    provider: 'Shinta Mani A Bensley Collection',
    category: 'Stay',
    date: 'Dec 21 - Dec 24, 2026',
    bookedBy: 'Aayush Pradhan',
    status: 'Confirmed',
    amount: '$2,550',
    qrCode: 'SHINTA-MUSTANG-44119-VIP',
    color: '#16A34A',
    meetingPoint: 'Jomsom Airport Helipad VIP Lounge',
    assignedGuide: 'Tsering Wangdi (Private Butler)',
    contactPhone: '+977 69 440120',
  },
  {
    id: 'BKG-33982',
    title: 'Everest Gourmet Champagne Heli-Tour & Landing',
    provider: 'Air Dynasty Heli Services',
    category: 'Adventure',
    date: 'Oct 04, 2026',
    bookedBy: 'Aayush Pradhan',
    status: 'Completed',
    amount: '$1,150',
    qrCode: 'HELI-EVEREST-33982-VERIFIED',
    color: '#64748B',
    meetingPoint: 'TIA Domestic Helipad Gate 3',
    assignedGuide: 'Capt. Bibek Khadka',
    contactPhone: '+977 1 4477300',
  },
  {
    id: 'BKG-22871',
    title: 'Chitwan Jungle Safari 3D/2N Luxury Package',
    provider: 'Barahi Jungle Lodge Meghauli',
    category: 'Adventure',
    date: 'Sep 22 - Sep 24, 2026',
    bookedBy: 'Aayush Pradhan',
    status: 'Completed',
    amount: '$640',
    qrCode: 'CHITWAN-BARAHI-22871-PAID',
    color: '#64748B',
    meetingPoint: 'Bharatpur Airport Chauffeur Desk',
    assignedGuide: 'Ram Kumar Tharu (Chief Naturalist)',
    contactPhone: '+977 56 690220',
  },
  {
    id: 'BKG-11760',
    title: 'Upper Mustang Restricted Area Permit & Heritage Guide',
    provider: 'Department of Immigration & NTB',
    category: 'Trek',
    date: 'Jan 15 - Jan 25, 2027',
    bookedBy: 'Aayush Pradhan',
    status: 'Confirmed',
    amount: '$680',
    qrCode: 'MUSTANG-PERMIT-11760-APPROVED',
    color: '#0552A2',
    meetingPoint: 'Kagbeni Immigration Checkpost, 09:00 AM',
    assignedGuide: 'Mingma Dorchi Sherpa',
    contactPhone: '+977 9812345678',
  },
  {
    id: 'BKG-99654',
    title: 'The Cliff Kushma 228m Canyon Bungee Jump',
    provider: 'The Cliff Nepal Adventure',
    category: 'Adventure',
    date: 'Aug 14, 2026',
    bookedBy: 'Aayush Pradhan',
    status: 'Completed',
    amount: '$180',
    qrCode: 'CLIFF-BUNGEE-99654-JUMPED',
    color: '#64748B',
    meetingPoint: 'The Cliff Resort Main Counter, Kushma',
    assignedGuide: 'Anup Acharya (Safety Rig Master)',
    contactPhone: '+977 67 420110',
  },
  {
    id: 'BKG-88543',
    title: 'Private IFMGA Mountain Leader: Dawa Yangzum Sherpa',
    provider: 'Nepal Mountain Guides Association',
    category: 'Trek',
    date: 'Feb 02 - Feb 09, 2027',
    bookedBy: 'Aayush Pradhan',
    status: 'Confirmed',
    amount: '$595',
    qrCode: 'IFMGA-DAWA-88543-ASSIGNED',
    color: '#0552A2',
    meetingPoint: 'Hotel Shanker Lobby Kathmandu, 08:00 AM',
    assignedGuide: 'Dawa Yangzum Sherpa (IFMGA)',
    contactPhone: '+977 9849001122',
  },
  {
    id: 'BKG-77432',
    title: 'Kathmandu - Lukla Scenic Mountain STOL Flight',
    provider: 'Tara Air Mountain Wings',
    category: 'Transport',
    date: 'Jul 19, 2026',
    bookedBy: 'Aayush Pradhan',
    status: 'Cancelled',
    amount: '$220 (Rescheduled Voucher)',
    qrCode: 'VOID-MONSOON-WEATHER-77432',
    color: '#EF4444',
    meetingPoint: 'TIA Terminal 2 Departure Hall',
    assignedGuide: 'Flight Operations Dispatch',
    contactPhone: '+977 1 4495000',
  },
];

export const initialCommunityPosts: CommunityPost[] = [
  {
    id: 'post_1',
    authorName: 'Tenzing Norbu',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    authorLocation: 'Dingboche, 4,410m',
    timeAgo: '2 hours ago',
    verified: true,
    content: 'Sunrise over Ama Dablam this morning was pure spiritual magic. Clear skies, freezing crisp air (-8°C), and fresh yak butter tea at the lodge. The Himalayas are calling!',
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
    likesCount: 284,
    userReaction: 'love',
    commentsCount: 34,
    comments: [
      {
        id: 'c1',
        author: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        text: 'Incredible shot! How are the trails up to Lobuche right now?',
        timeAgo: '1 hour ago',
        likes: 6,
      },
      {
        id: 'c2',
        author: 'Tenzing Norbu',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        text: '@Sarah dry and solid! Microspikes are helpful near the moraine.',
        timeAgo: '45m ago',
        likes: 4,
      },
    ],
  },
  {
    id: 'post_2',
    authorName: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    authorLocation: 'Phewa Lake, Pokhara',
    timeAgo: '5 hours ago',
    verified: false,
    content: 'Gliding silently across Phewa Lake on a traditional wooden doonga boat, looking right at the sacred Fishtail peak reflection. Nepal has captured my heart completely!',
    mediaUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80',
    likesCount: 192,
    userReaction: 'like',
    commentsCount: 19,
    comments: [
      {
        id: 'c3',
        author: 'Kritish Shrestha',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        text: 'Make sure you try the fresh Thakali thali in Lakeside for dinner!',
        timeAgo: '3 hours ago',
        likes: 8,
      },
    ],
  },
  {
    id: 'post_3',
    authorName: 'Marcus Berg',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    authorLocation: 'Lo Manthang, Mustang',
    timeAgo: 'Yesterday',
    verified: true,
    content: 'We finally crossed the high pass into Upper Mustang. The red sandstone formations look like they belong on Mars. Ancient Tibetan wall paintings inside the Jampa Gompa left us speechless.',
    mediaUrl: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=900&q=80',
    likesCount: 415,
    userReaction: 'wow',
    commentsCount: 52,
    comments: [
      {
        id: 'c4',
        author: 'Dawa Sherpa',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        text: 'Welcome to the Kingdom of Lo! Don’t forget to visit Chhoser sky caves tomorrow.',
        timeAgo: '18 hours ago',
        likes: 12,
      },
    ],
  },
  {
    id: 'post_4',
    authorName: 'Mingma Dorchi Sherpa',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    authorLocation: 'Everest Base Camp, 5,364m',
    timeAgo: '1 day ago',
    verified: true,
    content: 'Khumbu Icefall route for the upcoming summit window is fully secured by our Icefall Doctors team. Aluminum ladders installed across the western cwm crevasses. Team spirit is sky high!',
    mediaUrl: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=900&q=80',
    likesCount: 680,
    userReaction: 'love',
    commentsCount: 78,
    comments: [
      {
        id: 'c5',
        author: 'Capt. Bibek Khadka',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        text: 'Helicopter supply drops at Camp 2 completed smoothly today. Fly safe, brothers!',
        timeAgo: '20 hours ago',
        likes: 24,
      },
    ],
  },
  {
    id: 'post_5',
    authorName: 'Maya Shrestha',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    authorLocation: 'Patan Durbar Square, Lalitpur',
    timeAgo: '2 days ago',
    verified: true,
    content: 'Dusk falls over the Golden Temple (Hiranya Varna Mahavihar). Hundreds of bronze oil lamps flickering in the autumn breeze. This living craftsmanship has survived over eight centuries.',
    mediaUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f841807d?auto=format&fit=crop&w=900&q=80',
    likesCount: 312,
    userReaction: 'love',
    commentsCount: 28,
    comments: [
      {
        id: 'c6',
        author: 'Julien Mercier',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        text: 'The architecture of Patan is without a doubt one of the world gems.',
        timeAgo: '1 day ago',
        likes: 9,
      },
    ],
  },
  {
    id: 'post_6',
    authorName: 'Liam Walker',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    authorLocation: 'Thorong La Pass, 5,416m',
    timeAgo: '2 days ago',
    verified: false,
    content: 'We reached the signpost at 5,416m at 06:45 AM! Freezing winds, prayer flags whipping fiercely, and the first rays hitting Dhaulagiri. Hardest trek of my life and the greatest reward.',
    mediaUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
    likesCount: 520,
    userReaction: 'wow',
    commentsCount: 64,
    comments: [
      {
        id: 'c7',
        author: 'Anita Gurung',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        text: 'Massive congratulations Liam! Enjoy the downhill walk to Muktinath.',
        timeAgo: '1 day ago',
        likes: 18,
      },
    ],
  },
  {
    id: 'post_7',
    authorName: 'Priya Nair',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    authorLocation: 'Chitwan National Park, Rapti River',
    timeAgo: '3 days ago',
    verified: false,
    content: 'Silent canoe drift at dawn. Out of the morning mist emerged an Asian One-horned Rhinoceros grazing gently along the riverbank while kingfishers plunged into the water. True paradise!',
    mediaUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80',
    likesCount: 275,
    userReaction: 'like',
    commentsCount: 22,
    comments: [
      {
        id: 'c8',
        author: 'Ram Kumar Tharu',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        text: 'Glad you loved the morning drift Priya! Mother rhino was very relaxed.',
        timeAgo: '2 days ago',
        likes: 11,
      },
    ],
  },
  {
    id: 'post_8',
    authorName: 'Karma Sherpa',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    authorLocation: 'Tengboche Monastery, 3,867m',
    timeAgo: '4 days ago',
    verified: true,
    content: 'Mani Rimdu festival mask dance rehearsals in full swing at the monastery courtyard. The sound of long copper horns reverberating across the Khumbu valley brings goosebumps every single time.',
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
    likesCount: 388,
    userReaction: 'love',
    commentsCount: 41,
    comments: [
      {
        id: 'c9',
        author: 'Dawa Yangzum Sherpa',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        text: 'Tashi Delek! Will be there next week with our summit debrief team.',
        timeAgo: '3 days ago',
        likes: 15,
      },
    ],
  },
  {
    id: 'post_9',
    authorName: 'Daniel Craig',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    authorLocation: 'Shey Phoksundo Lake, Dolpo (3,611m)',
    timeAgo: '5 days ago',
    verified: true,
    content: 'No roads, no engines, zero pollution. Just pure turquoise water so transparent you can see underwater rock ledges tens of meters deep under towering snow peaks. Dolpo is the final frontier.',
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
    likesCount: 460,
    userReaction: 'wow',
    commentsCount: 39,
    comments: [
      {
        id: 'c10',
        author: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        text: 'Adding this to my bucket list immediately! How was the flight to Juphal?',
        timeAgo: '4 days ago',
        likes: 8,
      },
    ],
  },
  {
    id: 'post_10',
    authorName: 'Pasang Nuru Sherpa',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    authorLocation: 'Kala Patthar Summit, 5,545m',
    timeAgo: '6 days ago',
    verified: true,
    content: 'Standing on Kala Patthar watching the first golden ray hit the summit pyramid of Everest (8,848.86m), Nuptse, and the Changtse wall in Tibet. Never gets old even after 16 years of guiding.',
    mediaUrl: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=900&q=80',
    likesCount: 790,
    userReaction: 'love',
    commentsCount: 92,
    comments: [
      {
        id: 'c11',
        author: 'Aayush Pradhan',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        text: 'Thank you for leading our team safely up there Pasang Dai! Unforgettable!',
        timeAgo: '5 days ago',
        likes: 31,
      },
    ],
  },
];

export const initialConversations: Conversation[] = [
  {
    id: 'chat_1',
    name: 'Pasang Nuru Sherpa (Guide)',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    status: 'Online',
    verified: true,
    lastMessage: 'I have prepared our crampons and oxygen kits for tomorrow!',
    lastTime: '11:15 AM',
    unread: 2,
    messages: [
      {
        id: 'm1',
        sender: 'Pasang',
        text: 'Tashi Delek Aayush! Looking forward to starting the trek with you on the 12th.',
        time: '10:45 AM',
        isMe: false,
      },
      {
        id: 'm2',
        sender: 'Aayush',
        text: 'Namaste Pasang dai! Yes, my flight lands in Lukla at 8:30 AM.',
        time: '10:50 AM',
        isMe: true,
      },
      {
        id: 'm3',
        sender: 'Pasang',
        text: 'I will be at the runway gate waiting for you with a sign.',
        time: '11:02 AM',
        isMe: false,
      },
      {
        id: 'm4',
        sender: 'Pasang',
        text: 'I have prepared our crampons and oxygen kits for tomorrow!',
        time: '11:15 AM',
        isMe: false,
      },
    ],
  },
  {
    id: 'chat_2',
    name: "The Dwarika's Hotel Concierge",
    avatar:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
    status: 'Away',
    verified: true,
    lastMessage: 'Your airport pickup Mercedes has been scheduled for 1:30 PM.',
    lastTime: 'Yesterday',
    unread: 0,
    messages: [
      {
        id: 'm5',
        sender: 'Hotel',
        text: 'Greetings Mr. Pradhan! We are honored to welcome you.',
        time: 'Yesterday',
        isMe: false,
      },
      {
        id: 'm6',
        sender: 'Aayush',
        text: 'Could you please confirm the airport pickup driver details?',
        time: 'Yesterday',
        isMe: true,
      },
      {
        id: 'm7',
        sender: 'Hotel',
        text: 'Your airport pickup Mercedes has been scheduled for 1:30 PM.',
        time: 'Yesterday',
        isMe: false,
      },
    ],
  },
  {
    id: 'chat_3',
    name: 'Pemba Tenzing (Sherpa Butler)',
    avatar:
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    status: 'Online',
    verified: true,
    lastMessage: 'Teahouse rooms reserved at Namche and Tengboche.',
    lastTime: '2 days ago',
    unread: 0,
    messages: [
      {
        id: 'm8',
        sender: 'Pemba',
        text: 'Namaste! Teahouse rooms reserved at Namche and Tengboche with corner mountain views.',
        time: '2 days ago',
        isMe: false,
      },
    ],
  },
];

export const notifications: NotificationItem[] = [
  {
    id: 'nt_1',
    title: 'Permit Approved',
    body: 'Your Sagarmatha National Park entry permit (SNP-2026-4401) has been officially approved.',
    time: '10 mins ago',
    color: '#16A34A',
    read: false,
  },
  {
    id: 'nt_2',
    title: 'Booking Confirmed',
    body: 'Your reservation for Everest Base Camp Trek (Nov 12 - 25) with Himalayan Sherpa Expeditions is confirmed.',
    time: '2 hours ago',
    color: '#2563EB',
    read: false,
  },
  {
    id: 'nt_3',
    title: 'Himalayan Weather Advisory',
    body: 'Sunny mornings with afternoon fog expected across Khumbu Valley. High winds above 5,000m on Saturday.',
    time: 'Yesterday',
    color: '#EA580C',
    read: true,
  },
  {
    id: 'nt_4',
    title: 'New Story Liked',
    body: 'Tenzing Norbu and 42 others liked your photo at Phewa Lake.',
    time: '2 days ago',
    color: '#EF4444',
    read: true,
  },
];

export const initialScheduleDays: ScheduleDay[] = [
  {
    day: 1,
    date: 'Nov 12, 2026',
    title: 'Lukla Flight & Phakding Hike',
    completed: true,
    stay: 'Yeti Mountain Lodge, Phakding (2,610m)',
    alarm: '05:30 AM (Lukla Departure)',
    audioNote: 'Pack extra batteries in warm jacket pockets to preserve charge in mountain cold.',
    events: [
      { time: '06:30 AM', title: 'Lukla Flight from TIA', desc: 'Terminal 2, Flight Tara Air 102' },
      { time: '08:45 AM', title: 'Meet Guide Pasang Nuru', desc: 'Lukla runway checkpoint and porter arrangement' },
      { time: '09:30 AM', title: 'Begin trek to Phakding', desc: '3.5 hours gentle descent along Dudh Koshi river' },
      { time: '01:30 PM', title: 'Check-in & Hot Garlic Soup', desc: 'Acclimatization meal at riverside tea house' },
    ],
  },
  {
    day: 2,
    date: 'Nov 13, 2026',
    title: 'Climb to Namche Bazaar',
    completed: true,
    stay: 'Panorama Lodge, Namche (3,440m)',
    alarm: '06:00 AM',
    audioNote: 'Cross Hillary Suspension Bridge slowly and pace breathing on the Namche hill.',
    events: [
      { time: '07:30 AM', title: 'Trek departure from Phakding', desc: 'Enter Sagarmatha National Park at Monjo checkpoint' },
      { time: '11:00 AM', title: 'Hillary Suspension Bridge', desc: 'Prayer flags crossing & gorge view' },
      { time: '02:00 PM', title: 'Arrive in Namche Bazaar', desc: 'Sherpa capital exploration & bakery visit' },
    ],
  },
  {
    day: 3,
    date: 'Nov 14, 2026',
    title: 'Namche Acclimatization Hike',
    completed: true,
    stay: 'Panorama Lodge, Namche (3,440m)',
    alarm: '07:00 AM',
    audioNote: 'First panoramic photo spot of Mt. Everest, Ama Dablam, and Thamserku.',
    events: [
      { time: '08:30 AM', title: 'Hike to Everest View Hotel (3,880m)', desc: 'Panoramic terrace breakfast overlooking Everest' },
      { time: '01:00 PM', title: 'Visit Sherpa Culture Museum & Khumjung', desc: 'Heritage exhibits and Hillary Khumjung school' },
    ],
  },
  {
    day: 4,
    date: 'Nov 15, 2026',
    title: 'Namche to Tengboche Monastery',
    completed: false,
    stay: 'Tashi Delek Lodge, Tengboche (3,867m)',
    alarm: '06:30 AM',
    audioNote: 'Afternoon monastery chanting ceremony at 03:00 PM is mandatory to attend.',
    events: [
      { time: '07:45 AM', title: 'Descend to Phunki Thenga', desc: 'Water-driven prayer wheels and river crossing' },
      { time: '11:30 AM', title: 'Ascent through Rhododendron forest', desc: 'Climb to the spiritual heart of Khumbu' },
      { time: '03:00 PM', title: 'Monastery Blessing & Butter Lamp Puja', desc: 'Chanting ceremony with head Lama' },
    ],
  },
  {
    day: 5,
    date: 'Nov 16, 2026',
    title: 'Tengboche to Dingboche Alpine Valley',
    completed: false,
    stay: 'Good Luck Lodge, Dingboche (4,410m)',
    alarm: '06:30 AM',
    audioNote: 'We enter true alpine terrain; keep drinking minimum 4 liters of fluid daily.',
    events: [
      { time: '07:30 AM', title: 'Pangboche Village Crossing', desc: 'View of Ama Dablam hanging glaciers' },
      { time: '11:00 AM', title: 'Shomare Lunch Break', desc: 'Warm Sherpa stew and ginger honey lemon tea' },
      { time: '02:30 PM', title: 'Arrive Dingboche Stone-Walled Fields', desc: 'Altitude briefing and oximeter reading check' },
    ],
  },
  {
    day: 6,
    date: 'Nov 17, 2026',
    title: 'Dingboche Acclimatization Climb',
    completed: false,
    stay: 'Good Luck Lodge, Dingboche (4,410m)',
    alarm: '07:30 AM',
    audioNote: 'Climb high, sleep low. Nangkartshang ridge gives direct view of Makalu (8,485m).',
    events: [
      { time: '08:30 AM', title: 'Climb to Nangkartshang Peak (5,083m)', desc: 'Challenging ridge ascent for altitude adaptation' },
      { time: '01:30 PM', title: 'Afternoon Rest & Pulse Oximeter Check', desc: 'Guide Pasang reviews team blood oxygen saturation' },
    ],
  },
  {
    day: 7,
    date: 'Nov 18, 2026',
    title: 'Dingboche to Lobuche Memorials',
    completed: false,
    stay: 'Eco Lodge, Lobuche (4,940m)',
    alarm: '06:00 AM',
    audioNote: 'Pay respects at Thokla Pass memorials for fallen climbers like Scott Fischer.',
    events: [
      { time: '07:30 AM', title: 'Cross Dughla Alpine Moraine', desc: 'Rocky glacial terminal crossing' },
      { time: '11:00 AM', title: 'Thokla Pass Memorial Stupas (4,830m)', desc: 'Chorten prayers and solemn memorial ridge' },
      { time: '02:00 PM', title: 'Arrive Lobuche Glacial Edge', desc: 'View of Nuptse wall and Khumbu glacier' },
    ],
  },
  {
    day: 8,
    date: 'Nov 19, 2026',
    title: 'Everest Base Camp Milestone Day!',
    completed: false,
    stay: 'Snowland Lodge, Gorak Shep (5,164m)',
    alarm: '05:00 AM',
    audioNote: 'The big milestone day! Trek over glacial moraine to the historic EBC rock.',
    events: [
      { time: '06:00 AM', title: 'Lobuche to Gorak Shep Trek', desc: '3 hours over rocky lateral moraines' },
      { time: '10:00 AM', title: 'Quick Soup & Drop Heavy Gear', desc: 'Hydration stop at the final outpost' },
      { time: '11:00 AM', title: 'Push to Everest Base Camp (5,364m)', desc: 'Touch the milestone marker rock & photo celebration' },
      { time: '04:30 PM', title: 'Return to Gorak Shep Lodge', desc: 'Early dinner and warm sleeping bag preparation' },
    ],
  },
  {
    day: 9,
    date: 'Nov 20, 2026',
    title: 'Kala Patthar Summit & Descend Pheriche',
    completed: false,
    stay: 'Himalayan Hotel, Pheriche (4,240m)',
    alarm: '04:15 AM (Pre-dawn Headlamp Climb)',
    audioNote: 'Kala Patthar (5,545m) sunrise is the highest point of the trek; dress in maximum layers.',
    events: [
      { time: '04:45 AM', title: 'Ascend Kala Patthar Summit', desc: 'Pre-dawn climb under starry skies' },
      { time: '06:30 AM', title: 'Sunrise Over Mount Everest Peak', desc: 'Golden sunlight hitting Everest, Lhotse, and Pumori' },
      { time: '09:00 AM', title: 'Breakfast at Gorak Shep', desc: 'Pack gear and begin descent' },
      { time: '02:30 PM', title: 'Arrive Pheriche Himalayan Rescue Clinic', desc: 'Visit volunteer high-altitude doctor station' },
    ],
  },
  {
    day: 10,
    date: 'Nov 21, 2026',
    title: 'Pheriche to Namche Bazaar Descent',
    completed: false,
    stay: 'Panorama Lodge, Namche Bazaar (3,440m)',
    alarm: '07:00 AM',
    audioNote: 'Feel the rich oxygen returning to your lungs as we drop below 3,500m!',
    events: [
      { time: '08:00 AM', title: 'Trek past Pangboche & Deboche', desc: 'Lush greenery and birch forests return' },
      { time: '12:30 PM', title: 'Lunch at Tengboche Courtyard', desc: 'Warm noodles and panoramic mountain farewell' },
      { time: '04:00 PM', title: 'Arrive Namche Bazaar', desc: 'Hot shower and celebration dinner at Sherpa bar' },
    ],
  },
  {
    day: 11,
    date: 'Nov 22, 2026',
    title: 'Namche Bazaar to Lukla Farewell Trail',
    completed: false,
    stay: 'Paradise Lodge, Lukla (2,840m)',
    alarm: '06:30 AM',
    audioNote: 'Final trekking day along the Dudh Koshi river; evening tip ceremony with porters.',
    events: [
      { time: '07:30 AM', title: 'Descend Hillary Bridge to Monjo', desc: 'Exit Sagarmatha National Park gates' },
      { time: '01:00 PM', title: 'Phakding Lunch & Rest', desc: 'Cross final wooden and suspension bridges' },
      { time: '04:30 PM', title: 'Arrival at Lukla Airport Gateway', desc: 'Celebration dinner with guide and support team' },
    ],
  },
  {
    day: 12,
    date: 'Nov 23, 2026',
    title: 'Scenic Mountain Flight to Kathmandu',
    completed: false,
    stay: "The Dwarika's Hotel, Kathmandu",
    alarm: '05:30 AM',
    audioNote: 'Window seat on the right side of the aircraft offers full panoramic Himalayan view.',
    events: [
      { time: '06:30 AM', title: 'Lukla Tenzing-Hillary Takeoff', desc: 'Thrilling runway takeoff over the abyss' },
      { time: '07:15 AM', title: 'Arrive TIA Domestic Terminal', desc: 'Private transfer to luxury hotel' },
      { time: '10:00 AM', title: 'Ayurvedic Massage & Rest', desc: 'Deep muscle recovery and herbal steam' },
    ],
  },
  {
    day: 13,
    date: 'Nov 24, 2026',
    title: 'Kathmandu Heritage Rest & Spa',
    completed: false,
    stay: "The Dwarika's Hotel, Kathmandu",
    alarm: '08:00 AM',
    audioNote: 'Pashupatinath evening Aarati and farewell Newari dining feast.',
    events: [
      { time: '10:30 AM', title: 'Boudhanath Stupa Circumambulation', desc: 'Prayer flags and rooftop Tibetan café' },
      { time: '05:30 PM', title: 'Pashupatinath River Aarti Ceremony', desc: 'Sacred fire rituals along Bagmati river' },
      { time: '07:30 PM', title: '12-Course Traditional Nepali Royal Dinner', desc: 'Krishnarpan heritage dining experience' },
    ],
  },
  {
    day: 14,
    date: 'Nov 25, 2026',
    title: 'Final Debriefing & Onward Journey',
    completed: false,
    stay: 'Home Bound / Transit',
    alarm: 'Flexible',
    audioNote: 'Collect official TIMS Expedition Completion Certificate from Nepal Tourism Board.',
    events: [
      { time: '10:00 AM', title: 'NTB Expedition Debrief & Certificate', desc: 'Receive official signed certificate of completion' },
      { time: '02:00 PM', title: 'Souvenir & Thangka Selection in Thamel', desc: 'Authentic singing bowls and pashmina shawls' },
      { time: '06:00 PM', title: 'International Airport Transfer', desc: 'Depart Nepal with lifelong Himalayan memories' },
    ],
  },
];

export const businessMetrics = {
  companyName: 'Himalayan Sherpa Expeditions Pvt. Ltd.',
  registration: 'REG-NPL-88910',
  rating: 4.94,
  totalRevenue: '$48,920',
  totalBookings: 138,
  activeStaff: 16,
  verifiedStatus: 'Verified Government Partner',
  recentReservations: [
    {
      id: 'RSV-401',
      traveler: 'Aayush Pradhan',
      package: 'Everest Base Camp (14D)',
      pax: 2,
      date: 'Nov 12, 2026',
      status: 'Confirmed',
      amount: '$2,700',
    },
    {
      id: 'RSV-402',
      traveler: 'Sarah Jenkins',
      package: 'Annapurna Circuit (12D)',
      pax: 1,
      date: 'Nov 18, 2026',
      status: 'Pending Payment',
      amount: '$980',
    },
    {
      id: 'RSV-403',
      traveler: 'Hiroshi Tanaka',
      package: 'Upper Mustang Forbidden Kingdom',
      pax: 4,
      date: 'Dec 02, 2026',
      status: 'Confirmed',
      amount: '$6,600',
    },
  ],
  staffList: [
    {
      name: 'Pasang Nuru Sherpa',
      role: 'Lead Expedition Guide',
      status: 'Assigned on Nov 12',
    },
    {
      name: 'Anita Gurung',
      role: 'Wilderness Trek Leader',
      status: 'Available',
    },
    {
      name: 'Pemba Tenzing',
      role: 'Sherpa Butler',
      status: 'Assigned on Nov 12',
    },
    {
      name: 'Dawa Lama',
      role: 'Logistics & Porters Coordinator',
      status: 'Active',
    },
  ],
};

export const adminMetrics = {
  totalTravelers: 18450,
  registeredAgencies: 342,
  activeGuides: 820,
  totalBookingsVolume: '$2,450,000',
  pendingPermits: 24,
  pendingBusinessVerifications: 7,
  verificationQueue: [
    {
      id: 'VQ-1',
      business: 'Everest High Altitude Helis',
      type: 'Aviation & Rescue',
      applied: '2 days ago',
      status: 'Pending Inspection',
    },
    {
      id: 'VQ-2',
      business: 'Annapurna Eco Lodge Marpha',
      type: 'Hospitality / Stay',
      applied: 'Yesterday',
      status: 'Document Review',
    },
    {
      id: 'VQ-3',
      business: 'Trishuli Raft Adventures',
      type: 'Adventure Sport',
      applied: 'Today',
      status: 'Pending Safety Audit',
    },
  ],
  permitOfficerQueue: [
    {
      id: 'PMT-REQ-101',
      applicant: 'Aayush Pradhan',
      permit: 'Sagarmatha National Park',
      region: 'Khumbu',
      status: 'Approved',
    },
    {
      id: 'PMT-REQ-102',
      applicant: 'Elena Rostova',
      permit: 'Annapurna Conservation Area (ACAP)',
      region: 'Kaski/Manang',
      status: 'Under Review',
    },
    {
      id: 'PMT-REQ-103',
      applicant: 'Marcus Berg',
      permit: 'Upper Mustang Restricted Permit',
      region: 'Lo Manthang',
      status: 'Officer Signature Needed',
    },
  ],
};

