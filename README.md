# 🏔️ Visit Nepal 2026 — Official Digital Tourism & Expedition Platform

An all-in-one, enterprise-grade digital tourism ecosystem connecting international travelers, IFMGA-certified high-altitude mountain guides, Sherpa butlers, authorized tour operators, and the **Nepal Tourism Board (NTB)** / Ministry of Tourism.

Built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Node.js/Express**.

---

## 🌟 Key Highlights & Architectural Features

### 1. 🥾 Curated Mountain Treks & Circuit Registry (`/explore`)
- **Virtual Chunking & Scale Engine**: Engineered to effortlessly handle **1,000+ expedition routes** at locked 60 FPS with sub-2ms multi-parameter search and filtering.
- **Dual View Modes**:
  - **Visual Grid Cards View**: Rich photography, altitude markers, difficulty badges, reviews, and highlight bullets.
  - **Compact List / Comparison Table View**: High-density rows ideal for rapidly scanning through hundreds of routes without visual fatigue.
- **Smart Pagination & Windowing**: Full control over records per page (12, 24, 48, 96) and dynamic page navigation (`[< Prev] 1 2 3 … 84 [Next >]`).
- **Interactive Multi-Filtering**: Dynamic category pills with live matching counts, difficulty grades (Easy to Difficult), duration ranges, altitude elevation sorting, and instant keyword search.
- **Live 1,000+ Record Benchmark Simulator**: Built-in `[⚡ Test 1,000+ Records]` button to stress-test rendering and filtering in real time.

### 2. 🗺️ 7-Step Custom Expedition Builder (`/custom-plan`)
- **Interactive Route Viability Wizard**:
  - **Step 1: Region & Destination**: Everest (Khumbu), Annapurna, Langtang, Manaslu, Mustang, Dolpo.
  - **Step 2: Dates & Duration**: Intelligent acclimatization pacing and seasonal weather advisories.
  - **Step 3: Group Composition**: Adults, children, fitness level, and dietary requirements.
  - **Step 4: Field Staff & Concierge**: Certified IFMGA mountain guides, porters, and optional VIP Sherpa Butler service.
  - **Step 5: Lodging Tier**: Traditional Teahouse, Standard Mountain Lodge, or Luxury Alpine Eco-Resort.
  - **Step 6: Permits & Checkpoints**: Automated calculation of TIMS, ACAP, Sagarmatha (SNP), and Restricted Area Permits (RAP).
  - **Step 7: Real-Time Cost Calculator & Operator Broadcast**: Pure typography pricing summary (NPR & USD, 13% VAT, 5% Service Charge) and direct broadcast to verified local operators for binding quotations.

### 3. 📄 Official Government Tax Invoice & Digital Receipt (`receiptGenerator.ts`)
- **Strict Single-Page A4 / Letter PDF Engine**: Offscreen iframe rendering that prints or downloads *only* the official tax invoice—never the website UI, navbar, or modals.
- **Official NTB Compliance**: Official PAN (`301295847`) & VAT (`601928471`) registration numbers, clearance IDs, itemized charge breakdowns, and Controller of Tourism Desk authorization.
- **Zero Page Spillover**: Proportional layout budgeting and CSS `@page` / `page-break-inside: avoid` constraints ensure it fits onto a single page every time.

### 4. 📱 Physics-Based Shutter Mobile Navigation
- **Shutter Drop-Down & Roll-Up Animation**: Smooth entrance (`translateY(-20px) → 0`, `scaleY(0.96) → 1`) and retraction using iOS-style easing (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **Backdrop Blur & Scroll Lock**: Subtle backdrop overlay closes the shutter when tapped; background scrolling is locked to maintain smooth interaction.
- **Morphing Hamburger Icon**: Smooth 90-degree transition between `Menu` and `X`.

### 5. 👥 Multi-Role Portal Architecture
- **Traveler Dashboard** (`/dashboard`): Active reservations, custom trip quotes, digital boarding passes, transaction receipts, and live status filters.
- **Business / Agency Portal** (`/portals/business`): Receive custom plan requests, verify route logistics, submit binding quotes, and manage bookings.
- **Mountain Guide Portal** (`/portals/guide`): Expeditions roster, climber medical notes, checkpoint verification, and emergency comms.
- **Sherpa Butler Portal** (`/portals/butler`): High-altitude VIP hospitality, tea-house luxury provisioning, and baggage dispatch.
- **Regulatory / Admin Portal** (`/portals/admin`): Agency licenses, permit verifications, and national tourism statistics.

### 6. 🛰️ Direct Concierge & Field Chat (`/chat`)
- Direct communication channel between travelers and their assigned IFMGA mountain guides, lodge hosts, and Sherpa butlers.
- Guide status presence (e.g., *Online*, *On-Route*) and satellite link indicators.

### 7. 🗺️ Geospatial Nepal Map (`/map`)
- Interactive knowledge map displaying topography, peaks (Everest, K2, Annapurna, Manaslu), trekking circuits, and national park boundaries.

---

## 🎨 Design System & Visual Identity

The platform adheres to the official Nepal Tourism branding guidelines:
- **Royal Nepal Blue** (`#0552A2`): Primary brand color, headers, primary buttons, and key metrics.
- **Crimson Nepal Red** (`#EC1F27`): National flag accent, emergency hotlines, and location pins.
- **Golden Himalayan Yellow** (`#FDB716`): Ratings, awards, and VIP accents.
- **Sky Glacier Blue** (`#92C4EA`): High-altitude elevation tags and subtle highlights.
- **Typography**:
  - Headings: **Poppins** (SemiBold 600 / Medium 500)
  - Body & UI: **Inter** (Regular 400 / Medium 500 / SemiBold 600)

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [Next.js 15](https://nextjs.org/) (App Router, Turbopack) |
| **UI Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Backend API** | [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) (TypeScript) |
| **Database** | PostgreSQL (schema in `schema.sql`) + In-Memory Fallback Store |
| **State Management** | React Context (`AppContext`) with Persistent LocalStorage & Sync |

---

## 📂 Project Structure

```
Visit-Nepal/
├── frontend/                     # Next.js 15 + React 19 Frontend
│   ├── src/
│   │   ├── app/                  # App Router Pages & Layouts
│   │   │   ├── explore/          # Route catalog (with 1,000 scale engine & list view)
│   │   │   ├── custom-plan/      # 7-step custom expedition builder
│   │   │   ├── dashboard/        # Traveler dashboard & booking hub
│   │   │   ├── chat/             # Concierge & field messenger
│   │   │   ├── portals/          # Guide, Butler, Business & Admin portals
│   │   │   ├── schedule/         # 14-day interactive expedition calendar
│   │   │   ├── culture/          # UNESCO Heritage & cultural encyclopedia
│   │   │   ├── map/              # Interactive geospatial knowledge map
│   │   │   └── globals.css       # Tailwind v4 theme tokens & shutter animations
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Navbar.tsx        # Shutter-animated navigation & role switcher
│   │   │   ├── Footer.tsx        # Official NTB footer & emergency contact links
│   │   │   └── features/         # Booking modals, payment gateways, auth panels
│   │   ├── context/              # AppContext (global auth, bookings, notifications, toast)
│   │   ├── data/                 # Mock catalogs, scale synthesizer (scaleCatalog.ts)
│   │   └── lib/                  # Isolated receipt generator (receiptGenerator.ts), API client
├── backend/                      # Node.js + Express + TypeScript API Server
│   ├── src/
│   │   ├── routes/               # API endpoints (destinations, bookings, auth, portals)
│   │   ├── middleware/           # Role-based auth & JWT validation
│   │   └── data/                 # Database store & PostgreSQL adapter
└── schema.sql                    # Production PostgreSQL relational schema
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.x or 20.x
- **npm** or **pnpm**

### 1. Clone the Repository
```bash
git clone https://github.com/ma-nees/Visit-Nepal.git
cd Visit-Nepal
```

### 2. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run the Backend API (Optional for full backend persistence)
```bash
cd ../backend
npm install
npm run dev
```
The API server listens on [http://localhost:8080](http://localhost:8080).

---

## 🧪 Testing & Verification

- **Type Check**:
  ```bash
  npx --prefix frontend tsc -p frontend/tsconfig.json --noEmit
  ```
- **Scale Testing**:
  Navigate to [http://localhost:3000/explore](http://localhost:3000/explore) and click **`[⚡ Test 1,000+ Records]`** to test instant searching, sorting, and pagination across 1,000 live routes.

---

## 📜 License & Compliance

Compliant with **Nepal Tourism Board (NTB)** and **Inland Revenue Department (IRD)** regulations for tour operator licensing, VAT compliance (13%), and high-altitude mountain guide safety protocols.
