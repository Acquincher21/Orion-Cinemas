/* Page-specific interactions for login.html. */
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

// Toggle password
function togglePw(){
  const inp = document.getElementById('password');
  const btn = inp.parentElement.querySelector('.toggle-pw');
  inp.type = inp.type === 'password' ? 'text' : 'password';
  btn.textContent = inp.type === 'password' ? '👁' : '🙈';
  btn.setAttribute('aria-label', inp.type === 'password' ? 'Show password' : 'Hide password');
  btn.setAttribute('aria-pressed', String(inp.type === 'text'));
}

document.querySelector('.toggle-pw').addEventListener('click', togglePw);