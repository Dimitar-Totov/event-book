// ─── Shared category configuration ───────────────────────────────────────────
// UI-level metadata for each event category: slugs, labels, colours, gradients.
// Consumed by both the Events page and the Conversation page.

export type Category = {
  slug: string;
  label: string;
  emoji: string;
  tagline: string;
  gradientCard: string;
  gradientOverlay: string;
  iconRing: string;
  accent: string;
  pill: string;
  glow: string;
};

export const categories: Category[] = [
  {
    slug: 'music',
    label: 'Music Concerts',
    emoji: '🎵',
    tagline: 'Live performances, festivals & intimate gigs',
    gradientCard: 'from-violet-50 via-purple-50 to-pink-50',
    gradientOverlay: 'from-violet-400/20 via-purple-300/10 to-pink-400/20',
    iconRing: 'ring-violet-200 bg-violet-100',
    accent: 'text-violet-600',
    pill: 'bg-violet-100 text-violet-600 ring-violet-200',
    glow: 'hover:shadow-violet-200/70',
  },
  {
    slug: 'hiking',
    label: 'Mountain Hiking',
    emoji: '⛰️',
    tagline: 'Guided treks, day hikes & alpine expeditions',
    gradientCard: 'from-teal-50 via-emerald-50 to-sky-50',
    gradientOverlay: 'from-teal-400/20 via-emerald-300/10 to-sky-400/20',
    iconRing: 'ring-teal-200 bg-teal-100',
    accent: 'text-teal-600',
    pill: 'bg-teal-100 text-teal-600 ring-teal-200',
    glow: 'hover:shadow-teal-200/70',
  },
  {
    slug: 'beach',
    label: 'Beach Getaway',
    emoji: '🏖️',
    tagline: 'Coastal retreats, water sports & sunset events',
    gradientCard: 'from-sky-50 via-cyan-50 to-blue-50',
    gradientOverlay: 'from-sky-400/20 via-cyan-300/10 to-blue-400/20',
    iconRing: 'ring-sky-200 bg-sky-100',
    accent: 'text-sky-600',
    pill: 'bg-sky-100 text-sky-600 ring-sky-200',
    glow: 'hover:shadow-sky-200/70',
  },
  {
    slug: 'food',
    label: 'Food Festival',
    emoji: '🍽️',
    tagline: 'Culinary tastings, chef pop-ups & street food',
    gradientCard: 'from-amber-50 via-orange-50 to-yellow-50',
    gradientOverlay: 'from-amber-400/20 via-orange-300/10 to-yellow-400/20',
    iconRing: 'ring-amber-200 bg-amber-100',
    accent: 'text-amber-600',
    pill: 'bg-amber-100 text-amber-600 ring-amber-200',
    glow: 'hover:shadow-amber-200/70',
  },
  {
    slug: 'art',
    label: 'Art Exhibition',
    emoji: '🎨',
    tagline: 'Galleries, installations & live art performances',
    gradientCard: 'from-pink-50 via-rose-50 to-fuchsia-50',
    gradientOverlay: 'from-pink-400/20 via-rose-300/10 to-fuchsia-400/20',
    iconRing: 'ring-pink-200 bg-pink-100',
    accent: 'text-pink-600',
    pill: 'bg-pink-100 text-pink-600 ring-pink-200',
    glow: 'hover:shadow-pink-200/70',
  },
];
