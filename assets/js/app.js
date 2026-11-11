/* ==========================================================
   Landing Page Block
   Handles movie pagination, navbar scroll styling, and
   smooth scrolling between landing-page sections.
   ========================================================== */
// Sets up landing-page interactions after the document is ready.
document.addEventListener('DOMContentLoaded', () => {
    
    /* 1. Movie Pagination */
    const movieCards = document.querySelectorAll('.movie-card');
    const previousMovies = document.querySelector('#previous-movies');
    const nextMovies = document.querySelector('#next-movies');
    const moviePageStatus = document.querySelector('#movie-page-status');
    const movieShowcase = document.querySelector('#movies');

    if (movieCards.length && previousMovies && nextMovies && moviePageStatus && movieShowcase) {
        let currentMoviePage = 1;
        const totalMoviePages = Math.ceil(movieCards.length / 3);
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let showcaseVisible = false;
        let autoplayTimer = null;
        let transitioning = false;

        const scheduleAutoplay = () => {
            clearTimeout(autoplayTimer);
            autoplayTimer = null;
            if (reducedMotion.matches || transitioning || !showcaseVisible || document.hidden
                || movieShowcase.matches(':hover, :focus-within') || totalMoviePages < 2) return;

            autoplayTimer = setTimeout(() => {
                autoplayTimer = null;
                const nextPage = currentMoviePage === totalMoviePages ? 1 : currentMoviePage + 1;
                showMoviePage(nextPage, 1, true);
            }, 7000);
        };

        const showMoviePage = async (page, direction, automatic = false) => {
            if (page < 1 || page > totalMoviePages || transitioning) return;

            transitioning = true;
            clearTimeout(autoplayTimer);
            autoplayTimer = null;
            previousMovies.disabled = true;
            nextMovies.disabled = true;
            const currentCards = [...movieCards].filter(card => Number(card.dataset.moviePage) === currentMoviePage);
            const nextCards = [...movieCards].filter(card => Number(card.dataset.moviePage) === page);
            const reduceMotion = reducedMotion.matches;

            if (!reduceMotion) {
                const exitAnimations = currentCards.map((card, index) => card.animate(
                    [
                        { opacity: 1, transform: 'translateX(0)' },
                        { opacity: 0, transform: `translateX(${direction * -72}px)` }
                    ],
                    { duration: 220, delay: index * 35, easing: 'ease-in', fill: 'forwards' }
                ));
                await Promise.all(exitAnimations.map(animation => animation.finished));
            }

            currentMoviePage = page;
            movieCards.forEach(card => {
                const isCurrentPage = Number(card.dataset.moviePage) === currentMoviePage;
                card.hidden = !isCurrentPage;
            });
            if (!reduceMotion) currentCards.forEach(card => card.getAnimations().forEach(animation => animation.cancel()));

            const firstMovie = (currentMoviePage - 1) * 3 + 1;
            const lastMovie = Math.min(currentMoviePage * 3, movieCards.length);
            moviePageStatus.setAttribute('aria-live', automatic ? 'off' : 'polite');
            moviePageStatus.textContent = `Movies ${firstMovie}–${lastMovie} of ${movieCards.length}`;

            if (!reduceMotion) {
                const enterAnimations = nextCards.map((card, index) => card.animate(
                    [
                        { opacity: 0, transform: `translateX(${direction * 72}px)` },
                        { opacity: 1, transform: 'translateX(0)' }
                    ],
                    { duration: 300, delay: index * 45, easing: 'ease-out', fill: 'both' }
                ));
                await Promise.all(enterAnimations.map(animation => animation.finished));
                nextCards.forEach(card => card.getAnimations().forEach(animation => animation.cancel()));
            }

            previousMovies.disabled = currentMoviePage === 1;
            nextMovies.disabled = currentMoviePage === totalMoviePages;
            transitioning = false;
            scheduleAutoplay();
        };

        previousMovies.addEventListener('click', () => showMoviePage(currentMoviePage - 1, -1));
        nextMovies.addEventListener('click', () => showMoviePage(currentMoviePage + 1, 1));
        movieShowcase.addEventListener('mouseenter', scheduleAutoplay);
        movieShowcase.addEventListener('mouseleave', scheduleAutoplay);
        movieShowcase.addEventListener('focusin', scheduleAutoplay);
        movieShowcase.addEventListener('focusout', () => requestAnimationFrame(scheduleAutoplay));
        document.addEventListener('visibilitychange', scheduleAutoplay);
        reducedMotion.addEventListener('change', scheduleAutoplay);
        const movieObserver = new IntersectionObserver(entries => {
            showcaseVisible = entries[0].isIntersecting;
            scheduleAutoplay();
        }, { threshold: 0.1 });
        movieObserver.observe(movieShowcase);
    }

    /* 2. Scroll-Activated Header Styling */
    const navbar = document.querySelector('.navbar');

    // Adjusts the navbar shadow and border as the page scrolls.
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 60) {
                navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.8)';
                navbar.style.borderBottomColor = 'rgba(0, 242, 254, 0.3)';
            } else {
                navbar.style.boxShadow = 'none';
                navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.1)';
            }
        });
    }

    /* 3. Smooth Anchor Link Scrolling */
    // Smoothly scrolls to the section selected from an in-page navigation link.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /* 4. Scroll-Triggered Content Reveal Animations */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        revealElements.forEach(el => el.classList.add('is-revealed'));
    } else if ('IntersectionObserver' in window) {
        const revealOnIntersection = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);

                    // Once the scroll reveal finishes, clean up the helper class so hover animations run unhindered
                    const cleanUpScrollReveal = (e) => {
                        if (e.target === entry.target && e.propertyName === 'transform') {
                            entry.target.classList.remove('scroll-reveal');
                            entry.target.removeEventListener('transitionend', cleanUpScrollReveal);
                        }
                    };
                    entry.target.addEventListener('transitionend', cleanUpScrollReveal);
                }
            });
        };
        const revealObserver = new IntersectionObserver(revealOnIntersection, {
            root: null,
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        const upcomingRevealElements = [...revealElements].filter(el => el.closest('.upcoming-showcase'));
        const standardRevealElements = [...revealElements].filter(el => !el.closest('.upcoming-showcase'));
        standardRevealElements.forEach(el => revealObserver.observe(el));

        if (upcomingRevealElements.length) {
            const upcomingRevealObserver = new IntersectionObserver(revealOnIntersection, {
                root: null,
                threshold: 0.1,
                rootMargin: '0px 0px 180px 0px'
            });

            upcomingRevealElements.forEach(el => upcomingRevealObserver.observe(el));
        }
    } else {
        revealElements.forEach(el => el.classList.add('is-revealed'));
    }
});
