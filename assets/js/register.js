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
  btn.textContent = inp.type === 'password' ? '👁' : '🙈';
  btn.setAttribute('aria-label', inp.type === 'password' ? 'Show password' : 'Hide password');
  btn.setAttribute('aria-pressed', String(inp.type === 'text'));
}

document.querySelectorAll('.toggle-pw').forEach(button => {
  button.addEventListener('click', () => togglePw(button.dataset.passwordTarget, button));
});

// Password strength
document.getElementById('password').addEventListener('input', function(){
  const v = this.value;
  const fill = document.getElementById('strength-fill');
  const lbl  = document.getElementById('strength-label');
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

});

// Confirm password live check
document.getElementById('confirm_password').addEventListener('input', function(){
  const pw = document.getElementById('password').value;
  this.style.borderColor = this.value === pw ? '#22c55e' : '#ef4444';
});