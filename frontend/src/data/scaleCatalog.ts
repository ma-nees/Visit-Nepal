import { destinations, Destination, CategoryLabel } from './mockData';

/**
 * High-performance catalog synthesizer for stress-testing and production scaling.
 * Deterministically generates up to 1,000+ realistic Himalayan destinations
 * with full typing, valid prices, elevations, routes, and categories.
 */
export function getScaleDestinations(count: number = 1000): Destination[] {
  if (count <= destinations.length) return destinations;

  const regions = [
    'Everest (Khumbu)',
    'Annapurna Sanctuary',
    'Langtang & Gosainkunda',
    'Manaslu Circuit',
    'Upper Mustang (Kingdom of Lo)',
    'Upper Dolpo & Shey Phoksundo',
    'Kanchenjunga Circuit',
    'Makalu & Barun Glacial Valley',
    'Rolwaling Valley & Tashi Lapcha',
    'Dhaulagiri High Alpine Pass',
    'Rara Lake & Mugu Far West',
    'Nar Phu Forbidden Valley',
    'Tsum Sacred Valley',
    'Ruby Valley & Ganesh Himal',
    'Helambu Heritage Circuit',
    'Api Nampa Alpine Sanctuary',
    'Gokyo Ri & Cho La High Pass',
    'Mardi Himal High Ridge Camp',
  ];

  const routeTypes = [
    'Classic Route',
    'High Pass Traverse',
    'Alpine Expedition',
    'Cultural Heritage Trail',
    'Glacial Lakes Circuit',
    'Monastery Pilgrimage',
    'Wilderness Base Camp',
    'Panoramic Ridge Trek',
  ];

  const difficulties: ('Easy' | 'Moderate' | 'Challenging' | 'Difficult')[] = [
    'Easy',
    'Moderate',
    'Challenging',
    'Difficult',
  ];

  const categoriesList: Exclude<CategoryLabel, 'All'>[] = [
    'Trekking',
    'Adventure',
    'Cultural',
    'Wildlife',
    'Spiritual',
    'Lakes & Valleys',
  ];

  const results: Destination[] = [...destinations];
  const baseLen = destinations.length;

  for (let i = baseLen; i < count; i++) {
    const base = destinations[i % baseLen];
    const region = regions[i % regions.length];
    const rType = routeTypes[(i * 3) % routeTypes.length];
    const diff = difficulties[(i * 5) % difficulties.length];
    const cat = categoriesList[(i * 7) % categoriesList.length];
    const days = 3 + ((i * 2) % 21); // 3 to 23 days
    const price = Math.round(380 + ((i * 53) % 2900));
    const altitudeMeters = 2400 + ((i * 97) % 3500); // 2400m to 5900m
    const rating = Number((4.6 + (((i * 11) % 40) / 100)).toFixed(2));
    const reviews = 18 + ((i * 29) % 520);

    results.push({
      id: `scale_${i + 1}`,
      title: `${region} ${rType} (Sector ${Math.floor(i / 10) + 1})`,
      location: `${region}, Nepal`,
      duration: `${days} Days`,
      difficulty: diff,
      altitude: `${altitudeMeters.toLocaleString()} m`,
      bestSeason: base.bestSeason,
      price,
      rating,
      reviewsCount: reviews,
      imageUrl: base.imageUrl,
      category: cat,
      description: `Official Himalayan expedition sector in ${region}. Certified by Nepal Tourism Board with IFMGA guide accompaniment, satellite tracking, and high-altitude emergency clearance.`,
      highlights: [
        `High altitude scenic vantage at ${altitudeMeters.toLocaleString()}m`,
        `Authentic Sherpa & Tamang village hospitality in ${region}`,
        `TIMS & ACAP official entry checkpoint registry`,
      ],
      itinerary: base.itinerary || [],
    });
  }

  return results;
}
