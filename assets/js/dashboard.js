/* Dashboard booking history, now-showing carousel, and chart rendering. */

document.addEventListener('DOMContentLoaded', () => {
    const accountNav = document.querySelector('.account-nav');
    if (accountNav) {
        const navLinks = [...accountNav.querySelectorAll('a[href^="#"]')];
        const reduceNavMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function updateActiveLink(hash = window.location.hash) {
            const activeHash = navLinks.some(link => link.hash === hash) ? hash : '#overview';
            navLinks.forEach(link => {
                if (link.hash === activeHash) {
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        }

        navLinks.forEach(link => link.addEventListener('click', event => {
            const target = document.querySelector(link.hash);
            if (!target) return;

            event.preventDefault();
            if (window.location.hash !== link.hash) {
                window.history.pushState(null, '', link.hash);
            }
            updateActiveLink(link.hash);
            target.scrollIntoView({ behavior: reduceNavMotion ? 'auto' : 'smooth', block: 'start' });
        }));
        window.addEventListener('hashchange', () => updateActiveLink());
        window.addEventListener('popstate', () => updateActiveLink());
        updateActiveLink();
    }

    const filmCarousel = document.getElementById('film-carousel');
    if (filmCarousel) {
        const films = [...filmCarousel.querySelectorAll('.showing-film')];
        const position = document.getElementById('film-carousel-position');
        const progressTrack = filmCarousel.querySelector('.film-carousel-progress-track');
        const progressFill = document.getElementById('film-carousel-progress-fill');
        const reduceFilmMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const transitionTimeouts = new WeakMap();
        let currentFilmIndex = films.findIndex(film => film.classList.contains('is-current'));
        let isHovered = false;
        let hasFocus = false;
        let autoAdvanceTimer;

        function stopAutoAdvance() {
            window.clearInterval(autoAdvanceTimer);
            autoAdvanceTimer = undefined;
        }

        function startAutoAdvance() {
            stopAutoAdvance();
            if (reduceFilmMotion || isHovered || hasFocus || document.hidden || films.length < 2) return;
            autoAdvanceTimer = window.setInterval(() => showFilm(currentFilmIndex + 1), 4500);
        }

        function showFilm(requestedIndex) {
            const nextIndex = (requestedIndex + films.length) % films.length;
            if (nextIndex === currentFilmIndex) return;

            const previousFilm = films[currentFilmIndex];
            const nextFilm = films[nextIndex];
            const previousTimeout = transitionTimeouts.get(nextFilm);
            if (previousTimeout) {
                window.clearTimeout(previousTimeout);
                transitionTimeouts.delete(nextFilm);
            }

            const nextBookLink = nextFilm.querySelector('.showing-book-button');
            nextFilm.hidden = false;
            nextFilm.inert = false;
            nextFilm.removeAttribute('aria-hidden');
            nextBookLink.removeAttribute('tabindex');
            nextFilm.classList.remove('is-leaving');
            nextFilm.classList.add('is-current', 'is-entering');

            const previousBookLink = previousFilm.querySelector('.showing-book-button');
            previousFilm.classList.remove('is-current', 'is-entering');
            previousFilm.classList.add('is-leaving');
            previousFilm.setAttribute('aria-hidden', 'true');
            previousFilm.inert = true;
            previousBookLink.setAttribute('tabindex', '-1');

            currentFilmIndex = nextIndex;
            position.textContent = `${nextIndex + 1} / ${films.length}`;
            const progress = films.length > 1 ? (nextIndex / (films.length - 1)) * 100 : 0;
            progressFill.style.width = `${progress}%`;
            progressTrack.setAttribute('aria-valuenow', String(Math.round(progress)));

            window.setTimeout(() => nextFilm.classList.remove('is-entering'), 750);
            const hideTimeout = window.setTimeout(() => {
                previousFilm.hidden = true;
                previousFilm.classList.remove('is-leaving');
                transitionTimeouts.delete(previousFilm);
            }, reduceFilmMotion ? 0 : 380);
            transitionTimeouts.set(previousFilm, hideTimeout);
            startAutoAdvance();
        }

        filmCarousel.addEventListener('pointerenter', () => {
            isHovered = true;
            stopAutoAdvance();
        });
        filmCarousel.addEventListener('pointerleave', () => {
            isHovered = false;
            startAutoAdvance();
        });
        filmCarousel.addEventListener('focusin', () => {
            hasFocus = true;
            stopAutoAdvance();
        });
        filmCarousel.addEventListener('focusout', event => {
            if (event.relatedTarget && filmCarousel.contains(event.relatedTarget)) return;
            hasFocus = false;
            startAutoAdvance();
        });
        document.addEventListener('visibilitychange', startAutoAdvance);
        startAutoAdvance();
    }

    const bookingList = document.getElementById('booking-list');
    const historyFilters = document.querySelectorAll('.history-filter');
    if (!bookingList || !historyFilters.length) return;

    let activeFilter = 'upcoming';
    let hasRenderedBookings = false;

    function formatDate(date, options) {
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }

    function readBookings() {
        try {
            const bookings = JSON.parse(localStorage.getItem('cinepulse-bookings') || '[]');
            return Array.isArray(bookings) ? bookings.filter(booking => booking && booking.id && booking.screeningAt) : [];
        } catch {
            return [];
        }
    }

    function isUpcoming(booking) {
        return new Date(booking.screeningAt).getTime() >= Date.now();
    }

    function getSeatNumbers(seats) {
        return seats.map(seat => {
            const value = String(seat);
            if (/^\d+$/.test(value)) return Number(value);
            const match = /^([A-H])(\d+)$/.exec(value);
            if (!match) return null;

            const rowIndex = match[1].charCodeAt(0) - 'A'.charCodeAt(0);
            const seatInRow = Number(match[2]);
            if (rowIndex < 3) {
                return seatInRow <= 8 ? rowIndex * 8 + seatInRow : null;
            }
            return seatInRow <= 16 ? 24 + (rowIndex - 3) * 16 + seatInRow : null;
        }).filter(Number.isFinite).sort((a, b) => a - b);
    }

    function setCount(element, value) {
        const target = Number(value) || 0;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            element.textContent = target;
            return;
        }

        const start = performance.now();
        const duration = 500;
        function tick(now) {
            const progress = Math.min(1, (now - start) / duration);
            element.textContent = Math.round(target * progress);
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    function createBookingCard(booking) {
        const card = document.createElement('article');
        card.className = 'account-booking';
        const row = document.createElement('div');
        row.className = 'booking-main-row';
        const info = document.createElement('div');
        const title = document.createElement('h3');
        title.textContent = booking.movie || 'Cinema screening';
        const meta = document.createElement('p');
        meta.className = 'booking-meta';
        meta.textContent = `${booking.cinema ? `${booking.cinema} · ` : ''}${booking.date || 'Date unavailable'} · ${booking.time || 'Time unavailable'} · ${getSeatNumbers(booking.seats || []).join(', ') || 'No seats listed'}`;
        info.append(title, meta);

        const status = document.createElement('span');
        status.className = 'booking-status';
        status.textContent = isUpcoming(booking) ? 'Saved on this device' : 'Screening passed';
        row.append(info, status);

        const tracking = document.createElement('details');
        tracking.className = 'booking-track';
        const trackingSummary = document.createElement('summary');
        trackingSummary.textContent = 'Booking tracking';
        const details = document.createElement('div');
        details.className = 'tracking-details';
        const detailsContent = document.createElement('div');
        detailsContent.className = 'tracking-details-inner';

        [
            ['Reference', booking.id],
            ['Cinema', booking.cinema || 'Not listed'],
            ['Saved', booking.savedAt ? formatDate(new Date(booking.savedAt), { dateStyle: 'medium', timeStyle: 'short' }) : 'On this device'],
            ['Demo total', `₱${Number(booking.total || 0).toFixed(2)}`]
        ].forEach(([label, value]) => {
            const item = document.createElement('p');
            const itemLabel = document.createElement('span');
            const itemValue = document.createElement('strong');
            itemLabel.textContent = label;
            itemValue.textContent = value;
            item.append(itemLabel, itemValue);
            detailsContent.append(item);
        });

        details.append(detailsContent);
        tracking.append(trackingSummary, details);
        let isExpanded = false;
        let transitionId = 0;
        const reduceTrackingMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        details.addEventListener('transitionend', transitionEvent => {
            if (transitionEvent.propertyName !== 'max-height') return;
            if (isExpanded) {
                details.style.maxHeight = 'none';
            } else {
                tracking.open = false;
                details.style.removeProperty('max-height');
                details.style.removeProperty('opacity');
                details.style.removeProperty('padding-top');
            }
        });
        trackingSummary.addEventListener('click', event => {
            event.preventDefault();
            isExpanded = !isExpanded;
            const currentTransition = ++transitionId;

            if (reduceTrackingMotion) {
                tracking.open = isExpanded;
                details.classList.toggle('is-expanded', isExpanded);
                return;
            }

            if (isExpanded) {
                tracking.open = true;
                details.classList.add('is-expanded');
                details.style.maxHeight = '0px';
                details.style.opacity = '0';
                details.style.paddingTop = '0';
                window.requestAnimationFrame(() => {
                    if (currentTransition !== transitionId) return;
                    details.style.maxHeight = `${details.scrollHeight}px`;
                    details.style.opacity = '1';
                    details.style.paddingTop = '0.75rem';
                    });
            } else {
                    details.style.maxHeight = `${details.scrollHeight}px`;
                    void details.offsetHeight;
                    details.classList.remove('is-expanded');
                    details.style.maxHeight = '0px';
                    details.style.opacity = '0';
                    details.style.paddingTop = '0';
            }
        });
        card.append(row, tracking);
        return card;
    }

    function renderBookings() {
        const bookings = readBookings().sort((first, second) => new Date(second.screeningAt) - new Date(first.screeningAt));
        const upcomingBookings = bookings.filter(isUpcoming);
        const visibleBookings = activeFilter === 'all' ? bookings : upcomingBookings;
        const latestBooking = [...bookings].sort((first, second) => new Date(second.savedAt || 0) - new Date(first.savedAt || 0))[0];

        setCount(document.getElementById('upcoming-count'), upcomingBookings.length);
        setCount(document.getElementById('booking-count'), bookings.length);
        document.getElementById('latest-activity').textContent = latestBooking
            ? formatDate(new Date(latestBooking.savedAt || latestBooking.screeningAt), { month: 'short', day: 'numeric' })
            : 'No bookings yet';
        bookingList.replaceChildren();
        const animateBookingCards = !hasRenderedBookings;
        hasRenderedBookings = true;

        if (!visibleBookings.length) {
            const emptyState = document.createElement('div');
            emptyState.className = 'history-empty';
            const heading = document.createElement('h3');
            const message = document.createElement('p');
            if (activeFilter === 'all') {
                heading.textContent = 'No bookings saved';
                message.textContent = 'Choose a film to start your booking history.';
            } else {
                heading.textContent = 'No upcoming screenings';
                message.textContent = bookings.length ? 'Your previous bookings are available in all history.' : 'Your saved screenings will appear here.';
            }
            emptyState.append(heading, message);
            bookingList.append(emptyState);
            return;
        }

        visibleBookings.forEach((booking, index) => {
            const card = createBookingCard(booking);
            if (animateBookingCards && index < 3) card.classList.add('booking-card-enter');
            bookingList.append(card);
        });
    }

    function setHistoryFilter(filter) {
        activeFilter = filter;
        historyFilters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
        renderBookings();
    }

    historyFilters.forEach(button => button.addEventListener('click', () => setHistoryFilter(button.dataset.filter)));
    const savedBookingId = new URLSearchParams(window.location.search).get('booking');
    if (savedBookingId) {
        document.getElementById('booking-feedback').textContent = 'Your demo booking was saved to this browser. Payment and live ticket updates are not connected.';
    }
    renderBookings();
});

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('booking-chart');
    if (!canvas) return;

    const context = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tooltip = document.getElementById('chart-tooltip');
    let tooltipHideTimer;
    let focusedMonthIndex;

    function getMonthlyBookings(currentDate) {
        let bookings = [];
        try {
            const stored = JSON.parse(localStorage.getItem('cinepulse-bookings') || '[]');
            if (Array.isArray(stored)) bookings = stored;
        } catch {
            bookings = [];
        }

        const months = [];
        for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
            const count = bookings.filter(booking => {
                const savedAt = new Date(booking.savedAt || booking.screeningAt);
                return savedAt.getFullYear() === currentDate.getFullYear() && savedAt.getMonth() === monthIndex;
            }).length;
            months.push({
                label: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(currentDate.getFullYear(), monthIndex, 1)),
                count,
                isCurrent: monthIndex === currentDate.getMonth()
            });
        }
        return months;
    }

    function drawChart(months, elapsed = Infinity) {
        const bounds = canvas.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        const ratio = window.devicePixelRatio || 1;
        const pixelWidth = Math.round(bounds.width * ratio);
        const pixelHeight = Math.round(bounds.height * ratio);
        if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
            canvas.width = pixelWidth;
            canvas.height = pixelHeight;
        }
        context.setTransform(ratio, 0, 0, ratio, 0, 0);

        const width = bounds.width;
        const height = bounds.height;
        const padding = { top: 16, right: 12, bottom: 30, left: 28 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        const peak = Math.max(3, ...months.map(month => month.count));
        context.clearRect(0, 0, width, height);
        context.font = '11px system-ui, sans-serif';
        context.textBaseline = 'middle';
        const gradient = context.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
        gradient.addColorStop(0, '#ff9a62');
        gradient.addColorStop(1, '#f15c3b');
        const currentGradient = context.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
        currentGradient.addColorStop(0, '#65f5ff');
        currentGradient.addColorStop(1, '#1688c7');

        for (let line = 0; line <= 3; line++) {
            const y = padding.top + chartHeight - (chartHeight * line) / 3;
            context.strokeStyle = 'rgba(255,255,255,0.09)';
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(padding.left, y);
            context.lineTo(width - padding.right, y);
            context.stroke();
            context.fillStyle = '#7f8b9b';
            context.textAlign = 'right';
            context.fillText(String(Math.round((peak * line) / 3)), padding.left - 7, y);
        }

        const slotWidth = chartWidth / months.length;
        const barWidth = Math.min(34, slotWidth * 0.52);
        months.forEach((month, index) => {
            const x = padding.left + slotWidth * index + (slotWidth - barWidth) / 2;
            const fullHeight = month.count ? Math.max(4, (month.count / peak) * chartHeight) : 2;
            const delay = index * 70;
            const localProgress = reduceMotion ? 1 : Math.max(0, Math.min(1, (elapsed - delay) / 520));
            const easedProgress = 1 - (1 - localProgress) ** 3;
            const barHeight = fullHeight * easedProgress;
            context.globalAlpha = easedProgress;
            context.fillStyle = month.isCurrent ? currentGradient : gradient;
            context.shadowColor = month.isCurrent ? 'rgba(0, 229, 255, 0.55)' : 'transparent';
            context.shadowBlur = month.isCurrent ? 12 : 0;
            context.beginPath();
            context.roundRect(x, padding.top + chartHeight - barHeight, barWidth, barHeight, [4, 4, 0, 0]);
            context.fill();
            context.shadowBlur = 0;
            context.globalAlpha = 1;
            context.fillStyle = month.isCurrent ? '#65f5ff' : '#9aa5b5';
            context.font = `${month.isCurrent ? '700' : '400'} 11px system-ui, sans-serif`;
            context.textAlign = 'center';
            context.fillText(month.label, x + barWidth / 2, height - 12);
        });
    }

    function animateChart(months) {
        if (reduceMotion) {
            drawChart(months);
            return;
        }

        const start = performance.now();
        const duration = (months.length - 1) * 70 + 520;
        function frame(now) {
            const elapsed = now - start;
            drawChart(months, elapsed);
            if (elapsed < duration) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    const currentDate = new Date();
    const months = getMonthlyBookings(currentDate);
    const currentMonthLabel = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate);
    document.getElementById('chart-period').textContent = `January–December ${currentDate.getFullYear()}`;
    document.getElementById('chart-description').textContent = `Bookings saved each month this year, with ${currentMonthLabel} highlighted.`;
    function showMonthTooltip(index, clientX, clientY) {
        const month = months[index];
        if (!month) return;

        const widgetBounds = canvas.closest('.chart-widget').getBoundingClientRect();
        tooltip.textContent = `${month.label} ${currentDate.getFullYear()} · ${month.count} ${month.count === 1 ? 'booking' : 'bookings'}${month.isCurrent ? ' · Current month' : ''}`;
        tooltip.hidden = false;
        tooltip.setAttribute('aria-hidden', 'false');
        tooltip.style.left = `${Math.max(8, Math.min(clientX - widgetBounds.left + 10, widgetBounds.width - tooltip.offsetWidth - 8))}px`;
        tooltip.style.top = `${Math.max(8, clientY - widgetBounds.top - tooltip.offsetHeight - 12)}px`;
        window.clearTimeout(tooltipHideTimer);
        window.requestAnimationFrame(() => tooltip.classList.add('is-visible'));
    }

    function hideMonthTooltip() {
        tooltip.classList.remove('is-visible');
        tooltip.setAttribute('aria-hidden', 'true');
        window.clearTimeout(tooltipHideTimer);
        tooltipHideTimer = window.setTimeout(() => {
            tooltip.hidden = true;
        }, reduceMotion ? 0 : 180);
    }

    canvas.addEventListener('pointermove', event => {
        const bounds = canvas.getBoundingClientRect();
        const padding = { left: 28, right: 12 };
        const chartWidth = bounds.width - padding.left - padding.right;
        const slotWidth = chartWidth / months.length;
        const localX = event.clientX - bounds.left;
        const index = Math.floor((localX - padding.left) / slotWidth);

        if (event.clientY < bounds.top || event.clientY > bounds.bottom || index < 0 || index >= months.length) {
            hideMonthTooltip();
            return;
        }
        showMonthTooltip(index, event.clientX, event.clientY);
    });
    canvas.addEventListener('pointerleave', hideMonthTooltip);
    canvas.addEventListener('focus', () => {
        focusedMonthIndex = months.findIndex(month => month.isCurrent);
        const bounds = canvas.getBoundingClientRect();
        showMonthTooltip(focusedMonthIndex, bounds.left + bounds.width / 2, bounds.top + 16);
    });
    canvas.addEventListener('keydown', event => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        focusedMonthIndex = (focusedMonthIndex + direction + months.length) % months.length;
        const bounds = canvas.getBoundingClientRect();
        const slotWidth = (bounds.width - 40) / months.length;
        const centerX = bounds.left + 28 + slotWidth * (focusedMonthIndex + 0.5);
        showMonthTooltip(focusedMonthIndex, centerX, bounds.top + bounds.height / 2);
    });
    canvas.addEventListener('blur', () => {
        focusedMonthIndex = undefined;
        hideMonthTooltip();
    });
    window.setTimeout(() => animateChart(months), reduceMotion ? 0 : 620);
    window.addEventListener('resize', () => drawChart(months));
});
/* Landing Page Block */