# OrionCinemas Animation Summary

## How the animation system works

The site uses three main approaches:

- **CSS keyframes** define an animation's stages, such as fading in, pulsing, or shaking. CSS applies them with the `animation` property.
- **CSS transitions** smoothly interpolate between two states, usually when a user hovers, focuses, opens a panel, or when JavaScript changes a class.
- **JavaScript-driven animation** responds to events and draws or updates visuals frame by frame. This project uses the Canvas API, the Web Animations API, and WebGL.

A useful presentation summary is: **HTML provides the elements and classes, CSS defines their visual motion, and JavaScript decides when to trigger it or draws interactive graphics.**

## Landing page

- **Hero particle network:** The HTML provides the canvas at `index.html` (`#hero-canvas`). `assets/js/animation.js` uses the 2D Canvas API and `requestAnimationFrame` to move 60 particles, draw them, and connect nearby points with lines. The pointer brightens nearby particles. The “Stop Animation” button pauses or resumes this effect; the animation also pauses when the upcoming section is visible.
- **Scroll reveals and staggered entrances:** Elements such as the hero text, movie cards, and feature cards use the `scroll-reveal` class in `index.html`. `assets/js/app.js` uses `IntersectionObserver` to add `is-revealed` as elements enter the viewport. `assets/css/animations.css` then transitions opacity and vertical position, with delays that make items appear in sequence.
- **Logo, badge, and call-to-action motion:** `assets/css/animations.css` defines pulsing logo, badge-glow, and button effects. The logo is an SVG image, while CSS supplies its pulse and glow; its markup is in `index.html`.
- **Coming Soon marquee:** `assets/css/main.css` lays out the upcoming-movie strip; `assets/css/animations.css` animates it horizontally. JavaScript pauses it when it's offscreen to avoid unnecessary animation work.
- **Movie-card hover effect:** On hover or keyboard focus, the card reveals its movie details with opacity and vertical movement in `assets/css/animations.css`. `assets/js/movie-transition.js` adds a more elaborate WebGL poster transition using a displacement shader; if WebGL or the images aren't available, it falls back to the CSS fade.
- **Movie pagination:** `assets/js/app.js` uses the Web Animations API to slide the current movie cards out and the next cards in. It also advances the cards automatically when appropriate. The transition is skipped when reduced motion is requested.

## Sign-in and registration

- **Ambient particle backgrounds:** `login.html` and `register.html` provide canvases. `assets/js/login.js` and `assets/js/register.js` move particles with `requestAnimationFrame`. Their “Pause animations” buttons let the user stop or restart them.
- **Form-card entrance and login badge pulse:** `assets/css/login.css` animates the login card upward as it fades in and pulses the security badge. `assets/css/register.css` gives the registration card a similar fade-and-rise entrance.
- **Focus and hover feedback:** For example, the login input wrapper scales slightly when focused in `assets/css/login.css`. These are CSS transitions, not continuously running animations.
- **Validation feedback:** On registration, `assets/js/register.js` adds a class to shake invalid fields. `assets/css/register.css` defines the shake keyframes and a checkmark entrance for valid fields. The password strength bar changes width and color as the user types.
- **Terms dialog:** `assets/css/register.css` fades and lifts the dialog into view when it opens.
- **Sign-in loading progress:** `assets/js/validation.js` updates the loading percentage and progress-bar width; `assets/css/login.css` transitions the bar smoothly.

## Booking page

- **Step entrances:** Selecting a film, date, time, or seats triggers JavaScript to add `booking-section-animate` in `assets/js/booking.js`. `assets/css/animations.css` defines the section, calendar, and summary entrance animations.
- **Staggered choices and seat rows:** CSS delays each showtime and seat row slightly, creating a wave-like entrance instead of having all items appear at once. The relevant rules are in `assets/css/animations.css`.
- **Calendar changes:** `assets/js/booking.js` triggers a class when the calendar month changes; CSS fades and scales the new month into view.
- **Interactive seat hover:** Seat buttons include hover and selected states in `assets/css/booking.css`. Other controls also use short transitions so feedback feels smooth.

## Dashboard

- **Dashboard entrance:** The welcome area, metric cards, chart, and initial booking cards fade and rise in with staggered delays. These rules are in `assets/css/animations.css`.
- **Animated chart:** `dashboard.html` provides the chart canvas. `assets/js/dashboard.js` draws its bars with the Canvas API; `requestAnimationFrame` grows the bars into view in sequence. Pointer movement displays a month tooltip.
- **Scroll progress indicator:** The HTML indicator is in `dashboard.html`. `assets/js/dashboard.js` calculates the scroll percentage; `assets/css/dashboard.css` uses that value to move the marker and fill the track. CSS also animates small particles orbiting the marker.
- **Metric word wave:** The dashboard's word spans appear in `dashboard.html`. On hover, `assets/css/dashboard.css` lifts each word slightly, with small delays for a wave effect.
- **Booking history pagination and details:** `assets/js/dashboard.js` slides old booking cards away and renders the next page. CSS animates the new cards in with a staggered slide. Expanding “Booking tracking” smoothly opens its details, which fade in with a blur-to-sharp effect; the styling is in `assets/css/dashboard.css`.
- **Now-showing carousel:** `assets/js/dashboard.js` changes the active film and updates the progress bar. `assets/css/dashboard.css` fades and slides between films, animates the bar, and adds a light sweep. The carousel pauses automatic changes while hovered or focused.

## Page transitions and accessibility

The landing and sign-in pages include a branded overlay in `index.html` and `login.html`. `assets/js/page-transition.js` activates it when navigating to sign-in or registration; `assets/css/page-transition.css` fades and lifts the branding. Registration links use a different color treatment and light sweep.

Several CSS animations and transitions honor `prefers-reduced-motion`, for example in `assets/css/animations.css` and `assets/css/page-transition.css`. The site also provides manual pause controls for the particle animations.

## Short answer for your professor

> “My project combines CSS keyframe animations, CSS transitions, JavaScript-triggered animations, and canvas graphics. CSS handles effects like entrances, hover states, and staggered reveals. JavaScript uses observers and events to decide when to trigger those effects, and `requestAnimationFrame` to draw the particle backgrounds and dashboard chart. I also used WebGL for the movie-poster displacement transition and included reduced-motion support for many effects.”
