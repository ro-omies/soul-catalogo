// Simple demo JS: loads sample data and renders product cards + gallery
const DATA_URL = 'assets/data/catalogo.json';

async function fetchData(){
  const res = await fetch(DATA_URL);
  const data = await res.json();
  return data;
}

function createCard(p){
  const div = document.createElement('div');
  div.className = 'card';
  div.innerHTML = `<div style="height:120px;background:${p.color};border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff">${p.imageText}</div>
  <h4>${p.name} <span style="font-size:13px;color:#666">· ${p.price} CUP</span></h4>
  <div class="muted" style="font-size:13px">${p.short}</div>
  <div style="margin-top:8px"><a class="btn ghost" href="contacto.html">Consultar</a> <span style="float:right" class="muted">${p.status}</span></div>`;
  return div;
}

function renderFeatured(data){
  const grid = document.getElementById('featured');
  if(!grid) return;
  data.products.slice(0,3).forEach(p=> grid.appendChild(createCard(p)));
}

function renderCatalog(data){
  const grid = document.getElementById('product-grid');
  if(!grid) return;
  grid.innerHTML='';
  data.products.forEach(p=> grid.appendChild(createCard(p)));
  // populate categories
  const sel = document.getElementById('category');
  const cats = Array.from(new Set(data.products.map(x=>x.category)));
  cats.forEach(c=> sel.appendChild(new Option(c,c)));
}

function renderGallery(data){
  const g = document.getElementById('gallery');
  if(!g) return;
  data.gallery.forEach((img,i)=>{
    const d = document.createElement('div');
    d.style.height='140px';d.style.background=img.color;d.style.borderRadius='8px';d.style.display='inline-block';d.style.margin='6px';d.style.width='30%';d.textContent=img.alt;
    g.appendChild(d);
  });
}

document.addEventListener('DOMContentLoaded', async ()=>{
  const data = await fetchData();
  renderFeatured(data);
  renderCatalog(data);
  renderGallery(data);
});