/* ==========================================================
   OrionCinemas | Interactive HTML Canvas Particles & Vector Nodes
   ========================================================== */

/* Landing Page Block */
// Initializes the hero canvas, particles, and animation controls after the page loads.
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const animationToggle = document.getElementById('animation-toggle');
    let particles = [];
    const particleCount = 60;
    let mouse = { x: null, y: null, radius: 150 };
    let isManuallyPaused = false;
    let isPausedForUpcoming = false;
    let animationFrameId = null;

    // Matches the canvas dimensions to the hero section when it loads or resizes.
    function resizeCanvas() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Tracks the pointer so nearby particles can brighten interactively.
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    // Clears the pointer position after it leaves the browser window.
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Defines each moving point in the hero's particle network.
    class Particle {
        constructor() {
            this.reset();
        }

        // Randomizes a particle's initial position, size, velocity, and opacity.
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.baseAlpha = Math.random() * 0.4 + 0.2;
            this.alpha = this.baseAlpha;
        }

        // Moves the particle, reflects it at canvas edges, and responds to the pointer.
        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < mouse.radius) {
                    this.alpha = Math.min(1, this.baseAlpha + (1 - dist / mouse.radius));
                } else {
                    this.alpha = this.baseAlpha;
                }
            } else {
                this.alpha = this.baseAlpha;
            }
        }

        // Draws the particle as a cyan point on the hero canvas.
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 242, 254, ${this.alpha})`;
            ctx.fill();
        }
    }

    // Seeds the hero background with its initial set of particles.
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Connects nearby particles with faint lines to form the network effect.
    function connectNodes() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const opacity = (1 - dist / 120) * 0.25;
                    ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Draws one animation frame and schedules the next while motion is active.
    function animate() {
        if (isManuallyPaused || isPausedForUpcoming) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        connectNodes();
        animationFrameId = requestAnimationFrame(animate);
    }

    function syncAnimationState() {
        const shouldPause = isManuallyPaused || isPausedForUpcoming;
        canvas.parentElement.classList.toggle('motion-paused', shouldPause);
        animationToggle?.setAttribute('aria-pressed', String(shouldPause));
        if (animationToggle) {
            animationToggle.textContent = shouldPause ? 'Start Animation' : 'Stop Animation';
        }

        if (shouldPause) {
            if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        } else if (animationFrameId === null) {
            animationFrameId = requestAnimationFrame(animate);
        }
    }

    const upcomingSection = document.getElementById('upcoming');
    if (upcomingSection && 'IntersectionObserver' in window) {
        const upcomingObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    isPausedForUpcoming = true;
                } else if (entry.boundingClientRect.top >= 0) {
                    isPausedForUpcoming = false;
                }
            });
            syncAnimationState();
        }, { threshold: 0.1 });
        upcomingObserver.observe(upcomingSection);
    }

    // Stops or restarts the canvas and ticket-button pulse from the hero control.
    animationToggle?.addEventListener('click', () => {
        isManuallyPaused = !isManuallyPaused;
        syncAnimationState();
    });

    // Starts the hero particle animation when the page first loads.
    animate();
});
