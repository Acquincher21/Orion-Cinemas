# OrionCinemas

OrionCinemas is a frontend-only cinema booking experience created for the ITL303 Endterm CLE. It demonstrates responsive commercial UI, CSS motion and transforms, SVG emblems, canvas animation, and booking state management.

## Pages

- `index.html`: cinema landing page and now-showing films
- `login.html`: demo account sign-in
- `register.html`: browser-stored demo account registration
- `dashboard.html`: member booking overview, activity chart, and booking history
- `booking.html`: screening, showtime, seat selection, and local demo booking

## Architecture

- `assets/css/login.css` and `assets/css/register.css`: page-specific authentication styles
- `assets/css/main.css`: shared design tokens, reset, and landing-page layout
- `assets/css/animations.css`: keyframes and motion states
- `assets/css/components.css`: landing-page buttons, badges, cards, and hero canvas
- `assets/css/dashboard.css`: dashboard sidebar, metrics, history, and analytics layout
- `assets/css/booking.css`: ticket booking flow, calendar, seat map, and checkout components
- `assets/js/validation.js`: demo form validation, sign-in, registration, session, and logout behavior
- `assets/js/login.js` and `assets/js/register.js`: page-specific interactions
- `assets/js/app.js`: landing-page filters, navigation, and header interactions
- `assets/js/booking.js`: booking flow and dashboard booking history
- `assets/js/animation.js`: landing-page hero particle canvas
- `assets/js/dashboard.js`: dashboard booking activity chart

Use the demo account `juanderful@gmail.com` with password `Juan123*`, or register an account stored in this browser. Authentication is frontend-only and is not secure for real accounts. Demo bookings and account data are stored in browser storage. There is no payment processing or live cinema inventory integration. Open `index.html` in a browser to explore the project.

The demo account includes sample booking history with one to four seats per screening. Booking tracking shows the screening date and time, booked seats, person count, and demo total; sample totals are the ticket price multiplied by the number of seats.