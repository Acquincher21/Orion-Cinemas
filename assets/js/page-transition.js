(() => {
    const transition = document.getElementById('page-transition');
    const message = transition.querySelector('.page-transition-message');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let navigating = false;

    window.addEventListener('pageshow', () => {
        navigating = false;
        transition.classList.remove('is-active', 'is-signup');
        transition.setAttribute('aria-hidden', 'true');
    });

    document.addEventListener('click', event => {
        const link = event.target.closest('a[href^="login.html"], a[href^="register.html"]');
        if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey
            || event.shiftKey || event.altKey || link.hasAttribute('download')
            || (link.target && link.target !== '_self')) return;

        if (navigating) {
            event.preventDefault();
            return;
        }

        if (reducedMotion.matches || document.body.classList.contains('motion-paused')
            || document.body.classList.contains('animations-paused')) return;

        event.preventDefault();
        navigating = true;
        const isSignUp = link.getAttribute('href').startsWith('register.html');
        message.textContent = isSignUp ? 'Your story starts here' : 'Opening your cinema experience';
        transition.classList.toggle('is-signup', isSignUp);
        transition.setAttribute('aria-hidden', 'false');
        transition.classList.add('is-active');
        window.setTimeout(() => {
            window.location.href = link.href;
        }, isSignUp ? 2000 : 1000);
    });
})();
