# Pricing Section UI: Integration Plan

> **Goal:** Add a visually compelling pricing section to the Landing Page.

## 📐 Component Spec: `PricingSection.tsx`

### Location
`src/components/landing/PricingSection.tsx`

### Design System
- Use existing `glass-panel`, `btn-primary`, `btn-secondary` classes.
- **Do NOT add shadcn dependencies** (keep bundle small).
- Match dark theme aesthetic.

### Props
None. Data is hardcoded for now.

### Structure
```
Section (py-24)
├── Heading: "Choose Your Legacy"
├── Subheading: "Start free. Upgrade when you're serious."
├── Grid (3 cols on lg, 1 col mobile)
│   ├── Card: FREE
│   ├── Card: LEGACY+ (Featured)
│   └── Card: GUARDIAN
```

### Plan Data
```typescript
const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Try the protocol.',
    features: [
      '2 Active Vaults',
      'AES-256 Encryption',
      '7-365 Day Timers',
      'Kip Companion',
    ],
    cta: 'Start Free',
    featured: false,
  },
  {
    name: 'Legacy+',
    price: '$49/year',
    description: 'For serious digital estates.',
    features: [
      'Unlimited Vaults',
      'Gasless Claim for Recipients',
      'Video Messages (Up to 100MB)',
      'Priority Email Reminders',
      'Silent Alarm (Duress Mode)',
    ],
    cta: 'Upgrade Now',
    featured: true,
  },
  {
    name: 'Guardian',
    price: '1 SOL (Lifetime)',
    description: 'The ultimate safety net.',
    features: [
      'Everything in Legacy+',
      'Guardian Key Sharding (3-Key)',
      'Founder\'s Badge NFT',
      'Early Access to Features',
    ],
    cta: 'Become a Founder',
    featured: false,
  },
];
```

## 🎨 Visual Details

### Card Styles
- **Free:** Standard border (`border-dark-700`).
- **Legacy+ (Featured):** Glowing border (`border-primary-500/50`), subtle shadow.
- **Guardian:** Gold/Amber accent (`border-amber-500/30`).

### Icons
- Use `lucide-react`:
  - Free: `Gift`
  - Legacy+: `Shield`
  - Guardian: `Crown`

### Responsive
- `grid grid-cols-1 lg:grid-cols-3 gap-6`
- Stack on mobile.

## 🔗 Integration into `page.tsx`

1.  Import `PricingSection` in `src/app/page.tsx`.
2.  Place after `<UseCaseGrid />` and before `<FAQSection />`.

```tsx
// page.tsx
import PricingSection from '@/components/landing/PricingSection';

// ... inside return()
<UseCaseGrid />
<PricingSection />
<FAQSection />
```

## ✅ Checklist
- [ ] Create `PricingSection.tsx` with hardcoded data.
- [ ] Style cards with glass-panel aesthetic.
- [ ] Add to `page.tsx`.
- [ ] (Later) Connect CTA buttons to actual payment/connect flow.
