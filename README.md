# 🍢 StreetByte — Smart AI Queues for Local Food Retail

> Built by **Wanaemi Watson** for **TECHOFF 2026: Everybody Can Build**  
> Tagline: *Smart queues for smarter dining.*  
> Hashtags: `#TechOff2026` `#EverybodyCanBuild`

---

## 🌟 The Story & Real Problem

Street food vendors like **Mallam Musa** (and campus canteens / local food joints) make delicious, beloved food. However, they suffer from severe operational friction:
1. **Smoky Sidewalk Crowding**: High lunch and evening rushes cause customers to stand in smoke and dense crowds for 20–30 minutes.
2. **Lost Revenue**: Busy office workers and students on tight lunch breaks take one look at the queue and walk away.
3. **Chaotic Verbal Orders**: Yelling orders over sizzling charcoal grills leads to wrong modifications (e.g. wrong spice level, forgotten drinks).
4. **Delayed Transfer Verification**: Vendors with oily hands have to repeatedly stop cooking to refresh their personal banking apps to verify credit alerts, worried about fake bank transfers.

---

## 🚀 The Solution: StreetByte

**StreetByte** replaces physical waiting lines with smart digital queues and natural language AI ordering:

### 1. 🤖 AI Natural Language & Voice Order Assistant
- Speak or type using natural street food vernacular (e.g., *"2 beef suya, extra yaji, onions on the side, and 1 cold malt"*).
- Smart NLP parser automatically extracts quantities, items, spice intensity, onion preferences, and packaging choices.
- Intelligent upsell engine pairs grills with sides (fluffy Masa cakes) or ice-cold drinks (Zobo / Malta).

### 2. ⚡ Instant Payment Reconciliation & Fake Transfer Blocker
- Simulates automated instant bank inbound webhook matching with GTBank / Paystack-style references (`TRX-948123`).
- Vendor never needs to touch their phone with oily hands or guess if an alert is authentic.

### 3. ⏱️ Smart ETA & Walking Distance Sync
- Calculates dynamic queue wait time based on actual active orders in the kitchen.
- Factors in the customer's 4-minute walking distance: *"Leave your desk in 6 minutes to catch your food hot off the grill!"*

### 4. 🔥 High-Contrast Touch Kitchen Display System (KDS)
- Built for real street conditions (bright sunlight, heat, smoke).
- Audible Web Audio API chime alerts the vendor when new paid orders arrive.
- One-tap status pipeline: `🟡 Incoming` ➔ `🟠 On the Charcoal Grill` ➔ `🟢 Ready for Counter Pickup`.
- Voice announcement: Uses browser speech synthesis to announce ready ticket numbers aloud.
- Rush Pacing Regulator: `+5m` or `+10m` rush buffer buttons to dynamically slow down new incoming orders during peak rushes.
- 1-Tap Out-of-Stock toggles for sold-out menu items.

### 5. 🖨️ Branded Printable Counter QR Stand
- Ready-to-print or display countertop stand for the vendor's stall with high-res QR code and a 3-step customer guide.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React Icons
- **Real-Time Sync**: Multi-tab `BroadcastChannel` + `localStorage` + Node.js WebSocket Server (`server.js`)
- **Sound & Speech**: Web Audio API Synthesizer + Web Speech API (zero external mp3 downloads required)
- **Deployment**: Zero-config static output compatible with Vercel, Netlify, Cloudflare Pages, or local network mobile hotspots.

---

## 💻 Quick Start & Local Testing

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

> [!TIP]
> **Mobile Phone Testing on Same Wi-Fi**:
> Vite is configured with `--host`. Check the terminal output for your network IP (e.g., `http://192.168.1.15:5173`).
> Open that link on your smartphone to test the customer view while keeping the Kitchen KDS open on your laptop!

### 3. Build & Run Production Server
```bash
npm run build
npm run server
```

---

## 🌐 1-Click Cloud Deployment

### Option A: Vercel (Recommended)
1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) ➔ Import Git Repository.
3. Framework Preset: **Vite**.
4. Click **Deploy**. Vercel will instantly generate a live URL (e.g. `https://streetbyte.vercel.app`) with HTTPS for microphone voice support!

### Option B: Netlify
1. Drag and drop the `dist/` folder after running `npm run build` into [app.netlify.com/drop](https://app.netlify.com/drop), or link via GitHub.
2. Build command: `npm run build`, Publish directory: `dist`.

---

## 📹 Video Submission Guide (TECHOFF 2026)

Check [`SUBMISSION_GUIDE.md`](./SUBMISSION_GUIDE.md) for the complete 85-second shot-by-shot script, filming instructions, social media captions, and WhatsApp templates.
