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

[Visual Tour & Screenshots](#-visual-showcase--functional-architecture-tour) • [Explore Features](#key-features) • [Architecture](#architecture--governance-pipeline) • [Getting Started](#getting-started) • [How Aria Works](#how-aria-works) • [Seller Hub](#seller-hub--store-health)

</div>

---

## 📸 Visual Showcase & Functional Architecture Tour

Explore the two-sided agentic commerce ecosystem in action. Cairn enforces strict, deterministic governance across both the **Buyer Experience** (where autonomous shopping agent Aria serves consumer intent within client-signed rules) and the **Merchant Experience** (where artisan makers manage inventory, smart escrow, and anti-arbitrage catalog integrity).

---

### 🛍️ Part 1: Buyer-Side Experience (Aria & Mindful Commerce)

#### 1. Explore & Natural-Language Intent Hero ("Ask Aria")
![Explore Screen & Natural-Language Intent Hero](screenshot_of_app/Screenshot%202026-10-30%20084938.png)
- **Screen**: `Screen1_Home.jsx` (Customer Explore)
- **Core Functionality**: The primary conversational shopping entry point. Shoppers can state their intent in natural language (voice or text), e.g., *"Find me a quiet study laptop under ₹60,000"*, *"Linen sheets for guest room"*, or trigger academic governance test scenarios (`Auto-Execute`, `Needs OK`, `Block Policy`).
- **Governance Role**: Aria acts strictly as an **intent parser**, quarantined from direct financial tools. The hero integrates live hyper-local micro-hub delivery estimates and active governance safeguards.

#### 2. Intent-Led Curations ("Picked for You")
![Intent-Led Curations](screenshot_of_app/Screenshot%202026-10-29%20003731.png)
- **Screen**: `Screen1_Home.jsx` (Curated Picks)
- **Core Functionality**: Dynamic product discovery pre-filtered against the shopper's hardware longevity rules and weekly pantry allowances. Displays authentic artisan products with explicit match rationales and pre-audited budget badges.
- **Zero Dark Patterns**: No algorithmic auctions, no sponsored priority tags, and no artificial urgency countdowns.

#### 3. High-Value Order Verification Holding Buffer ("Needs my OK")
![Needs my OK Screen](screenshot_of_app/Screenshot%202026-10-30%20084953.png)
- **Screen**: `Screen3_NeedsOK.jsx`
- **Core Functionality**: When a purchase proposal exceeds the shopper's autonomous auto-execution limit (e.g., Dell XPS 13 Plus at ₹1,20,000 > ₹1,00,000 threshold), the transaction is suspended in a safe 15-minute peace-of-mind buffer.
- **Governance Role**: Requires explicit human authorization before payment execution. Displays full hardware specifications, order intent metadata, and the 3-stamp pre-execution verification ledger (Budget Approved, Needs Confirmation, Authentic Flagship OEM). Shoppers can authorize or cancel with one tap.

#### 4. Deterministic Spending Ceiling Guardrail ("Not Placed")
![Not Placed Guardrail Screen](screenshot_of_app/Screenshot%202026-10-30%20085002.png)
- **Screen**: `Screen4_NotPlaced.jsx`
- **Core Functionality**: Enforces absolute budget ceilings. When an order proposal violates the monthly spending cap (e.g., MacBook Air M2 at ₹75,000 > ₹50,000 cap), the transaction is paused pre-emptively with **zero funds debited**.
- **Transparency & Remediation**: Shows the exact limit delta (+₹25,000 overrun prevented), explains the triggered rule, and presents zero-sacrifice within-budget alternatives curated for the shopper.

#### 5. Deterministic Acquisition Sanctuary & Cryptographic Ledger ("Orders")
![Order Sanctuary & Trust Receipts](screenshot_of_app/Screenshot%202026-10-30%20085011.png)
- **Screen**: `Screen5_Orders.jsx`
- **Core Functionality**: Comprehensive order management ledger categorizing acquisitions into *All*, *Needs my OK*, *Placed*, and *Not Placed*.
- **Governance Role**: Every placed order features a live status badge, settlement confirmation, and a link to view the complete immutable **Trust Receipt** backed by client-verifiable SHA-256 cryptographic digests.

#### 6. Personal Safeguards & Live Rule Simulator ("My Rules")
![Personal Safeguards & Live Rule Simulator](screenshot_of_app/Screenshot%202026-10-30%20085027.png)
- **Screen**: `Screen6_Rules.jsx`
- **Core Functionality**: Shopper-controlled deterministic guardrail configuration center:
  - **Guardrail 01**: Monthly Spending Cap slider (₹10,000 to ₹2,00,000) with real-time headroom calculation.
  - **Guardrail 02**: Autonomous Single-Purchase Threshold presets (Conservative ₹25k, Balanced ₹100k, Relaxed ₹150k).
  - **Guardrail 03**: 15-minute Tranquility Window toggle.
- **Interactive Sandbox**: Features a real-time **Live Rule Simulator** to test hypothetical purchases across Scenarios A, B, and C against client-signed code contracts.

#### 7. Governance Architecture & Trust Explainer ("How Aria Works")
![How Cairn Keeps You Safe](screenshot_of_app/Screenshot%202026-10-30%20085037.png)
- **Screen**: `Screen9_HowAriaWorks.jsx`
- **Core Functionality**: Interactive educational and technical audit walkthrough demonstrating how Cairn safeguards shoppers through 4 deterministic phases:
  1. *You Express Intent* (Natural language parsing)
  2. *Aria Audits Your Rules* (Deterministic rule evaluation)
  3. *The Trust Receipt is Minted* (3-stamp immutable verification)
  4. *15-Minute Tranquility Hold* (Cancellation safety window)
- **Dual Mode**: Toggle between *Simple Narrative Mode* for consumers and *Deep Architecture Audit* for engineers.

#### 8. Active Curation Bag & Zero-Overrun Drawer
![Active Curation Bag](screenshot_of_app/Screenshot%202026-10-30%20085050.png)
- **Component**: `CartDrawer.jsx`
- **Core Functionality**: Slide-out cart drawer displaying live item statuses (Hold Active, Settled, Paused). Enforces the zero-overrun guarantee and transparent price breakdowns with zero hidden fees. Includes identity management and quick role switching.

#### 9. Live Micro-Hub Delivery Calibration
![Live Delivery Location Modal](screenshot_of_app/Screenshot%202026-10-30%20085103.png)
- **Component**: `LocationModal.jsx`
- **Core Functionality**: Calibrates artisan proximity and enables hyper-local 15-minute micro-hub dispatch across verified fulfillment nodes (Bengaluru, New Delhi, Mumbai, Hyderabad, San Francisco, London) using simulated satellite lock or manual area selection.

#### 10. Buyer Portal Sign-In & Onboarding
![Buyer Portal Welcome](screenshot_of_app/Screenshot%202026-10-29%20013147.png)
- **Screen**: `BuyerLoginPage.jsx`
- **Core Functionality**: Dedicated consumer authentication portal with Google OAuth 2.0 PKCE, instant 1-click Demo Account, or Guest exploration, maintaining isolated buyer session state.

---

### 🏪 Part 2: Merchant-Side Experience (Artisan Studio & Escrow Vault)

#### 11. Role Selection Gateway
![Role Selection Gateway](screenshot_of_app/Screenshot%202026-10-30%20085112.png)
- **Screen**: `LandingPage.jsx`
- **Core Functionality**: Central platform gateway enforcing clean architectural separation between consumer shopping (*Shop as Buyer*) and artisan business administration (*Sell as Merchant*).

#### 12. Merchant Studio Authentication
![Merchant Studio Sign-In](screenshot_of_app/Screenshot%202026-10-30%20085121.png)
- **Screen**: `MerchantLoginPage.jsx`
- **Core Functionality**: Secure Google Workspace OAuth 2.0 gateway for independent makers and verified craft studios, highlighting network metrics (2,400+ active makers, ₹84K average monthly revenue, 18K+ verified artisan products).

#### 13. Seller Integrity Hub & Anti-Arbitrage Engine
![Seller Integrity Hub](screenshot_of_app/Screenshot%202026-10-30%20085143.png)
- **Screen**: `Screen7_SellerHub.jsx`
- **Core Functionality**: Maker sanctuary operating with zero advertising auctions and 0.00% chargeback rates. Demonstrates the **Catalog Enforcement Engine**'s three deterministic verification outcomes:
  - 🟢 **Approved & Published**: Authentic OEM partner credentials verified with zero intermediary markups.
  - 🔴 **Rejected · Ownership Conflict**: Dropshipping arbitrage and duplicate listings blocked automatically.
  - 🟡 **Needs Human Review**: Dynamic surge pricing (+18% above 30-day baseline) flagged for manual escrow review.

#### 14. Verified Artisan Inventory Management
![Verified Artisan Inventory](screenshot_of_app/Screenshot%202026-10-30%20085155.png)
- **Screen**: `Screen7_SellerHub.jsx` (Inventory Table)
- **Core Functionality**: Live stock ledger tracking SKU batches, real-time stock units, base pricing, Cairn Audit status (Verified & Active vs. Restock Scheduled), and direct links to cryptographic ledger proofs.

#### 15. Store Health & Telemetry Scoring Sanctuary
![Store Health & Telemetry](screenshot_of_app/Screenshot%202026-10-30%20085206.png)
- **Screen**: `Screen8_StoreHealth.jsx`
- **Core Functionality**: Evaluates merchant operations across the Three Pillars of Store Health:
  - **Authority (99.8%)**: 100% compliance with delegated buyer caps; zero hallucination rate; unauthorized prompt injection halts.
  - **Routing (100%)**: Direct-from-source manufacturer verification; 0 unverified dropshipping nodes.
  - **Traceability (100%)**: 100% valid SHA-256 receipt integrity audits and 15-minute tranquility cancellation honoring.
- **Audit Log**: Live stream of recent pre-execution audit checks synced with AES-256 enclaves.

#### 16. Buyer Orders & Smart Escrow Vault
![Buyer Orders & Escrow Vault](screenshot_of_app/Screenshot%202026-10-30%20085216.png)
- **Screen**: `SellerOrderView.jsx`
- **Core Functionality**: Manages incoming buyer orders locked in smart escrow (e.g., ₹21,550 in vault with 0.00% chargebacks).
- **Fulfillment States**:
  - *In Tranquility Window*: Active 15-minute cancellation window with live timer.
  - *Ready for Dispatch*: Escrow released, enables 1-click **"Dispatch Now"** courier handover.
  - *Settled to Bank*: Direct ledger settlement into merchant HDFC bank account.

#### 17. Publish Artisan Listing Modal
![Publish Artisan Listing Modal](screenshot_of_app/Screenshot%202026-10-30%20085226.png)
- **Component**: `AddListingModal.jsx`
- **Core Functionality**: Verified submission form allowing artisans to enter product titles, craft materials, studio identity, fair MSRP pricing, and available units before running the Cairn origin & escrow verification engine.

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
