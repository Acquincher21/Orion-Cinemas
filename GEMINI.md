# Project Rules & Specifications: ITL303 Web Animation

## Technical & System Scope
- **Architecture**: Strictly Frontend-Only (HTML5, CSS3, JavaScript / TypeScript, and standard web animation/canvas frameworks).
- **Domain Selection**: Industrial or commercial application (e.g., Enterprise Resource Planning, SaaS Analytics Dashboard, Logistics Tracking, E-Commerce Management, Health Tech Portal).
- **Cross-Subject Integration**: Existing logic or structure from Web Development or OOP projects is allowed, provided the UI is elevated with complete animation choreographies, vector badges, state transitions, and responsive graphics.

## Required Main Pages & Key Components
The system must present a seamless flow between the following four core pages:

1. **Landing Page (`index.html`)**
   - High-impact hero section with smooth scroll transitions or animated vectors.
   - Animated feature overview cards, commercial badges, and dynamic call-to-action (CTA) buttons.

2. **Registration Page (`register.html`)**
   - Multi-step or single-page form with interactive field validations (e.g., error shake effects, success checkmark micro-animations).
   - Dynamic feedback elements (e.g., password strength meters, interactive terms modal).

3. **Login Page (`login.html`)**
   - Interactive login panel with dynamic focus/hover transformations.
   - Animated visual branding, security emblems, or animated badges.

4. **Dashboard Page (`dashboard.html`)**
   - Interactive data presentation using dynamic charts, widget panels, or HTML Canvas elements.
   - Animated numerical counters, status glyphs, live activity feeds, and interactive navigation sidebar/topbar.

## Animation & Visual Requirements
- **Transforms & Transitions**: Extensive use of 2D/3D CSS transformations (translate, scale, rotate, matrix) for hover, active, and focus states.
- **Keyframe Animations**: Custom CSS `@keyframes` orchestrations for page entry, skeletal loading screens, modal transitions, and dynamic feedback.
- **SVG & Vector Graphics**: Incorporation of animated Scalable Vector Graphics (SVG) for logos, UI badges, status emblems, and system glyphs.
- **Canvas / Interactive Graphics**: Integration of HTML Canvas elements or interactive rendering scripts for dynamic user feedback or visual analytics.
- **Micro-interactions & Choreography**: Staggered element arrivals, smooth state transitions without hard cuts, and accessible timing functions.

## Recommended Project Folder Structure
```text
project-root/
│
├── index.html                 # Landing Page
├── login.html                 # Login Page
├── register.html              # Registration Page
├── dashboard.html             # Dashboard Page
│
├── assets/
│   ├── css/
│   │   ├── main.css           # Core styling and variables
│   │   ├── animations.css     # Keyframes and animation rules
│   │   └── components.css     # Buttons, badges, forms, cards
│   ├── js/
│   │   ├── app.js             # Global interaction & routing logic
│   │   ├── animation.js       # Canvas/SVG animation triggers
│   │   └── validation.js      # Form animations and error handling
│   ├── images/
│   │   ├── vectors/           # Custom SVG emblems, glyphs, and icons
│   │   └── graphics/          # Static and animated UI assets
│   └── fonts/                 # Custom web typography
│
└── README.md                  # Project overview, system domain, and features
```

## Assessment Criteria & Rubric Summary (ITL303)
| Evaluation Area | Focus & Deliverable Standard |
| :--- | :--- |
| **Demonstration of Concepts** | Effective mastery of CSS Transforms/Transitions, SVG animation, and HTML Canvas techniques. |
| **Technical Accuracy** | Bug-free execution of interactive UI states, properly linked assets, and proper frontend architecture. |
| **UI/UX & Animation Quality** | Realism of the commercial/industrial system, smooth 60fps animations, polished micro-interactions, and visual hierarchy. |
| **Completeness & Structure** | Full presence of all 4 main pages, adherence to proper folder organization, and inclusion of required emblems/glyphs/badges. |

