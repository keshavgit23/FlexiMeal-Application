import type { MessOwnerData, ShiftData } from './types/messOnboarding';

// export const INITIAL_MESS_DATA: MessOwnerData = {
//     // Pre-filled from Onboarding (as mandated: owner ALREADY completed these)
//     name: 'Annapurna Executive Mess',
//     address: 'Kothrud, Pune',
//     state: 'Maharashtra',

//     // Pending required items
//     monthlyPrice: null,
//     description: '',
//     offersBreakfast: false,
//     offersLunch: true,
//     offersDinner: true,
//     foodType: 'PURE_VEG',

//     // Draft state initially
//     isPublished: false,
//     status: 'DRAFT',
// };
export const INITIAL_MESS_DATA: MessOwnerData = {
  profileId: 0,
  userId: 0,

  name: 'ABC Mess',
  address: 'Sample Address',
  city: 'Pune',
  state: 'Maharashtra',

  monthlyPrice: 2200,
  description: 'Hygienic home-style food.',
  foodType: 'PURE_VEG',

  photoUrl: null,
  offersBreakfast: false,
  offersLunch: true,
  offersDinner: true,

  listingStatus: 'DRAFT',
  publishedAt: null,
  profileCompleted: true
};

export const SAMPLE_DEFAULT_DESCRIPTION =
    'Hygienic home-style food served fresh near MIT College. Unlimited chapati & daily special dal.';

export const QUICK_PRICE_SUGGESTIONS = [2000, 2200, 2500, 2800];

export const INITIAL_SHIFT_DATA: ShiftData = {
    shiftName: 'Lunch',
    cutoffTimeRemaining: 2535, // 00:42:15 in seconds
    totalMealsToPrepare: 185,
    portionBreakdown: {
        subscribed: 120,
        defaultMeals: 40,
        payg: 25,
    },
    menuToCook: [
        'Paneer Butter Masala (Fresh Cottage Cheese)',
        'Dal Tadka (Pahari Style)',
        'Steamed Jeera Rice & Phulka Chapati',
        'Koshimbir & Roasted Papad',
    ],
    nextShift: {
        name: 'Dinner',
        timing: '7:30 PM – 10:00 PM',
        expectedMeals: 160,
    },
};

export const SAMPLE_MESS_PHOTOS = [
    {
        id: 'p1',
        label: 'Dining Hall',
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'p2',
        label: 'Fresh Thali',
        url: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'p3',
        label: 'Clean Kitchen',
        url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
    },
];
