(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const toast=m=>{let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.append(t)}t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),3200)};
// nav
$('.burger')?.addEventListener('click',()=>$('.links').classList.toggle('open'));
// reveal
const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.15});
$$('.rv').forEach(el=>io.observe(el));
// service cards: tap to open on touch
$$('.card').forEach(c=>c.addEventListener('click',()=>c.classList.toggle('open')));
// counters
const co=new IntersectionObserver(e=>e.forEach(x=>{if(!x.isIntersecting)return;const el=x.target,end=+el.dataset.n,suf=el.dataset.s||'';let n=0;const step=Math.max(1,end/60);const t=setInterval(()=>{n=Math.min(end,n+step);el.textContent=Math.floor(n).toLocaleString()+suf;if(n>=end)clearInterval(t)},25);co.unobserve(el)}),{threshold:.5});
$$('[data-n]').forEach(el=>co.observe(el));
// testimonials
const tc=$$('.tcard');if(tc.length){const dots=$('.dots');let i=0,timer;
tc.forEach((_,k)=>{const b=document.createElement('button');b.setAttribute('aria-label','Show review '+(k+1));b.onclick=()=>{show(k);auto()};dots.append(b)});
const show=k=>{i=k;tc.forEach((c,j)=>c.classList.toggle('on',j===k));$$('button',dots).forEach((b,j)=>b.classList.toggle('on',j===k))};
const auto=()=>{clearInterval(timer);timer=setInterval(()=>show((i+1)%tc.length),5500)};show(0);auto()}
// gallery
$$('.chip').forEach(c=>c.addEventListener('click',()=>{$$('.chip').forEach(x=>x.classList.remove('on'));c.classList.add('on');$$('.gal figure').forEach(f=>f.classList.toggle('hide',c.dataset.f!=='all'&&f.dataset.c!==c.dataset.f))}));
const lb=$('.lb');if(lb){$$('.gal figure').forEach(f=>f.addEventListener('click',()=>{$('img',lb).src=$('img',f).src.replace(/\/\d+\/\d+$/,'/1200/900');lb.classList.add('on')}));lb.addEventListener('click',()=>lb.classList.remove('on'));addEventListener('keydown',e=>e.key==='Escape'&&lb.classList.remove('on'))}
// contact form
$('#contactForm')?.addEventListener('submit',e=>{e.preventDefault();e.target.reset();toast('Message sent. We will reply within one working day.')});
// appointments
const form=$('#apptForm');if(form){
const KEY='glow_appointments',list=$('#apptList'),load=()=>JSON.parse(localStorage.getItem(KEY)||'[]'),save=a=>localStorage.setItem(KEY,JSON.stringify(a));
const d=$('#date');d.min=new Date().toISOString().split('T')[0];
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const render=()=>{const a=load().sort((x,y)=>(x.date+x.time).localeCompare(y.date+y.time));
list.innerHTML=a.length?a.map(p=>`<div class="appt"><div><b>${esc(p.name)}</b> · ${esc(p.service)}<br><small>${new Date(p.date+'T00:00').toDateString()} at ${esc(p.time)} · ${esc(p.phone)}</small></div><button class="x" data-id="${p.id}">Cancel</button></div>`).join(''):'<div class="empty">No appointments yet. Fill in the form above to book your first visit.</div>'};
form.addEventListener('submit',e=>{e.preventDefault();const f=Object.fromEntries(new FormData(form));
const a=load();if(a.some(p=>p.date===f.date&&p.time===f.time))return toast('That slot is taken. Please choose another time.');
a.push({...f,id:Date.now()});save(a);form.reset();render();toast('Appointment booked for '+f.date+' at '+f.time);$('#alist').scrollIntoView({behavior:'smooth'})});
list.addEventListener('click',e=>{const b=e.target.closest('.x');if(!b)return;save(load().filter(p=>p.id!=b.dataset.id));render();toast('Appointment cancelled')});
render()}
})();
