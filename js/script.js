// --- Tiny utilities ---
    const money = (n) => n.toLocaleString('pt-BR',{ style:'currency', currency:'BRL' });
    const el = (sel,root=document)=> root.querySelector(sel);
    const els = (sel,root=document)=> [...root.querySelectorAll(sel)];

    // --- Procedural stars in hero ---
    const stars = el('.stars');
    for(let i=0;i<90;i++){
      const s = document.createElement('span');
      s.className='star';
      s.style.left = Math.random()*100+'%';
      s.style.top = Math.random()*100+'%';
      s.style.animationDelay = (Math.random()*9)+'s';
      s.style.opacity = .4 + Math.random()*0.6;
      stars.appendChild(s);
    }

    // --- Catalog data (single-file, imagens via SVG inline) ---
    const products = [
      {id:'luna-01', title:'Rocha Lunar — Série Estudo', cat:'rochas', price:189.9, desc:'Réplica científica com ficha de densidade e origem.', svg:planetSVG()},
      {id:'mars-01', title:'Meteorito Marciano (réplica)', cat:'rochas', price:249.9, desc:'Textura porosa e etiqueta de catalogação.', svg:meteorSVG()},
      {id:'probe-01', title:'Mini Sonda Voyager', cat:'sondas', price:149.0, desc:'Miniatura detalhada com datas de lançamento.', svg:probeSVG()},
      {id:'probe-02', title:'Mini Sonda Luna 9', cat:'sondas', price:139.0, desc:'Aterrissagem histórica — placa informativa.', svg:landerSVG()},
      {id:'poster-01', title:'Pôster Mapas Estelares (A2)', cat:'posteres', price:79.9, desc:'Constelações e escalas de distância.', svg:posterSVG()},
      {id:'sou-01', title:'Chaveiro Planeta Anelado', cat:'souvenires', price:29.9, desc:'Acrílico translúcido com brilho suave.', svg:ringSVG()},
    ];

    // --- SVG makers ---
    function planetSVG(){return `<svg viewBox="0 0 300 168" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#5b8def"/><stop offset="1" stop-color="#8a5bff"/></linearGradient></defs><rect width="300" height="168" rx="14" fill="#f8fbff"/><ellipse cx="120" cy="88" rx="60" ry="60" fill="url(#a)"/><ellipse cx="120" cy="88" rx="110" ry="16" fill="#e6eeff" transform="rotate(-12 120 88)"/><rect x="180" y="46" width="90" height="90" rx="12" fill="#fff" stroke="#e9efff"/></svg>`}
    function meteorSVG(){return `<svg viewBox="0 0 300 168" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="168" rx="14" fill="#f8fbff"/><g><circle cx="110" cy="84" r="40" fill="#9fb8ff"/><circle cx="95" cy="80" r="6" fill="#7d9fff"/><circle cx="130" cy="95" r="8" fill="#7d9fff"/></g><path d="M220 40 L180 70 L240 80 Z" fill="#5b8def" opacity=".3"/></svg>`}
    function probeSVG(){return `<svg viewBox="0 0 300 168" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="168" rx="14" fill="#f8fbff"/><g fill="#5b8def"><rect x="130" y="40" width="40" height="40" rx="6"/><rect x="90" y="60" width="40" height="6"/><rect x="170" y="60" width="40" height="6"/></g><circle cx="150" cy="120" r="18" fill="#8a5bff"/></svg>`}
    function landerSVG(){return `<svg viewBox="0 0 300 168" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="168" rx="14" fill="#f8fbff"/><g><rect x="120" y="60" width="60" height="36" rx="8" fill="#8a5bff"/><rect x="100" y="96" width="20" height="28" fill="#5b8def"/><rect x="180" y="96" width="20" height="28" fill="#5b8def"/></g></svg>`}
    function posterSVG(){return `<svg viewBox="0 0 300 168" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="168" rx="14" fill="#ffffff" stroke="#e9efff"/><g><circle cx="60" cy="60" r="10" fill="#5b8def"/><circle cx="120" cy="40" r="6" fill="#8a5bff"/><circle cx="200" cy="70" r="8" fill="#7aa4ff"/><rect x="40" y="110" width="220" height="8" rx="4" fill="#e6eeff"/></g></svg>`}
    function ringSVG(){return `<svg viewBox="0 0 300 168" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="168" rx="14" fill="#f8fbff"/><circle cx="150" cy="84" r="34" fill="#8a5bff"/><ellipse cx="150" cy="84" rx="78" ry="16" fill="#ccd9ff" transform="rotate(-15 150 84)"/></svg>`}

    // --- Render products ---
    const grid = el('#produtos');
    const tpl = el('#tplProduct');
    products.forEach(p=>{
      const node = tpl.content.cloneNode(true);
      const card = el('.product-card', node);
      card.dataset.cat = p.cat;
      el('.title', node).textContent = p.title;
      el('.desc', node).textContent = p.desc;
      el('.price', node).textContent = money(p.price);
      el('.ratio', node).innerHTML = p.svg;
      el('.add', node).addEventListener('click', ()=> addToCart(p.id));
      grid.appendChild(node);
    });

    // --- Search & Filter ---
    el('#search').addEventListener('input', (e)=>{
      const q = e.target.value.toLowerCase();
      els('.product-card').forEach(c=>{
        const title = el('.title', c).textContent.toLowerCase();
        const desc  = el('.desc', c).textContent.toLowerCase();
        c.parentElement.style.display = (title.includes(q) || desc.includes(q)) ? '' : 'none';
      });
    });

    els('[data-filter]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        els('[data-filter]').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        els('#produtos > *').forEach(col=>{
          const cat = el('.product-card', col).dataset.cat;
          col.style.display = (f==='all' || cat===f) ? '' : 'none';
        });
      })
    });

    // --- Scroll reveal ---
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } });
    },{threshold:.12});
    els('.reveal').forEach(x=> io.observe(x));

    // --- Cart state ---
    const cart = JSON.parse(localStorage.getItem('cart-space')||'{}');
    function saveCart(){ localStorage.setItem('cart-space', JSON.stringify(cart)); }

    function addToCart(id){
      cart[id] = (cart[id]||0) + 1;
      saveCart();
      renderCart();
      // open offcanvas on add
      const off = bootstrap.Offcanvas.getOrCreateInstance('#offcart');
      off.show();
    }

    function removeFromCart(id){ delete cart[id]; saveCart(); renderCart(); }
    function changeQty(id,delta){ cart[id] = Math.max(1,(cart[id]||1)+delta); saveCart(); renderCart(); }

    function renderCart(){
      const cont = el('#cartItems');
      cont.innerHTML='';
      let total=0; let count=0;
      Object.entries(cart).forEach(([id,qty])=>{
        const p = products.find(x=>x.id===id);
        if(!p) return;
        total += p.price*qty; count+=qty;
        const row = document.createElement('div');
        row.className='list-group-item d-flex align-items-center justify-content-between';
        row.innerHTML = `
          <div class="me-2">
            <div class="fw-semibold small">${p.title}</div>
            <div class="text-secondary small">${money(p.price)} × ${qty}</div>
          </div>
          <div class="btn-group btn-group-sm" role="group">
            <button class="btn btn-outline-secondary" aria-label="Diminuir">−</button>
            <button class="btn btn-outline-secondary" aria-label="Aumentar">＋</button>
            <button class="btn btn-outline-danger" aria-label="Remover">✕</button>
          </div>`;
        const [btnDec, btnInc, btnDel] = row.querySelectorAll('button');
        btnDec.addEventListener('click', ()=> changeQty(id,-1));
        btnInc.addEventListener('click', ()=> changeQty(id, 1));
        btnDel.addEventListener('click', ()=> removeFromCart(id));
        cont.appendChild(row);
      });
      el('#cartTotal').textContent = money(total);
      el('#cartCount').textContent = count;
    }
    renderCart();

    // --- Checkout toast ---
    el('#btnCheckout').addEventListener('click', ()=>{
      const t = bootstrap.Toast.getOrCreateInstance('#toastOk');
      t.show();
    });