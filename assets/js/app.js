/* ==========================================================
   Landing Page Block
   Handles movie category filters, navbar scroll styling, and
   smooth scrolling between landing-page sections.
   ========================================================== */
// Sets up landing-page interactions after the document is ready.
document.addEventListener('DOMContentLoaded', () => {
    
    /* 1. Category Filter Badge Interactions */
    // Connects the format filter buttons to the movie cards they control.
    const filterButtons = document.querySelectorAll('.badge-filter');
    const movieCards = document.querySelectorAll('.movie-card');

    movieCards.forEach(card => {
        card.addEventListener('transitionend', (event) => {
            if (event.propertyName === 'opacity' && card.classList.contains('is-filtered-out')) {
                card.style.display = 'none';
            }
        });
    });

    // Filters the movie list whenever a category button is selected.
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter').toLowerCase();

            movieCards.forEach(card => {
                const badgeTag = card.querySelector('.badge-tag');
                const tagText = badgeTag ? badgeTag.textContent.toLowerCase() : '';
                const matchesFilter = filterValue === 'all' || tagText.includes(filterValue);

                if (matchesFilter) {
                    const isHidden = card.style.display === 'none';
                    card.inert = false;
                    card.style.display = 'block';

                    if (isHidden) {
                        card.classList.add('is-filtered-out');
                        requestAnimationFrame(() => {
                            if (!card.inert) card.classList.remove('is-filtered-out');
                        });
                    } else {
                        card.classList.remove('is-filtered-out');
                    }
                } else {
                    card.inert = true;
                    card.classList.add('is-filtered-out');
                }
            });
        });
    });

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
});
