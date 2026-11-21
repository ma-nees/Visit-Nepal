export interface ConciergeMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  date: string;
  isMe: boolean;
  status?: 'sent' | 'delivered' | 'read';
  attachment?: {
    type: 'image' | 'file';
    url: string;
    name: string;
    size?: string;
  };
}

export interface RouteCheckpoint {
  name: string;
  altitude: string;
  completed: boolean;
  current?: boolean;
}

export interface TripContext {
  title: string;
  reference: string;
  dates: string;
  status: 'Confirmed' | 'In Progress' | 'Upcoming';
  altitude?: string;
  weather?: string;
  temperature?: string;
  routeCheckpoints: RouteCheckpoint[];
}

export interface ConciergeConversation {
  id: string;
  name: string;
  role: string;
  category: 'guides' | 'hosts' | 'support';
  destination: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  statusText: string;
  verified: boolean;
  rating: number;
  reviewsCount: number;
  lastMessage: string;
  lastTime: string;
  unread: number;
  license?: string;
  experience?: string;
  languages?: string[];
  emergencyPhone?: string;
  trip: TripContext;
  messages: ConciergeMessage[];
}

export const INITIAL_CONCIERGE_CONVERSATIONS: ConciergeConversation[] = [
  {
    id: 'conv_pasang_sherpa',
    name: 'Pasang Nuru Sherpa',
    role: 'Lead Mountain Guide',
    category: 'guides',
    destination: 'Everest Region (Solukhumbu)',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
    status: 'online',
    statusText: 'Online • On Namche trail',
    verified: true,
    rating: 4.98,
    reviewsCount: 142,
    lastMessage: 'Trail is firm and dry. Carry around NPR 20,000 in cash for tea house wifi & hot showers.',
    lastTime: '11:15 AM',
    unread: 2,
    license: 'IFMGA / UIAGM Certified #4492',
    experience: '14 Seasons • 26 EBC Expeditions',
    languages: ['Sherpa', 'Nepali', 'English'],
    emergencyPhone: '+977 98510 44920',
    trip: {
      title: 'Everest Base Camp & Gokyo Ri 14-Day Trek',
      reference: 'VN-EBC-2026-8841',
      dates: 'Oct 14 – Oct 27, 2026',
      status: 'Confirmed',
      altitude: '3,440 m (Namche)',
      weather: 'Clear Skies / Low Wind',
      temperature: '4°C / -6°C Night',
      routeCheckpoints: [
        { name: 'Lukla Tenzing-Hillary', altitude: '2,860 m', completed: true },
        { name: 'Phakding Riverside', altitude: '2,610 m', completed: true },
        { name: 'Namche Bazaar', altitude: '3,440 m', completed: true, current: true },
        { name: 'Tengboche Monastery', altitude: '3,867 m', completed: false },
        { name: 'Dingboche Acclimatization', altitude: '4,410 m', completed: false },
        { name: 'Lobuche High Pass', altitude: '4,940 m', completed: false },
        { name: 'Gorakshep Base', altitude: '5,164 m', completed: false },
        { name: 'Everest Base Camp', altitude: '5,364 m', completed: false }
      ]
    },
    messages: [
      {
        id: 'msg_p1',
        sender: 'Pasang Nuru Sherpa',
        text: 'Tashi Delek! Welcome to Nepal. I have reviewed our Solukhumbu manifest and your TIMS registration is fully verified.',
        time: '09:20 AM',
        date: 'Today',
        isMe: false,
        status: 'read'
      },
      {
        id: 'msg_p2',
        sender: 'Me',
        text: 'Namaste Pasang! Excited to meet you. How are the trail conditions between Phakding and Namche currently?',
        time: '09:35 AM',
        date: 'Today',
        isMe: true,
        status: 'read'
      },
      {
        id: 'msg_p3',
        sender: 'Pasang Nuru Sherpa',
        text: 'The suspension bridges at Hillary Bridge have zero ice, and the morning weather window is crystal clear. We will keep an easy pace of 45 steps per minute for natural acclimatization.',
        time: '10:02 AM',
        date: 'Today',
        isMe: false,
        status: 'read'
      },
      {
        id: 'msg_p4',
        sender: 'Me',
        text: 'Good to know. Should I withdraw more Nepalese Rupees in Kathmandu or can I use cards in Namche?',
        time: '10:48 AM',
        date: 'Today',
        isMe: true,
        status: 'read'
      },
      {
        id: 'msg_p5',
        sender: 'Pasang Nuru Sherpa',
        text: 'Trail is firm and dry. Carry around NPR 20,000 in cash for tea house wifi & hot showers. Higher lodges past Tengboche only take cash. I will meet you at the trailhead gate with the porter crew at 07:00 tomorrow!',
        time: '11:15 AM',
        date: 'Today',
        isMe: false,
        status: 'read'
      }
    ]
  },
  {
    id: 'conv_pemba_tenzing',
    name: 'Pemba Tenzing',
    role: 'Sherpa Butler & Logistics Lead',
    category: 'guides',
    destination: 'Everest Region',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    status: 'online',
    statusText: 'Online • Namche Lodge Desk',
    verified: true,
    rating: 4.96,
    reviewsCount: 98,
    lastMessage: 'Your waterproof expedition duffle bag is weighed and labeled. Exactly 13.8kg.',
    lastTime: '10:42 AM',
    unread: 1,
    license: 'Certified Alpine Hospitality & IPPG Protocol',
    experience: '9 Seasons with Luxury Lodges',
    languages: ['Sherpa', 'Nepali', 'English'],
    emergencyPhone: '+977 98510 55102',
    trip: {
      title: 'Everest Luxury Lodge Trek',
      reference: 'VN-ELT-2026-3092',
      dates: 'Oct 14 – Oct 27, 2026',
      status: 'Confirmed',
      altitude: '3,440 m',
      weather: 'Sunny / Gentle Breeze',
      temperature: '6°C Afternoon',
      routeCheckpoints: [
        { name: 'Yeti Mountain Home Lukla', altitude: '2,860 m', completed: true },
        { name: 'YMH Phakding', altitude: '2,610 m', completed: true },
        { name: 'YMH Namche', altitude: '3,440 m', completed: true, current: true },
        { name: 'Rivendell Deboche', altitude: '3,820 m', completed: false }
      ]
    },
    messages: [
      {
        id: 'msg_pb1',
        sender: 'Pemba Tenzing',
        text: 'Good morning! Heated electric fleece blankets and hot ginger honey lemon tea will be prepared in your private room at Namche lodge tonight.',
        time: '08:30 AM',
        date: 'Today',
        isMe: false,
        status: 'read'
      },
      {
        id: 'msg_pb2',
        sender: 'Me',
        text: 'That sounds amazing Pemba. Did the porter gear transfer arrive safely from Lukla?',
        time: '09:15 AM',
        date: 'Today',
        isMe: true,
        status: 'read'
      },
      {
        id: 'msg_pb3',
        sender: 'Pemba Tenzing',
        text: 'Your waterproof expedition duffle bag is weighed and labeled. Exactly 13.8kg. Well within the IPPG safe porter guidelines.',
        time: '10:42 AM',
        date: 'Today',
        isMe: false,
        status: 'read'
      }
    ]
  },
  {
    id: 'conv_dwarikas_concierge',
    name: "The Dwarika's Hotel Concierge",
    role: 'Heritage Hospitality Host',
    category: 'hosts',
    destination: 'Kathmandu Valley (Battisputali)',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80',
    status: 'online',
    statusText: 'Online • Front Concierge Desk',
    verified: true,
    rating: 5.0,
    reviewsCount: 310,
    lastMessage: 'Your 6-course royal Newari tasting dinner at Krishnarpan is confirmed for 7:30 PM.',
    lastTime: '10:05 AM',
    unread: 0,
    license: 'Heritage Concierge Member Clefs d’Or',
    experience: '18 Years Hospitality',
    languages: ['Nepali', 'English', 'French', 'Hindi'],
    emergencyPhone: '+977 1 447 9488',
    trip: {
      title: 'Kathmandu Valley Cultural Residency',
      reference: 'VN-KTM-2026-1104',
      dates: 'Oct 11 – Oct 14, 2026',
      status: 'Confirmed',
      altitude: '1,400 m',
      weather: 'Pleasant Autumn Sun',
      temperature: '22°C Day',
      routeCheckpoints: [
        { name: 'Airport VIP Arrival', altitude: '1,338 m', completed: true },
        { name: "The Dwarika's Courtyard", altitude: '1,400 m', completed: true, current: true },
        { name: 'Pashupatinath Evening Aarti', altitude: '1,390 m', completed: false },
        { name: 'Boudhanath Kora & Stupa', altitude: '1,420 m', completed: false }
      ]
    },
    messages: [
      {
        id: 'msg_dw1',
        sender: 'Me',
        text: 'Hello concierge! Could we book a table for two at Krishnarpan tonight?',
        time: '09:00 AM',
        date: 'Today',
        isMe: true,
        status: 'read'
      },
      {
        id: 'msg_dw2',
        sender: "The Dwarika's Hotel Concierge",
        text: 'Certainly! We have set aside an authentic floor-seating alcove with handwoven Dhaka cushions.',
        time: '09:20 AM',
        date: 'Today',
        isMe: false,
        status: 'read'
      },
      {
        id: 'msg_dw3',
        sender: "The Dwarika's Hotel Concierge",
        text: 'Your 6-course royal Newari tasting dinner at Krishnarpan is confirmed for 7:30 PM. Our private airport chauffeur will also be on standby for your Lukla connection.',
        time: '10:05 AM',
        date: 'Today',
        isMe: false,
        status: 'read'
      }
    ]
  },
  {
    id: 'conv_karma_dorje',
    name: 'Karma Dorje',
    role: 'High-Altitude Trekking Guide',
    category: 'guides',
    destination: 'Annapurna Circuit & Thorong La',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    status: 'online',
    statusText: 'Online • Manang High Valley',
    verified: true,
    rating: 4.95,
    reviewsCount: 116,
    lastMessage: 'Thorong La pass is clear. Temperatures at the summit marker hit -8°C at sunrise.',
    lastTime: '09:40 AM',
    unread: 1,
    license: 'NMA Certified Alpine Guide #3281',
    experience: '11 Seasons Annapurna & Dhaulagiri',
    languages: ['Gurung', 'Nepali', 'English'],
    emergencyPhone: '+977 98460 33812',
    trip: {
      title: 'Annapurna Circuit & Thorong High Pass',
      reference: 'VN-ACT-2026-5521',
      dates: 'Nov 02 – Nov 18, 2026',
      status: 'Upcoming',
      altitude: '3,540 m (Manang)',
      weather: 'Crisp & Sunny',
      temperature: '2°C / -9°C Night',
      routeCheckpoints: [
        { name: 'Besisahar Drive', altitude: '760 m', completed: false },
        { name: 'Chame Pine Forest', altitude: '2,670 m', completed: false },
        { name: 'Pisang Apple Orchards', altitude: '3,200 m', completed: false },
        { name: 'Manang Acclimatization', altitude: '3,540 m', completed: false },
        { name: 'Thorong High Camp', altitude: '4,925 m', completed: false },
        { name: 'Thorong La Pass', altitude: '5,416 m', completed: false },
        { name: 'Muktinath Sacred Shrine', altitude: '3,760 m', completed: false }
      ]
    },
    messages: [
      {
        id: 'msg_kd1',
        sender: 'Me',
        text: 'Hi Karma, should we bring full crampons or microspikes for Thorong La Pass next week?',
        time: '08:45 AM',
        date: 'Today',
        isMe: true,
        status: 'read'
      },
      {
        id: 'msg_kd2',
        sender: 'Karma Dorje',
        text: 'Thorong La pass is clear. Temperatures at the summit marker hit -8°C at sunrise. Quality Kahtoola microspikes and windproof mittens will be more than sufficient.',
        time: '09:40 AM',
        date: 'Today',
        isMe: false,
        status: 'read'
      }
    ]
  },
  {
    id: 'conv_sonam_lama',
    name: 'Sonam Lama',
    role: 'Heritage & Cultural Guide',
    category: 'guides',
    destination: 'Upper Mustang (Lo Manthang)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    status: 'away',
    statusText: 'Away • Lo Manthang Monastery',
    verified: true,
    rating: 4.97,
    reviewsCount: 84,
    lastMessage: 'Restricted area permits stamped by Department of Immigration. Ready for the walled city.',
    lastTime: 'Yesterday',
    unread: 0,
    license: 'Ministry of Tourism Cultural Expert #882',
    experience: '15 Years Upper Mustang Specialist',
    languages: ['Loba', 'Tibetan', 'Nepali', 'English'],
    emergencyPhone: '+977 98670 99401',
    trip: {
      title: 'Kingdom of Lo & Ancient Sky Caves',
      reference: 'VN-LOM-2026-7712',
      dates: 'Sep 20 – Oct 02, 2026',
      status: 'Upcoming',
      altitude: '3,840 m (Lo Manthang)',
      weather: 'Windy / High Plateau Sun',
      temperature: '11°C Day',
      routeCheckpoints: [
        { name: 'Jomsom Airport Gate', altitude: '2,743 m', completed: false },
        { name: 'Kagbeni Ancient Fort', altitude: '2,804 m', completed: false },
        { name: 'Chele Red Cliffs', altitude: '3,050 m', completed: false },
        { name: 'Charang Red Gompa', altitude: '3,560 m', completed: false },
        { name: 'Walled City of Lo Manthang', altitude: '3,840 m', completed: false }
      ]
    },
    messages: [
      {
        id: 'msg_sl1',
        sender: 'Sonam Lama',
        text: 'Tashi Delek! The Department of Immigration has approved our 10-day Mustang Restricted Area Permit.',
        time: '04:15 PM',
        date: 'Yesterday',
        isMe: false,
        status: 'read'
      },
      {
        id: 'msg_sl2',
        sender: 'Sonam Lama',
        text: 'Restricted area permits stamped by Department of Immigration. Ready for the walled city. Horses are arranged for Charang canyon crossing.',
        time: '04:22 PM',
        date: 'Yesterday',
        isMe: false,
        status: 'read'
      }
    ]
  },
  {
    id: 'conv_maya_gurung',
    name: 'Maya Gurung',
    role: 'Travel Coordinator & Host',
    category: 'hosts',
    destination: 'Pokhara & Phewa Lake',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    status: 'online',
    statusText: 'Online • Lakeside Pokhara Hub',
    verified: true,
    rating: 4.99,
    reviewsCount: 167,
    lastMessage: 'Sarangkot sunrise paragliding is booked for 06:45 AM. Smooth thermals expected.',
    lastTime: 'Yesterday',
    unread: 0,
    license: 'Pokhara Tourism Council Lead Coordinator',
    experience: '8 Years Pokhara Hospitality',
    languages: ['Nepali', 'English', 'Hindi'],
    emergencyPhone: '+977 98130 77219',
    trip: {
      title: 'Pokhara Serenity & Annapurna Panoramic View',
      reference: 'VN-POK-2026-4439',
      dates: 'Oct 28 – Nov 01, 2026',
      status: 'Upcoming',
      altitude: '822 m',
      weather: 'Warm Sunshine',
      temperature: '24°C Afternoon',
      routeCheckpoints: [
        { name: 'Phewa Lakeside Hotel', altitude: '822 m', completed: false },
        { name: 'Sarangkot Sunrise Point', altitude: '1,592 m', completed: false },
        { name: 'World Peace Pagoda Stupa', altitude: '1,100 m', completed: false },
        { name: 'Begnas Lake Serenity Boat', altitude: '650 m', completed: false }
      ]
    },
    messages: [
      {
        id: 'msg_mg1',
        sender: 'Maya Gurung',
        text: 'Namaste! Are you still interested in doing the tandem paragliding over Phewa Lake on your first morning?',
        time: '02:10 PM',
        date: 'Yesterday',
        isMe: false,
        status: 'read'
      },
      {
        id: 'msg_mg2',
        sender: 'Me',
        text: 'Yes definitely! With the Machhapuchhre backdrop if the visibility is good.',
        time: '02:30 PM',
        date: 'Yesterday',
        isMe: true,
        status: 'read'
      },
      {
        id: 'msg_mg3',
        sender: 'Maya Gurung',
        text: 'Sarangkot sunrise paragliding is booked for 06:45 AM. Smooth thermals expected. Pilot Bikash will meet you at your lobby.',
        time: '03:00 PM',
        date: 'Yesterday',
        isMe: false,
        status: 'read'
      }
    ]
  },
  {
    id: 'conv_tashi_sherpa',
    name: 'Tashi Sherpa',
    role: 'Alpine Expeditions Leader',
    category: 'guides',
    destination: 'Khumbu Valley & Island Peak',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    status: 'online',
    statusText: 'Online • Chhukung High Camp',
    verified: true,
    rating: 5.0,
    reviewsCount: 73,
    lastMessage: 'Fixed ropes on Island Peak headwall inspected. Summit bid scheduled for midnight.',
    lastTime: 'Oct 23',
    unread: 0,
    license: 'IFMGA Mountain Guide #5104',
    experience: '8x Everest Summits • Island Peak Specialist',
    languages: ['Sherpa', 'Nepali', 'English'],
    emergencyPhone: '+977 98412 88201',
    trip: {
      title: 'Island Peak (Imja Tse) 6,189m Ascent',
      reference: 'VN-ISP-2026-9023',
      dates: 'Nov 10 – Nov 24, 2026',
      status: 'Upcoming',
      altitude: '5,087 m (Chhukung)',
      weather: 'Clear Sky / High Winds',
      temperature: '-12°C Night',
      routeCheckpoints: [
        { name: 'Dingboche Acclimatization', altitude: '4,410 m', completed: false },
        { name: 'Chhukung Valley', altitude: '4,730 m', completed: false },
        { name: 'Island Peak Base Camp', altitude: '5,200 m', completed: false },
        { name: 'High Camp Crampon Point', altitude: '5,600 m', completed: false },
        { name: 'Island Peak Summit', altitude: '6,189 m', completed: false }
      ]
    },
    messages: [
      {
        id: 'msg_ts1',
        sender: 'Tashi Sherpa',
        text: 'Fixed ropes on Island Peak headwall inspected. Summit bid scheduled for midnight. Ensure your harness and ascender are tethered.',
        time: '08:20 PM',
        date: 'Oct 23',
        isMe: false,
        status: 'read'
      }
    ]
  },
  {
    id: 'conv_nima_tamang',
    name: 'Nima Tamang',
    role: 'Adventure Guide',
    category: 'guides',
    destination: 'Langtang Valley',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    status: 'away',
    statusText: 'Away • Kyanjin Gompa',
    verified: true,
    rating: 4.93,
    reviewsCount: 65,
    lastMessage: 'Fresh yak cheese tasting arranged at Kyanjin Gompa Swiss dairy for tomorrow!',
    lastTime: 'Oct 22',
    unread: 0,
    license: 'Trekking Agencies Association of Nepal (TAAN) #194',
    experience: '7 Seasons Langtang & Helambu',
    languages: ['Tamang', 'Nepali', 'English'],
    emergencyPhone: '+977 98499 10423',
    trip: {
      title: 'Langtang Valley & Kyanjin Ri Glacier Trek',
      reference: 'VN-LTG-2026-6188',
      dates: 'Nov 05 – Nov 13, 2026',
      status: 'Upcoming',
      altitude: '3,870 m (Kyanjin)',
      weather: 'Crisp Valley Breeze',
      temperature: '8°C Day',
      routeCheckpoints: [
        { name: 'Syabrubesi Trailhead', altitude: '1,503 m', completed: false },
        { name: 'Lama Hotel Bamboo Forest', altitude: '2,480 m', completed: false },
        { name: 'Langtang Village Memorial', altitude: '3,430 m', completed: false },
        { name: 'Kyanjin Gompa & Dairy', altitude: '3,870 m', completed: false },
        { name: 'Kyanjin Ri Summit Viewpoint', altitude: '4,773 m', completed: false }
      ]
    },
    messages: [
      {
        id: 'msg_nt1',
        sender: 'Nima Tamang',
        text: 'Namaste! The rhododendron forest trail up from Lama Hotel is beautiful right now.',
        time: '11:15 AM',
        date: 'Oct 22',
        isMe: false,
        status: 'read'
      },
      {
        id: 'msg_nt2',
        sender: 'Nima Tamang',
        text: 'Fresh yak cheese tasting arranged at Kyanjin Gompa Swiss dairy for tomorrow! Don’t forget to pack a windbreaker for Kyanjin Ri.',
        time: '11:30 AM',
        date: 'Oct 22',
        isMe: false,
        status: 'read'
      }
    ]
  },
  {
    id: 'conv_rinchen_bhutia',
    name: 'Rinchen Bhutia',
    role: 'Lodge Host & Restaurateur',
    category: 'hosts',
    destination: 'Manang Village (3,519m)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    status: 'online',
    statusText: 'Online • Hotel Tilicho Reception',
    verified: true,
    rating: 4.98,
    reviewsCount: 140,
    lastMessage: 'Dining room cedar fireplace is roaring. Fresh seabuckthorn warm punch is ready.',
    lastTime: 'Oct 21',
    unread: 0,
    license: 'Manang Eco-Tourism Board Member',
    experience: '22 Years Highland Host',
    languages: ['Manangi', 'Nepali', 'English'],
    emergencyPhone: '+977 98460 21900',
    trip: {
      title: 'Tilicho Lake & Manang Highland Stay',
      reference: 'VN-MNG-2026-2248',
      dates: 'Nov 04 – Nov 09, 2026',
      status: 'Upcoming',
      altitude: '3,519 m',
      weather: 'Clear Starry Night',
      temperature: '0°C Evening',
      routeCheckpoints: [
        { name: 'Manang High Plaza', altitude: '3,519 m', completed: false },
        { name: 'Khangsar Ancient Village', altitude: '3,734 m', completed: false },
        { name: 'Tilicho Base Camp', altitude: '4,150 m', completed: false },
        { name: 'Tilicho Lake Glacier', altitude: '4,919 m', completed: false }
      ]
    },
    messages: [
      {
        id: 'msg_rb1',
        sender: 'Rinchen Bhutia',
        text: 'Dining room cedar fireplace is roaring. Fresh seabuckthorn warm punch is ready for your group upon check-in.',
        time: '06:15 PM',
        date: 'Oct 21',
        isMe: false,
        status: 'read'
      }
    ]
  },
  {
    id: 'conv_himalayan_rescue',
    name: 'Himalayan Rescue & Trek Support',
    role: '24/7 Rapid SAR & Medical Dispatch',
    category: 'support',
    destination: 'All Sectors • High Altitude Medical Team',
    avatar: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=400&q=80',
    status: 'online',
    statusText: 'Online • 24/7 Emergency Frequency',
    verified: true,
    rating: 5.0,
    reviewsCount: 520,
    lastMessage: 'Satellite beacon check received. All rescue air fleet in Pheriche on standby.',
    lastTime: 'Oct 20',
    unread: 0,
    license: 'Himalayan Rescue Association (HRA) Direct Fleet',
    experience: 'Airbus H125 B3e High-Altitude Evacuation Squad',
    languages: ['English', 'Nepali', 'German', 'French'],
    emergencyPhone: '+977 1 444 3210 (SAR Hotline)',
    trip: {
      title: 'HRA Emergency Evacuation Coverage',
      reference: 'SAR-EXP-2026-0001',
      dates: 'Active 24/7 Trek Coverage',
      status: 'In Progress',
      altitude: 'Sector 1-4 Nationwide',
      weather: 'Flight Safety VFR Code Green',
      temperature: 'Monitored Live',
      routeCheckpoints: [
        { name: 'Kathmandu Heli Base', altitude: '1,338 m', completed: true },
        { name: 'Lukla Medical Helipad', altitude: '2,860 m', completed: true },
        { name: 'Pheriche HRA Clinic', altitude: '4,371 m', completed: true, current: true },
        { name: 'Gorakshep High Helipad', altitude: '5,164 m', completed: true }
      ]
    },
    messages: [
      {
        id: 'msg_hr1',
        sender: 'Himalayan Rescue & Trek Support',
        text: 'This is the Himalayan Rescue Association (HRA) automated dispatch link. Your Garmin inReach and TIMS beacon telemetry have been paired.',
        time: '01:00 PM',
        date: 'Oct 20',
        isMe: false,
        status: 'read'
      },
      {
        id: 'msg_hr2',
        sender: 'Himalayan Rescue & Trek Support',
        text: 'Satellite beacon check received. All rescue air fleet in Pheriche on standby. Helipad response window: < 22 minutes.',
        time: '01:05 PM',
        date: 'Oct 20',
        isMe: false,
        status: 'read'
      }
    ]
  },
  {
    id: 'conv_airport_dispatch',
    name: 'Lukla & KTM Airport Dispatch',
    role: 'Aviation Logistics & Weather Desk',
    category: 'support',
    destination: 'Tribhuvan Int’l & Tenzing-Hillary Airport',
    avatar: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=400&q=80',
    status: 'online',
    statusText: 'Online • Runway Operations Desk',
    verified: true,
    rating: 4.89,
    reviewsCount: 380,
    lastMessage: 'Lukla weather window open. Tara Air Flight #103 baggage check-in underway.',
    lastTime: 'Oct 19',
    unread: 0,
    license: 'Civil Aviation Authority of Nepal (CAAN) Certified',
    experience: 'Dornier 228 & Twin Otter Flight Management',
    languages: ['Nepali', 'English'],
    emergencyPhone: '+977 1 411 3000',
    trip: {
      title: 'Twin Otter / Dornier Mountain Flight Fleet',
      reference: 'VN-AV-2026-3819',
      dates: 'Oct 14, 2026 • Flight Tara Air #103',
      status: 'Confirmed',
      altitude: '2,860 m (Lukla Runway)',
      weather: 'VFR Clear Morning',
      temperature: '10°C at Touchdown',
      routeCheckpoints: [
        { name: 'KTM Domestic Terminal Gate 4', altitude: '1,338 m', completed: true },
        { name: 'Lamjura Pass Mountain Flyover', altitude: '3,530 m', completed: true },
        { name: 'Lukla Runway 06 Touchdown', altitude: '2,860 m', completed: true }
      ]
    },
    messages: [
      {
        id: 'msg_ad1',
        sender: 'Lukla & KTM Airport Dispatch',
        text: 'Lukla weather window open. Tara Air Flight #103 baggage check-in underway. Please proceed through security gate 4.',
        time: '06:15 AM',
        date: 'Oct 19',
        isMe: false,
        status: 'read'
      }
    ]
  },
  {
    id: 'conv_chitwan_wildlife',
    name: 'Chitwan Wildlife & Tharu Host',
    role: 'Naturalist & Jungle Safari Host',
    category: 'hosts',
    destination: 'Chitwan National Park (Sauraha)',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    status: 'online',
    statusText: 'Online • Barahi Jungle Lodge',
    verified: true,
    rating: 4.96,
    reviewsCount: 112,
    lastMessage: 'Morning dugout canoe safari on Rapti River booked. Gharials spotted on the sandbanks.',
    lastTime: 'Oct 18',
    unread: 0,
    license: 'National Park Certified Senior Naturalist #208',
    experience: '16 Years Terai Wildlife Conservation',
    languages: ['Tharu', 'Nepali', 'English'],
    emergencyPhone: '+977 56 580 120',
    trip: {
      title: 'Chitwan Deep Jungle & Rhino Sanctuary',
      reference: 'VN-CTW-2026-5590',
      dates: 'Nov 20 – Nov 24, 2026',
      status: 'Upcoming',
      altitude: '150 m (Terai Lowlands)',
      weather: 'Misty Dawn / Warm Sun',
      temperature: '27°C Day',
      routeCheckpoints: [
        { name: 'Bharatpur Airport Arrival', altitude: '180 m', completed: false },
        { name: 'Rapti River Canoe Launch', altitude: '150 m', completed: false },
        { name: 'Chitwan Core Buffer Zone', altitude: '140 m', completed: false },
        { name: 'Tharu Cultural Heritage Village', altitude: '155 m', completed: false }
      ]
    },
    messages: [
      {
        id: 'msg_cw1',
        sender: 'Chitwan Wildlife & Tharu Host',
        text: 'Morning dugout canoe safari on Rapti River booked. Gharials spotted on the sandbanks. Our open electric jeep will depart at 2:00 PM for the core rhino grasslands.',
        time: '05:40 PM',
        date: 'Oct 18',
        isMe: false,
        status: 'read'
      }
    ]
  }
];
