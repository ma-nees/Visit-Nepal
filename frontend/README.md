# 🏔️ Visit Nepal Frontend (`website/frontend`)

Next.js 15 App Router + React 19 + TypeScript + Tailwind CSS v4 frontend for the **Visit Nepal 2026** platform.

---

## 🌟 Key Features

- **Iconic Mountain Treks & Circuit Registry (`/explore`)**:
  - Virtual chunking and scalable pagination engine capable of effortlessly handling **1,000+ routes** at 60 FPS with sub-2ms multi-parameter search and filtering.
  - Dual view modes: **Grid Cards View** and high-density **Compact List / Table View**.
  - Dynamic multi-filtering: category chips with live count badges, difficulty grades, duration brackets, altitude sorting, and instant search.
  - 1-click `[⚡ Test 1,000+ Records]` benchmark mode.
- **7-Step Custom Expedition Builder (`/custom-plan`)**:
  - Region selection, dates, travelers, IFMGA guides, porters, VIP Sherpa butler, lodging tiers, and permits.
  - Real-time pure typography pricing calculation (NPR & USD, 13% VAT, 5% Service Charge) and direct broadcast to verified local tour operators.
- **Official Government Tax Invoice & Digital Receipt (`src/lib/receiptGenerator.ts`)**:
  - Isolated client-side single-page A4 / Letter PDF print engine.
  - Strict NTB compliance (PAN & VAT registration, itemized statement of charges, official notice, and Controller of Tourism Desk authorization).
  - Guaranteed single-page layout with zero spillover.
- **Physics-Based Shutter Mobile Navigation**:
  - Smooth shutter drop-down and roll-up animations (`cubic-bezier(0.16, 1, 0.3, 1)`).
  - Background overlay with subtle blur and body scroll lock.
- **Multi-Role Portals & Interactive Dashboard**:
  - Dedicated interfaces for Travelers, Guides, Sherpa Butlers, Agencies, and NTB Admins.
- **Real-Time Concierge & Field Chat (`/chat`)**:
  - Direct communication with assigned guides, lodge hosts, and Sherpa butlers.
- **Interactive Geospatial Knowledge Map (`/map`)**:
  - Visual topographic map tracking mountain ranges, high passes, and national parks.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 + Custom Design Tokens (Royal Blue `#0552A2`, Crimson `#EC1F27`, Gold `#FDB716`, Glacier Sky `#92C4EA`)
- **Typography**: Poppins (Headings) & Inter (Body, UI, and Buttons)
- **Icons**: Lucide React

---

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

3. **Type check**:
   ```bash
   npx tsc --noEmit
   ```

4. **Production Build**:
   ```bash
   npm run build
   npm start
   ```
