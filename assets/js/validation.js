/* Demo-only form validation and authentication for login.html, register.html, dashboard.html, and booking.html. */

(function () {
    const demoAccount = {
        name: 'OrionCinemas Demo',
        email: 'juanderful@gmail.com',
        password: 'Juan123*'
    };
    const accountKey = 'cinepulse-registered-account';
    const localSessionKey = 'cinepulse-session';
    const sessionSessionKey = 'cinepulse-session';

    function readSession() {
        try {
            const stored = localStorage.getItem(localSessionKey) || sessionStorage.getItem(sessionSessionKey);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    }

    function showFeedback(form, message, success) {
        let feedback = form.querySelector('[data-auth-feedback]');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.dataset.authFeedback = '';
            feedback.setAttribute('role', success ? 'status' : 'alert');
            form.prepend(feedback);
        }
        feedback.className = success ? 'alert alert-success' : 'alert alert-error';
        feedback.textContent = message;
        feedback.hidden = false;
    }

    function saveSession(account, remember) {
        const session = JSON.stringify({ name: account.name, email: account.email });
        try {
            if (remember) {
                localStorage.setItem(localSessionKey, session);
                sessionStorage.removeItem(sessionSessionKey);
            } else {
                sessionStorage.setItem(sessionSessionKey, session);
                localStorage.removeItem(localSessionKey);
            }
            return true;
        } catch {
            return false;
        }
    }

    function getNextPage() {
        const requested = new URLSearchParams(window.location.search).get('next') || '';
        return /^(dashboard\.html|booking\.html(?:\?movie=[1-6])?)$/.test(requested)
            ? requested
            : 'dashboard.html';
    }

    function setupLogin(form) {
        const submitButton = form.querySelector('#submitBtn');
        const loadingScreen = document.getElementById('loginLoading');
        submitButton.disabled = false;
        form.addEventListener('submit', event => {
            event.preventDefault();
            const email = form.querySelector('#email').value.trim().toLowerCase();
            const password = form.querySelector('#password').value;
            let registeredAccount = null;
            try {
                registeredAccount = JSON.parse(localStorage.getItem(accountKey) || 'null');
            } catch {
                showFeedback(form, 'Saved account data could not be read. Please register again.', false);
                return;
            }

            const account = email === demoAccount.email && password === demoAccount.password
                ? demoAccount
                : registeredAccount && email === String(registeredAccount.email).toLowerCase() && password === registeredAccount.password
                    ? registeredAccount
                    : null;

            if (!account) {
                showFeedback(form, 'Email or password is incorrect. Check your details and try again.', false);
                return;
            }
            if (!saveSession(account, form.querySelector('[name="remember"]').checked)) {
                showFeedback(form, 'Your browser could not save the demo sign-in. Check its storage settings and try again.', false);
                return;
            }
            submitButton.disabled = true;
            form.setAttribute('aria-busy', 'true');
            loadingScreen.showModal();
            const progressBar = loadingScreen.querySelector('[role="progressbar"]');
            const progressFill = loadingScreen.querySelector('.login-loading-progress-fill');
            const percentage = loadingScreen.querySelector('#loginLoadingPercentage');
            const message = loadingScreen.querySelector('#loginLoadingMessage');
            const loadingMessages = [
                'Verifying your sign-in…',
                'Preparing your cinema experience…',
                'Getting your account ready…',
                'Almost there—opening your account…'
            ];
            const loadingStartedAt = Date.now();
            const loadingInterval = window.setInterval(() => {
                const elapsed = Date.now() - loadingStartedAt;
                const progressRatio = Math.min(1, elapsed / 4000);
                const progress = Math.floor(progressRatio ** 2 * 100);
                const messageIndex = Math.min(loadingMessages.length - 1, Math.floor(progress / 25));

                progressBar.setAttribute('aria-valuenow', String(progress));
                progressFill.style.width = `${progress}%`;
                percentage.textContent = `${progress}%`;
                message.textContent = loadingMessages[messageIndex];

                if (elapsed >= 4000) {
                    window.clearInterval(loadingInterval);
                    window.location.href = getNextPage();
                }
            }, 40);
        });

        if (new URLSearchParams(window.location.search).get('registered') === '1') {
            showFeedback(form, 'Account created. Sign in with your new email and password.', true);
        }
    }

    function setupRegistration(form) {
        const submitButton = form.querySelector('#submitBtn');
        const terms = form.querySelector('#terms');
        submitButton.disabled = false;
        form.addEventListener('submit', event => {
            event.preventDefault();
            const email = form.querySelector('#email').value.trim();
            const password = form.querySelector('#password').value;
            const confirmation = form.querySelector('#confirm_password').value;
            if (!terms.checked) {
                showFeedback(form, 'Please agree to the Terms & Conditions and Privacy Policy to continue.', false);
                return;
            }
            if (password !== confirmation) {
                showFeedback(form, 'Your passwords do not match. Please check both password fields.', false);
                return;
            }
            if (email.toLowerCase() === demoAccount.email) {
                showFeedback(form, 'That email is reserved for the demo account. Please use another email address.', false);
                return;
            }

            const firstName = form.querySelector('#first_name').value.trim();
            const middleName = form.querySelector('#middle_name').value.trim();
            const lastName = form.querySelector('#last_name').value.trim();
            const account = {
                name: [firstName, middleName, lastName].filter(Boolean).join(' '),
                email,
                password
            };
            try {
                localStorage.setItem(accountKey, JSON.stringify(account));
            } catch {
                showFeedback(form, 'Your browser could not save this account. Check its storage settings and try again.', false);
                return;
            }
            window.location.href = 'login.html?registered=1';
        });
    }

    function clearSession() {
        try {
            localStorage.removeItem(localSessionKey);
            sessionStorage.removeItem(sessionSessionKey);
            return true;
        } catch {
            return false;
        }
    }

    window.CinePulseAuth = {
        isAuthenticated: () => Boolean(readSession()),
        getAccount: readSession,
        logout: clearSession
    };

    const form = document.querySelector('form');
    if (form) {
        if (form.querySelector('#confirm_password')) {
            setupRegistration(form);
        } else {
            setupLogin(form);
        }
    }

    if (document.body.classList.contains('page-account') || document.body.classList.contains('page-dashboard')) {
        if (!window.CinePulseAuth.isAuthenticated()) {
            const currentPage = window.location.pathname.split('/').pop();
            const next = currentPage + window.location.search;
            window.location.replace(`login.html?next=${encodeURIComponent(next)}`);
        }
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', event => {
            event.preventDefault();
            if (clearSession()) {
                window.location.href = 'index.html';
            } else {
                window.alert('Could not clear the demo sign-in from this browser. Check its storage settings and try again.');
            }
        });
    }
})();