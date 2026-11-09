# Project Guidelines

For future code additions, follow the ITL303 Web Animation project requirements:

## Technical and System Scope

- Keep the architecture strictly frontend-only: HTML5, CSS3, JavaScript/TypeScript, and standard web animation or canvas frameworks. Do not add a backend.
- Use an industrial or commercial application domain (for example, ERP, SaaS analytics, logistics, e-commerce management, or health tech).
- Existing Web Development or OOP logic may be reused, but elevate the UI with animation choreography, vector badges, state transitions, and responsive graphics.

## Core Pages and Flow

Maintain a seamless flow between these pages:

- `index.html`: high-impact hero with smooth-scroll transitions or animated vectors, animated feature cards, commercial badges, and dynamic calls to action.
- `register.html`: single- or multi-step registration with interactive validation, animated error/success feedback, password strength feedback, and an interactive terms modal.
- `login.html`: interactive login panel with focus/hover transformations, animated branding, and security emblems or badges.
- `dashboard.html`: interactive charts, widgets, or canvas graphics; animated counters, status glyphs, a live activity feed, and interactive navigation.

## Animation and Visual Requirements

- Use CSS 2D/3D transforms and transitions for hover, active, and focus states.
- Create purposeful keyframe choreography for page entry, loading skeletons, modal transitions, and dynamic feedback.
- Use animated SVG for logos, badges, status emblems, and system glyphs.
- Store every SVG as a standalone file under `assets/images/vectors/` and reference it by path; do not embed SVG markup inline in HTML, CSS, or JavaScript.
- Use HTML Canvas or interactive rendering for visual analytics or user feedback where appropriate.
- Stagger arrivals and make state changes smooth; use accessible timing and respect reduced-motion preferences.
- Keep animations performant and responsive, with a polished visual hierarchy and no abrupt state cuts.

## Structure and Quality

- Organize new work in a clean, scalable structure, following existing repository conventions. Prefer shared assets under `assets/css/` (core, animation, and component styles), `assets/js/` (app, animation, and validation logic), and `assets/images/` (vectors and graphics), with fonts under `assets/fonts/` when needed.
- Keep all four core pages, their assets, and navigation correctly linked.
- Prioritize bug-free interactions, responsive presentation, animation quality, and clear commercial realism.
