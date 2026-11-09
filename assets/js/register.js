/* Page-specific interactions for register.html. */
// Particle background
(function(){
  const c = document.getElementById('particles');
  const ctx = c.getContext('2d');
  let W, H, pts = [];
  let frameId = null;
  let paused = false;
  function resize(){ W = c.width = innerWidth; H = c.height = innerHeight; }
  resize(); addEventListener('resize', resize);
  for(let i=0;i<90;i++) pts.push({
    x:Math.random()*9999, y:Math.random()*9999,
    vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3,
    r:Math.random()*1.5+.5,
    a:Math.random()*.7+.1
  });

  function draw(){
    ctx.clearRect(0,0,W,H);
    pts.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0)p.x=W; if(p.x>W)p.x=0;
      if(p.y<0)p.y=H; if(p.y>H)p.y=0;
      ctx.beginPath();
      ctx.arc(p.x%W, p.y%H, p.r, 0, Math.PI*2);
      ctx.fillStyle=`rgba(0,229,255,${p.a})`;
      ctx.fill();
    });
    if (!paused) frameId = requestAnimationFrame(draw);
  }

  const toggle = document.getElementById('motionToggle');
  toggle.hidden = false;
  toggle.addEventListener('click', function(){
    paused = !paused;
    document.body.classList.toggle('animations-paused', paused);
    toggle.textContent = paused ? 'Resume animations' : 'Pause animations';
    if (paused) {
      cancelAnimationFrame(frameId);
      frameId = null;
    } else {
      draw();
    }
  });

  draw();
})();

// Toggle password visibility
function togglePw(id, btn){
  const inp = document.getElementById(id);
  inp.type = inp.type === 'password' ? 'text' : 'password';
  btn.setAttribute('aria-label', inp.type === 'password' ? 'Show password' : 'Hide password');
  btn.setAttribute('aria-pressed', String(inp.type === 'text'));
}

document.querySelectorAll('.toggle-pw').forEach(button => {
  button.addEventListener('click', () => togglePw(button.dataset.passwordTarget, button));
});

const registrationForm = document.querySelector('form');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm_password');
const touchedFields = new WeakSet();

function shake(element) {
  element.classList.remove('field-shake');
  void element.offsetWidth;
  element.classList.add('field-shake');
}

function getFieldMessage(input) {
  if (input.validity.valueMissing) return 'This field is required.';
  if (input.validity.typeMismatch && input.type === 'email') return 'Enter a valid email address.';
  if (input.validity.typeMismatch && input.type === 'tel') return 'Enter a valid phone number.';
  if (input.validity.tooShort) return `Use at least ${input.minLength} characters.`;
  if (input.validity.customError) return input.validationMessage;
  return input.validationMessage;
}

function renderFieldState(input, showError) {
  const field = input.closest('.field');
  if (!field) return;

  let feedback = field.querySelector('.field-feedback');
  if (!feedback) {
    feedback = document.createElement('small');
    feedback.className = 'field-feedback';
    feedback.id = `${input.id}-feedback`;
    field.append(feedback);
  }

  let status = field.querySelector('.field-status');
  if (!status) {
    status = document.createElement('span');
    status.className = 'field-status';
    status.setAttribute('aria-hidden', 'true');
    input.closest('.input-wrap').append(status);
  }

  const hasValue = input.value.length > 0;
  const invalid = showError && !input.validity.valid;
  const valid = hasValue && input.validity.valid;
  field.dataset.state = invalid ? 'invalid' : valid ? 'valid' : '';
  input.setAttribute('aria-invalid', String(invalid));
  const describedBy = new Set((input.getAttribute('aria-describedby') || '').split(/\s+/).filter(id => id && id !== feedback.id));
  describedBy.add(feedback.id);
  input.setAttribute('aria-describedby', [...describedBy].join(' '));
  feedback.textContent = invalid ? getFieldMessage(input) : '';
  status.textContent = valid ? '✓' : '';
}

function updatePasswordMatch() {
  confirmPasswordInput.setCustomValidity(
    confirmPasswordInput.value && confirmPasswordInput.value !== passwordInput.value
      ? 'Passwords do not match.'
      : ''
  );
  if (touchedFields.has(confirmPasswordInput)) {
    renderFieldState(confirmPasswordInput, true);
  }
}

registrationForm.querySelectorAll('.field input').forEach(input => {
  input.addEventListener('blur', () => {
    touchedFields.add(input);
    if (input === confirmPasswordInput) updatePasswordMatch();
    renderFieldState(input, true);
  });
  input.addEventListener('input', () => {
    if (input === passwordInput) updatePasswordMatch();
    if (touchedFields.has(input)) renderFieldState(input, true);
  });
});

registrationForm.addEventListener('invalid', event => {
  const input = event.target;
  if (input.matches('.field input')) {
    touchedFields.add(input);
    if (input === confirmPasswordInput) updatePasswordMatch();
    renderFieldState(input, true);
    shake(input.closest('.field'));
  } else if (input.id === 'terms') {
    const row = input.closest('.check-row');
    row.classList.add('field-invalid');
    document.getElementById('terms-feedback').textContent = 'Please agree to continue.';
    input.setAttribute('aria-invalid', 'true');
    shake(row);
  }
}, true);

const termsCheckbox = document.getElementById('terms');
termsCheckbox.addEventListener('change', () => {
  termsCheckbox.removeAttribute('aria-invalid');
  termsCheckbox.closest('.check-row').classList.remove('field-invalid');
  document.getElementById('terms-feedback').textContent = '';
});

// Password strength
passwordInput.addEventListener('input', function(){
  const v = this.value;
  const fill = document.getElementById('strength-fill');
  const lbl  = document.getElementById('strength-label');
  const meter = document.getElementById('strength-bar');
  let score = 0;
  if(v.length >= 8)  score++;
  if(/[A-Z]/.test(v)) score++;
  if(/[0-9]/.test(v)) score++;
  if(/[^A-Za-z0-9]/.test(v)) score++;

  const levels = [
    {w:'0%',   c:'transparent', t:''},
    {w:'25%',  c:'#ef4444',    t:'Weak'},
    {w:'50%',  c:'#f97316',    t:'Fair'},
    {w:'75%',  c:'#eab308',    t:'Good'},
    {w:'100%', c:'#22c55e',    t:'Strong'},
  ];

  const l = levels[score];
  fill.style.width  = l.w;
  fill.style.background = l.c;
  lbl.textContent   = l.t;
  lbl.style.color   = l.c;
  meter.setAttribute('aria-valuenow', String(score));
  meter.setAttribute('aria-valuetext', l.t || 'No password entered');

});

// Terms and privacy dialog
const legalDialog = document.getElementById('legalDialog');
const legalTitle = document.getElementById('legalDialogTitle');
const legalContent = document.getElementById('legalDialogContent');
const legalDocuments = {
  terms: {
    title: 'Terms & Conditions',
    sections: [
      ['Coursework demo', 'OrionCinemas is a frontend-only project demonstration. Movie listings, showtimes, seats, and bookings are examples and do not create a real reservation.'],
      ['No payments', 'This demo does not process payments or connect to live theater systems.']
    ]
  },
  privacy: {
    title: 'Privacy Policy',
    sections: [
      ['Browser storage', 'The name, email, and password you enter are stored in this browser to demonstrate account sign-in. Clearing this browser’s site data removes the saved account.'],
      ['Use demo details', 'No server account is created. Do not enter a password you use for another service.']
    ]
  }
};

document.querySelectorAll('[data-legal-document]').forEach(button => {
  button.addEventListener('click', () => {
    const documentContent = legalDocuments[button.dataset.legalDocument];
    legalTitle.textContent = documentContent.title;
    legalContent.replaceChildren(...documentContent.sections.map(([heading, text]) => {
      const section = document.createElement('section');
      const title = document.createElement('h3');
      const paragraph = document.createElement('p');
      title.textContent = heading;
      paragraph.textContent = text;
      section.append(title, paragraph);
      return section;
    }));
    legalDialog.showModal();
  });
});

legalDialog.querySelector('.legal-dialog-close').addEventListener('click', () => legalDialog.close());
legalDialog.addEventListener('click', event => {
  if (event.target === legalDialog) legalDialog.close();
});