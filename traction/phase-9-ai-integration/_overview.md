# 🤖 Phase 9: AI & Micro-UX

> **Philosophy:** Invisible helpers. High value, low friction.  
> **Updated:** 2025-12-10

---

## 🎯 User Psychology: Why AI Matters

### The Pain Points

| Pain | User Thought | AI Solution |
|------|--------------|-------------|
| **Password anxiety** | "What if they can't remember?" | → Password Hint Generator |
| **Writer's block** | "What do I even say to them?" | → Write Assist |
| **Overwhelm** | "30 days? 90 days? What's right?" | → Smart Timer |
| **Privacy fear** | "Did I accidentally expose my keys?" | → Anti-Doxxer |
| **Guilt of forgetting** | "I feel bad for not checking in" | → Kip's warmth |

### User → Customer Trigger

```
FREE user thinks: "This is useful but basic"
                        ↓
AI features show: "We understand your anxiety"
                        ↓
Customer feels: "This app GETS me. Worth paying for."
```

---

## 📊 Feature Matrix

| ID | Feature | AI/Tech | Difficulty | Benefit | Priority |
|----|---------|---------|------------|---------|----------|
| **9.4** | Anti-Doxxer | Regex | ⭐ Easy | ⭐⭐⭐⭐⭐ Critical | P0 |
| **9.1** | Kip's Voice | Static | ⭐ Easy | ⭐⭐⭐⭐ Retention | P1 |
| **9.3** | Smart Timer | Rules | ⭐⭐ Medium | ⭐⭐⭐ Guidance | P2 |
| **9.2** | Password Hint | LLM | ⭐⭐ Medium | ⭐⭐⭐ Trust | P2 |
| **9.5** | Write Assist | LLM | ⭐⭐ Medium | ⭐⭐⭐ Conversion | P3 |
| **9.6** | AI Providers | Infra | ⭐⭐⭐ Hard | ⭐⭐⭐⭐ Cost | P1 |
| **9.7** | AI Caching | Supabase | ⭐⭐ Medium | ⭐⭐⭐⭐ Latency | P1 |

---

## 📂 Spec Files

| File | Focus | Status |
|------|-------|--------|
| [9.1-kips-voice.md](./9.1-kips-voice.md) | Warm system messages | 📝 Planned |
| [9.2-password-hint.md](./9.2-password-hint.md) | AI hint generator | 📝 Planned |
| [9.3-smart-timer.md](./9.3-smart-timer.md) | Timer suggestions | 📝 Planned |
| [9.4-anti-doxxer.md](./9.4-anti-doxxer.md) | Prevent key leaks | 📝 Planned |
| [9.5-write-assist.md](./9.5-write-assist.md) | Message writing help | 📝 Planned |
| [9.6-ai-providers.md](./9.6-ai-providers.md) | **NEW:** FREE API setup | 📝 Planned |
| [9.7-ai-caching.md](./9.7-ai-caching.md) | **NEW:** Supabase cache | 📝 Planned |

---

## 🚀 Execution Order

### Phase A: Safety First (P0)
1. **9.4 Anti-Doxxer** - Zero cost, prevents disaster

### Phase B: Infrastructure (P1)  
2. **9.6 AI Providers** - Setup Groq + fallbacks
3. **9.7 AI Caching** - Supabase response cache
4. **9.1 Kip's Voice** - Emotional hook

### Phase C: AI Features (P2-P3)
5. **9.3 Smart Timer** - Rule-based guidance
6. **9.2 Password Hint** - LLM integration
7. **9.5 Write Assist** - Premium conversion

---

## ❌ Rejected Features

| Feature | Why Rejected |
|---------|--------------|
| Content Explainer | Users know their files. Hallucination risk. |
| Memory Summary | Too risky for grieving users. Insensitive. |

---

## 🔒 Privacy Rules (Non-Negotiable)

| Rule | Description |
|------|-------------|
| **Never send decrypted content** | No file contents, no vault data to AI |
| **Metadata only** | OK: file name, extension, size, vault type |
| **Client-side scrubbing** | Remove crypto keys BEFORE API call |
| **No logging prompts** | Don't store user prompts in analytics |

### What CAN go to AI
- "Help me write a hint for my cat's name + year"
- "Suggest a timer for crypto inheritance"

### What NEVER goes to AI
- Actual passwords or keys
- Decrypted file contents
- Private messages or letters

---

## 💰 Cost Strategy

**Target: $0/month**

| Component | Solution | Cost |
|-----------|----------|------|
| Primary AI | Groq (FREE) | $0 |
| Fallback 1 | Cerebras (FREE) | $0 |
| Fallback 2 | Gemini (FREE) | $0 |
| Cache | Supabase (FREE tier) | $0 |
| Edge | Vercel (Hobby) | $0 |

---

## 📈 Success Metrics

| Metric | Target |
|--------|--------|
| AI response latency | <300ms |
| Cache hit rate | >60% |
| Password Hint usage | >40% of vaults |
| Write Assist conversion | >20% use → upgrade |
