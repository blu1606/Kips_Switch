# UI Fix List - Vault Archive

> Các lỗi nhỏ và điểm cần cải thiện trong Vault Archive UI sau khi redesign.

## 🐛 Bugs (Cần sửa ngay)

### 1. Particles Random Position SSR Hydration Mismatch
**File:** `ArchiveHero.tsx` (line 30-32)
```tsx
style={{
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
}}
```
**Vấn đề:** `Math.random()` được gọi trong render, gây hydration mismatch giữa server và client.
**Fix:** Di chuyển random values vào useMemo hoặc useEffect.

---

### 2. Select Dropdown Background Color trên Dark Mode
**File:** `ArchiveFilter.tsx` (line 89-99)
```tsx
<select className="px-4 py-3 bg-dark-800/50 ...">
```
**Vấn đề:** Option elements không inherit dark background, gây ra text đen trên nền trắng khi mở dropdown.
**Fix:** Thêm `[&>option]:bg-dark-800 [&>option]:text-white` hoặc dùng custom dropdown component.

---

### 3. Delete Button Animation Flicker
**File:** `ClaimedVaultCard.tsx` (line 224-248)
**Vấn đề:** AnimatePresence bao bọc conditional rendering nhưng thiếu key unique, có thể gây animation không smooth.
**Fix:** Thêm `key="delete-confirm"` vào motion.button và `key="delete-btn"` vào button thường.

---

## ⚠️ Improvements (Nên cải thiện)

### 4. Missing Accessibility Labels
**Files:** Tất cả components
**Vấn đề:** 
- Buttons chỉ có emoji (👁️, ⬇️, 🗑️) thiếu aria-label
- Filter chips thiếu aria-pressed state

**Fix:**
```tsx
<button aria-label="View vault contents">👁️</button>
<button aria-pressed={filterType === opt.value}>...</button>
```

---

### 5. Hero Stats Hiện Khi Không Có Vaults
**File:** `page.tsx` (line 148)
```tsx
<ArchiveHero vaults={vaults} />
```
**Vấn đề:** Hero hiện stats "0 Vaults" khi không có data, sau đó hiện ArchiveEmptyState - bị duplicate thông điệp.
**Fix:** Ẩn Hero hoặc chỉ hiện title khi `vaults.length === 0`.

---

### 6. Card Stagger Delay Quá Lâu Khi Nhiều Cards
**File:** `ClaimedVaultCard.tsx` (line 41)
```tsx
delay: index * 0.1
```
**Vấn đề:** Nếu có 20 cards, card cuối phải đợi 2 giây.
**Fix:** ```tsx
delay: Math.min(index * 0.1, 0.5) // Cap tối đa 500ms
```

---

### 7. List View Thiếu Delete Button
**File:** `ClaimedVaultCard.tsx` (line 53-110)
**Vấn đề:** List view không render delete button như grid view.
**Fix:** Thêm delete button tương tự vào list view actions.

---

### 8. Mobile Responsive - Filter Bar Overflow
**File:** `ArchiveFilter.tsx` (line 51)
**Vấn đề:** Trên mobile, filter chips có thể overflow nhưng không có scroll indicator.
**Fix:** Thêm `overflow-x-auto scrollbar-hide` và gradient fade hint.

---

### 9. Gradient Text Không Hiện Trên Safari
**File:** `ArchiveHero.tsx` (line 65)
```tsx
className="... bg-clip-text text-transparent"
```
**Vấn đề:** Cần thêm `-webkit-background-clip` cho Safari.
**Fix:** Thêm custom class hoặc inline style:
```tsx
style={{ WebkitBackgroundClip: 'text' }}
```

---

### 10. Search Focus Not Using Reduced Motion
**File:** `ArchiveFilter.tsx` (line 53-60)
**Vấn đề:** Animation box-shadow không respect `prefers-reduced-motion`.
**Fix:** Wrap trong media query check:
```tsx
const prefersReducedMotion = typeof window !== 'undefined' 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

---

## 📋 Priority Matrix

| Issue | Severity | Effort | Priority |
|-------|----------|--------|----------|
| #1 SSR Hydration | High | Low | P1 |
| #2 Select Dropdown | Medium | Low | P1 |
| #3 Delete Animation | Low | Low | P2 |
| #4 Accessibility | Medium | Medium | P2 |
| #5 Hero Duplicate | Low | Low | P2 |
| #6 Stagger Cap | Low | Low | P3 |
| #7 List Delete | Low | Low | P2 |
| #8 Mobile Overflow | Medium | Low | P2 |
| #9 Safari Gradient | Medium | Low | P1 |
| #10 Reduced Motion | Low | Medium | P3 |

---

## ✅ Quick Fixes (Copy-paste)

### Fix #1 - SSR Safe Particles
```tsx
// ArchiveHero.tsx - Add at top of component
const [particles] = useState(() => 
    [...Array(20)].map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 3 + Math.random() * 2,
        delay: Math.random() * 2,
    }))
);
```

### Fix #2 - Select Styling
```tsx
className="px-4 py-3 bg-dark-800/50 border border-dark-700 rounded-xl text-white focus:border-primary-500/50 focus:outline-none cursor-pointer min-w-[160px] [&>option]:bg-dark-800 [&>option]:text-white"
```

### Fix #9 - Safari Gradient
```tsx
<h1 
    className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-primary-200 to-purple-200 bg-clip-text text-transparent"
    style={{ WebkitBackgroundClip: 'text' }}
>
```
