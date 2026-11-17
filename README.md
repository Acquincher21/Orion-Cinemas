# OrionCinemas

## Project Overview

OrionCinemas is a frontend-only, industrial-grade cinema booking platform built for the ITL303 Web Animation course (Endterm CLE). The application demonstrates advanced animation choreography, interactive state management, and responsive design patterns in a commercial cinema reservation system. All functionality is client-side only with no backend dependencies.

## System Domain

**Domain**: E-commerce / Entertainment (Cinema Reservation System)  
**Application Type**: Commercial SaaS booking platform  
**Use Case**: Online cinema ticket reservation and member booking management  
**Architecture**: Frontend-only (HTML5, CSS3, JavaScript ES6+) with browser-based local storage

## Features

### Core Functionality
- **Landing Page**: High-impact hero section with animated canvas background, 3D movie cards, and smooth scroll transitions
- **User Authentication**: Sign-in and registration flows with animated form validation and password strength feedback
- **Multi-Step Booking**: Film selection → Date selection → Showtime selection → Seat reservation → Checkout
- **Member Dashboard**: Personalized booking overview, activity tracking, booking history, and now-showing carousel
- **Responsive Design**: Mobile-first layout with touch-friendly interactions and adaptive navigation

### Animation & Visual Effects
- **Canvas-based Graphics**: Particle effects and hero animations using HTML5 Canvas
- **3D Transforms**: Movie card hover effects with poster transitions and depth effects
- **Choreographed Transitions**: Staggered scroll reveals, page transitions with branded loading states
- **State Animations**: Form validation feedback, seat selection states, counter animations
- **Accessibility**: Reduced-motion support with `prefers-reduced-motion` media queries

### Technical Highlights
- **Interactive Elements**: Animated form fields, toggleable password visibility, animated error/success states
- **Scroll-driven Effects**: Progressive content reveals, parallax backgrounds, scroll progress tracking
- **Dynamic Interactions**: Date picker, seat map, booking progress indicators, modal dialogs
- **Performance**: 60fps CSS animations, optimized canvas rendering, lazy-loaded images

## How to Run or Access the Project

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+) with ES6+ and HTML5 Canvas support

### Running Instructions

1. **Clone or download** the project repository to your local machine
2. **Navigate** to the project directory: `C:\zSchoolWorks\Web Animation\CLE`
3. **Open** `index.html` in your web browser (double-click or right-click → Open with Browser)
4. **Explore the site** using the main navigation or hero CTA buttons

### Demo Account Access

To experience the full booking flow without creating an account:
- **Email**: `juanderful@gmail.com`
- **Password**: `Juan123*`

Or create a new account via the registration page.

### Data Storage

All account and booking data are stored locally in the browser using `localStorage`. This project does not provide:
- Secure authentication or password encryption
- Payment processing integration
- Live cinema inventory management
- Backend data persistence

**Note**: Data persists only within the same browser and is cleared if browser storage is manually cleared.

## Getting Started Guide (Step-by-Step)

### Option 1: Using the Demo Account (Quickest Way)

1. **Open the Landing Page**
   - Launch `index.html` in your browser
   - You'll see the animated hero section with the OrionCinemas branding

2. **Navigate to Login**
   - Click the **"Login"** button in the top-right navigation bar
   - Or click **"Book Tickets Now"** CTA button (redirects to login)

3. **Enter Demo Credentials**
   - **Email**: `juanderful@gmail.com`
   - **Password**: `Juan123*`
   - Click **"Sign In"**
   - Wait for the animated loading state to complete

4. **Explore the Dashboard**
   - You'll see your personalized booking dashboard
   - View your booking history in the "Bookings" section
   - Browse the "Now Showing" carousel to see upcoming films

5. **Make a New Booking**
   - Click the **"Book Tickets"** button on your dashboard
   - **Step 1**: Select a film from the grid
   - **Step 2**: Pick a date from the interactive calendar
   - **Step 3**: Choose a showtime
   - **Step 4**: Select your seats on the animated seat map
   - **Step 5**: Review booking summary and confirm checkout

6. **Log Out**
   - Click the **"Log out"** link in the sidebar to return to the landing page

### Option 2: Create a New Account

1. **Navigate to Registration**
   - From the landing page, click **"Sign Up"** in the top-right
   - Or click **"Create Account"** on the login page

2. **Fill in Registration Form**
   - Enter your first name, middle name (optional), last name
   - Provide your email address
   - Create a password (you'll see real-time strength feedback)
   - Confirm your password
   - Accept terms & conditions (interactive modal)
   - Click **"Create Account"**

3. **Automatic Login**
   - After successful registration, you're automatically logged in
   - You'll be redirected to your dashboard
   - Start booking tickets immediately

### Navigation Map

```
Landing Page (index.html)
├─ Click "Login" or "Book Tickets Now" → Login Page (login.html)
│  ├─ Enter credentials → Dashboard (dashboard.html)
│  └─ Click "Sign Up" → Registration (register.html)
│
├─ Click "Sign Up" → Registration Page (register.html)
│  └─ Create account → Dashboard (dashboard.html)
│
├─ Scroll and browse → Movie Cards → Click to view details
│
└─ Click "Book Tickets" (from dashboard) → Booking Page (booking.html)
   └─ Complete multi-step flow → Confirmation
```

### Key Features to Try

- **Animated Scroll**: Scroll through the landing page to see progressive content reveals
- **Movie Card 3D Effects**: Hover over movie posters to see depth transformations
- **Form Validations**: Try entering invalid data in registration/login forms to see animated error feedback
- **Password Strength**: Watch the password strength meter update as you type
- **Seat Selection**: Click individual seats to toggle selection (visual feedback with animations)
- **Activity Counter**: Watch numbers animate on the dashboard activity section
- **Responsive Design**: Resize your browser or view on mobile to see adaptive layout

### Troubleshooting

| Issue | Solution |
|-------|----------|
| "Login failed" | Verify email and password are correct. Try the demo credentials first. |
| Data not persisting | Check browser localStorage settings. Clearing cache will erase account data. |
| Animations not smooth | Ensure your browser supports ES6+ and HTML5 Canvas. Try a different browser or disable other tabs. |
| Can't proceed past a step | Ensure all required form fields are filled correctly (red border indicates errors). |
| Mobile layout issues | Try a modern mobile browser (Chrome, Safari, Firefox). Clear cache if styles look broken. |

## Pages and Features

### `index.html` – Landing Page
- Animated hero section with branded canvas animation and particle effects
- Animated hero title with staggered reveal transitions
- Badge system highlighting features (Dolby Surround, Digital Projection)
- Now Showing movie grid with 3D card effects, poster transitions, and hover states
- Animated scroll reveals for progressive content loading
- Dynamic call-to-action buttons with pulse animations
- Smooth navigation bar with brand logo and VIP sign-up button

### `register.html` – Account Registration
- Multi-field form with inline validation and animated error states
- Password strength meter with visual feedback
- Form field focus/blur animations with icon transitions
- Interactive terms & conditions modal
- Particle canvas background for visual appeal
- Animated success/error feedback
- Mobile-responsive single-column layout

### `login.html` – User Authentication
- Interactive login panel with focus/hover transformations
- Animated loading state with progress bar
- Remember me checkbox with toggle animation
- Brand logo and security emblems
- Particle canvas background effects
- Page transition overlay with branded messaging
- Quick navigation to registration

### `booking.html` – Ticket Booking
- Multi-step booking progress indicator (Film → Date → Showtime)
- Film selection grid with movie cards and ratings
- Interactive calendar for date selection
- Showtime selection with available seats indicator
- Animated seat map with occupied/available/selected states
- Booking summary panel with price calculations
- Demo checkout flow with order confirmation
- Responsive design for mobile seat selection

### `dashboard.html` – Member Dashboard
- Personalized welcome section with member initials badge
- Sidebar navigation with account sections (Overview, Now Showing, Bookings)
- Scroll progress indicator tracking page position
- Real-time activity counter animations
- Now-showing carousel with featured movies
- Booking history and tracking table
- Quick actions (Book Tickets, Logout) with smooth transitions
- Responsive sidebar that collapses on mobile

## Project Structure

```
assets/
├── css/
│   ├── main.css              # Core layout, typography, and responsive utilities
│   ├── animations.css         # Global keyframe animations and transitions
│   ├── components.css         # Reusable component styles (buttons, cards, badges)
│   ├── page-transition.css    # Page loading transitions and overlay effects
│   ├── login.css              # Login page specific styles
│   ├── register.css           # Registration page specific styles
│   ├── booking.css            # Booking flow and seat map styles
│   └── dashboard.css          # Dashboard layout and sidebar styles
├── js/
│   ├── app.js                 # Landing page initialization and hero canvas
│   ├── animation.js           # Reusable animation utilities and scroll reveals
│   ├── movie-transition.js    # 3D card effects and poster hover transitions
│   ├── page-transition.js     # Page load transitions and navigation handling
│   ├── login.js               # Login form logic and authentication flow
│   ├── register.js            # Registration form and validation logic
│   ├── booking.js             # Booking flow state management and seat selection
│   ├── dashboard.js           # Dashboard interactions and scroll progress
│   └── validation.js          # Form validation, password strength, and error handling
└── images/
    ├── graphics/              # Movie posters and raster graphics (19 posters)
    └── vectors/               # SVG icons and logos (18 vector graphics)
        ├── orion-logo.svg     # Main brand logo with glow/pulse effects
        ├── cinema-badge.svg   # Feature badge (Dolby, Digital Projection)
        ├── film-icon.svg      # Film/movie icon
        ├── user-icon.svg      # User profile icon
        ├── lock-icon.svg      # Security/password icon
        └── [14 additional vectors for calendar, seat, booking, etc.]
```

## Technical Stack

- **Frontend**: HTML5, CSS3 (Flexbox, Grid, 3D Transforms), JavaScript (ES6+)
- **Animation**: CSS Keyframes, CSS Transitions, HTML5 Canvas
- **Storage**: Browser localStorage for account/booking persistence
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation, prefers-reduced-motion support
- **Performance**: Lazy-loaded images, optimized canvas rendering, CSS animations for 60fps motion

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Demo Data

The project includes 20 pre-configured movie posters spanning multiple genres:
- Action: Avengers, Gipsy Danger, Dr. Doom, Secret Wars
- Adventure: The Odyssey, Agamemnon, Project Hail Mary
- Comedy: Minions, Toy Story, Rocky
- Horror: Resident Evil, A Quiet Place Part III
- Sci-Fi: Star Wars, Sonic 4, Kaiju, Pacific Rim
- Other: A Minecraft Movie, Boiling Point

## Notes for Developers

- All SVGs are stored as separate files in `assets/images/vectors/` for modularity and reusability
- Animation timings respect `prefers-reduced-motion` media queries for accessibility
- Form validation is client-side only; real production would require server-side validation
- Booking data persists via localStorage but is not synced to any backend
- Page transitions use CSS transitions and custom overlay effects for branded user experience
