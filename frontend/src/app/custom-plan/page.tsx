'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Compass,
  Calendar,
  Mountain,
  Hotel,
  UserCheck,
  ConciergeBell,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  PlusCircle,
  Trash2,
  MoveUp,
  MoveDown,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Info,
  Luggage,
  PhoneCall,
  Search,
  Users,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';

// Region and destination catalog for Step 1
const REGIONS_CATALOG = [
  {
    id: 'everest',
    regionName: 'Everest (Khumbu)',
    name: 'Everest Base Camp & Gokyo Lakes',
    altitude: '5,364m - 5,545m (Kala Patthar)',
    difficulty: 'Challenging',
    bestSeason: 'Mar - May / Oct - Dec',
    highlights: ['Mt. Everest, Lhotse, Ama Dablam', 'Tengboche Monastery', 'Sherpa Capital of Namche Bazaar'],
    requiredPermits: ['tims', 'snp'],
    defaultDays: 14,
  },
  {
    id: 'annapurna',
    regionName: 'Annapurna Conservation Area',
    name: 'Annapurna Circuit & Sanctuary',
    altitude: '4,130m (ABC) / 5,416m (Thorong La)',
    difficulty: 'Moderate to Challenging',
    bestSeason: 'Sep - Nov / Mar - May',
    highlights: ['Thorong La Pass', 'Poon Hill Sunrise', 'Sacred Muktinath Temple'],
    requiredPermits: ['tims', 'acap'],
    defaultDays: 12,
  },
  {
    id: 'langtang',
    regionName: 'Langtang & Helambu',
    name: 'Langtang Valley & Gosainkunda Lakes',
    altitude: '4,984m (Tsergo Ri) / 4,380m (Lakes)',
    difficulty: 'Moderate',
    bestSeason: 'Mar - May / Sep - Nov',
    highlights: ['Tamang Heritage Culture', 'Glacial Lakes of Gosainkunda', 'Kyanjin Gompa Cheese Factory'],
    requiredPermits: ['tims', 'lnp'],
    defaultDays: 9,
  },
  {
    id: 'manaslu',
    regionName: 'Manaslu Restricted Zone',
    name: 'Manaslu Circuit & Tsum Valley',
    altitude: '5,106m (Larkya La Pass)',
    difficulty: 'Challenging',
    bestSeason: 'Oct - Nov / Mar - May',
    highlights: ['Wild Tibetan Border Crossings', 'Pristine Larkya La Pass', 'Ancient Buddhist Tsum Valley'],
    requiredPermits: ['tims', 'mrap', 'acap'],
    defaultDays: 14,
  },
  {
    id: 'mustang',
    regionName: 'Upper Mustang (Kingdom of Lo)',
    name: 'Upper Mustang & Walled City of Lo Manthang',
    altitude: '3,840m (Lo Manthang)',
    difficulty: 'Moderate',
    bestSeason: 'Apr - Nov (Rain-Shadow Zone)',
    highlights: ['Walled Capital of Lo Manthang', 'Centuries-old Sky Caves', 'Tibetan Red Cliffs & Monasteries'],
    requiredPermits: ['mustang_rap', 'acap'],
    defaultDays: 10,
  },
  {
    id: 'dolpo',
    regionName: 'Dolpo & Far West',
    name: 'Upper Dolpo & Shey Phoksundo Lake',
    altitude: '5,115m (Kang La Pass)',
    difficulty: 'Strenuous / Alpine',
    bestSeason: 'May - Oct',
    highlights: ['Deep Turquoise Lake Phoksundo', 'Bonpo Shamanic Monasteries', 'Untouched Himalayan Solitude'],
    requiredPermits: ['tims', 'dolpo_rap'],
    defaultDays: 16,
  },
];

export interface ItineraryStage {
  day: number;
  stageName: string;
  startPoint: string;
  endPoint: string;
  altitude: string;
  distanceKm: number;
  walkingHours: number;
  isRestDay: boolean;
  notes: string;
}

const DEFAULT_STAGES: Record<string, ItineraryStage[]> = {
  everest: [
    { day: 1, stageName: 'Lukla Arrival to Phakding', startPoint: 'Lukla (2,840m)', endPoint: 'Phakding (2,610m)', altitude: '2,610m', distanceKm: 8, walkingHours: 3.5, isRestDay: false, notes: 'Scenic mountain flight from Kathmandu; gentle acclimatization descent.' },
    { day: 2, stageName: 'Ascent through Sagarmatha NP to Namche', startPoint: 'Phakding (2,610m)', endPoint: 'Namche Bazaar (3,440m)', altitude: '3,440m', distanceKm: 11, walkingHours: 6, isRestDay: false, notes: 'Cross Hillary Suspension Bridge; first view of Mt. Everest.' },
    { day: 3, stageName: 'Acclimatization & Everest View Hike', startPoint: 'Namche (3,440m)', endPoint: 'Hotel Everest View (3,880m)', altitude: '3,880m', distanceKm: 5, walkingHours: 4, isRestDay: true, notes: 'Climb high, sleep low protocol. Explore Sherpa Museum.' },
    { day: 4, stageName: 'Trek to Tengboche Monastery', startPoint: 'Namche Bazaar', endPoint: 'Tengboche (3,860m)', altitude: '3,860m', distanceKm: 10, walkingHours: 5, isRestDay: false, notes: 'Receive traditional juniper blessing from resident Rinpoche.' },
    { day: 5, stageName: 'Alpine Meadows to Dingboche', startPoint: 'Tengboche', endPoint: 'Dingboche (4,410m)', altitude: '4,410m', distanceKm: 11, walkingHours: 5.5, isRestDay: false, notes: 'Pass mani walls and treeline into glaciated valley.' },
    { day: 6, stageName: 'Acclimatization & Nangkartshang Peak', startPoint: 'Dingboche', endPoint: 'Dingboche Ridge (5,080m)', altitude: '5,080m', distanceKm: 4, walkingHours: 4.5, isRestDay: true, notes: 'Important staging day before high-altitude moraine trek.' },
    { day: 7, stageName: 'Lobuche & Memorial Ridge', startPoint: 'Dingboche', endPoint: 'Lobuche (4,940m)', altitude: '4,940m', distanceKm: 8, walkingHours: 5, isRestDay: false, notes: 'Pay tribute at climbers memorial crest near Thokla Pass.' },
    { day: 8, stageName: 'Everest Base Camp & Gorak Shep', startPoint: 'Lobuche', endPoint: 'EBC (5,364m) / Gorak Shep', altitude: '5,364m', distanceKm: 13, walkingHours: 7.5, isRestDay: false, notes: 'Reach historic Everest Base Camp on Khumbu Glacier.' },
  ],
  annapurna: [
    { day: 1, stageName: 'Pokhara to Tikhedhungga', startPoint: 'Pokhara (820m)', endPoint: 'Ulleri / Tikhedhungga (1,960m)', altitude: '1,960m', distanceKm: 9, walkingHours: 4.5, isRestDay: false, notes: 'Drive to Birethanti trailhead; trek stone stairs through rhododendron.' },
    { day: 2, stageName: 'Ascent to Ghorepani', startPoint: 'Tikhedhungga', endPoint: 'Ghorepani (2,860m)', altitude: '2,860m', distanceKm: 11, walkingHours: 5.5, isRestDay: false, notes: 'Dense ancient moss forest; panoramic views of Dhaulagiri.' },
    { day: 3, stageName: 'Poon Hill Sunrise to Tadapani', startPoint: 'Ghorepani', endPoint: 'Tadapani (2,630m)', altitude: '3,210m (Poon Hill)', distanceKm: 10, walkingHours: 5, isRestDay: false, notes: 'Pre-dawn climb to Poon Hill 360-degree Himalayan sunrise.' },
    { day: 4, stageName: 'Tadapani to Chhomrong', startPoint: 'Tadapani', endPoint: 'Chhomrong (2,170m)', altitude: '2,170m', distanceKm: 9, walkingHours: 4.5, isRestDay: false, notes: 'Gateway village beneath towering peaks of Machhapuchhre (Fishtail).' },
    { day: 5, stageName: 'Chhomrong to Dovan', startPoint: 'Chhomrong', endPoint: 'Dovan (2,600m)', altitude: '2,600m', distanceKm: 9, walkingHours: 5, isRestDay: false, notes: 'Descend to Chhomrong Khola river and climb through bamboo grove.' },
    { day: 6, stageName: 'Deurali to Machhapuchhre Base Camp', startPoint: 'Dovan', endPoint: 'MBC (3,700m)', altitude: '3,700m', distanceKm: 10, walkingHours: 5.5, isRestDay: false, notes: 'Enter alpine sanctuary gorge between Hiunchuli and Fishtail.' },
    { day: 7, stageName: 'Annapurna Base Camp Sanctuary', startPoint: 'MBC', endPoint: 'ABC (4,130m)', altitude: '4,130m', distanceKm: 4, walkingHours: 3, isRestDay: true, notes: 'Glacial amphitheater surrounded by Annapurna I, South, and Gangapurna.' },
  ],
};

export default function CustomTripPlannerPage() {
  const router = useRouter();
  const { createCustomTrip, currentUser } = useApp();

  // Wizard Step (1 to 7)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // STEP 1: Destination
  const [destinationSearch, setDestinationSearch] = useState('');
  const [selectedRegionId, setSelectedRegionId] = useState('everest');

  // STEP 2: Travel Details
  const [startDate, setStartDate] = useState('2026-05-10');
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [experienceLevel, setExperienceLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Technical'>('Intermediate');
  const [travelStyle, setTravelStyle] = useState<'Luxury Lodge' | 'Classic Teahouse' | 'Wilderness Camping' | 'Fastpacking Alpine'>('Classic Teahouse');

  // STEP 3: Custom Itinerary Stages
  const [itineraryStages, setItineraryStages] = useState<ItineraryStage[]>(DEFAULT_STAGES['everest']);
  const [editingStageIndex, setEditingStageIndex] = useState<number | null>(null);

  // New stage form state
  const [newStageName, setNewStageName] = useState('');
  const [newStageStart, setNewStageStart] = useState('');
  const [newStageEnd, setNewStageEnd] = useState('');
  const [newStageAlt, setNewStageAlt] = useState('3,500m');
  const [newStageDist, setNewStageDist] = useState(10);
  const [newStageHours, setNewStageHours] = useState(5);
  const [newStageRest, setNewStageRest] = useState(false);
  const [newStageNotes, setNewStageNotes] = useState('');

  // STEP 4: Services
  const [guideRequested, setGuideRequested] = useState(true);
  const [porterCount, setPorterCount] = useState(1);
  const [sherpaButlerRequested, setSherpaButlerRequested] = useState(false);
  const [accommodationTier, setAccommodationTier] = useState<'5-Star Himalayan Lodge' | 'Boutique Teahouse' | 'Traditional Mountain Lodge' | 'Alpine Expedition Camp'>('Boutique Teahouse');
  const [transportMode, setTransportMode] = useState<'Domestic Flights (Lukla/Pokhara)' | 'Private 4WD Expedition Jeep' | 'Tourist Express Bus' | 'Private Helicopter Charter'>('Domestic Flights (Lukla/Pokhara)');
  const [mealPlan, setMealPlan] = useState<'All-Inclusive 3 Meals/Day' | 'Bed & Breakfast Only' | 'Self-Catered'>('All-Inclusive 3 Meals/Day');
  const [selectedGear, setSelectedGear] = useState<string[]>(['-20°C Down Jacket', '4-Season Sleeping Bag']);
  const [emergencySupport, setEmergencySupport] = useState<string[]>(['Satellite InReach Dispatch', 'Emergency Heli-Medevac Guarantee']);

  // STEP 5: Permits
  const [permitAcknowledged, setPermitAcknowledged] = useState(true);

  // STEP 6: Dynamic Pricing Calculation State
  const [calculatedPricing, setCalculatedPricing] = useState<any>(null);
  const [calculatingPrice, setCalculatingPrice] = useState(false);

  // STEP 7: Traveler Contact Form
  const [leadName, setLeadName] = useState(currentUser?.name || 'Aayush Pradhan');
  const [leadEmail, setLeadEmail] = useState(currentUser?.email || 'aayush.traveler@visitnepal.com');
  const [leadPhone, setLeadPhone] = useState('+977-9801234567');
  const [leadNationality, setLeadNationality] = useState('Nepal / International');
  const [passportNumber, setPassportNumber] = useState('NP-9982341A');
  const [emergencyContact, setEmergencyContact] = useState('Dr. S. Pradhan (+977-9841239876)');
  const [specialRequests, setSpecialRequests] = useState('');

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submittedTrip, setSubmittedTrip] = useState<any>(null);

  // Active Region Record
  const activeRegion = useMemo(() => {
    return REGIONS_CATALOG.find((r) => r.id === selectedRegionId) || REGIONS_CATALOG[0];
  }, [selectedRegionId]);

  // Handle region switch and prefill default stages
  const handleSelectRegion = (regionId: string) => {
    setSelectedRegionId(regionId);
    if (DEFAULT_STAGES[regionId]) {
      setItineraryStages(DEFAULT_STAGES[regionId]);
    } else {
      setItineraryStages([
        { day: 1, stageName: 'Arrival & Trailhead Briefing', startPoint: 'Kathmandu Base', endPoint: 'Initial Lodge', altitude: '2,200m', distanceKm: 8, walkingHours: 4, isRestDay: false, notes: 'Expedition kickoff and gear check.' },
        { day: 2, stageName: 'High Mountain Ascent', startPoint: 'Initial Lodge', endPoint: 'High Camp', altitude: '3,800m', distanceKm: 12, walkingHours: 6, isRestDay: false, notes: 'Alpine ascent through pine forest.' },
        { day: 3, stageName: 'Acclimatization Day', startPoint: 'High Camp', endPoint: 'Panoramic Viewpoint', altitude: '4,400m', distanceKm: 5, walkingHours: 3.5, isRestDay: true, notes: 'Active rest day for altitude adaptation.' },
      ]);
    }
  };

  // Reorder itinerary stages
  const moveStage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= itineraryStages.length) return;
    const updated = [...itineraryStages];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    // Renumber days
    const renumbered = updated.map((stage, idx) => ({ ...stage, day: idx + 1 }));
    setItineraryStages(renumbered);
  };

  const removeStage = (index: number) => {
    const updated = itineraryStages.filter((_, idx) => idx !== index).map((s, idx) => ({ ...s, day: idx + 1 }));
    setItineraryStages(updated);
  };

  const addStage = () => {
    if (!newStageName.trim()) return;
    const nextDay = itineraryStages.length + 1;
    setItineraryStages((prev) => [
      ...prev,
      {
        day: nextDay,
        stageName: newStageName.trim(),
        startPoint: newStageStart.trim() || 'Previous Camp',
        endPoint: newStageEnd.trim() || 'Next Lodge',
        altitude: newStageAlt.trim() || '3,500m',
        distanceKm: Number(newStageDist) || 10,
        walkingHours: Number(newStageHours) || 5,
        isRestDay: newStageRest,
        notes: newStageNotes.trim() || 'Custom trekking stage',
      },
    ]);
    setNewStageName('');
    setNewStageStart('');
    setNewStageEnd('');
    setNewStageNotes('');
    setNewStageRest(false);
  };

  // Stats calculation
  const totalDurationDays = itineraryStages.length;
  const totalDistanceKm = itineraryStages.reduce((acc, s) => acc + (s.distanceKm || 0), 0);
  const totalWalkingHours = itineraryStages.reduce((acc, s) => acc + (s.walkingHours || 0), 0);
  const totalRestDays = itineraryStages.filter((s) => s.isRestDay).length;

  // STEP 6: Live Dynamic Price Calculation with Backend Formula
  useEffect(() => {
    const fetchCalculation = async () => {
      setCalculatingPrice(true);
      try {
        const res = await api.customPlans.calculate({
          destinations: [activeRegion.id],
          durationDays: totalDurationDays,
          travelersCount: adultsCount + childrenCount,
          guideRequested,
          porterRequested: porterCount > 0,
          butlerRequested: sherpaButlerRequested,
          accommodationTier,
          transportRequested: transportMode.includes('Flight') || transportMode.includes('Jeep'),
        });
        if (res) {
          setCalculatedPricing(res);
        }
      } catch (err) {
        // Local calculation fallback
        const travelers = adultsCount + childrenCount;
        const accommodationRate = accommodationTier.includes('5-Star') ? 14000 : accommodationTier.includes('Boutique') ? 7000 : 3500;
        const guideDailyRate = guideRequested ? 6500 : 0;
        const porterDailyRate = porterCount * 3500;
        const butlerDailyRate = sherpaButlerRequested ? 8500 : 0;
        const transportTotal = transportMode.includes('Flight') ? 30000 * travelers : transportMode.includes('Helicopter') ? 180000 : 15000;
        const mealDaily = mealPlan.includes('All-Inclusive') ? 4500 * travelers : 1500 * travelers;
        const gearTotal = selectedGear.length * 1500 * travelers;
        const permitTotal = activeRegion.requiredPermits.includes('mustang_rap') ? 70000 * travelers : 5000 * travelers;

        const subtotal = (accommodationRate * totalDurationDays) +
          (guideDailyRate * totalDurationDays) +
          (porterDailyRate * totalDurationDays) +
          (butlerDailyRate * totalDurationDays) +
          transportTotal +
          (mealDaily * totalDurationDays) +
          gearTotal +
          permitTotal;

        const serviceCharge = Math.round(subtotal * 0.05);
        const vat = Math.round((subtotal + serviceCharge) * 0.13);
        const total = subtotal + serviceCharge + vat;

        setCalculatedPricing({
          estimatedBudgetNpr: total,
          currency: 'NPR',
          budgetBreakdown: {
            accommodation: accommodationRate * totalDurationDays,
            guideAndFieldStaff: (guideDailyRate + porterDailyRate + butlerDailyRate) * totalDurationDays,
            transportation: transportTotal,
            meals: mealDaily * totalDurationDays,
            equipmentRental: gearTotal,
            governmentPermits: permitTotal,
            serviceChargeNpr: serviceCharge,
            vatNpr: vat,
            totalEstimatedNpr: total,
          },
        });
      } finally {
        setCalculatingPrice(false);
      }
    };

    fetchCalculation();
  }, [
    activeRegion,
    totalDurationDays,
    adultsCount,
    childrenCount,
    guideRequested,
    porterCount,
    sherpaButlerRequested,
    accommodationTier,
    transportMode,
    mealPlan,
    selectedGear,
  ]);

  // Submit Custom Booking Request
  const handleSubmitCustomTrip = async () => {
    setSubmitting(true);
    const totalTravelers = adultsCount + childrenCount;
    const finalAmountNpr = calculatedPricing?.estimatedBudgetNpr || 280000;

    const payload = {
      title: `Custom Expedition: ${activeRegion.name} (${totalDurationDays} Days)`,
      destinations: [activeRegion.id],
      startDate,
      durationDays: totalDurationDays,
      travelersCount: totalTravelers,
      adultsCount,
      childrenCount,
      experienceLevel,
      travelStyle,
      trekkingDifficulty: activeRegion.difficulty,
      estimatedBudgetNpr: finalAmountNpr,
      accommodationPreference: accommodationTier,
      guideRequested,
      porterRequested: porterCount > 0,
      butlerRequested: sherpaButlerRequested,
      transportRequested: transportMode.includes('Flight') || transportMode.includes('Jeep'),
      mealsPlan: mealPlan,
      equipmentRental: selectedGear,
      emergencyServices: emergencySupport,
      detectedPermits: activeRegion.requiredPermits.map((pid) => ({
        id: pid,
        name: pid === 'tims' ? 'TIMS Permit' : pid === 'snp' ? 'Sagarmatha NP Permit' : pid === 'acap' ? 'ACAP Permit' : pid.toUpperCase(),
        feeNpr: pid.includes('rap') ? 67500 : 3000,
        feeUsd: pid.includes('rap') ? 500 : 30,
        isRestrictedArea: pid.includes('rap'),
      })),
      itinerary: itineraryStages.map((s) => ({
        day: s.day,
        title: s.stageName,
        destination: activeRegion.regionName,
        activity: `${s.startPoint} to ${s.endPoint} (${s.notes})`,
        elevation: s.altitude,
        distanceKm: s.distanceKm,
        walkingHours: s.walkingHours,
        isRestDay: s.isRestDay,
      })),
      travelerContact: {
        fullName: leadName,
        email: leadEmail,
        phone: leadPhone,
        nationality: leadNationality,
        passportNumber,
        emergencyContact,
        dietaryNotes: specialRequests,
      },
      status: 'PENDING_REVIEW',
    };

    const saved = await createCustomTrip(payload);
    setSubmittedTrip(saved);
    setSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-6 font-inter">
      {/* 1. Header Hero (Unique & Aesthetic Editorial - No Dark Box Container) */}
      <div className="relative pb-6 border-b border-slate-200/80">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#0552A2] text-[11px] font-bold tracking-wider uppercase">
              <Sparkles className="h-3.5 w-3.5 text-[#0552A2]" />
              <span>Interactive Expedition Studio</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">Bespoke Himalayan Routes 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-poppins">
              Build Your Own <span className="text-[#0552A2]">Himalayan Journey</span>
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
              Design a custom itinerary across Everest, Annapurna, Manaslu, or Mustang. Select your IFMGA guide, Sherpa butler, preferred accommodation, and route-detected permits.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <Mountain className="h-4 w-4 text-[#0552A2]" />
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900">Dynamic Pricing</div>
                <div className="text-[10px] text-slate-500 font-medium">Real-Time Cost Calculator</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900">Direct Operator Review</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Binding Fixed Quotations</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Wizard Stepper Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-2 sm:p-3 shadow-xs">
        <div className="flex items-center justify-between overflow-x-auto text-xs font-semibold gap-2 py-1 scrollbar-none">
          {[
            { num: 1, label: 'Destination' },
            { num: 2, label: 'Travel Details' },
            { num: 3, label: 'Itinerary' },
            { num: 4, label: 'Services' },
            { num: 5, label: 'Permits' },
            { num: 6, label: 'Pricing' },
            { num: 7, label: 'Review & Submit' },
          ].map((s) => {
            const isActive = currentStep === s.num;
            const isCompleted = currentStep > s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setCurrentStep(s.num)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0552A2] text-white shadow-xs font-bold'
                    : isCompleted
                    ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                  isActive
                    ? 'bg-white text-[#0552A2]'
                    : isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {isCompleted ? '✓' : s.num}
                </span>
                <span className="hidden md:inline">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Wizard Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Step Form (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* ================================================================= */}
          {/* STEP 1: DESTINATION SELECTION & AUTOCOMPLETE */}
          {/* ================================================================= */}
          {currentStep === 1 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5 shadow-xs">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0552A2]">
                  <Compass className="h-4 w-4" /> Step 1 of 7
                </div>
                <h2 className="text-xl font-bold font-poppins text-slate-900 mt-1">
                  Choose Himalayan Region or Route
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Filter by region, maximum altitude, and technical grading.
                </p>
              </div>

              {/* Destination Search Box */}
              <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Everest, Annapurna, Manaslu, Mustang, Dolpo, Langtang..."
                  value={destinationSearch}
                  onChange={(e) => setDestinationSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20"
                />
              </div>

              {/* Region Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {REGIONS_CATALOG.filter((r) =>
                  destinationSearch
                    ? r.name.toLowerCase().includes(destinationSearch.toLowerCase()) ||
                      r.regionName.toLowerCase().includes(destinationSearch.toLowerCase())
                    : true
                ).map((r) => {
                  const isSelected = selectedRegionId === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => handleSelectRegion(r.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#0552A2] bg-blue-50/60 ring-2 ring-[#0552A2]/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0552A2]">
                          {r.regionName}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          r.difficulty === 'Challenging'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : r.difficulty === 'Moderate'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}>
                          {r.difficulty}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">
                        {r.name}
                      </h3>
                      <div className="mt-2.5 flex items-center gap-3 text-[11px] text-slate-600">
                        <span className="flex items-center gap-1">
                          <Mountain className="h-3.5 w-3.5 text-[#EC1F27]" />
                          {r.altitude}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                          {r.bestSeason.split('/')[0]}
                        </span>
                      </div>
                      <ul className="mt-2.5 space-y-0.5 border-t border-slate-100 pt-2 text-[10.5px] text-slate-500">
                        {r.highlights.map((h, i) => (
                          <li key={i} className="flex items-center gap-1.5 truncate">
                            <span className="h-1 w-1 rounded-full bg-[#0552A2]" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Navigation button */}
              <div className="flex justify-end pt-4 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full sm:w-auto h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0552A2] via-[#084C93] to-[#0552A2] hover:opacity-95 px-5 sm:px-6 text-xs font-bold text-white shadow-md shadow-[#0552A2]/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Proceed to Travel Details</span>
                  <span className="sm:hidden">Travel Details</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 2: TRAVEL DETAILS (Dates, Group, Style) */}
          {/* ================================================================= */}
          {currentStep === 2 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5 shadow-xs">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0552A2]">
                  <Calendar className="h-4 w-4" /> Step 2 of 7
                </div>
                <h2 className="text-xl font-bold font-poppins text-slate-900 mt-1">
                  Dates, Group Size &amp; Travel Preferences
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure expedition party makeup and preferred alpine lodging style.
                </p>
              </div>

              {/* Dates & Travelers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Expedition Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Adult Travelers (12+ yrs)
                  </label>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-1.5">
                    <span className="text-xs font-bold text-slate-800">{adultsCount} Adults</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setAdultsCount((v) => Math.max(1, v - 1))}
                        className="h-6 w-6 rounded bg-slate-100 font-bold hover:bg-slate-200 text-xs"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdultsCount((v) => Math.min(16, v + 1))}
                        className="h-6 w-6 rounded bg-slate-100 font-bold hover:bg-slate-200 text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Children (Under 12)
                  </label>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-1.5">
                    <span className="text-xs font-bold text-slate-800">{childrenCount} Kids</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setChildrenCount((v) => Math.max(0, v - 1))}
                        className="h-6 w-6 rounded bg-slate-100 font-bold hover:bg-slate-200 text-xs"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => setChildrenCount((v) => Math.min(8, v + 1))}
                        className="h-6 w-6 rounded bg-slate-100 font-bold hover:bg-slate-200 text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience Level */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Himalayan Experience Level
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced', 'Technical'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setExperienceLevel(lvl)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        experienceLevel === lvl
                          ? 'border-[#0552A2] bg-blue-50/60 font-bold text-[#0552A2] ring-1 ring-[#0552A2]/30'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600 text-xs'
                      }`}
                    >
                      <p className="text-xs font-bold">{lvl}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {lvl === 'Beginner' ? '< 3,000m' : lvl === 'Intermediate' ? '3,000m - 4,500m' : lvl === 'Advanced' ? 'High Passes 5,000m+' : 'Crampons & Ropes'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Style */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Preferred Travel Style
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(['Luxury Lodge', 'Classic Teahouse', 'Wilderness Camping', 'Fastpacking Alpine'] as const).map((style) => (
                    <label
                      key={style}
                      onClick={() => setTravelStyle(style)}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        travelStyle === style
                          ? 'border-[#0552A2] bg-blue-50/60 ring-1 ring-[#0552A2]/30'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={travelStyle === style}
                        onChange={() => setTravelStyle(style)}
                        className="mt-1 text-[#0552A2] focus:ring-[#0552A2]"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{style}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {style === 'Luxury Lodge' && 'En-suite heated rooms, electric blankets & hot showers.'}
                          {style === 'Classic Teahouse' && 'Traditional Sherpa hospitality and shared dining hall stove.'}
                          {style === 'Wilderness Camping' && '4-season alpine tents, private camp cook & dining tent.'}
                          {style === 'Fastpacking Alpine' && 'Ultralight mountain staging with rapid elevation profile.'}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-2.5 pt-4 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="h-10 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 sm:px-4 text-xs font-semibold text-slate-700 shadow-2xs transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
                >
                  <ArrowLeft className="h-3.5 w-3.5 shrink-0" /> <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 sm:flex-initial h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0552A2] via-[#084C93] to-[#0552A2] hover:opacity-95 px-4 sm:px-6 text-xs font-bold text-white shadow-md shadow-[#0552A2]/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Build Custom Itinerary</span>
                  <span className="sm:hidden">Custom Itinerary</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 3: CUSTOM DAY-BY-DAY ITINERARY BUILDER */}
          {/* ================================================================= */}
          {currentStep === 3 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5 shadow-xs">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0552A2]">
                    <Clock className="h-4 w-4" /> Step 3 of 7
                  </div>
                  <h2 className="text-xl font-bold font-poppins text-slate-900 mt-1">
                    Interactive Day-by-Day Route Builder
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Add trekking stages, insert rest/acclimatization days, reorder, and review hours.
                  </p>
                </div>
                {/* Route Metrics Summary Pill */}
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700">
                  <span>{totalDurationDays} Days</span>
                  <span>•</span>
                  <span>{totalDistanceKm} km</span>
                  <span>•</span>
                  <span>{totalWalkingHours} Walking Hrs</span>
                </div>
              </div>

              {/* Day Stages List */}
              <div className="space-y-3">
                {itineraryStages.map((stage, idx) => (
                  <div
                    key={stage.day}
                    className={`p-3.5 rounded-xl border transition-all ${
                      stage.isRestDay
                        ? 'border-purple-200 bg-purple-50/40'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold ${
                          stage.isRestDay ? 'bg-purple-600 text-white' : 'bg-[#0552A2] text-white'
                        }`}>
                          D{stage.day}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs font-bold text-slate-900">{stage.stageName}</h4>
                            {stage.isRestDay && (
                              <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">
                                Acclimatization / Rest Day
                              </span>
                            )}
                            <span className="text-[10px] font-mono font-bold text-[#0552A2] bg-blue-50 px-1.5 py-0.5 rounded">
                              {stage.altitude}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {stage.startPoint} ➔ {stage.endPoint} • {stage.distanceKm} km • ~{stage.walkingHours} hrs
                          </p>
                          {stage.notes && (
                            <p className="text-[11px] text-slate-600 mt-1 italic">
                              "{stage.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Reorder and Delete Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveStage(idx, 'up')}
                          title="Move Day Up"
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        >
                          <MoveUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === itineraryStages.length - 1}
                          onClick={() => moveStage(idx, 'down')}
                          title="Move Day Down"
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        >
                          <MoveDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeStage(idx)}
                          title="Remove Stage"
                          className="p-1 rounded text-red-400 hover:text-red-700 hover:bg-red-50 cursor-pointer ml-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Custom Stage Accordion */}
              <div className="rounded-xl border border-dashed border-slate-300 p-4 bg-slate-50/60 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <PlusCircle className="h-4 w-4 text-[#0552A2]" />
                  Add Custom Trekking Stage or Rest Day
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Stage Title (e.g. Dingboche to Chhukung Valley)"
                      value={newStageName}
                      onChange={(e) => setNewStageName(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 bg-white text-slate-800"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Max Altitude (e.g. 4,730m)"
                      value={newStageAlt}
                      onChange={(e) => setNewStageAlt(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 bg-white text-slate-800"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Start point"
                      value={newStageStart}
                      onChange={(e) => setNewStageStart(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 bg-white text-slate-800"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="End destination"
                      value={newStageEnd}
                      onChange={(e) => setNewStageEnd(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 bg-white text-slate-800"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newStageRest}
                        onChange={(e) => setNewStageRest(e.target.checked)}
                        className="rounded text-[#0552A2]"
                      />
                      <span>Rest Day</span>
                    </label>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addStage}
                  disabled={!newStageName.trim()}
                  className="rounded-lg bg-[#0552A2] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#044182] disabled:opacity-50 cursor-pointer"
                >
                  Append Stage to Itinerary
                </button>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-2.5 pt-4 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="h-10 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 sm:px-4 text-xs font-semibold text-slate-700 shadow-2xs transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
                >
                  <ArrowLeft className="h-3.5 w-3.5 shrink-0" /> <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="flex-1 sm:flex-initial h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0552A2] via-[#084C93] to-[#0552A2] hover:opacity-95 px-4 sm:px-6 text-xs font-bold text-white shadow-md shadow-[#0552A2]/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Select Expedition Services</span>
                  <span className="sm:hidden">Expedition Services</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 4: SERVICES SELECTION (Guide, Porter, Butler, Accom, Transport) */}
          {/* ================================================================= */}
          {currentStep === 4 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5 shadow-xs">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0552A2]">
                  <Luggage className="h-4 w-4" /> Step 4 of 7
                </div>
                <h2 className="text-xl font-bold font-poppins text-slate-900 mt-1">
                  Customize Services &amp; Field Staff
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select IFMGA mountain guides, high-altitude porters, Sherpa butlers, and gear rentals.
                </p>
              </div>

              {/* Staff Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* IFMGA Lead Guide */}
                <label className={`p-3.5 rounded-xl border cursor-pointer transition-all ${guideRequested ? 'border-[#0552A2] bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">Lead IFMGA Guide</span>
                    <input
                      type="checkbox"
                      checked={guideRequested}
                      onChange={(e) => setGuideRequested(e.target.checked)}
                      className="rounded text-[#0552A2]"
                    />
                  </div>
                  <p className="text-[10px] text-[#0552A2] font-semibold">NPR 6,500/day</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Certified route navigator, avalanche &amp; high-altitude first responder.
                  </p>
                </label>

                {/* Porters */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">High Altitude Porters</span>
                    <span className="text-[10px] font-bold text-[#0552A2]">NPR 3,500/day</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold text-slate-700">{porterCount} Porter(s)</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPorterCount((v) => Math.max(0, v - 1))}
                        className="h-6 w-6 rounded bg-slate-100 font-bold hover:bg-slate-200 text-xs"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => setPorterCount((v) => Math.min(6, v + 1))}
                        className="h-6 w-6 rounded bg-slate-100 font-bold hover:bg-slate-200 text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400">Up to 25kg duffle capacity each.</p>
                </div>

                {/* Sherpa Butler */}
                <label className={`p-3.5 rounded-xl border cursor-pointer transition-all ${sherpaButlerRequested ? 'border-[#0552A2] bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">Sherpa Butler VIP</span>
                    <input
                      type="checkbox"
                      checked={sherpaButlerRequested}
                      onChange={(e) => setSherpaButlerRequested(e.target.checked)}
                      className="rounded text-[#0552A2]"
                    />
                  </div>
                  <p className="text-[10px] text-[#0552A2] font-semibold">NPR 8,500/day</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    White-glove tea ceremonies, heated beds &amp; bespoke concierge.
                  </p>
                </label>
              </div>

              {/* Accommodation Tier */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Accommodation Category
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {([
                    '5-Star Himalayan Lodge',
                    'Boutique Teahouse',
                    'Traditional Mountain Lodge',
                    'Alpine Expedition Camp',
                  ] as const).map((tier) => (
                    <label
                      key={tier}
                      onClick={() => setAccommodationTier(tier)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
                        accommodationTier === tier
                          ? 'border-[#0552A2] bg-blue-50/60 font-bold text-[#0552A2]'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{tier}</span>
                      <input
                        type="radio"
                        checked={accommodationTier === tier}
                        onChange={() => setAccommodationTier(tier)}
                        className="text-[#0552A2]"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Transportation Mode */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Domestic Transportation
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {([
                    'Domestic Flights (Lukla/Pokhara)',
                    'Private 4WD Expedition Jeep',
                    'Tourist Express Bus',
                    'Private Helicopter Charter',
                  ] as const).map((mode) => (
                    <label
                      key={mode}
                      onClick={() => setTransportMode(mode)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
                        transportMode === mode
                          ? 'border-[#0552A2] bg-blue-50/60 font-bold text-[#0552A2]'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{mode}</span>
                      <input
                        type="radio"
                        checked={transportMode === mode}
                        onChange={() => setTransportMode(mode)}
                        className="text-[#0552A2]"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Meal Plan */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Meal Plan
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {([
                    'All-Inclusive 3 Meals/Day',
                    'Bed & Breakfast Only',
                    'Self-Catered',
                  ] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMealPlan(m)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        mealPlan === m
                          ? 'border-[#0552A2] bg-blue-50/60 font-bold text-[#0552A2]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Equipment Rental Checkboxes */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Trekking Equipment Rental (Optional)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {['-20°C Down Jacket', '4-Season Sleeping Bag', 'Trekking Carbon Poles', 'Microspikes & Crampons'].map((gear) => {
                    const isChecked = selectedGear.includes(gear);
                    return (
                      <label
                        key={gear}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                          isChecked ? 'border-[#0552A2] bg-blue-50/50 font-bold text-[#0552A2]' : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedGear((prev) => [...prev, gear]);
                            else setSelectedGear((prev) => prev.filter((g) => g !== gear));
                          }}
                          className="rounded text-[#0552A2]"
                        />
                        <span className="text-[11px]">{gear}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-2.5 pt-4 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="h-10 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 sm:px-4 text-xs font-semibold text-slate-700 shadow-2xs transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
                >
                  <ArrowLeft className="h-3.5 w-3.5 shrink-0" /> <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="flex-1 sm:flex-initial h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0552A2] via-[#084C93] to-[#0552A2] hover:opacity-95 px-4 sm:px-6 text-xs font-bold text-white shadow-md shadow-[#0552A2]/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Review Required Permits</span>
                  <span className="sm:hidden">Required Permits</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 5: ROUTE-BASED PERMIT AUTO-DETECTION & COMPLIANCE */}
          {/* ================================================================= */}
          {currentStep === 5 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5 shadow-xs">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0552A2]">
                  <ShieldCheck className="h-4 w-4" /> Step 5 of 7
                </div>
                <h2 className="text-xl font-bold font-poppins text-slate-900 mt-1">
                  Route-Detected Permits &amp; Government Regulations
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automatically identified permits required by the Department of Immigration &amp; National Parks.
                </p>
              </div>

              {/* Permits List */}
              <div className="space-y-3">
                {activeRegion.requiredPermits.map((pid) => {
                  const isTIMS = pid === 'tims';
                  const isSNP = pid === 'snp';
                  const isACAP = pid === 'acap';
                  const isMRAP = pid === 'mrap';
                  const isMustang = pid === 'mustang_rap';
                  const isLNP = pid === 'lnp';

                  const title = isTIMS
                    ? 'TIMS (Trekkers’ Information Management System) Card'
                    : isSNP
                    ? 'Sagarmatha National Park Conservation Entry Permit'
                    : isACAP
                    ? 'Annapurna Conservation Area Project (ACAP) Permit'
                    : isMRAP
                    ? 'Manaslu Restricted Area Special Entry Permit'
                    : isMustang
                    ? 'Upper Mustang Restricted Area Permit (RAP)'
                    : 'Langtang National Park Entry Permit';

                  const feeNpr = isMustang ? 67500 : isMRAP ? 13500 : isTIMS ? 2000 : 3000;
                  const feeUsd = isMustang ? 500 : isMRAP ? 100 : isTIMS ? 20 : 30;

                  return (
                    <div key={pid} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{title}</span>
                            {(isMustang || isMRAP) && (
                              <span className="bg-red-100 text-red-800 text-[9.5px] font-bold px-1.5 py-0.5 rounded uppercase">
                                Restricted Area
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Authority: Government of Nepal • Department of Immigration &amp; NTB
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-extrabold text-[#0552A2]">
                            NPR {feeNpr.toLocaleString()}
                          </span>
                          <span className="block text-[10px] text-slate-400">
                            (~${feeUsd} USD)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Government Compliance Warning Box */}
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  Official Statutory Notice
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  Government-issued permits are distinct from tour operator packages and agency coordination fees. In accordance with Nepal Tourism Act 2035, permits are processed through official immigration checkpoints and national park desks. Visit Nepal never fabricates or auto-approves state documents.
                </p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-2.5 pt-4 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="h-10 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 sm:px-4 text-xs font-semibold text-slate-700 shadow-2xs transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
                >
                  <ArrowLeft className="h-3.5 w-3.5 shrink-0" /> <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(6)}
                  className="flex-1 sm:flex-initial h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0552A2] via-[#084C93] to-[#0552A2] hover:opacity-95 px-4 sm:px-6 text-xs font-bold text-white shadow-md shadow-[#0552A2]/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Calculate Dynamic Quotation</span>
                  <span className="sm:hidden">Calculate Quote</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 6: DYNAMIC PRICING BREAKDOWN */}
          {/* ================================================================= */}
          {currentStep === 6 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5 shadow-xs">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0552A2]">
                  <DollarSign className="h-4 w-4" /> Step 6 of 7
                </div>
                <h2 className="text-xl font-bold font-poppins text-slate-900 mt-1">
                  Itemized Dynamic Cost Calculation
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time formula accounting for field staff, accommodation tier, permits, and VAT.
                </p>
              </div>

              {/* Price Breakdown Table */}
              <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Cost Category</th>
                      <th className="py-2.5 px-4 text-right">Estimated NPR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-2.5 px-4 font-semibold">
                        Lodging &amp; Accommodation ({accommodationTier})
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        NPR {(calculatedPricing?.budgetBreakdown?.accommodation || 0).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4">
                        Field Staff (Guide: {guideRequested ? 'Yes' : 'No'}, Porters: {porterCount}, Butler: {sherpaButlerRequested ? 'Yes' : 'No'})
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        NPR {(calculatedPricing?.budgetBreakdown?.guideAndFieldStaff || 0).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4">
                        Transportation ({transportMode})
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        NPR {(calculatedPricing?.budgetBreakdown?.transportation || 0).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4">
                        Meals &amp; Rations ({mealPlan})
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        NPR {(calculatedPricing?.budgetBreakdown?.meals || 0).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4">
                        Gear Rental ({selectedGear.length} Items)
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        NPR {(calculatedPricing?.budgetBreakdown?.equipmentRental || 0).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4">
                        Official Government Permits &amp; Checkpoint Fees
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        NPR {(calculatedPricing?.budgetBreakdown?.governmentPermits || 0).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="bg-slate-50 font-semibold text-slate-800">
                      <td className="py-2 px-4">Subtotal Logistics</td>
                      <td className="py-2 px-4 text-right">
                        NPR {((calculatedPricing?.estimatedBudgetNpr || 0) - (calculatedPricing?.budgetBreakdown?.vatNpr || 0) - (calculatedPricing?.budgetBreakdown?.serviceChargeNpr || 0)).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-4 text-slate-500">
                        Nepal Tourism Development Service Charge (5%)
                      </td>
                      <td className="py-1.5 px-4 text-right text-slate-600">
                        NPR {(calculatedPricing?.budgetBreakdown?.serviceChargeNpr || 0).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-4 text-slate-500">
                        Nepal Inland Revenue VAT (13%)
                      </td>
                      <td className="py-1.5 px-4 text-right text-slate-600">
                        NPR {(calculatedPricing?.budgetBreakdown?.vatNpr || 0).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="bg-blue-50/80 font-extrabold text-sm text-[#0552A2] border-t-2 border-[#0552A2]/30">
                      <td className="py-3 px-4">Total Estimated Budget</td>
                      <td className="py-3 px-4 text-right text-base">
                        NPR {(calculatedPricing?.estimatedBudgetNpr || 0).toLocaleString()}
                        <span className="block text-[10px] font-normal text-slate-500">
                          (~${Math.round((calculatedPricing?.estimatedBudgetNpr || 0) / 135).toLocaleString()} USD)
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-2.5 pt-4 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="h-10 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 sm:px-4 text-xs font-semibold text-slate-700 shadow-2xs transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
                >
                  <ArrowLeft className="h-3.5 w-3.5 shrink-0" /> <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(7)}
                  className="flex-1 sm:flex-initial h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0552A2] via-[#084C93] to-[#0552A2] hover:opacity-95 px-4 sm:px-6 text-xs font-bold text-white shadow-md shadow-[#0552A2]/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Review &amp; Submit Request</span>
                  <span className="sm:hidden">Review &amp; Submit</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 7: REVIEW, TRAVELER INFO & SUBMIT */}
          {/* ================================================================= */}
          {currentStep === 7 && !submittedTrip && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5 shadow-xs">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0552A2]">
                  <FileText className="h-4 w-4" /> Step 7 of 7
                </div>
                <h2 className="text-xl font-bold font-poppins text-slate-900 mt-1">
                  Review &amp; Submit Custom Expedition Request
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your custom plan will be submitted to licensed NTB operators for route verification and official quotation.
                </p>
              </div>

              {/* Traveler Contact Form */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Lead Traveler Contact &amp; Identity
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Passport / ID Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={passportNumber}
                      onChange={(e) => setPassportNumber(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-800 font-mono uppercase"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Special Route Instructions or Dietary Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g., We would like to add a side trek to Gokyo Ri if weather permits..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Approval Workflow Explanation */}
              <div className="rounded-xl bg-blue-50/70 border border-blue-200/80 p-4 text-xs text-slate-700 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#0552A2]">
                  <Info className="h-4 w-4" /> Custom Trip Approval Workflow
                </div>
                <p className="text-[11px] leading-relaxed">
                  Upon submission, your custom itinerary is broadcast to verified NTB tour operators. Operators review route viability, guide availability, and furnish an official binding quotation. You may review, adjust, or accept the quotation directly in your <span className="font-semibold text-[#0552A2]">Traveler Dashboard</span>.
                </p>
              </div>

              {/* Navigation & Submit Button */}
              <div className="flex items-center justify-between gap-2.5 pt-4 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setCurrentStep(6)}
                  className="h-10 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 sm:px-4 text-xs font-semibold text-slate-700 shadow-2xs transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
                >
                  <ArrowLeft className="h-3.5 w-3.5 shrink-0" /> <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={submitting || !leadName || !leadEmail || !leadPhone}
                  onClick={handleSubmitCustomTrip}
                  className="flex-1 sm:flex-initial h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0552A2] via-[#084C93] to-[#0552A2] hover:opacity-95 px-4 sm:px-6 text-xs font-bold text-white shadow-md shadow-[#0552A2]/20 cursor-pointer disabled:opacity-50 active:scale-95 transition-all whitespace-nowrap"
                >
                  {submitting ? (
                    <span>Submitting Plan...</span>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Submit Custom Plan</span>
                      <span className="sm:hidden">Submit Plan</span>
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* SUCCESS SCREEN AFTER SUBMISSION */}
          {submittedTrip && (
            <div className="rounded-2xl border border-emerald-200 bg-white p-6 sm:p-8 space-y-5 text-center shadow-md">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div className="space-y-1">
                <span className="rounded bg-amber-100 text-amber-800 font-bold text-[10px] px-2.5 py-0.5 uppercase tracking-wider">
                  Status: Under Operator Review
                </span>
                <h3 className="text-2xl font-bold font-poppins text-slate-900 mt-2">
                  Custom Trip Request Submitted!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your custom expedition request #{submittedTrip.id} has been transmitted to authorized tour operators for route safety verification and quotation.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-left max-w-md mx-auto text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Trip Reference ID:</span>
                  <span className="font-mono font-bold text-[#0552A2]">{submittedTrip.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Duration:</span>
                  <span className="font-semibold">{totalDurationDays} Days ({itineraryStages.length} Stages)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Total:</span>
                  <span className="font-bold text-emerald-700">NPR {(calculatedPricing?.estimatedBudgetNpr || 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
                <Link
                  href="/dashboard"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0552A2] py-2.5 text-xs font-bold text-white hover:bg-[#044182]"
                >
                  <span>Go to Traveler Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedTrip(null);
                    setCurrentStep(1);
                  }}
                  className="flex-1 rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Plan Another Trip
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Trip Summary & Calculation Sidebar (Right Col) */}
        <div className="space-y-4 font-inter">
          <div className="sticky top-20 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
            {/* Clean Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold font-poppins text-slate-900 tracking-tight">
                Trip Overview
              </span>
              <span className="text-[10px] font-semibold text-[#0552A2] bg-blue-50/80 border border-blue-200/60 px-2.5 py-0.5 rounded-full">
                Live Calculator
              </span>
            </div>

            {/* Selected Route Inset Card */}
            <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0552A2] flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Selected Route
                </span>
                <span className="text-[9.5px] font-semibold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md">
                  {activeRegion.difficulty || 'Custom'}
                </span>
              </div>
              <p className="font-bold text-slate-900 text-sm font-poppins line-clamp-1 mt-0.5">
                {activeRegion.name}
              </p>
              <p className="text-[11px] text-slate-500">{activeRegion.regionName}</p>
            </div>

            {/* Key Trip Parameters: 2x2 Clean Micro-Tiles */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-slate-50/60 border border-slate-200/60 rounded-xl p-2.5 space-y-0.5">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                  <Calendar className="h-3 w-3 text-[#0552A2]" />
                  <span>Start Date</span>
                </div>
                <p className="font-semibold text-slate-800 text-xs">{startDate}</p>
              </div>

              <div className="bg-slate-50/60 border border-slate-200/60 rounded-xl p-2.5 space-y-0.5">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                  <Clock className="h-3 w-3 text-[#0552A2]" />
                  <span>Duration</span>
                </div>
                <p className="font-semibold text-slate-800 text-xs">{totalDurationDays} Days</p>
              </div>

              <div className="bg-slate-50/60 border border-slate-200/60 rounded-xl p-2.5 space-y-0.5">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                  <Users className="h-3 w-3 text-[#0552A2]" />
                  <span>Travelers</span>
                </div>
                <p className="font-semibold text-slate-800 text-xs">{adultsCount + childrenCount} Person(s)</p>
              </div>

              <div className="bg-slate-50/60 border border-slate-200/60 rounded-xl p-2.5 space-y-0.5">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                  <Sparkles className="h-3 w-3 text-[#0552A2]" />
                  <span>Style</span>
                </div>
                <p className="font-semibold text-slate-800 text-xs truncate" title={travelStyle}>{travelStyle}</p>
              </div>
            </div>

            {/* Field Service Specifications */}
            <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                Field Staff &amp; Services
              </span>

              <div className="flex items-center justify-between text-[11px] py-1 border-b border-slate-100/80">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <UserCheck className="h-3.5 w-3.5 text-[#0552A2]" />
                  <span>Lead Guide</span>
                </div>
                {guideRequested ? (
                  <span className="text-[10px] font-semibold text-[#0552A2] bg-blue-50 border border-blue-200/70 px-2 py-0.5 rounded-md">
                    IFMGA Certified
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400">Independent</span>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] py-1 border-b border-slate-100/80">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Luggage className="h-3.5 w-3.5 text-[#0552A2]" />
                  <span>Porters</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                  {porterCount} Porter(s)
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] py-1 border-b border-slate-100/80">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <ConciergeBell className="h-3.5 w-3.5 text-[#0552A2]" />
                  <span>Sherpa Butler</span>
                </div>
                {sherpaButlerRequested ? (
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    VIP Concierge
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400">Optional</span>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] py-1">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Hotel className="h-3.5 w-3.5 text-[#0552A2]" />
                  <span>Lodging</span>
                </div>
                <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[140px] text-right" title={accommodationTier}>
                  {accommodationTier}
                </span>
              </div>
            </div>

            {/* Pure Typography Price Summary (No card box, just clean text) */}
            <div className="border-t border-slate-200/80 pt-3 space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-semibold text-slate-600">
                  Estimated Total
                </span>
                <span className="text-xl font-bold font-poppins text-slate-900">
                  NPR {(calculatedPricing?.estimatedBudgetNpr || 0).toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 text-right">
                ~${Math.round((calculatedPricing?.estimatedBudgetNpr || 0) / 135).toLocaleString()} USD • Includes 13% VAT &amp; 5% SC
              </p>
            </div>

            {/* Quick jump to step button if not on review */}
            {currentStep < 7 && (
              <button
                type="button"
                onClick={() => setCurrentStep(7)}
                className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-[#0552A2]/40 hover:text-[#0552A2] transition-all cursor-pointer active:scale-95"
              >
                <span>Skip Directly to Review &amp; Submit</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
