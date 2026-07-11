import type { Feature, Room, Testimonial, Stat } from "../../types/index";

export const features: Feature[] = [
  {
    icon: "🛏️",
    title: "Comfortable Rooms",
    desc: "Dormitory & private rooms with cozy beds, storage lockers, and fresh linen.",
  },
  {
    icon: "🍽️",
    title: "Free Breakfast",
    desc: "Start every morning with a complimentary hot breakfast in our communal kitchen.",
  },
  {
    icon: "⚡",
    title: "High-Speed Wi-Fi",
    desc: "Lightning-fast internet throughout the building — work or stream without limits.",
  },
  {
    icon: "🔒",
    title: "24/7 Security",
    desc: "Keycard access, CCTV, and round-the-clock staff for your peace of mind.",
  },
  {
    icon: "🧺",
    title: "Laundry Facilities",
    desc: "On-site washer & dryer available any time, every day of the week.",
  },
  {
    icon: "🌐",
    title: "Social Lounge",
    desc: "Meet fellow travelers in our vibrant common area with games and events.",
  },
];

export const rooms: Room[] = [
  {
    type: "Dormitory",
    price: "$12",
    per: "/ night",
    tag: "Best Value",
    tagColor: "bg-emerald-100 text-emerald-700",
    imgBg: "from-indigo-100 to-indigo-200",
    emoji: "🛏️",
    desc: "6–10 bed mixed or female-only dorms with personal curtains, power sockets & lockers.",
    features: ["Shared bathroom", "Free breakfast", "Locker included"],
  },
  {
    type: "Twin Private",
    price: "$38",
    per: "/ night",
    tag: "Popular",
    tagColor: "bg-amber-100 text-amber-700",
    imgBg: "from-amber-100 to-amber-200",
    emoji: "🏡",
    desc: "A cozy private twin room with an en-suite bathroom — perfect for couples or friends.",
    features: ["En-suite bathroom", "Free breakfast", "Smart TV"],
  },
  {
    type: "Single Private",
    price: "$28",
    per: "/ night",
    tag: "Solo Stay",
    tagColor: "bg-sky-100 text-sky-700",
    imgBg: "from-sky-100 to-sky-200",
    emoji: "🪟",
    desc: "Your own quiet retreat — a compact single room with a city view and all amenities.",
    features: ["City view", "Free breakfast", "Work desk"],
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Lena Müller",
    country: "Germany 🇩🇪",
    text: "Honestly the best hostel stay I've had in years. Staff were super helpful and the rooftop was 🔥",
    avatar: "LM",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    name: "Raj Patel",
    country: "India 🇮🇳",
    text: "Affordable, clean, and the breakfast was amazing. I'll definitely be coming back next month.",
    avatar: "RP",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "Sofia Rossi",
    country: "Italy 🇮🇹",
    text: "Made so many friends in the lounge! The location is perfect — everything is walkable.",
    avatar: "SR",
    color: "bg-rose-100 text-rose-700",
  },
];

export const stats: Stat[] = [
  { value: "4,200+", label: "Happy Guests" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "12+", label: "Years Running" },
  { value: "4.9★", label: "Average Rating" },
];