// Very simple admin prototype: uses localStorage to store products
const STORAGE_KEY = 'soul_demo';
function loadStore(){
  const s = localStorage.getItem(STORAGE_KEY);
  return s ? JSON.parse(s) : null;
}
function saveStore(obj){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}
function ensureData(){
  let s = loadStore();
  if(!s){
    // copy from static file
    fetch('../assets/data/catalogo.json').then(r=>r.json()).then(d=>{
      saveStore(d);
      if(window.location.pathname.endsWith('/admin/productos.html')) renderProducts();
      if(window.location.pathname.endsWith('/admin/dashboard.html')) updateDashboard();
    });
  } else {
    if(window.location.pathname.endsWith('/admin/productos.html')) renderProducts();
    if(window.location.pathname.endsWith('/admin/dashboard.html')) updateDashboard();
  }
}

// Login (demo)
const loginForm = document.getElementById('login-form');
if(loginForm){
  loginForm.addEventListener('submit', e=>{
    e.preventDefault();
    const pwd = loginForm.password.value;
    if(pwd === 'soul123'){ localStorage.setItem('soul_admin','1'); location.href='dashboard.html'; }
    else alert('Contraseña incorrecta (demo: soul123)');
  });
}

// Admin actions
function renderProducts(){
  const box = document.getElementById('product-list');
  const state = loadStore();
  box.innerHTML = '';
  state.products.forEach((p,idx)=>{
    const el = document.createElement('div');
    el.style.padding='10px';el.style.border='1px solid #eee';el.style.marginBottom='8px';el.style.borderRadius='8px';
    el.innerHTML = `<strong>${p.name}</strong> <div style="float:right"><button onclick="editProduct(${idx})" class="btn ghost">Editar</button> <button onclick="deleteProduct(${idx})" class="btn">Eliminar</button></div><div class="muted">${p.category} · ${p.status}</div>`;
    box.appendChild(el);
  });
  document.getElementById('count').textContent = state.products.length;
}

window.editProduct = function(i){
  const state = loadStore();
  const p = state.products[i];
  openModal(p,i);
}
window.deleteProduct = function(i){
  if(!confirm('Eliminar producto?')) return;
  const state = loadStore();
  state.products.splice(i,1);
  saveStore(state);
  renderProducts();
}

function openModal(p,i){
  const modal = document.getElementById('modal');
  modal.setAttribute('aria-hidden','false');
  const form = document.getElementById('product-form');
  form.name.value = p ? p.name : '';
  form.description.value = p ? p.short : '';
  form.price.value = p ? p.price : '';
  form.category.value = p ? p.category : 'Velas';
  form.status.value = p ? p.status : 'Disponible';
  form.onsubmit = function(e){
    e.preventDefault();
    const state = loadStore();
    const obj = {name:form.name.value, short:form.description.value, price:form.price.value, category:form.category.value, status:form.status.value, imageText: 'Img', color: '#b89b72'};
    if(typeof i === 'number') state.products[i]=obj;
    else state.products.push(obj);
    saveStore(state);
    modal.setAttribute('aria-hidden','true');
    renderProducts();
  }
  document.getElementById('btn-close').onclick = ()=> modal.setAttribute('aria-hidden','true');
}

document.getElementById('btn-new')?.addEventListener('click', ()=> openModal(null,null));
document.getElementById('btn-export')?.addEventListener('click', ()=>{
  const s = loadStore(); if(!s) return alert('No hay datos');
  const blob = new Blob([JSON.stringify(s, null, 2)], {type:'application/json'}); const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'soul_backup.json'; a.click();
});

// logout
document.getElementById('logout')?.addEventListener('click', e=>{ e.preventDefault(); localStorage.removeItem('soul_admin'); location.href='login.html'; });

// init
ensureData();