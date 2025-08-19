// Mobile nav toggle + year
const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}
// Close nav on link click (mobile)
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', ()=>{
  nav.classList.remove('open'); navToggle?.setAttribute('aria-expanded','false');
}));
// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Theme toggle with localStorage
(function(){
  const btn = document.getElementById('theme-toggle');
  const root = document.body;
  const KEY = 'estepona-theme';
  const apply = (mode) => {
    if (mode === 'light'){ root.classList.add('light'); btn.textContent = 'Mode sombre'; }
    else { root.classList.remove('light'); btn.textContent = 'Mode clair'; }
  };
  const saved = localStorage.getItem(KEY);
  if (saved) apply(saved);
  btn?.addEventListener('click', ()=>{
    const mode = root.classList.contains('light') ? 'dark' : 'light';
    localStorage.setItem(KEY, mode);
    apply(mode);
  });
})();

// ==== Carte interactive Estepona (Leaflet + OSM) ====
(function(){
  const mapEl = document.getElementById('map');
  if (!mapEl || typeof L === 'undefined') return;

  // Centre approximatif d'Estepona
  const map = L.map('map', {scrollWheelZoom:true}).setView([36.4276, -5.1459], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // Icônes emoji par catégorie
  const icon = (emoji) => L.divIcon({className:'marker-emoji', html:`<div style="font-size:22px">${emoji}</div>`, iconSize:[24,24], iconAnchor:[12,12]});

  // Exemples de lieux (remplace par des adresses précises si tu veux)
  const places = [
    // Plages
    {cat:'plage', name:'Playa de la Rada', coords:[36.4237,-5.1455], desc:'Large plage familiale en centre-ville.'},
    {cat:'plage', name:'Playa del Cristo', coords:[36.4166,-5.1663], desc:'Crique abritée, eau calme — idéale enfants.'},
    {cat:'plage', name:'Playa del Saladillo', coords:[36.4519,-5.0666], desc:'Longue plage vers Cancelada.'},
    // Chiringuitos
    {cat:'chiringuito', name:'Chiringuito El Cristo', coords:[36.4174,-5.1669], desc:'Tapas, cocktails & coucher de soleil.'},
    {cat:'chiringuito', name:'La Rada Beach', coords:[36.4261,-5.1399], desc:'Poissons grillés sur la plage.'},
    // Restaurants
    {cat:'restaurant', name:'Old Town Tapas', coords:[36.4257,-5.1485], desc:'Tapas typiques dans la vieille ville.'},
    {cat:'restaurant', name:'Port Seafood', coords:[36.4202,-5.1593], desc:'Fruits de mer au port de plaisance.'},
  ];

  const layers = {
    plage: L.layerGroup().addTo(map),
    chiringuito: L.layerGroup().addTo(map),
    restaurant: L.layerGroup().addTo(map),
  };

  const catEmoji = {plage:'🏖️', chiringuito:'🍹', restaurant:'🍽️'};

  places.forEach(p => {
    const m = L.marker(p.coords, {icon: icon(catEmoji[p.cat])})
      .bindPopup(`<b>${p.name}</b><br>${p.desc}<br><a href="https://www.google.com/maps/dir/?api=1&destination=${p.coords[0]},${p.coords[1]}" target="_blank" rel="noopener">Itinéraire</a>`);
    layers[p.cat].addLayer(m);
  });

  // Filtres par catégorie
  document.querySelectorAll('.filter').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const cat = e.target.dataset.cat;
      if (e.target.checked) {
        layers[cat].addTo(map);
      } else {
        map.removeLayer(layers[cat]);
      }
    });
  });

  // Style pour marqueurs emoji
  const style = document.createElement('style');
  style.textContent = `.marker-emoji{display:grid; place-items:center; width:28px; height:28px; border-radius:50%; background:rgba(56,189,248,.15); border:1px solid rgba(56,189,248,.35); box-shadow:0 4px 12px rgba(2,6,23,.35)}`;
  document.head.appendChild(style);
})();
