# OrionCinemas - Animation Types by Page

## index.html (Landing Page)

**Animation Types:**
- CSS Keyframes (pulsing, fade-in, slide-up)
- CSS Transitions (hover, focus states)
- Canvas API with requestAnimationFrame (particle network)
- Web Animations API (movie pagination)
- WebGL (poster displacement shader)
- IntersectionObserver + scroll reveals

**Classes Used:**
- `.scroll-reveal` - **Scroll-based reveal (IntersectionObserver)** – Elements marked for detection when entering viewport
- `.is-revealed` - **CSS Keyframes (Fade-in & Slide-up)** – Applied when scroll-reveal triggers, animates opacity and transform
- `.hero-pulse` - **CSS Keyframes (Pulsing)** – Continuous pulsing animation on logo using scale and opacity
- `.badge-glow` - **CSS Keyframes (Glow effect)** – Badge pulses with box-shadow and opacity keyframes
- `.movie-card` - **CSS Transitions + Keyframes (Hover state)** – Smooth opacity and transform on hover, details reveal with slide-up
- `.button-hover` - **CSS Transitions (State change)** – CTA button scales and color-shifts on hover using transition
- `.marquee-scroll` - **CSS Keyframes (Horizontal animation)** – Continuous horizontal scroll using transform translateX keyframes

---

## login.html (Sign-In Page)

**Animation Types:**
- CSS Keyframes (fade-in, slide-up)
- CSS Transitions (input focus, hover states)
- Canvas API with requestAnimationFrame (particle background)
- JavaScript-driven progress bar

**Classes Used:**
- `.login-card-animate` - **CSS Keyframes (Fade-in & Slide-up)** – Form card entrance with opacity and transform animation
- `.badge-pulse` - **CSS Keyframes (Pulsing)** – Security badge pulses using scale and opacity keyframes
- `.input-wrapper-focus` - **CSS Transitions (State change)** – Input wrapper scales on focus with smooth transition
- `.loading-progress` - **CSS Transitions (Width animation)** – Progress bar width animates smoothly as JavaScript updates value
- `.form-container` - **CSS Keyframes (Fade-in & Slide-up)** – Container fades and slides up on page load
- `.particle-canvas` - **Canvas API + requestAnimationFrame (Frame-by-frame)** – Particle background animated 60fps using canvas drawing

---

## register.html (Registration Page)

**Animation Types:**
- CSS Keyframes (fade-in, slide-up, shake, checkmark)
- CSS Transitions (input focus, hover states)
- Canvas API with requestAnimationFrame (particle background)
- Form validation feedback animations

**Classes Used:**
- `.register-card-animate` - **CSS Keyframes (Fade-in & Slide-up)** – Form card entrance with opacity and transform animation
- `.form-input` - **CSS Transitions (State change)** – Input fields transition on focus (outline, shadow, background)
- `.input-invalid` - **CSS Keyframes (Shake effect)** – Invalid fields shake using alternating transform translateX keyframes
- `.input-valid` - **CSS Keyframes (Checkmark entrance)** – Valid fields show animated checkmark with scale and fade-in keyframes
- `.password-strength-bar` - **CSS Transitions (Width & Color change)** – Bar width and background-color transition smoothly as strength updates
- `.terms-dialog-open` - **CSS Keyframes (Fade & Lift)** – Dialog fades in and lifts up using opacity and transform keyframes
- `.particle-canvas` - **Canvas API + requestAnimationFrame (Frame-by-frame)** – Particle background animated 60fps using canvas drawing

---

## booking.html (Booking Page)

**Animation Types:**
- CSS Keyframes (fade-in, slide-up, staggered entrances)
- CSS Transitions (hover, selected states)
- JavaScript-triggered animations

**Classes Used:**
- `.booking-section-animate` - **CSS Keyframes (Fade-in & Slide-up)** – Section entrance with staggered delay using opacity and transform
- `.calendar-animate` - **CSS Keyframes (Fade & Scale transition)** – Calendar month change fades and scales smoothly using transform
- `.showtime-row` - **CSS Keyframes (Staggered slide-up)** – Each showtime row slides up with animation-delay for sequential entrance
- `.seat-row` - **CSS Keyframes (Staggered slide-up)** – Each seat row slides up with increasing animation-delay for wave effect
- `.seat-button` - **CSS Transitions (State change)** – Seat button transitions on hover (scale, border-color, background) and when selected
- `.booking-summary` - **CSS Keyframes (Fade-in & Slide-up)** – Summary section entrance with staggered animation
- `.month-transition` - **CSS Keyframes (Fade & Scale)** – Calendar month change uses transform scale and opacity keyframes

---

## dashboard.html (Dashboard Page)

**Animation Types:**
- CSS Keyframes (fade-in, slide-up, wave effect, bar growth)
- CSS Transitions (hover, state changes)
- Canvas API with requestAnimationFrame (chart bars, particles)
- JavaScript-driven animations (pagination, carousel)

**Classes Used:**
- `.dashboard-entrance` - **CSS Keyframes (Fade-in & Slide-up)** – Welcome area and cards fade and slide up with staggered delays
- `.metric-card` - **CSS Keyframes (Staggered fade-in & Slide-up)** – Each metric card enters with animation-delay for sequential appearance
- `.chart-container` - **Canvas API + requestAnimationFrame (Frame-by-frame drawing)** – Bar chart bars grow into view frame-by-frame using canvas
- `.metric-word` - **CSS Keyframes (Wave effect on hover)** – Individual words lift with staggered animation-delay on parent hover for wave motion
- `.booking-card` - **CSS Keyframes (Staggered fade-in & Slide-up)** – Booking history cards enter with animation-delay for sequential appearance
- `.booking-card-slide` - **CSS Keyframes (Slide out & in)** – Old cards slide out left while new cards slide in from right using transform
- `.booking-tracking-expand` - **CSS Transitions + Keyframes (Expand & blur-to-sharp)** – Details expand smoothly and content fades from blur to sharp using filter transition
- `.carousel-active` - **CSS Transitions (State change)** – Active film state transition opacity and transform
- `.carousel-fade-slide` - **CSS Keyframes (Fade & Slide transition)** – Film carousel transitions between items using fade and slide transform
- `.scroll-progress-marker` - **CSS Transitions (Position update)** – Progress marker position updates smoothly as JavaScript changes value using transition
- `.particle-orbit` - **CSS Keyframes (Orbiting animation)** – Small particles orbit around marker using rotating transform keyframes

---

## Page Transitions

**Animation Types:**
- CSS Keyframes (branded overlay fade-lift)
- CSS Transitions with reduced-motion support

**Classes Used:**
- `.page-transition-overlay` - **CSS Keyframes (Fade & Lift)** – Branded overlay fades in and lifts up using opacity and transform keyframes
- `.page-transition-active` - **CSS Keyframes (Fade & Lift trigger)** – Applied when navigating, triggers overlay entrance animation
- `.prefers-reduced-motion` - **CSS Keyframes (Reduced timing)** – Media query respects user motion preferences, disables or slows animations
