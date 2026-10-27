# Cairn · Agentic Governance E-Commerce

<div align="center">

```
  ____      _              
 / ___|__ _(_)_ __ _ __    
| |   / _` | | '__| '_ \   · Mindful Shopping with Aria
| |__| (_| | | |  | | | |  · Deterministic AI Safeguards
 \____\__,_|_|_|  |_| |_|  · Zero Dark Patterns
```

**A calm, human-centric agentic e-commerce platform where AI shopping delegation is strictly governed by deterministic rules, cryptographic verification, and human-in-the-loop safeguards.**

[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Oxlint](https://img.shields.io/badge/Linter-Oxlint-orange?style=flat)](https://oxc.rs/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=flat)](LICENSE)
[![Zero Dark Patterns](https://img.shields.io/badge/UX-Zero_Dark_Patterns-2D5A27?style=flat)](https://github.com/Mohnish-140605/agentic_governance_ecommerce)

[Explore Features](#key-features) • [Architecture](#architecture--governance-pipeline) • [Getting Started](#getting-started) • [How Aria Works](#how-aria-works) • [Seller Hub](#seller-hub--store-health)

</div>

---

## 🌿 The Vision

As artificial intelligence shifts from informational chatbots to autonomous transaction agents, the risk of runaway spending, deceptive pricing, dropshipping arbitrage, and dark UX patterns grows exponentially. 

**Cairn** reimagines e-commerce for the agentic era through **Agentic Governance**:
- **Delegation with Confidence**: You empower **Aria** (your personal shopping agent) to source and order products, but Aria's autonomy is strictly bounded by hard, client-signed deterministic constraints.
- **Natural Language Intent, Deterministic Execution**: While LLMs excel at understanding conversational intent, they are forbidden from initiating financial settlements directly.
- **The Trust Receipt**: Every purchase generates a tangible, 3-stamp cryptographic receipt backed by a client-verifiable SHA-256 hash.
- **Zero Dark Patterns**: No fake countdown timers, no artificial urgency, no surprise markups, and no algorithmic traps.

---

## 🏛️ Core Pillars of Agentic Governance

```
                                  USER INTENT
                     "Find me a quiet study laptop < ₹60k"
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │   Aria (Intent Parser Only)   │
                       │   Quarantined from Settlement │
                       └───────────────┬───────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │   DETERMINISTIC RULE ENGINE   │
                       │  • Monthly Spending Cap       │
                       │  • Single-Order Limit         │
                       │  • Verified OEM Whitelist     │
                       └───────────────┬───────────────┘
                                       │
               ┌───────────────────────┴───────────────────────┐
               │                                               │
        [Within Rules]                                  [Rule Triggered]
               ▼                                               ▼
   ┌───────────────────────┐                       ┌───────────────────────┐
   │     TRUST RECEIPT     │                       │    SAFE HOLD BUFFER   │
   │  ✓ Within Budget      │                       │  • Needs-OK Approval  │
   │  ✓ Approval Cleared   │                       │  • Alternative Suggest│
   │  ✓ Verified Merchant  │                       │  • Biometric Override │
   │  SHA-256 State Hash   │                       └───────────────────────┘
   └───────────┬───────────┘
               │
               ▼
   ┌───────────────────────┐
   │ 15-MIN TRANQUILITY    │ ──[ 1-Click Cancel ]──► Instant Reserve Release
   │        HOLD           │
   └───────────┬───────────┘
               │ (Timer expires)
               ▼
      DIRECT OEM FULFILLMENT
```

### 1. Quarantined Intent Parsing
Aria parses natural language queries (voice or text), extracts specifications, searches verified listings, and formats recommendations. However, the AI model has **zero access** to payment credentials or direct settlement APIs.

### 2. Deterministic Safeguard Engine
Client-signed budget contracts are evaluated locally in code:
- **Monthly Spending Ceiling**: Real-time tracking against budget caps.
- **Single-Order Auto-Approval Threshold**: Orders above the threshold automatically transition into a `Needs-OK` state requiring explicit human authorization.
- **Out-of-Budget Policy**: Customizable behavior (suggest curated alternatives vs. notify-only).

### 3. The 3-Stamp Trust Receipt
Every transaction produces a boarding-pass-style **Trust Receipt** displaying three immutable verification stamps:
- 🟢 **Budget Stamp**: Verifies transaction falls within monthly allowance.
- 🟢 **Approval Stamp**: Verifies order is within pre-authorized single-item limits.
- 🟢 **Merchant Stamp**: Verifies the vendor is a certified OEM or artisan partner.
- 🔒 **Tamper-Evident SHA-256 Digest**: Computed across order attributes for delivery escrow.

### 4. 15-Minute Tranquility Hold
To eliminate buyer's remorse, orders enter a 15-minute tranquility pause with a live countdown timer before dispatch. A single click cancels the order and releases the funds with zero payment gateway cancellation penalties.

---

## ✨ Key Features

### 👤 Customer Experience

| Screen | Description |
|---|---|
| **Screen 1: Explore & Curations** | Serene, editorial marketplace featuring slow living goods, verified laptops, and pantry essentials. Includes voice/text prompt bar. |
| **Screen 2: Aria Chat** | Conversational shopping companion with rich interactive product cards, specification breakdowns, and instant rule checks. |
| **Screen 3: Needs-OK Approval** | High-value order verification holding buffer with live 15-minute countdown, biometric/one-click approval, and reason transparency. |
| **Screen 4: Not-Placed Handler** | Graceful rejection when an order exceeds user caps, accompanied by curated within-budget alternatives. |
| **Screen 5: Orders & Receipts** | Complete order history with expandable, high-fidelity **Trust Receipts** displaying SHA-256 checksums and real-time delivery tracking. |
| **Screen 6: Rules & Safeguards** | Interactive control center allowing users to adjust monthly caps, approval limits, tranquility duration, and test scenarios against mock purchases. |
| **Screen 9: How Aria Works** | Interactive dual-mode visualizer (Narrative vs. Technical Audit) breaking down the 4-step governance architecture. |

### 🏪 Merchant & Seller Governance

| Screen | Description |
|---|---|
| **Screen 7: Seller Hub** | Direct-to-consumer inventory manager with duplicate listing prevention, anti-arbitrage shields, and instant settlement escrow tracking. |
| **Screen 8: Store Health** | Telemetry scoring system evaluating store **Authority** (100% rule compliance), **Routing** (direct OEM sourcing), and **Traceability** (receipt validation). |

### 🛠️ Interactive Tooling

- **Command Palette (`⌘K` / `Ctrl+K`)**: Universal navigation modal across all customer screens, merchant tools, budget controls, and orders.
- **Google One Tap & OAuth Authentication**: Integrated Google Identity Services (GIS) with profile personalization, automatic avatar sync, and persistent sessions.
- **Live Location Selector**: Quick PIN code and neighborhood switcher for location-based delivery estimates.
- **Quick Order & Cart Drawer**: Transparent slide-out cart showing exact pricing breakdown with zero hidden fees.

---

## 💻 Tech Stack

- **Frontend Core**: [React 19](https://react.dev/) + [React DOM 19](https://react.dev/)
- **Build & Dev Tooling**: [Vite 8](https://vitejs.dev/) with Hot Module Replacement (HMR)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations & Delight**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Linter & Code Quality**: [Oxlint](https://oxc.rs/) (Rust-based high speed linter)
- **Styling Architecture**: Pure, highly maintainable CSS with modern CSS custom properties (`--font-serif: 'Fraunces'`, `--forest-green: #2D5A27`, `--bg-cream: #FBF7F0`).
- **Typography**: Google Fonts (*Fraunces* optical variable serif & *Inter* UI sans).

---

## 📁 Project Structure

```
agentic_governance_ecommerce/
├── public/                 # Static assets & favicons
├── src/
│   ├── assets/             # Curated product images & photography
│   ├── components/         # Reusable UI components & modals
│   │   ├── AddListingModal.jsx   # Seller catalog addition modal
│   │   ├── AskAriaFab.jsx        # Floating action trigger for Aria
│   │   ├── CairnLogo.jsx         # Custom SVG emblem & wordmark
│   │   ├── CartDrawer.jsx        # Slide-out zero-markup cart
│   │   ├── CommandPalette.jsx    # Universal ⌘K spotlight navigation
│   │   ├── Footer.jsx            # Mindful footer & navigation
│   │   ├── GoogleAuthModal.jsx   # Google Identity Services modal
│   │   ├── Header.jsx            # Top navigation bar & role switcher
│   │   ├── LocationModal.jsx     # Neighborhood & PIN code selector
│   │   ├── SellerOrderView.jsx   # Merchant order inspection view
│   │   ├── Toast.jsx             # Non-intrusive status notification
│   │   └── TrustReceipt.jsx      # Tangible 3-stamp verification receipt
│   ├── data/
│   │   ├── mockData.js           # Products, rules, orders, & audit scenarios
│   │   └── navigation.js         # Navigation links & popular locations
│   ├── portals/
│   │   └── CustomerPortal.jsx    # Consumer portal wrapper
│   ├── screens/                  # Application screens
│   │   ├── Screen1_Home.jsx          # Explore & Editorial Showcase
│   │   ├── Screen2_Chat.jsx          # Conversational Aria Shopping
│   │   ├── Screen3_NeedsOK.jsx       # High-Value Approval Buffer
│   │   ├── Screen4_NotPlaced.jsx     # Rule Breach & Alternatives
│   │   ├── Screen5_Orders.jsx        # Order History & Trust Receipts
│   │   ├── Screen6_Rules.jsx         # Deterministic Rules Engine & Sandbox
│   │   ├── Screen7_SellerHub.jsx     # Merchant Dashboard & Anti-Arbitrage
│   │   ├── Screen8_StoreHealth.jsx   # Ecosystem Health & Telemetry
│   │   └── Screen9_HowAriaWorks.jsx  # Governance Architecture Explainer
│   ├── App.css                   # Layout & animation classes
│   ├── App.jsx                   # Main application state & screen router
│   ├── index.css                 # Global design system & CSS variables
│   └── main.jsx                  # React 19 root mounting
├── index.html              # HTML entrypoint & Google Fonts
├── package.json            # Project manifest & dependencies
├── vite.config.js          # Vite configuration
└── .oxlintrc.json          # Oxlint configuration
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version `v18.0.0` or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Mohnish-140605/agentic_governance_ecommerce.git
   cd agentic_governance_ecommerce
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

### Build for Production

To create an optimized production build:
```bash
npm run build
```
The output will be placed in the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

### Linting

Run Oxlint to check code quality:
```bash
npm run lint
```

---

## 🔑 Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| <kbd>⌘</kbd> + <kbd>K</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd> | Open Command Palette |
| <kbd>Esc</kbd> | Dismiss any open modal / drawer |

---

## 🛡️ Design Principles

1. **Human Agency Above All**: AI proposes; code enforces; humans retain final decision rights.
2. **Deterministic Over Probabilistic**: Financial transactions and limit enforcements are governed by deterministic logic, never left to LLM probability.
3. **Calm Computing**: Soft parchment backgrounds (`#FBF7F0`), deep forest greens (`#2D5A27`), subtle terracotta accents, and zero high-stress popups.
4. **Transparent Provenance**: Direct OEM verification and verifiable SHA-256 receipts ensure you always know where an item originated and why it was cleared.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
