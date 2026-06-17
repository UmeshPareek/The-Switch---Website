// ============================================================
// the switch. — supabase.js
// Replace SUPABASE_URL and SUPABASE_ANON_KEY with your values
// ============================================================

const SUPABASE_URL  = 'https://ncosbgwexgyzrpwynsfc.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jb3NiZ3dleGd5enJwd3luc2ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2ODI0OTEsImV4cCI6MjA5NzI1ODQ5MX0.T3mCCzPzIx8hE1GIpiPdj6BQhtKhSozZteFoywys_ps';

// ── Init ──────────────────────────────────────────────────
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON);

// ── Fallback / seed data (used when Supabase not configured) ──
const SEED_PROPERTIES = [
  {
    id: 1, slug: 'switch-volt', name: 'Switch Volt',
    location: 'Sarjapur', area: 'Bengaluru',
    bhk: '1BHK', rent: 25000, units: 40,
    status: 'available',
    description: 'Walk in with a suitcase. Everything else is already there. Switch Volt is our Sarjapur node — built for professionals who need zero friction between work and home.',
    amenities: ['Fully Furnished', 'High-Speed WiFi', 'Caretaker On-Site', '11-Month L&L', 'No Broker', 'One Month Deposit'],
    map_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.0!2d77.6933!3d12.8698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSarjapur%2C+Bengaluru!5e0!3m2!1sen!2sin!4v1!5m2!1sen!2sin',
    images: [
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&q=80',
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=1200&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80'
    ]
  },
  {
    id: 2, slug: 'switch-arc', name: 'Switch Arc',
    location: 'Yemlur', area: 'Bengaluru',
    bhk: '1BHK', rent: 23000, units: 30,
    status: 'available',
    description: 'Yemlur is quiet. Switch Arc is quieter. A building of people who are building things — five minutes from the airport corridor, zero minutes from a decent chai.',
    amenities: ['Fully Furnished', 'High-Speed WiFi', 'Caretaker On-Site', '11-Month L&L', 'No Broker', 'One Month Deposit'],
    map_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.0!2d77.7480!3d12.9600!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sYemlur%2C+Bengaluru!5e0!3m2!1sen!2sin!4v1!5m2!1sen!2sin',
    images: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80'
    ]
  },
  {
    id: 3, slug: 'switch-flux', name: 'Switch Flux',
    location: 'Yemlur', area: 'Bengaluru',
    bhk: '1BHK', rent: 24000, units: 35,
    status: 'coming-soon',
    description: 'Switch Flux is coming. If you know, you know. Yemlur\'s second node — more space, same standard. Join the waitlist before it gets long.',
    amenities: ['Fully Furnished', 'High-Speed WiFi', 'Caretaker On-Site', '11-Month L&L', 'No Broker', 'One Month Deposit'],
    map_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.0!2d77.7520!3d12.9580!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sYemlur%2C+Bengaluru!5e0!3m2!1sen!2sin!4v1!5m2!1sen!2sin',
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=1200&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80'
    ]
  }
];

const SEED_GRID_MEMBERS = [
  { id:1, time:'6am',   role:'Gym Buddy',       quote:'No negotiation. 6am.',                   img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80' },
  { id:2, time:'Work',  role:'Startup Founder', quote:'Always hiring. Always caffeinated.',     img:'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80' },
  { id:3, time:'4pm',   role:'Chai Buddy',      quote:'Very strong opinions on cutting chai.',  img:'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=80' },
  { id:4, time:'Weekend', role:'Weekend Hiker', quote:'Nandi Hills at 5am. Has good trail mix.',img:'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&q=80' },
  { id:5, time:'11:30pm',role:'Midnight Foodie',quote:'Knows which dal makhni is open.',        img:'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80' },
  { id:6, time:'Work',  role:'VC Analyst',      quote:'Will hear your pitch. Bring chai.',      img:'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80' },
  { id:7, time:'Culture',role:'Book Club Person',quote:'Will notice if you didn\'t read.',      img:'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80' },
  { id:8, time:'Work',  role:'Product Manager', quote:'Has opinions. All of them.',             img:'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&q=80' },
];

// ── Data helpers ──────────────────────────────────────────
const isConfigured = () => true;

async function getProperties() {
  if (!isConfigured()) return SEED_PROPERTIES;
  const { data, error } = await db.from('properties').select('*').order('sort_order');
  return error ? SEED_PROPERTIES : data;
}

async function getProperty(slug) {
  if (!isConfigured()) return SEED_PROPERTIES.find(p => p.slug === slug) || null;
  const { data, error } = await db.from('properties').select('*').eq('slug', slug).single();
  return error ? null : data;
}

async function getGridMembers() {
  if (!isConfigured()) return SEED_GRID_MEMBERS;
  const { data, error } = await db.from('grid_members').select('*').order('sort_order');
  return error ? SEED_GRID_MEMBERS : data;
}

async function submitEnquiry(payload) {
  if (!isConfigured()) { console.log('Enquiry (offline):', payload); return { ok: true }; }
  const { error } = await db.from('enquiries').insert(payload);
  return { ok: !error, error };
}

async function submitGridRequest(payload) {
  if (!isConfigured()) { console.log('Grid request (offline):', payload); return { ok: true }; }
  const { error } = await db.from('grid_requests').insert(payload);
  return { ok: !error, error };
}

// ── Utilities ─────────────────────────────────────────────
function statusBadge(status) {
  const map = {
    'available':   ['badge-available', 'Available Now'],
    'filling-fast':['badge-filling',   'Filling Fast'],
    'full':        ['badge-full',       'Full'],
    'coming-soon': ['badge-soon',       'Coming Soon'],
  };
  const [cls, label] = map[status] || ['badge-soon', status];
  return `<span class="badge ${cls}">${label}</span>`;
}

function formatRent(n) {
  return '₹' + Number(n).toLocaleString('en-IN') + '/mo';
}

function initFadeUp() {
  const els = document.querySelectorAll('.fade-up');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

function initNav() {
  const burger = document.getElementById('burger');
  const mobile = document.getElementById('navMobile');
  if (burger && mobile) {
    burger.addEventListener('click', () => mobile.classList.toggle('open'));
    mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobile.classList.remove('open')));
  }
}

function navComponent(active = '') {
  const links = [
    { href: '/properties.html',  label: 'Properties' },
    { href: '/the-grid.html',    label: 'the grid.' },
    { href: '/about.html',       label: 'About' },
    { href: '/contact.html',     label: 'Contact' },
  ];
  return `
  <nav class="nav">
    <div class="nav-inner">
      <a href="/index.html" class="nav-logo">
        <span class="toggle-icon"></span>
        the switch<span class="dot">.</span>
      </a>
      <div class="nav-links">
        ${links.map(l => `<a href="${l.href}" ${active===l.label?'style="color:var(--cream)"':''}>${l.label}</a>`).join('')}
        <a href="/contact.html" class="nav-cta">Just show up →</a>
      </div>
      <button class="nav-hamburger" id="burger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>
  <div class="nav-mobile" id="navMobile">
    ${links.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}
    <a href="/contact.html" class="nav-cta btn-primary">Just show up →</a>
  </div>`;
}

function footerComponent() {
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand-name">the switch<span class="dot">.</span></div>
          <p class="footer-tagline">just show up.<br>Managed residential living in Bengaluru.<br>Fully furnished. Zero broker.</p>
          <a href="mailto:hello@theswitch.living" style="font-size:13px;color:var(--muted)">hello@theswitch.living</a>
        </div>
        <div class="footer-col">
          <h4>Properties</h4>
          <ul>
            <li><a href="/property/switch-volt.html">Switch Volt — Sarjapur</a></li>
            <li><a href="/property/switch-arc.html">Switch Arc — Yemlur</a></li>
            <li><a href="/property/switch-flux.html">Switch Flux — Yemlur</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="/the-grid.html">the grid.</a></li>
            <li><a href="/about.html">About</a></li>
            <li><a href="/contact.html">For Investors</a></li>
            <li><a href="/contact.html">For Landowners</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Follow</h4>
          <ul>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 the switch. living LLP · Bengaluru, India</span>
        <span>just show up.</span>
      </div>
    </div>
  </footer>
  <a href="https://wa.me/917892278953" class="wa-float" target="_blank" rel="noopener" aria-label="WhatsApp">
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  </a>`;
}
