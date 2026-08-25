(function(){
"use strict";
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasHover = matchMedia('(hover:hover)').matches;
const isMobile = matchMedia('(max-width:820px)').matches;

const ACCENTS = { sea:'#33c7d8', emerald:'#13c98a', gold:'#ffc93c', teal:'#7fe6ea' };
const accentCycle = ['sea','emerald','gold'];

const SERVICES = [
  { slug:'contingent-staffing', name:'Contingent Staffing', audience:'For employers', headline:'Scale your team on demand.',
    description:'Pre-vetted contract talent deployed in days — W2 or C2C — with payroll, compliance, and backfill coverage handled end to end.',
    icon:'M12 3v18M3 12h18|circle:12,12,9',
    features:[['Rapid deployment','Calibrated candidates in your inbox within days, not weeks, drawn from cultivated vertical networks.'],
      ['Full compliance','Classification, onboarding paperwork, multi-state payroll, and insurance — owned by us, invisible to you.'],
      ['Backfill guarantee','If a contractor rolls off early, we replace them at no additional search cost.']], cta:'Request contract talent' },
  { slug:'permanent-placement', name:'Permanent Placement', audience:'For employers', headline:'Direct hires who stay.',
    description:'Structured search for the roles that matter — deep technical vetting, culture-fit screening, and a replacement guarantee.',
    icon:'circle:12,8,4|M4 21c0-4 3.6-7 8-7s8 3 8 7',
    features:[['Role calibration','We map the outcome the hire must deliver before sourcing a single profile.'],
      ['Three to five, not thirty','Shortlists are small and calibrated. Every profile has passed structured interviews and reference validation.'],
      ['Ninety-day support','Onboarding check-ins and a replacement guarantee through the first ninety days.']], cta:'Start a search' },
  { slug:'project-based-staffing', name:'Project-Based Staffing (SOW)', audience:'For employers', headline:'Complete teams, defined outcomes.',
    description:'Architects, engineers, and delivery leads assembled around your milestones — onshore, offshore, or blended.',
    icon:'rect:3,5,18,14,2|M3 10h18M9 5v14',
    features:[['Outcome-scoped','Statement-of-work engagements priced against deliverables, not just hours.'],
      ['Blended delivery','US-based leadership backed by our India delivery center for follow-the-sun velocity.'],
      ['Single accountability','One contract, one point of contact, one team responsible for the outcome.']], cta:'Scope a project' },
  { slug:'payroll-compliance', name:'Payroll & Compliance Services', audience:'For employers', headline:'Hire anywhere. Skip the entity.',
    description:'Employer-of-record and payroll services across the US, Canada, and India — onboarding, benefits, and multi-jurisdiction compliance handled.',
    icon:'M12 2l8 4v6c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-4z|M9 12l2 2 4-4',
    features:[['Employer of record','We employ your selected talent on your behalf, in-country and fully compliant.'],
      ['Multi-state payroll','Accurate, on-time payroll with tax withholding across every state you operate in.'],
      ['Benefits administration','Competitive benefits packages that help your contingent workforce stay.']], cta:'Talk to payroll' },
  { slug:'training-placement', name:'Training & Placement Programs', audience:'For job seekers', headline:"From Master's degree to first offer.",
    description:'For international STEM graduates: resume engineering, technical interview preparation, mock interviews, and direct employer matching.',
    icon:'M22 10L12 5 2 10l10 5 10-5z|M6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5',
    features:[['Resume engineering','ATS-optimized, achievement-led resumes built with a coach — not run through a template.'],
      ['Interview readiness','Structured technical prep and recorded mock interviews with detailed feedback loops.'],
      ['Employer matching','Direct introductions to hiring teams in our network when you are ready.']], cta:'Apply to the program' },
  { slug:'medical-billing', name:'Medical Billing Services', audience:'For job seekers', headline:'A career in healthcare revenue.',
    description:'Training and placement for medical billing and revenue-cycle roles — coding fundamentals, payer workflows, and employer connections.',
    icon:'rect:4,3,16,18,2|M9 8h6M9 12h6M9 16h4',
    features:[['Practical curriculum','Claims, coding, denials, and payer workflows taught from real scenarios.'],
      ['Certification support','Guided preparation for industry-recognized billing credentials.'],
      ['Placement assistance','Interview preparation and introductions to provider and RCM employers.']], cta:'Explore the track' },
  { slug:'accounting-bookkeeping', name:'Accounting & Bookkeeping Services', audience:'For job seekers', headline:'Ledger-ready in weeks.',
    description:'Hands-on training in bookkeeping, reconciliation, and accounting software, followed by placement support with hiring firms.',
    icon:'M3 3v18h18|M7 15l3-4 3 3 4-6',
    features:[['Software fluency','QuickBooks, Excel, and modern close tooling taught by working practitioners.'],
      ['Real workflows','Month-end close, reconciliation, AP/AR cycles — practiced, not just described.'],
      ['Employer network','Placement introductions to firms hiring entry and mid-level accounting talent.']], cta:'Explore the track' },
  { slug:'it-services-consulting', name:'IT Services & Consulting', audience:'For job seekers', headline:'Consulting careers, accelerated.',
    description:'Skill development and placement pathways into IT services and consulting roles — from support to cloud to data.',
    icon:'rect:2,4,20,14,2|M8 20h8M12 18v2',
    features:[['Track selection','Guided placement into support, cloud, QA, or data tracks based on your background.'],
      ['Project portfolio','Build demonstrable work products that survive technical screens.'],
      ['Client-ready coaching','Communication and consulting-readiness training for client-facing roles.']], cta:'Explore the track' },
];

const INDUSTRIES = [
  { slug:'information-technology', name:'Information Technology', tagline:'Engineers who ship, not resumes that keyword-match.', description:'Software engineering, cloud, data, security, and QA talent — technically vetted through structured interviews and work-sample review before you ever see a profile.', roles:['Software Engineers','Cloud & DevOps','Data Engineers','Security Analysts','QA & SDET'], stat:['5 days','median time to shortlist'] },
  { slug:'healthcare-life-sciences', name:'Healthcare & Life Sciences', tagline:'Compliant clinical and operational staffing at speed.', description:'From revenue-cycle teams to clinical research associates — credential-verified talent for providers, payers, and life sciences organizations.', roles:['RCM Specialists','Clinical Research','Health IT','Medical Billing','Care Coordination'], stat:['100%','credential verification'] },
  { slug:'finance-accounting', name:'Finance & Accounting', tagline:'Numbers people who understand your close calendar.', description:'Controllers, analysts, AP/AR teams, and audit support — placed permanent or deployed for quarter-end surge.', roles:['Financial Analysts','Controllers','AP / AR','Audit Support','FP&A'], stat:['3–5','candidates per shortlist'] },
  { slug:'engineering', name:'Engineering', tagline:'Mechanical to electrical, design to plant floor.', description:'Degreed engineers and technical designers across mechanical, electrical, civil, and industrial disciplines.', roles:['Mechanical Engineers','Electrical Engineers','CAD Designers','Project Engineers','Manufacturing Engineers'], stat:['90 days','post-placement support'] },
  { slug:'administrative-clerical', name:'Administrative & Clerical', tagline:'The people who keep operations moving.', description:'Executive assistants, office managers, data entry, and front-office staff — reliability-screened and reference-checked.', roles:['Executive Assistants','Office Managers','Data Entry','Reception','Records'], stat:['48 hrs','typical deployment'] },
  { slug:'light-industrial-manufacturing', name:'Light Industrial & Manufacturing', tagline:'Shift-ready workforce, safety-first screening.', description:'Assembly, warehouse, logistics, and skilled-trade staffing with full compliance and safety documentation.', roles:['Assembly','Warehouse & Logistics','Machine Operators','Quality Inspectors','Skilled Trades'], stat:['24/7','shift coverage models'] },
  { slug:'sales-marketing', name:'Sales & Marketing', tagline:'Revenue talent with verifiable track records.', description:'SDRs to sales directors, growth marketers to brand leads — screened against real pipeline and campaign outcomes.', roles:['Account Executives','SDR / BDR','Growth Marketing','Brand & Content','RevOps'], stat:['2 wks','average search-to-offer'] },
  { slug:'education', name:'Education', tagline:'Educators and administrators, background-verified.', description:'Instructional staff, administrators, and support roles for institutions and ed-tech companies.', roles:['Instructors','Administrators','Curriculum Design','Student Services','Ed-Tech Support'], stat:['100%','background checks'] },
  { slug:'legal', name:'Legal', tagline:'Paralegal to counsel, conflict-checked.', description:'Legal support staffing for firms and in-house teams — paralegals, legal assistants, contract managers, and document review.', roles:['Paralegals','Legal Assistants','Contract Managers','Doc Review','Compliance'], stat:['3–5','candidates per shortlist'] },
  { slug:'retail-hospitality', name:'Retail & Hospitality', tagline:'Seasonal surge to permanent leadership.', description:'Store, venue, and hospitality staffing that flexes with your calendar — from seasonal ramp to district management.', roles:['Store Management','Guest Services','F&B','Merchandising','Events'], stat:['days','seasonal ramp lead-time'] },
  { slug:'telecom-networking', name:'Telecom & Networking', tagline:'Field to NOC, certified and deployment-ready.', description:'Network engineers, field technicians, and infrastructure project teams with current certifications.', roles:['Network Engineers','Field Technicians','NOC Analysts','Fiber / OSP','Wireless'], stat:['cert','verified certifications'] },
  { slug:'pharma-clinical-research', name:'Pharma & Clinical Research', tagline:'GxP-aware talent for regulated environments.', description:'CRAs, regulatory affairs, quality, and biostatistics talent for sponsors, CROs, and manufacturers.', roles:['CRAs','Regulatory Affairs','Quality (GxP)','Biostatistics','Pharmacovigilance'], stat:['GxP','regulated screening'] },
];
INDUSTRIES.forEach((it,i)=> it.accent = accentCycle[i % 3]);

const bySlugS = s => SERVICES.find(x=>x.slug===s);
const bySlugI = s => INDUSTRIES.find(x=>x.slug===s);
const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function iconSVG(spec){
  const parts = spec.split('|').map(p=>{
    if(p.startsWith('circle:')){const[a,b,c]=p.slice(7).split(',');return `<circle cx="${a}" cy="${b}" r="${c}"/>`;}
    if(p.startsWith('rect:')){const[x,y,w,h,r]=p.slice(5).split(',');return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r||0}"/>`;}
    return `<path d="${p}"/>`;
  }).join('');
  return `<svg viewBox="0 0 24 24" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${parts}</svg>`;
}

const serviceCards = document.getElementById('serviceCards');
SERVICES.filter(s=>s.audience==='For employers').forEach(s=>{
  const b=document.createElement('button'); b.type='button'; b.className='card tilt reveal';
  b.dataset.route = '#/service/'+s.slug;
  b.setAttribute('aria-label', s.name+' — learn more');
  b.innerHTML = `<span class="glyph">${iconSVG(s.icon)}</span><h3>${esc(s.name)}</h3><p>${esc(s.description)}</p><span class="cta-line">Explore ${esc(s.name.split(' ')[0].toLowerCase())} <span class="arr">→</span></span>`;
  serviceCards.appendChild(b);
});

const indGrid = document.getElementById('indGrid');
INDUSTRIES.forEach((it,i)=>{
  const b=document.createElement('button'); b.type='button'; b.className='ind a-'+it.accent+' reveal';
  b.dataset.route='#/industry/'+it.slug; b.setAttribute('aria-label', it.name+' — learn more');
  b.innerHTML = `<span class="idx">${String(i+1).padStart(2,'0')}</span><span class="name">${esc(it.name)}</span><span class="arrow" aria-hidden="true">↗</span>`;
  indGrid.appendChild(b);
});

const footServices=document.getElementById('footServices');
SERVICES.slice(0,5).forEach(s=>{const a=document.createElement('button');a.type='button';a.dataset.route='#/service/'+s.slug;a.textContent=s.name;footServices.appendChild(a);});
const footIndustries=document.getElementById('footIndustries');
INDUSTRIES.slice(0,4).forEach(it=>{const a=document.createElement('button');a.type='button';a.dataset.route='#/industry/'+it.slug;a.textContent=it.name;footIndustries.appendChild(a);});
{const a=document.createElement('button');a.type='button';a.dataset.route='#/industries';a.style.color='var(--sea)';a.textContent='View all twelve →';footIndustries.appendChild(a);}

const LOGOS=['NORTHWIND HEALTH','VECTORPAY','ATLAS MANUFACTURING','BLUEGRID SYSTEMS','MERIDIAN CAPITAL','HELIX BIO','CREST RETAIL GROUP','ORBIT TELECOM'];
const track=document.getElementById('logoTrack');
[...LOGOS,...LOGOS].forEach(n=>{const s=document.createElement('span');s.textContent=n;track.appendChild(s);});

const homeView=document.getElementById('home-view');
const detailView=document.getElementById('detail-view');
const navButtons=document.querySelectorAll('.nav-links [data-route]');

function ctaBand(title, label, route){
  return `<div class="wrap"><div class="cta-band"><h2>${esc(title)}</h2><button class="btn btn-primary magnetic" type="button" data-route="${route}">${esc(label)} <span class="arr">→</span></button></div></div>`;
}
function renderService(slug){
  const s=bySlugS(slug); if(!s) return renderNotFound();
  const feats = s.features.map((f,i)=>`<div class="panel reveal"><span class="fnum">0${i+1}</span><h3>${esc(f[0])}</h3><p>${esc(f[1])}</p></div>`).join('');
  const related = SERVICES.filter(x=>x.audience===s.audience && x.slug!==s.slug).slice(0,3).map(x=>
    `<button class="related-card" type="button" data-route="#/service/${x.slug}"><b>${esc(x.name)}</b><small>${esc(x.headline)}</small></button>`).join('');
  const closeTitle = s.audience==='For employers' ? 'Ready to build your team?' : 'Ready to start your career?';
  detailView.innerHTML = `
    <section class="detail-hero">
      <div class="glow aurora" aria-hidden="true"></div>
      <div class="wrap">
        <button class="back-link" type="button" data-route="#/services">← All services</button>
        <p class="eyebrow reveal">${esc(s.audience)}</p>
        <h1 tabindex="-1" id="detailHeading" class="reveal">${esc(s.headline)}</h1>
        <p class="tag reveal">${esc(s.description)}</p>
        <div style="margin-top:32px" class="reveal"><button class="btn btn-primary magnetic" type="button" data-route="#/#contact">${esc(s.cta)} <span class="arr">→</span></button></div>
      </div>
    </section>
    <section class="detail-sec"><div class="wrap"><div class="detail-grid g3">${feats}</div></div></section>
    <section class="detail-sec"><div class="wrap related"><h5>Related ${s.audience==='For employers'?'services':'tracks'}</h5><div class="related-grid">${related}</div></div></section>
    <section class="detail-sec">${ctaBand(closeTitle, s.cta, '#/#contact')}</section>`;
  document.title = s.name+' — Talent & Purpose';
}
function renderIndustry(slug){
  const it=bySlugI(slug); if(!it) return renderNotFound();
  const hex=ACCENTS[it.accent];
  const chips = it.roles.map(r=>`<li>${esc(r)}</li>`).join('');
  const others = INDUSTRIES.filter(x=>x.slug!==it.slug).slice(0,6).map(x=>
    `<button class="related-card" type="button" data-route="#/industry/${x.slug}"><b>${esc(x.name)}</b><small>${esc(x.tagline)}</small></button>`).join('');
  detailView.innerHTML = `
    <section class="detail-hero">
      <div class="glow" aria-hidden="true" style="background:radial-gradient(50% 42% at 20% 0%, ${hex}22, transparent 70%)"></div>
      <div class="wrap">
        <button class="back-link" type="button" data-route="#/industries">← All industries</button>
        <p class="eyebrow reveal">Industry desk</p>
        <h1 tabindex="-1" id="detailHeading" class="reveal">${esc(it.name)}</h1>
        <p class="tag reveal">${esc(it.tagline)}</p>
        <p class="desc reveal">${esc(it.description)}</p>
      </div>
    </section>
    <section class="detail-sec"><div class="wrap"><div class="detail-grid g2">
      <div class="panel reveal"><h3>Roles we place</h3><ul class="chips">${chips}</ul></div>
      <div class="panel stat-panel reveal"><div class="big" style="color:${hex}">${esc(it.stat[0])}</div><div class="cap">${esc(it.stat[1])}</div></div>
    </div></div></section>
    <section class="detail-sec">${ctaBand('Hiring in '+it.name.toLowerCase()+'?', 'Hire talent', '#/#contact')}</section>
    <section class="detail-sec"><div class="wrap related"><h5>Other desks</h5><div class="related-grid">${others}</div></div></section>`;
  document.title = it.name+' — Talent & Purpose';
}
function renderServicesIndex(){
  const cards = SERVICES.map(s=>`<button class="related-card" type="button" data-route="#/service/${s.slug}"><b>${esc(s.name)}</b><small>${esc(s.audience)} · ${esc(s.headline)}</small></button>`).join('');
  detailView.innerHTML = `
    <section class="detail-hero"><div class="glow aurora" aria-hidden="true"></div><div class="wrap">
      <button class="back-link" type="button" data-route="#/">← Home</button>
      <p class="eyebrow reveal">Services</p>
      <h1 tabindex="-1" id="detailHeading" class="reveal">Eight ways we <span style="background:var(--grad-brand);-webkit-background-clip:text;background-clip:text;color:transparent">support you.</span></h1>
      <p class="tag reveal">For employers building teams and for job seekers building careers. Open any service to see how it works.</p>
    </div></section>
    <section class="detail-sec"><div class="wrap"><div class="related-grid" style="grid-template-columns:repeat(2,1fr)">${cards}</div></div></section>`;
  document.title='Services — Talent & Purpose';
}
function renderIndustriesIndex(){
  const cards = INDUSTRIES.map((it,i)=>`<button class="related-card" type="button" data-route="#/industry/${it.slug}"><b>${String(i+1).padStart(2,'0')} · ${esc(it.name)}</b><small>${esc(it.tagline)}</small></button>`).join('');
  detailView.innerHTML = `
    <section class="detail-hero"><div class="glow aurora" aria-hidden="true"></div><div class="wrap">
      <button class="back-link" type="button" data-route="#/">← Home</button>
      <p class="eyebrow reveal">Industries</p>
      <h1 tabindex="-1" id="detailHeading" class="reveal">Specialized desks across <span style="background:var(--grad-brand);-webkit-background-clip:text;background-clip:text;color:transparent">twelve verticals.</span></h1>
      <p class="tag reveal">Each desk is run by recruiters who know the roles, the market rates, and the people. Open any industry to see how we support it.</p>
    </div></section>
    <section class="detail-sec"><div class="wrap"><div class="related-grid" style="grid-template-columns:repeat(2,1fr)">${cards}</div></div></section>`;
  document.title='Industries — Talent & Purpose';
}
function renderNotFound(){
  detailView.innerHTML = `<section class="detail-hero"><div class="wrap"><button class="back-link" type="button" data-route="#/">← Home</button><h1 tabindex="-1" id="detailHeading">Page not found.</h1><p class="tag">That page doesn't exist. Head back home to keep exploring.</p></div></section>`;
  document.title='Not found — Talent & Purpose';
}

function showHome(){ detailView.hidden=true; homeView.hidden=false; document.title='Talent & Purpose — Workforce Solutions'; }
function showDetail(){ homeView.hidden=true; detailView.hidden=false; }

function route(){
  const h = location.hash || '#/';
  if(h==='#/' || h.startsWith('#/#') || h==='' ){
    showHome();
    setActiveNav('#/');
    const anchor = h.startsWith('#/#') ? h.slice(2) : null;
    requestAnimationFrame(()=>{
      if(anchor){ const el=document.querySelector(anchor); if(el) el.scrollIntoView({behavior:reduced?'auto':'smooth'}); }
      else window.scrollTo({top:0,behavior:'auto'});
      wireReveals(); refreshTilt();
    });
    return;
  }
  showDetail();
  const parts = h.replace(/^#\//,'').split('/');
  if(parts[0]==='service' && parts[1]) renderService(parts[1]);
  else if(parts[0]==='industry' && parts[1]) renderIndustry(parts[1]);
  else if(parts[0]==='services') renderServicesIndex();
  else if(parts[0]==='industries') renderIndustriesIndex();
  else renderNotFound();
  setActiveNav(parts[0]==='service'||parts[0]==='services' ? '#/services' : (parts[0]==='industry'||parts[0]==='industries' ? '#/industries':'#/'));
  window.scrollTo({top:0,behavior:'auto'});
  const heading=document.getElementById('detailHeading');
  if(heading) heading.focus({preventScroll:true});
  wireReveals(); refreshTilt();
}
function setActiveNav(match){
  navButtons.forEach(b=>{ b.removeAttribute('aria-current'); });
  navButtons.forEach(b=>{ if(b.dataset.route===match) b.setAttribute('aria-current','page'); });
}
function go(r){ if(location.hash===r){ route(); } else { location.hash=r; } }

document.addEventListener('click', e=>{
  const t = e.target.closest('[data-route]');
  if(t){ e.preventDefault(); go(t.dataset.route); }
});
addEventListener('hashchange', route);

let revealObserver;
function wireReveals(){
  const els = document.querySelectorAll('.reveal:not(.in)');
  if(reduced){ els.forEach(el=>el.classList.add('in')); return; }
  if(!revealObserver){
    revealObserver = new IntersectionObserver((ents)=>{
      ents.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); revealObserver.unobserve(en.target);
        if(en.target.matches('.stat')) {} } });
    },{threshold:.14, rootMargin:'0px 0px -8% 0px'});
  }
  els.forEach(el=>revealObserver.observe(el));
}

const countObserver = new IntersectionObserver((ents)=>{
  ents.forEach(en=>{
    if(!en.isIntersecting) return;
    const el=en.target, to=+el.dataset.to;
    countObserver.unobserve(el);
    if(reduced){ el.textContent=to.toLocaleString(); return; }
    const dur=1700, start=performance.now();
    (function tick(now){ const p=Math.min((now-start)/dur,1); const e=1-Math.pow(1-p,3);
      el.textContent=Math.round(to*e).toLocaleString(); if(p<1) requestAnimationFrame(tick); })(start);
  });
},{threshold:.6});
document.querySelectorAll('.count').forEach(el=>countObserver.observe(el));

const timeline=document.getElementById('timeline');
function onScrollTimeline(){
  if(!timeline || homeView.hidden) return;
  const items=timeline.querySelectorAll('.t-item'), prog=document.getElementById('tprogress');
  const r=timeline.getBoundingClientRect(), vh=innerHeight;
  const p=Math.max(0,Math.min(1,(vh*0.7 - r.top)/(r.height*0.75)));
  prog.style.height=(p*100)+'%';
  items.forEach((it,i)=>it.classList.toggle('active', p>=(i/(items.length-1))-0.02));
}
addEventListener('scroll', onScrollTimeline, {passive:true});

const nav=document.getElementById('nav');
addEventListener('scroll',()=>{ nav.classList.toggle('scrolled', scrollY>10); },{passive:true});

const navToggle=document.getElementById('navToggle');
const navLinksEl=document.getElementById('navLinks');
function closeNavMenu(){
  navLinksEl.classList.remove('open');
  navToggle.setAttribute('aria-expanded','false');
  document.body.classList.remove('nav-open');
}
navToggle.addEventListener('click',()=>{
  const open=navLinksEl.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open?'true':'false');
  document.body.classList.toggle('nav-open', open);
});
navLinksEl.addEventListener('click', e=>{ if(e.target.closest('[data-route]')) closeNavMenu(); });
addEventListener('keydown', e=>{ if(e.key==='Escape') closeNavMenu(); });

if(hasHover && !reduced){
  const dot=document.querySelector('.cursor-dot'), ring=document.querySelector('.cursor-ring');
  let x=0,y=0,rx=0,ry=0;
  addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY;dot.style.transform=`translate(${x-3}px,${y-3}px)`;});
  (function loop(){rx+=(x-rx)*.14;ry+=(y-ry)*.14;ring.style.transform=`translate(${rx-17}px,${ry-17}px)`;requestAnimationFrame(loop);})();
  document.addEventListener('mouseover',e=>{ if(e.target.closest('a,button,.card,.ind,.related-card,.door-label')) document.body.classList.add('cursor-hover'); });
  document.addEventListener('mouseout',e=>{ if(e.target.closest('a,button,.card,.ind,.related-card,.door-label')) document.body.classList.remove('cursor-hover'); });
}
function bindMagnetic(){
  if(reduced) return;
  document.querySelectorAll('.magnetic:not([data-mag])').forEach(btn=>{
    btn.dataset.mag='1';
    btn.addEventListener('mousemove',e=>{const r=btn.getBoundingClientRect();btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.22}px,${(e.clientY-r.top-r.height/2)*.3}px)`;});
    btn.addEventListener('mouseleave',()=>btn.style.transform='translate(0,0)');
  });
}
function refreshTilt(){
  bindMagnetic();
  if(reduced) return;
  document.querySelectorAll('.tilt:not([data-tilt])').forEach(card=>{
    card.dataset.tilt='1';
    card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect();const px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
      card.style.setProperty('--mx',px*100+'%');card.style.setProperty('--my',py*100+'%');
      card.style.transform=`perspective(1000px) rotateY(${(px-.5)*7}deg) rotateX(${(.5-py)*7}deg) translateZ(6px)`;});
    card.addEventListener('mouseleave',()=>card.style.transform='');
  });
}

function init(){
  wireReveals(); refreshTilt(); onScrollTimeline();
  document.querySelector('.hero').classList.add('ready');
  route();
}
window.addEventListener('load',()=>{
  const bar=document.getElementById('loadbar'), pre=document.getElementById('preloader');
  if(reduced){ pre.remove(); init(); return; }
  requestAnimationFrame(()=>bar.style.transform='scaleX(1)');
  setTimeout(()=>{ pre.style.transition='opacity .5s'; pre.style.opacity='0'; setTimeout(()=>pre.remove(),520); init(); }, 700);
});

const CONTACT_FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbx64peztobgHGiuMMYchPJjb_ayxqGw_ZOeVjHyD5Fd7fc8WYxW-KfuRUjsrLuOemkQ2w/exec';
const contactModal = document.getElementById('contactModal');
const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');
const contactSubmit = document.getElementById('contactSubmit');

const COUNTRY_CODES = [
  ['Afghanistan','+93'],['Albania','+355'],['Algeria','+213'],['American Samoa','+1'],['Andorra','+376'],
  ['Angola','+244'],['Anguilla','+1'],['Antigua and Barbuda','+1'],['Argentina','+54'],['Armenia','+374'],
  ['Aruba','+297'],['Australia','+61'],['Austria','+43'],['Azerbaijan','+994'],['Bahamas','+1'],
  ['Bahrain','+973'],['Bangladesh','+880'],['Barbados','+1'],['Belarus','+375'],['Belgium','+32'],
  ['Belize','+501'],['Benin','+229'],['Bermuda','+1'],['Bhutan','+975'],['Bolivia','+591'],
  ['Bosnia and Herzegovina','+387'],['Botswana','+267'],['Brazil','+55'],['British Virgin Islands','+1'],['Brunei','+673'],
  ['Bulgaria','+359'],['Burkina Faso','+226'],['Burundi','+257'],['Cambodia','+855'],['Cameroon','+237'],
  ['Canada','+1'],['Cape Verde','+238'],['Cayman Islands','+1'],['Central African Republic','+236'],['Chad','+235'],
  ['Chile','+56'],['China','+86'],['Colombia','+57'],['Comoros','+269'],['Congo (DRC)','+243'],
  ['Congo (Republic)','+242'],['Cook Islands','+682'],['Costa Rica','+506'],['Croatia','+385'],['Cuba','+53'],
  ['Curacao','+599'],['Cyprus','+357'],['Czech Republic','+420'],['Denmark','+45'],['Djibouti','+253'],
  ['Dominica','+1'],['Dominican Republic','+1'],['Ecuador','+593'],['Egypt','+20'],['El Salvador','+503'],
  ['Equatorial Guinea','+240'],['Eritrea','+291'],['Estonia','+372'],['Eswatini','+268'],['Ethiopia','+251'],
  ['Fiji','+679'],['Finland','+358'],['France','+33'],['French Guiana','+594'],['French Polynesia','+689'],
  ['Gabon','+241'],['Gambia','+220'],['Georgia','+995'],['Germany','+49'],['Ghana','+233'],
  ['Gibraltar','+350'],['Greece','+30'],['Greenland','+299'],['Grenada','+1'],['Guadeloupe','+590'],
  ['Guam','+1'],['Guatemala','+502'],['Guinea','+224'],['Guinea-Bissau','+245'],['Guyana','+592'],
  ['Haiti','+509'],['Honduras','+504'],['Hong Kong','+852'],['Hungary','+36'],['Iceland','+354'],
  ['India','+91'],['Indonesia','+62'],['Iran','+98'],['Iraq','+964'],['Ireland','+353'],
  ['Israel','+972'],['Italy','+39'],['Ivory Coast','+225'],['Jamaica','+1'],['Japan','+81'],
  ['Jordan','+962'],['Kazakhstan','+7'],['Kenya','+254'],['Kiribati','+686'],['Kosovo','+383'],
  ['Kuwait','+965'],['Kyrgyzstan','+996'],['Laos','+856'],['Latvia','+371'],['Lebanon','+961'],
  ['Lesotho','+266'],['Liberia','+231'],['Libya','+218'],['Liechtenstein','+423'],['Lithuania','+370'],
  ['Luxembourg','+352'],['Macau','+853'],['Madagascar','+261'],['Malawi','+265'],['Malaysia','+60'],
  ['Maldives','+960'],['Mali','+223'],['Malta','+356'],['Marshall Islands','+692'],['Martinique','+596'],
  ['Mauritania','+222'],['Mauritius','+230'],['Mayotte','+262'],['Mexico','+52'],['Micronesia','+691'],
  ['Moldova','+373'],['Monaco','+377'],['Mongolia','+976'],['Montenegro','+382'],['Montserrat','+1'],
  ['Morocco','+212'],['Mozambique','+258'],['Myanmar','+95'],['Namibia','+264'],['Nauru','+674'],
  ['Nepal','+977'],['Netherlands','+31'],['New Caledonia','+687'],['New Zealand','+64'],['Nicaragua','+505'],
  ['Niger','+227'],['Nigeria','+234'],['Niue','+683'],['North Korea','+850'],['North Macedonia','+389'],
  ['Norway','+47'],['Oman','+968'],['Pakistan','+92'],['Palau','+680'],['Palestine','+970'],
  ['Panama','+507'],['Papua New Guinea','+675'],['Paraguay','+595'],['Peru','+51'],['Philippines','+63'],
  ['Poland','+48'],['Portugal','+351'],['Puerto Rico','+1'],['Qatar','+974'],['Reunion','+262'],
  ['Romania','+40'],['Russia','+7'],['Rwanda','+250'],['Saint Kitts and Nevis','+1'],['Saint Lucia','+1'],
  ['Saint Vincent and the Grenadines','+1'],['Samoa','+685'],['San Marino','+378'],['Sao Tome and Principe','+239'],['Saudi Arabia','+966'],
  ['Senegal','+221'],['Serbia','+381'],['Seychelles','+248'],['Sierra Leone','+232'],['Singapore','+65'],
  ['Slovakia','+421'],['Slovenia','+386'],['Solomon Islands','+677'],['Somalia','+252'],['South Africa','+27'],
  ['South Korea','+82'],['South Sudan','+211'],['Spain','+34'],['Sri Lanka','+94'],['Sudan','+249'],
  ['Suriname','+597'],['Sweden','+46'],['Switzerland','+41'],['Syria','+963'],['Taiwan','+886'],
  ['Tajikistan','+992'],['Tanzania','+255'],['Thailand','+66'],['Timor-Leste','+670'],['Togo','+228'],
  ['Tonga','+676'],['Trinidad and Tobago','+1'],['Tunisia','+216'],['Turkey','+90'],['Turkmenistan','+993'],
  ['Turks and Caicos Islands','+1'],['Tuvalu','+688'],['Uganda','+256'],['Ukraine','+380'],['United Arab Emirates','+971'],
  ['United Kingdom','+44'],['United States','+1'],['Uruguay','+598'],['Uzbekistan','+998'],['Vanuatu','+678'],
  ['Vatican City','+379'],['Venezuela','+58'],['Vietnam','+84'],['Yemen','+967'],['Zambia','+260'],
  ['Zimbabwe','+263']
];
const countryCodeSelect = document.getElementById('countryCode');
COUNTRY_CODES.forEach(([name,code])=>{
  const opt = document.createElement('option');
  const label = `${code} ${name}`;
  opt.value = label;
  opt.textContent = label;
  countryCodeSelect.appendChild(opt);
});
let contactOpener = null;

function openContactModal(opener){
  contactOpener = opener || null;
  contactModal.hidden = false;
  requestAnimationFrame(()=>contactModal.classList.add('open'));
  document.body.classList.add('modal-open');
  contactModal.querySelector('input,select,textarea').focus();
}
function closeContactModal(){
  contactModal.classList.remove('open');
  document.body.classList.remove('modal-open');
  setTimeout(()=>{ contactModal.hidden = true; }, 300);
  if(contactOpener) contactOpener.focus();
}
document.getElementById('openContactModal').addEventListener('click', e=>openContactModal(e.currentTarget));
document.getElementById('contactModalClose').addEventListener('click', closeContactModal);
contactModal.addEventListener('click', e=>{ if(e.target===contactModal) closeContactModal(); });
addEventListener('keydown', e=>{ if(e.key==='Escape' && !contactModal.hidden) closeContactModal(); });

const formToast = document.getElementById('formToast');
let toastTimer = null;
function showToast(msg){
  formToast.querySelector('p').textContent = msg;
  formToast.hidden = false;
  requestAnimationFrame(()=>formToast.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 6000);
}
function hideToast(){
  formToast.classList.remove('show');
  clearTimeout(toastTimer);
  setTimeout(()=>{ formToast.hidden = true; }, 350);
}
document.getElementById('toastClose').addEventListener('click', hideToast);

contactForm.addEventListener('submit', async e=>{
  e.preventDefault();
  if(!contactForm.checkValidity()){ contactForm.reportValidity(); return; }
  if(!CONTACT_FORM_ENDPOINT){ contactStatus.textContent='Form is not connected yet.'; contactStatus.className='cf-status err'; return; }
  contactSubmit.disabled = true;
  contactStatus.textContent = 'Sending...'; contactStatus.className='cf-status';
  try{
    const fd = new FormData(contactForm);
    const phoneVal = contactForm.phone.value.trim();
    const codeVal = contactForm.countryCode.value;
    if(phoneVal && codeVal) fd.set('phone', `${phoneVal} (${codeVal})`);
    fd.delete('countryCode');
    await fetch(CONTACT_FORM_ENDPOINT, { method:'POST', mode:'no-cors', body:fd });
    contactStatus.textContent = "Thanks — we'll be in touch within one business day.";
    contactStatus.className = 'cf-status ok';
    contactForm.reset();
    setTimeout(()=>{
      closeContactModal();
      setTimeout(()=>showToast("Thanks — your message was submitted. We'll be in touch soon."), 350);
    }, 1200);
  }catch(err){
    contactStatus.textContent = 'Something went wrong. Please try again or email hello@talentnpurpose.com.';
    contactStatus.className = 'cf-status err';
  }finally{
    contactSubmit.disabled = false;
  }
});

if(typeof THREE!=='undefined' && !isMobile){

(function(){
  const canvas=document.getElementById('hero-canvas');
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(55,1,.1,100); camera.position.z=16;
  const group=new THREE.Group(); scene.add(group);
  const N=320,R=9,pos=new Float32Array(N*3),col=new Float32Array(N*3);
  const cA=new THREE.Color(0x33c7d8),cB=new THREE.Color(0xffc93c),cC=new THREE.Color(0x13c98a),pts=[];
  for(let i=0;i<N;i++){
    const th=Math.random()*Math.PI*2, ph=Math.acos(2*Math.random()-1), r=R*(.55+.45*Math.random());
    const x=r*Math.sin(ph)*Math.cos(th),y=r*Math.cos(ph)*.62,z=r*Math.sin(ph)*Math.sin(th);
    pos.set([x,y,z],i*3); pts.push(new THREE.Vector3(x,y,z));
    const c=Math.random()<.18?cC:cA.clone().lerp(cB,Math.random()); col.set([c.r,c.g,c.b],i*3);
  }
  const pGeo=new THREE.BufferGeometry();
  pGeo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  pGeo.setAttribute('color',new THREE.BufferAttribute(col,3));
  group.add(new THREE.Points(pGeo,new THREE.PointsMaterial({size:.09,vertexColors:true,transparent:true,opacity:.95,sizeAttenuation:true})));
  const edges=[],lp=[];
  for(let i=0;i<N;i++){let k=0;for(let j=i+1;j<N&&k<3;j++){if(pts[i].distanceTo(pts[j])<2.4){edges.push([i,j]);lp.push(pts[i].x,pts[i].y,pts[i].z,pts[j].x,pts[j].y,pts[j].z);k++;}}}
  const lGeo=new THREE.BufferGeometry(); lGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(lp),3));
  group.add(new THREE.LineSegments(lGeo,new THREE.LineBasicMaterial({color:0x33c7d8,transparent:true,opacity:.14})));
  const PN=26,pulses=[],puPos=new Float32Array(PN*3),puGeo=new THREE.BufferGeometry();
  puGeo.setAttribute('position',new THREE.BufferAttribute(puPos,3));
  group.add(new THREE.Points(puGeo,new THREE.PointsMaterial({size:.16,color:0x9fe8f0,transparent:true,opacity:.9})));
  for(let i=0;i<PN;i++)pulses.push({e:edges[(Math.random()*edges.length)|0],t:Math.random(),v:.004+Math.random()*.008});
  let mx=0,my=0,tx=0,ty=0;
  addEventListener('mousemove',e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5;},{passive:true});
  function resize(){const w=canvas.clientWidth||innerWidth,h=canvas.clientHeight||innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
  resize(); addEventListener('resize',resize);
  let vis=true; new IntersectionObserver(en=>vis=en[0].isIntersecting).observe(canvas);
  const clock=new THREE.Clock();
  (function tick(){requestAnimationFrame(tick); if(!vis||homeView.hidden)return;
    const t=clock.getElapsedTime();
    if(!reduced){mx+=(tx-mx)*.04;my+=(ty-my)*.04;}
    group.rotation.y=t*.05+mx*.5; group.rotation.x=my*.3+Math.sin(t*.2)*.04;
    for(let i=0;i<PN;i++){const p=pulses[i];p.t+=reduced?0:p.v;if(p.t>1){p.t=0;p.e=edges[(Math.random()*edges.length)|0];}
      const a=pts[p.e[0]],b=pts[p.e[1]];puPos[i*3]=a.x+(b.x-a.x)*p.t;puPos[i*3+1]=a.y+(b.y-a.y)*p.t;puPos[i*3+2]=a.z+(b.z-a.z)*p.t;}
    puGeo.attributes.position.needsUpdate=true; renderer.render(scene,camera);
  })();
})();

(function(){
  const canvas=document.getElementById('globe-canvas');
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(45,1,.1,100); camera.position.z=13;
  const globe=new THREE.Group(); scene.add(globe); const R=4.4;
  const GN=900,gp=new Float32Array(GN*3);
  for(let i=0;i<GN;i++){const y=1-(i/(GN-1))*2,rad=Math.sqrt(1-y*y),th=i*2.39996;gp.set([Math.cos(th)*rad*R,y*R,Math.sin(th)*rad*R],i*3);}
  const gGeo=new THREE.BufferGeometry(); gGeo.setAttribute('position',new THREE.BufferAttribute(gp,3));
  globe.add(new THREE.Points(gGeo,new THREE.PointsMaterial({size:.045,color:0x2f6b74,transparent:true,opacity:.6})));
  function ll(lat,lon,r){const phi=(90-lat)*Math.PI/180,th=(lon+180)*Math.PI/180;return new THREE.Vector3(-r*Math.sin(phi)*Math.cos(th),r*Math.cos(phi),r*Math.sin(phi)*Math.sin(th));}
  const CITIES=[{lat:39,lon:-98,c:0x33c7d8},{lat:56,lon:-106,c:0x13c98a},{lat:22,lon:78,c:0xffc93c}];
  const markers=[];
  CITIES.forEach(ct=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.09,12,12),new THREE.MeshBasicMaterial({color:ct.c}));m.position.copy(ll(ct.lat,ct.lon,R+.02));globe.add(m);markers.push(m);
    const halo=new THREE.Mesh(new THREE.SphereGeometry(.2,12,12),new THREE.MeshBasicMaterial({color:ct.c,transparent:true,opacity:.25}));halo.position.copy(m.position);globe.add(halo);m.userData.halo=halo;});
  const pairs=[[0,2],[1,2],[0,1]],travelers=[];
  pairs.forEach(pr=>{const a=ll(CITIES[pr[0]].lat,CITIES[pr[0]].lon,R),b=ll(CITIES[pr[1]].lat,CITIES[pr[1]].lon,R);
    const mid=a.clone().add(b).multiplyScalar(.5).normalize().multiplyScalar(R*1.55);const curve=new THREE.QuadraticBezierCurve3(a,mid,b);
    globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(64)),new THREE.LineBasicMaterial({color:0x13c98a,transparent:true,opacity:.5})));
    const tr=new THREE.Mesh(new THREE.SphereGeometry(.07,10,10),new THREE.MeshBasicMaterial({color:0xffffff}));globe.add(tr);travelers.push({mesh:tr,curve,t:Math.random()});});
  function resize(){const s=canvas.clientWidth||480;renderer.setSize(s,s,false);camera.aspect=1;camera.updateProjectionMatrix();}
  resize(); addEventListener('resize',resize);
  let vis=false,drag=false,lx=0,vy=0;
  new IntersectionObserver(en=>vis=en[0].isIntersecting).observe(canvas);
  canvas.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;});
  addEventListener('pointerup',()=>drag=false);
  addEventListener('pointermove',e=>{if(drag){vy=(e.clientX-lx)*.005;lx=e.clientX;}},{passive:true});
  const clock=new THREE.Clock();
  (function tick(){requestAnimationFrame(tick); if(!vis||homeView.hidden)return;
    const t=clock.getElapsedTime();
    globe.rotation.y+=reduced?0:(.0022+vy); vy*=.92; globe.rotation.x=.28;
    markers.forEach((m,i)=>{const s=1+Math.sin(t*2.4+i*2)*.35;m.userData.halo.scale.setScalar(s);});
    travelers.forEach(tr=>{tr.t=(tr.t+(reduced?0:.0035))%1;tr.mesh.position.copy(tr.curve.getPoint(tr.t));});
    renderer.render(scene,camera);
  })();
})();

(function(){
  const canvas = document.getElementById('hub-canvas');
  const section = document.getElementById('seekers');
  const uiIntro = document.getElementById('hub-ui-intro');
  
  if (!canvas || !section) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x080b0e, 1);
  
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x080b0e, 0.015);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
  camera.position.set(0, 0, 10);

  const zoneColors = [
      new THREE.Color(0x33c7d8), 
      new THREE.Color(0x13c98a), 
      new THREE.Color(0xffc93c), 
      new THREE.Color(0x7fe6ea)  
  ];

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  function createGlowTexture(hex) {
      const c = document.createElement('canvas'); c.width = 128; c.height = 128;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(64,64,0, 64,64,64);
      grad.addColorStop(0, hex); grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad; ctx.fillRect(0,0,128,128);
      return new THREE.CanvasTexture(c);
  }

  const portals = [];
  const zoneMeshes = [];
  
  for (let i = 0; i < 4; i++) {
      const zPos = -i * 100 - 40; 
      
      const pGroup = new THREE.Group();
      pGroup.position.set(0, 0, zPos);
      
      const ringGeo = new THREE.RingGeometry(8, 9.5, 64);
      const ringMat = new THREE.MeshBasicMaterial({ 
          color: zoneColors[i], transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, side: THREE.DoubleSide 
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      pGroup.add(ring);

      const glowMat = new THREE.SpriteMaterial({ 
          map: createGlowTexture('#' + zoneColors[i].getHexString()), 
          transparent: true, blending: THREE.AdditiveBlending, opacity: 0.8 
      });
      const glowSprite = new THREE.Sprite(glowMat);
      glowSprite.scale.set(40, 40, 1);
      pGroup.add(glowSprite);

      scene.add(pGroup);
      portals.push(pGroup);

      const envGroup = new THREE.Group();
      envGroup.position.set(0, 0, zPos - 30);
      
      if (i === 0) {
          const count = 50;
          const iMesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(1.5, 2), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15, side: THREE.DoubleSide, wireframe: true }), count);
          const dummy = new THREE.Object3D();
          for(let j=0; j<count; j++) {
              dummy.position.set((Math.random()-0.5)*50, (Math.random()-0.5)*50, (Math.random()-0.5)*60);
              dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
              dummy.updateMatrix(); iMesh.setMatrixAt(j, dummy.matrix);
          }
          envGroup.add(iMesh);
          zoneMeshes.push({ type: 'rotate', mesh: envGroup, speed: 0.001 });
          
      } else if (i === 1) {
          const count = 35;
          const iMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.65, 8, 8), new THREE.MeshBasicMaterial({ color: zoneColors[i], wireframe: true, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending }), count);
          const dummy = new THREE.Object3D();
          for(let j=0; j<count; j++) {
              dummy.position.set((Math.random()-0.5)*60, (Math.random()-0.5)*40, (Math.random()-0.5)*60);
              dummy.updateMatrix(); iMesh.setMatrixAt(j, dummy.matrix);
          }
          envGroup.add(iMesh);
          zoneMeshes.push({ type: 'pulse', mesh: envGroup, speed: 0.002 });
          
      } else if (i === 2) {
          const count = 20;
          const iMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(3.6, 40, 3.6), new THREE.MeshBasicMaterial({ color: 0x121a20 }), count);
          const dummy = new THREE.Object3D();
          for(let j=0; j<count; j++) {
              dummy.position.set((Math.random()-0.5)*80, -25 + (Math.random()*10), (Math.random()-0.5)*80);
              dummy.updateMatrix(); iMesh.setMatrixAt(j, dummy.matrix);
          }
          const edges = new THREE.InstancedMesh(new THREE.BoxGeometry(3.65, 40.05, 3.65), new THREE.MeshBasicMaterial({ color: zoneColors[i], wireframe: true, transparent: true, opacity: 0.1 }), count);
          for(let j=0; j<count; j++) {
              dummy.position.set((Math.random()-0.5)*80, -25 + (Math.random()*10), (Math.random()-0.5)*80);
              dummy.updateMatrix(); edges.setMatrixAt(j, dummy.matrix);
          }
          envGroup.add(iMesh); envGroup.add(edges);
          zoneMeshes.push({ type: 'static', mesh: envGroup, speed: 0 });
          
      } else if (i === 3) {
          for(let j=0; j<6; j++) {
              const ring = new THREE.Mesh(new THREE.TorusGeometry(8 + j*3, 0.04, 16, 100), new THREE.MeshBasicMaterial({ color: zoneColors[i], transparent: true, opacity: 0.5 }));
              ring.rotation.x = Math.random() * Math.PI;
              ring.userData.rotX = (Math.random()-0.5)*0.01;
              ring.userData.rotY = (Math.random()-0.5)*0.01;
              envGroup.add(ring);
          }
          zoneMeshes.push({ type: 'rings', mesh: envGroup, speed: 0 });
      }
      
      scene.add(envGroup);
  }

  const dustCount = 500;
  const dGeo = new THREE.BufferGeometry();
  const dPos = new Float32Array(dustCount * 3);
  for(let i=0; i<dustCount; i++) {
      dPos[i*3] = (Math.random() - 0.5) * 100;
      dPos[i*3+1] = (Math.random() - 0.5) * 80;
      dPos[i*3+2] = 10 - (Math.random() * 450);
  }
  dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
  const dMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.16, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
  const dust = new THREE.Points(dGeo, dMat);
  scene.add(dust);

  let mouseX = 0, mouseY = 0;
  let targetZ = 0;
  let progress = 0;

  if (!reduced) {
      window.addEventListener('mousemove', e => {
          mouseX = (e.clientX / window.innerWidth) * 2 - 1;
          mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      }, { passive: true });
  }

  window.addEventListener('scroll', () => {
      const rect = section.getBoundingClientRect();
      const scrolled = -rect.top;
      const total = rect.height - window.innerHeight;
      if (total > 0 && scrolled > -window.innerHeight && scrolled < total + window.innerHeight) {
          progress = Math.max(0, Math.min(1, scrolled / total));
          targetZ = -(progress * 380); 
      }
  }, { passive: true });

  function resize() {
      const w = section.clientWidth || window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
  }
  resize(); window.addEventListener('resize', resize);

  let hubVisible = true;
  new IntersectionObserver(en => hubVisible = en[0].isIntersecting).observe(section);

  const tmpVec = new THREE.Vector3();
  const baseDark = new THREE.Color(0x080b0e);
  const activeTint = new THREE.Color();

  (function render(time) {
      requestAnimationFrame(render);
      if (homeView.hidden || !hubVisible) return;

      const t = time * 0.001;

      camera.position.z += (targetZ - camera.position.z) * 0.08;
      if (!reduced) {
          camera.position.x += (mouseX * 4 - camera.position.x) * 0.05;
          camera.position.y += (mouseY * 2 - camera.position.y) * 0.05;
          camera.rotation.y = -(camera.position.x * 0.05);
          camera.rotation.x = (camera.position.y * 0.05);
      }

      uiIntro.style.opacity = progress > 0.05 ? Math.max(0, 1 - (progress - 0.05)*20) : 1;

      const absZ = Math.abs(camera.position.z);
      const zoneFloat = absZ / 100;
      let zIdx = Math.floor(zoneFloat);
      let lerpAmt = zoneFloat - zIdx;
      if (zIdx > 2) { zIdx = 2; lerpAmt = 1; } 

      const c1 = zoneColors[zIdx] || zoneColors[0];
      const c2 = zoneColors[zIdx+1] || zoneColors[3];
      activeTint.copy(c1).lerp(c2, lerpAmt);
      
      scene.fog.color.copy(baseDark).lerp(activeTint, 0.12);
      renderer.setClearColor(scene.fog.color);

      portals.forEach((p, i) => {
          if (!reduced) {
              p.rotation.z += 0.001;
              p.scale.setScalar(1 + Math.sin(t * 2 + i) * 0.03);
          }
          
          const pl = document.getElementById('pl-' + i);
          if (pl) {
              tmpVec.set(0, 7.5, 0); 
              p.localToWorld(tmpVec);
              tmpVec.project(camera);
              
              const dist = camera.position.z - p.position.z; 
              
              if (tmpVec.z > 1 || dist < -5) {
                  pl.style.opacity = 0; 
              } else {
                  const x = (tmpVec.x * 0.5 + 0.5) * window.innerWidth;
                  const y = (-tmpVec.y * 0.5 + 0.5) * window.innerHeight;
                  
                  let op = 1 - (dist / 140); 
                  if (op < 0) op = 0;
                  if (dist < 15) op = dist / 15; 
                  
                  pl.style.opacity = op;
                  pl.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) scale(${0.8 + (1-dist/150)*0.4})`;
                  pl.style.borderColor = dist < 40 && dist > -5 ? `rgba(${activeTint.r*255},${activeTint.g*255},${activeTint.b*255},0.6)` : 'rgba(255,255,255,0.1)';
              }
          }
      });

      zoneMeshes.forEach(z => {
          if (reduced) return;
          if (z.type === 'rotate') {
              z.mesh.rotation.y += z.speed;
              z.mesh.rotation.x += z.speed * 0.5;
          } else if (z.type === 'pulse') {
              z.mesh.rotation.y -= z.speed;
              const s = 1 + Math.sin(t*2)*0.1;
              z.mesh.scale.set(s,s,s);
          } else if (z.type === 'rings') {
              z.mesh.children.forEach(c => {
                  c.rotation.x += c.userData.rotX;
                  c.rotation.y += c.userData.rotY;
              });
          }
      });

      const positions = dust.geometry.attributes.position.array;
      for(let i=0; i<dustCount; i++) {
          positions[i*3+2] += 0.2; 
          if (positions[i*3+2] > camera.position.z + 10) {
              positions[i*3+2] = camera.position.z - 400;
          }
      }
      dust.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
  })(0);
})();
}
})();