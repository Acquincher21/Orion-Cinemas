/* Ticket selection and booking submission interactions. */

/* ==========================================================
   Booking Page
   Handles film, date, showtime, seat selection, and booking submission.
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const filmOptions = document.getElementById('film-options');
    const filmSection = document.getElementById('film-section');
    const dateOptions = document.getElementById('date-options');
    const timeOptions = document.querySelector('.time-options');
    const seatMap = document.getElementById('seat-map');
    const checkoutButton = document.getElementById('checkout-button');
    const checkoutStatus = document.getElementById('checkout-status');
    const selectedMovie = { id: '', name: '', cinema: '', price: 280 };
    const showtimesByMovie = {
        '1': ['12:30 PM', '3:45 PM', '7:15 PM', '9:40 PM'],
        '2': ['11:00 AM', '2:15 PM', '6:00 PM', '8:30 PM'],
        '3': ['1:15 PM', '4:30 PM', '7:45 PM', '10:15 PM'],
        '4': ['12:00 PM', '3:30 PM', '6:45 PM', '9:15 PM'],
        '5': ['11:30 AM', '2:45 PM', '6:15 PM', '9:30 PM'],
        '6': ['10:45 AM', '1:45 PM', '5:15 PM', '8:45 PM']
    };
    const dateSection = document.getElementById('date-section');
    const timeSection = document.getElementById('time-section');
    const seatSection = document.getElementById('seat-section');
    const bookingSummary = document.getElementById('booking-summary');
    const bookingProgressSteps = document.querySelectorAll('.booking-progress-step');
    const bookingProgressStatus = document.getElementById('booking-progress-status');
    const selectedSeats = new Set();
    const occupiedSeats = new Set(['A4', 'B4', 'B5', 'D11', 'E6']);
    const ticketPrice = 280;
    let selectedDate = null;
    let selectedTime = '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let displayedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastCalendarMonth = new Date(today.getFullYear(), today.getMonth() + 5, 1);

    function setBookingProgress(currentStep, stepName) {
        bookingProgressSteps.forEach(step => {
            const stepNumber = Number(step.dataset.bookingStep);
            if (stepNumber === currentStep) {
                step.setAttribute('aria-current', 'step');
            } else {
                step.removeAttribute('aria-current');
            }
            step.classList.toggle('is-complete', stepNumber < currentStep);
        });
        bookingProgressStatus.textContent = `Step ${currentStep} of 4: ${stepName}`;
    }

    function scrollToBookingStep(section) {
        const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
        section.scrollIntoView({ behavior, block: 'start' });
    }

    function animateSectionEntrance(element) {
        if (!element) return;
        element.classList.remove('booking-section-animate');
        void element.offsetWidth;
        element.classList.add('booking-section-animate');
    }

    /* Booking helpers for date formatting and seat labels. */
    function formatDate(date, options) {
        return new Intl.DateTimeFormat('en-US', options).format(date);
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

    /* ==========================================================
       Booking Flow
       ========================================================== */
    if (filmOptions && dateOptions && timeOptions && seatMap && checkoutButton && checkoutStatus) {
        function renderCalendar() {
            const year = displayedMonth.getFullYear();
            const month = displayedMonth.getMonth();
            const firstWeekday = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const monthHeading = document.getElementById('calendar-month');
            const previousMonth = document.getElementById('calendar-previous');
            const nextMonth = document.getElementById('calendar-next');
            const selectedKey = selectedDate
                ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
                : '';
            const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

            monthHeading.textContent = formatDate(displayedMonth, { month: 'long', year: 'numeric' });
            previousMonth.disabled = year === today.getFullYear() && month === today.getMonth();
            nextMonth.disabled = year === lastCalendarMonth.getFullYear() && month === lastCalendarMonth.getMonth();
            dateOptions.replaceChildren();

            for (let blank = 0; blank < firstWeekday; blank++) {
                const spacer = document.createElement('span');
                spacer.className = 'calendar-spacer';
                spacer.setAttribute('aria-hidden', 'true');
                dateOptions.append(spacer);
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'calendar-day';
                button.dataset.date = dateKey;
                button.disabled = date < today;
                button.setAttribute('aria-pressed', String(dateKey === selectedKey));
                button.setAttribute('aria-label', formatDate(date, { weekday: 'long', month: 'long', day: 'numeric' }));
                if (dateKey === todayKey) button.classList.add('is-today');
                button.textContent = day;
                dateOptions.append(button);
            }
        }

        function renderShowtimes() {
            const showtimes = showtimesByMovie[selectedMovie.id] || [];
            timeOptions.replaceChildren();
            showtimes.forEach(time => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'choice-button';
                button.dataset.time = time;
                button.setAttribute('aria-pressed', 'false');
                button.textContent = time;
                timeOptions.append(button);
            });
        }

        function renderSeats() {
            const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
            let seatNumber = 1;
            rows.forEach((row, rowIndex) => {
                const seatRow = document.createElement('div');
                seatRow.className = 'seat-row';
                seatRow.setAttribute('role', 'group');
                seatRow.setAttribute('aria-label', `Row ${row}`);

                const addSeat = seatName => {
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.className = 'seat-button';
                    button.textContent = seatNumber;
                    button.dataset.seat = seatName;
                    button.dataset.number = String(seatNumber);
                    button.disabled = occupiedSeats.has(seatName);
                    button.setAttribute('aria-label', `Seat ${seatName}${button.disabled ? ', occupied' : ', available'}`);
                    button.setAttribute('aria-pressed', 'false');
                    seatNumber++;
                    return button;
                };

                const addBlock = (count, className, labelOffset = 0) => {
                    const block = document.createElement('div');
                    block.className = `seat-block ${className}`;

                    for (let number = 1; number <= count; number++) {
                        const seatId = number + labelOffset;
                        block.append(addSeat(`${row}${seatId}`));
                    }

                    return block;
                };

                const addAisle = () => {
                    const aisle = document.createElement('span');
                    aisle.className = 'seat-aisle';
                    aisle.setAttribute('aria-hidden', 'true');
                    return aisle;
                };

                if (rowIndex < 3) {
                    const placeholder = document.createElement('span');
                    placeholder.className = 'seat-block-placeholder seat-block-placeholder--left';
                    seatRow.append(placeholder);
                } else {
                    seatRow.append(addBlock(4, 'seat-block--left'));
                }
                const leftAisle = addAisle();
                leftAisle.classList.add('seat-aisle--left');
                const rightAisle = addAisle();
                rightAisle.classList.add('seat-aisle--right');
                seatRow.append(leftAisle, addBlock(8, 'seat-block--center', rowIndex < 3 ? 0 : 4), rightAisle);
                if (rowIndex < 3) {
                    const placeholder = document.createElement('span');
                    placeholder.className = 'seat-block-placeholder seat-block-placeholder--right';
                    seatRow.append(placeholder);
                } else {
                    seatRow.append(addBlock(4, 'seat-block--right', 12));
                }
                seatMap.append(seatRow);
            });
        }

        function clearSelectedSeats() {
            selectedSeats.clear();
            seatMap.querySelectorAll('.seat-button[aria-pressed="true"]').forEach(seat => {
                seat.setAttribute('aria-pressed', 'false');
                seat.setAttribute('aria-label', `Seat ${seat.dataset.seat}, available`);
            });
        }

        function updateSummary() {
            const seatList = getSeatNumbers([...selectedSeats]);
            const count = seatList.length;
            const currentPrice = selectedMovie.price || ticketPrice;
            const ticketTotal = count * currentPrice;
            document.getElementById('summary-film').textContent = selectedMovie.name;
            document.getElementById('summary-cinema').textContent = selectedMovie.cinema;
            document.getElementById('screen-cinema').textContent = selectedMovie.cinema;
            document.getElementById('summary-date').textContent = selectedDate
                ? formatDate(selectedDate, { weekday: 'short', month: 'short', day: 'numeric' })
                : 'Choose a date';
            document.getElementById('summary-time').textContent = selectedTime;
            document.getElementById('summary-seats').textContent = seatList.length ? seatList.join(', ') : 'None selected';
            document.getElementById('ticket-count').textContent = count;
            const unitPriceElement = document.getElementById('ticket-unit-price');
            if (unitPriceElement) {
                unitPriceElement.textContent = `₱${currentPrice.toFixed(2)}`;
            }
            document.getElementById('ticket-total').textContent = `₱${ticketTotal.toFixed(2)}`;
            const serviceFeeElement = document.getElementById('service-fee');
            if (serviceFeeElement) {
                serviceFeeElement.textContent = `₱0.00`;
            }
            document.getElementById('booking-total').textContent = `₱${ticketTotal.toFixed(2)}`;
            checkoutButton.disabled = count === 0;
            checkoutStatus.textContent = count ? 'Your selection is ready to review.' : 'Select at least one seat to continue.';
            checkoutStatus.dataset.state = count ? 'ready' : '';
        }

        dateOptions.addEventListener('click', event => {
            const button = event.target.closest('button.calendar-day[data-date]');
            if (!button || button.disabled) return;
            if (selectedDate && button.dataset.date === `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`) return;
            selectedDate = new Date(`${button.dataset.date}T12:00:00`);
            renderCalendar();
            setBookingProgress(3, 'Choose a showtime');
            selectedTime = '';
            clearSelectedSeats();
            timeOptions.querySelectorAll('button[data-time]').forEach(option => option.setAttribute('aria-pressed', 'false'));
            timeSection.hidden = false;
            animateSectionEntrance(timeSection);
            seatSection.hidden = true;
            bookingSummary.hidden = true;
            updateSummary();
            scrollToBookingStep(timeSection);
        });

        document.getElementById('calendar-previous').addEventListener('click', () => {
            displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() - 1, 1);
            renderCalendar();
            dateOptions.classList.remove('calendar-flip-animate');
            void dateOptions.offsetWidth;
            dateOptions.classList.add('calendar-flip-animate');
        });

        document.getElementById('calendar-next').addEventListener('click', () => {
            displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 1);
            renderCalendar();
            dateOptions.classList.remove('calendar-flip-animate');
            void dateOptions.offsetWidth;
            dateOptions.classList.add('calendar-flip-animate');
        });

        timeOptions.addEventListener('click', event => {
            const button = event.target.closest('button[data-time]');
            if (!button) return;
            timeOptions.querySelectorAll('button').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
            if (selectedTime !== button.dataset.time) clearSelectedSeats();
            selectedTime = button.dataset.time;
            setBookingProgress(4, 'Select your seats');
            seatSection.hidden = false;
            animateSectionEntrance(seatSection);
            bookingSummary.hidden = false;
            animateSectionEntrance(bookingSummary);
            updateSummary();
            scrollToBookingStep(seatSection);
        });

        seatMap.addEventListener('click', event => {
            const button = event.target.closest('button[data-seat]');
            if (!button || button.disabled) return;
            const seatName = button.dataset.seat;
            if (selectedSeats.has(seatName)) {
                selectedSeats.delete(seatName);
            } else if (selectedSeats.size < 8) {
                selectedSeats.add(seatName);
            } else {
                checkoutStatus.textContent = 'You can select up to 8 seats per booking.';
                checkoutStatus.dataset.state = 'error';
                return;
            }
            const isSelected = selectedSeats.has(seatName);
            button.setAttribute('aria-pressed', String(isSelected));
            button.setAttribute('aria-label', `Seat ${seatName}${isSelected ? ', selected' : ', available'}`);
            updateSummary();
        });

        function chooseMovie(button) {
            selectedMovie.id = button.dataset.movieId;
            selectedMovie.name = button.dataset.movieName;
            selectedMovie.cinema = button.dataset.cinema;
            selectedMovie.price = Number(button.dataset.moviePrice) || 280;
            filmOptions.querySelectorAll('.film-card').forEach(card => {
                card.setAttribute('aria-pressed', String(card === button));
            });
            filmSection.hidden = true;
            dateSection.hidden = false;
            animateSectionEntrance(dateSection);
            timeSection.hidden = true;
            seatSection.hidden = true;
            bookingSummary.hidden = true;
            selectedDate = null;
            selectedTime = '';
            setBookingProgress(2, 'Choose a date');
            displayedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            renderCalendar();
            renderShowtimes();
            clearSelectedSeats();
            updateSummary();
            scrollToBookingStep(dateSection);
        }

        document.getElementById('change-film').addEventListener('click', () => {
            setBookingProgress(1, 'Choose a film');
            filmSection.hidden = false;
            animateSectionEntrance(filmSection);
            dateSection.hidden = true;
            timeSection.hidden = true;
            seatSection.hidden = true;
            bookingSummary.hidden = true;
            scrollToBookingStep(filmSection);
        });

        filmOptions.addEventListener('click', event => {
            const button = event.target.closest('.film-card[data-movie-id]');
            if (button) chooseMovie(button);
        });

        checkoutButton.addEventListener('click', () => {
            if (!selectedSeats.size || !selectedMovie.id) return;
            const [timeValue, meridiem] = document.getElementById('summary-time').textContent.split(' ');
            const [hoursValue, minutesValue] = timeValue.split(':').map(Number);
            const screeningHour = (hoursValue % 12) + (meridiem === 'PM' ? 12 : 0);
            const screeningDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), screeningHour, minutesValue);
            const booking = {
                id: `CP-${Date.now().toString(36).toUpperCase()}`,
                movieId: selectedMovie.id,
                movie: selectedMovie.name,
                cinema: selectedMovie.cinema,
                screeningAt: screeningDate.toISOString(),
                date: document.getElementById('summary-date').textContent,
                time: document.getElementById('summary-time').textContent,
                seats: getSeatNumbers([...selectedSeats]),
                total: Number(document.getElementById('booking-total').textContent.replace(/[^\d.]/g, '')),
                savedAt: new Date().toISOString()
            };
            try {
                const bookings = JSON.parse(localStorage.getItem('cinepulse-bookings') || '[]');
                if (!Array.isArray(bookings)) throw new Error('Invalid booking history');
                bookings.unshift(booking);
                localStorage.setItem('cinepulse-bookings', JSON.stringify(bookings));
                window.location.href = `dashboard.html?booking=${encodeURIComponent(booking.id)}`;
            } catch {
                checkoutStatus.textContent = 'This browser could not save the demo booking. Check storage settings and try again.';
                checkoutStatus.dataset.state = 'error';
            }
        });

        renderCalendar();
        renderSeats();
        const requestedMovie = new URLSearchParams(window.location.search).get('movie');
        const requestedFilm = [...filmOptions.querySelectorAll('.film-card')].find(card => card.dataset.movieId === requestedMovie);
        if (requestedFilm) chooseMovie(requestedFilm);
    }
});