/* =========================================================
   Lamsa — الأجزاء المشتركة: الصور، السلة، الهيدر، الفوتر، الكارت، السلايدر
   ========================================================= */

const FREE_SHIPPING_FROM = 1000;
const SHIPPING_FEE = 50;
const EXPRESS_EXTRA = 40;
const IMG_DIR = 'images';

/* ---------- Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const qs = (key) => new URLSearchParams(location.search).get(key);
const fmt = (n) => Number(n).toLocaleString('ar-EG') + ' ج.م';
const num = (n) => Number(n).toLocaleString('ar-EG');
const getCat = (id) => CATEGORIES.find((c) => c.id === id);
const getProduct = (id) => PRODUCTS.find((p) => p.id === id);
const countIn = (catId) => PRODUCTS.filter((p) => p.cat === catId).length;
const discount = (p) => (p.old ? Math.round((1 - p.price / p.old) * 100) : 0);
const mostViewed = (n = 8, exclude) =>
  [...PRODUCTS].filter((p) => p.id !== exclude).sort((a, b) => b.views - a.views).slice(0, n);
const SORTERS = {
  default: () => 0,
  views: (a, b) => b.views - a.views,
  rating: (a, b) => b.rating - a.rating,
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
};

/* ---------- Icons (SVG) ---------- */
const svg = (d, size = 22, sw = 1.8) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

const ICONS = {
  cart:    svg('<path d="M6 7h13l-1.5 9h-10z"/><path d="M6 7 5 3H2"/><circle cx="9" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/>'),
  bag:     svg('<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'),
  menu:    svg('<path d="M4 7h16M4 12h16M4 17h10"/>'),
  close:   svg('<path d="M6 6l12 12M18 6 6 18"/>'),
  plus:    svg('<path d="M12 5v14M5 12h14"/>', 18, 2),
  minus:   svg('<path d="M5 12h14"/>', 18, 2),
  eye:     svg('<path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3"/>', 15),
  star:    '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="m12 2 3 6.6 7 .8-5.2 4.8 1.4 7L12 17.8 5.8 21.2l1.4-7L2 9.4l7-.8z"/></svg>',
  trash:   svg('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>', 18),
  truck:   svg('<path d="M2 5h12v11H2zM14 9h4l4 4v3h-8"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>'),
  back:    svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'),
  cash:    svg('<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>'),
  card:    svg('<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>'),
  phone:   svg('<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>'),
  shield:  svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'),
  check:   svg('<path d="M20 6 9 17l-5-5"/>', 40, 2.4),
  user:    svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>', 20),
  pin:     svg('<path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>', 20),
  mail:    svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>', 18),
  search:  svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  arrow:   svg('<path d="M19 12H5M11 6l-6 6 6 6"/>', 18, 2),   // يشاور لليسار (للأمام في RTL)
  chevL:   svg('<path d="m15 6-6 6 6 6"/>', 20, 2),
  chevR:   svg('<path d="m9 6 6 6-6 6"/>', 20, 2),
};

/* أيقونات الأقسام (line icons) */
const CAT_ICON_PATHS = {
  women: '<path d="M9 3h6"/><path d="M10 3 9 8l-3.5 12h13L15 8l-1-5"/><path d="M9 8h6"/>',
  men:   '<path d="M8 3 3 6l2 4 2-1v12h10V9l2 1 2-4-5-3c0 2-1.8 3-4 3S8 5 8 3z"/>',
  kids:  '<path d="M9 3h6l5 4-2.5 2.5L16 8v5l-1.5 8h-2L12 17l-.5 4h-2L8 13V8L6.5 9.5 4 7z"/>',
  shoes: '<path d="M2 17v-6l4-3 3 3h3l7 3a3 3 0 0 1 3 3v0H2z"/><path d="M2 20h20"/>',
  home:  '<path d="M4 10h16v4a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6z"/><path d="M2 10h20M9 6h6M12 6V4"/>',
  acc:   '<circle cx="12" cy="12" r="6"/><path d="m9 6.5.8-4.5h4.4l.8 4.5M9 17.5l.8 4.5h4.4l.8-4.5M12 9.5V12l1.5 1"/>',
};
const catIcon = (id, size = 28) => svg(CAT_ICON_PATHS[id], size, 1.5);

/* ---------- الصور ----------
   images/<cat>/<اسم الصورة من p.imgs> — ولو الصورة مش موجودة بيتحط placeholder بلون القسم. */
function placeholderImg(catId) {
  const c = getCat(catId);
  const s =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.c2}"/><stop offset="1" stop-color="${c.c1}"/></linearGradient></defs>` +
    `<rect width="400" height="500" fill="url(#g)"/>` +
    `<g transform="translate(140 170) scale(5)" fill="none" stroke="#000" stroke-opacity=".18" stroke-width=".9" stroke-linecap="round" stroke-linejoin="round">${CAT_ICON_PATHS[catId]}</g>` +
    `</svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
}

const productImgSrc = (p, i = 0) => `${IMG_DIR}/${p.cat}/${p.imgs[i] || p.imgs[0]}`;

function productImgTag(p, i = 0, { alt = p.name, cls = '', lazy = true } = {}) {
  return `<img src="${productImgSrc(p, i)}" alt="${alt}" class="${cls}" ${lazy ? 'loading="lazy"' : ''} decoding="async"
    data-cat="${p.cat}" onerror="imgFallback(this)">`;
}

function imgFallback(img) {
  img.onerror = null;
  img.src = placeholderImg(img.dataset.cat);
  img.classList.add('is-placeholder');
}

/* ---------- كارت القسم (صورة حقيقية + اسم + عدد) ---------- */
function catCard(c) {
  return `
  <a class="cat-card" data-cat="${c.id}" href="category.html?c=${c.id}">
    <img src="${IMG_DIR}/${c.id}/${c.cover}" alt="${c.name}" loading="lazy" decoding="async" data-cat="${c.id}" onerror="imgFallback(this)">
    <span class="cc-en">${c.en}</span>
    <span class="cc-body">
      <span class="cc-text"><strong>${c.name}</strong></span>
      <span class="cc-go">${ICONS.arrow}</span>
    </span>
  </a>`;
}

function stars(r) {
  return `<span class="stars" aria-label="تقييم ${r} من 5">${ICONS.star}<b>${num(r)}</b></span>`;
}

/* ---------- السلة (localStorage) ---------- */
const Cart = {
  KEY: 'lamsa_cart',
  items() {
    try { return (JSON.parse(localStorage.getItem(this.KEY)) || []).filter((it) => getProduct(it.id)); } catch { return []; }
  },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch {}
    updateCartBadge();
  },
  add(id, qty = 1, size = '', color = '') {
    const p = getProduct(id);
    if (!p) return;
    size = size || SIZES[p.cat][0] || '';
    color = color || COLORS[p.cat][0] || '';
    const items = this.items();
    const hit = items.find((it) => it.id === id && it.size === size && it.color === color);
    hit ? (hit.qty += qty) : items.push({ id, qty, size, color });
    this.save(items);
  },
  setQty(index, qty) {
    const items = this.items();
    if (!items[index]) return;
    items[index].qty = Math.min(99, Math.max(1, qty));
    this.save(items);
  },
  remove(index) {
    const items = this.items();
    items.splice(index, 1);
    this.save(items);
  },
  clear() { this.save([]); },
  count() { return this.items().reduce((s, it) => s + it.qty, 0); },
  totals(express = false) {
    const items = this.items();
    const subtotal = items.reduce((s, it) => s + getProduct(it.id).price * it.qty, 0);
    const saved = items.reduce((s, it) => {
      const p = getProduct(it.id);
      return s + (p.old ? (p.old - p.price) * it.qty : 0);
    }, 0);
    let shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
    if (express && subtotal > 0) shipping += EXPRESS_EXTRA;
    return { subtotal, saved, shipping, total: subtotal + shipping };
  },
};

function updateCartBadge() {
  const n = Cart.count();
  $$('.cart-count').forEach((el) => {
    el.textContent = num(n);
    el.hidden = n === 0;
  });
}

/* ---------- كارت المنتج ---------- */
function productCard(p) {
  const cat = getCat(p.cat);
  const off = discount(p);
  return `
  <article class="card" data-cat="${p.cat}">
    <div class="card-media">
      <a href="product.html?id=${p.id}" tabindex="-1" aria-hidden="true">${productImgTag(p)}</a>
      <div class="card-badges">
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
        ${off ? `<span class="badge badge-off">خصم ${num(off)}٪</span>` : ''}
      </div>
      <button class="card-add" data-add="${p.id}" aria-label="أضف ${p.name} للسلة">${ICONS.bag}<span>أضف للسلة</span></button>
    </div>
    <div class="card-body">
      <div class="card-top">
        <a href="category.html?c=${p.cat}" class="card-cat">${cat.name}</a>
        ${stars(p.rating)}
      </div>
      <a href="product.html?id=${p.id}" class="card-title">${p.name}</a>
      <div class="price"><strong>${fmt(p.price)}</strong>${p.old ? `<del>${fmt(p.old)}</del>` : ''}</div>
    </div>
  </article>`;
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(html) {
  let el = $('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    document.body.appendChild(el);
  }
  el.innerHTML = html;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}

/* ---------- Slider ----------
   سلايدر خفيف بيعتمد على scroll-snap: سحب باللمس/الماوس + أسهم + نقط + autoplay اختياري.
   الماركب: <div class="slider" data-per="4,3,2"> <div class="slider-track"> ...slides </div> </div>
   data-per = عدد السلايدز (ديسكتوب, تابلت, موبايل) */
class Slider {
  constructor(root, { autoplay = 0, loop = false, dots = true, arrows = true, onChange } = {}) {
    this.root = root;
    this.track = $('.slider-track', root);
    this.opts = { autoplay, loop, onChange };
    this.index = 0;
    root.classList.add('is-ready');

    const per = (root.dataset.per || '1,1,1').split(',').map(Number);
    root.style.setProperty('--per-lg', per[0]);
    root.style.setProperty('--per-md', per[1] ?? per[0]);
    root.style.setProperty('--per-sm', per[2] ?? per[1] ?? per[0]);

    if (arrows) {
      root.insertAdjacentHTML('beforeend', `
        <button class="slider-btn prev" type="button" aria-label="السابق">${ICONS.chevR}</button>
        <button class="slider-btn next" type="button" aria-label="التالي">${ICONS.chevL}</button>`);
      $('.prev', root).addEventListener('click', () => this.go(this.index - 1));
      $('.next', root).addEventListener('click', () => this.go(this.index + 1));
    }
    if (dots) {
      this.dotsEl = document.createElement('div');
      this.dotsEl.className = 'slider-dots';
      root.appendChild(this.dotsEl);
      this.dotsEl.addEventListener('click', (e) => {
        const d = e.target.closest('[data-dot]');
        if (d) this.go(+d.dataset.dot);
      });
    }

    let raf;
    this.track.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => this.sync());
    }, { passive: true });
    new ResizeObserver(() => this.refresh()).observe(this.track);
    this.enableDrag();
    if (autoplay) this.startAuto();
    this.refresh();
  }
  get dir() { return getComputedStyle(this.track).direction === 'rtl' ? -1 : 1; }
  get step() {
    const gap = parseFloat(getComputedStyle(this.track).columnGap) || 0;
    return this.track.clientWidth + gap;
  }
  get pages() {
    const max = this.track.scrollWidth - this.track.clientWidth;
    return max <= 2 ? 1 : Math.ceil(max / this.step - 0.05) + 1;
  }
  refresh() {
    const n = this.pages;
    this.root.classList.toggle('is-static', n <= 1);
    if (this.dotsEl) {
      this.dotsEl.innerHTML = n > 1
        ? Array.from({ length: n }, (_, i) => `<button type="button" data-dot="${i}" aria-label="شريحة ${i + 1}"></button>`).join('')
        : '';
    }
    this.sync();
  }
  sync() {
    const n = this.pages;
    const max = this.track.scrollWidth - this.track.clientWidth;
    const pos = Math.abs(this.track.scrollLeft);
    this.index = pos >= max - 2 ? n - 1 : Math.round(pos / this.step);
    if (this.dotsEl) $$('[data-dot]', this.dotsEl).forEach((d, i) => d.classList.toggle('active', i === this.index));
    if (!this.opts.loop) {
      const prev = $('.prev', this.root), next = $('.next', this.root);
      if (prev) prev.disabled = this.index <= 0;
      if (next) next.disabled = this.index >= n - 1;
    }
    this.opts.onChange?.(this.index);
  }
  go(i) {
    const n = this.pages;
    if (this.opts.loop) i = (i + n) % n;
    i = Math.max(0, Math.min(n - 1, i));
    this.track.scrollTo({ left: this.dir * i * this.step, behavior: 'smooth' });
  }
  startAuto() {
    const tick = () => this.go(this.index + 1);
    let timer = setInterval(tick, this.opts.autoplay);
    const stop = () => clearInterval(timer);
    const start = () => { stop(); timer = setInterval(tick, this.opts.autoplay); };
    this.root.addEventListener('pointerenter', stop);
    this.root.addEventListener('pointerleave', start);
    this.root.addEventListener('touchstart', stop, { passive: true });
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  }
  enableDrag() {
    const t = this.track;
    let startX = 0, startLeft = 0, startIdx = 0, dragging = false, moved = false;
    t.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      dragging = true; moved = false;
      startX = e.clientX; startLeft = t.scrollLeft; startIdx = this.index;
    });
    window.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) { moved = true; t.classList.add('is-dragging'); }
      if (moved) t.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', () => {
      if (!dragging) return;
      dragging = false;
      if (!moved) return;
      t.classList.remove('is-dragging');
      const delta = (t.scrollLeft - startLeft) * this.dir;
      this.go(startIdx + (delta > 40 ? 1 : delta < -40 ? -1 : 0));
    });
    // امنع الكليك على اللينكات بعد السحب
    t.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    t.addEventListener('dragstart', (e) => e.preventDefault());
  }
}

/* يبني سلايدر منتجات جوه container */
function productSlider(el, products, per = '4,3,2') {
  el.innerHTML = `<div class="slider" data-per="${per}"><div class="slider-track">${products.map((p) => `<div class="slide">${productCard(p)}</div>`).join('')}</div></div>`;
  return new Slider($('.slider', el));
}

/* ---------- Header / Footer ---------- */
function renderShell(activeCat = '') {
  const links = [
    `<a href="index.html" class="${activeCat === 'all' ? 'active' : ''}">الرئيسية</a>`,
    ...CATEGORIES.map((c) => `<a href="category.html?c=${c.id}" data-cat="${c.id}" class="${c.id === activeCat ? 'active' : ''}">${c.name}</a>`),
  ].join('');

  $('#site-header').innerHTML = `
    <div class="topbar"><div class="container">
      <span>شحن مجاني للطلبات فوق ${fmt(FREE_SHIPPING_FROM)}</span><i></i>
      <span>الدفع عند الاستلام</span><i></i>
      <span>استرجاع خلال ١٤ يوم</span>
    </div></div>
    <div class="nav container">
      <button class="icon-btn menu-btn" type="button" aria-label="القائمة" aria-expanded="false" aria-controls="drawer">${ICONS.menu}</button>
      <a class="logo" href="index.html" aria-label="لمسة - الرئيسية">لمسة<span>.</span></a>
      <nav class="main-nav" aria-label="الأقسام">${links}</nav>
      <a href="cart.html" class="icon-btn cart-link" aria-label="السلة">${ICONS.bag}<span class="cart-count" hidden>٠</span></a>
    </div>
    <div class="drawer" id="drawer" aria-hidden="true">
      <div class="drawer-panel" role="dialog" aria-label="القائمة">
        <div class="drawer-head">
          <a class="logo" href="index.html">لمسة<span>.</span></a>
          <button class="icon-btn drawer-close" type="button" aria-label="إغلاق">${ICONS.close}</button>
        </div>
        <nav class="drawer-nav">
          <a href="index.html" class="${activeCat === 'all' ? 'active' : ''}">الرئيسية</a>
          ${CATEGORIES.map((c) => `<a href="category.html?c=${c.id}" data-cat="${c.id}" class="${c.id === activeCat ? 'active' : ''}"><span class="dn-ico">${catIcon(c.id, 22)}</span>${c.name}</a>`).join('')}
          <a href="cart.html"><span class="dn-ico">${ICONS.bag}</span>السلة</a>
        </nav>
      </div>
    </div>`;

  const drawer = $('#drawer');
  const menuBtn = $('.menu-btn');
  const toggle = (open) => {
    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
  };
  menuBtn.addEventListener('click', () => toggle(true));
  $('.drawer-close').addEventListener('click', () => toggle(false));
  drawer.addEventListener('click', (e) => e.target === drawer && toggle(false));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && toggle(false));

  const header = $('#site-header');
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 10);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  $('#site-footer').innerHTML = `
    <div class="container footer-grid">
      <div class="footer-brand">
        <a class="logo" href="index.html">لمسة<span>.</span></a>
        <p>كل اللي بتحتاجه لبيتك ولعيلتك في مكان واحد، بأسعار حلوة وتوصيل لحد باب البيت.</p>
      </div>
      <div><h4>الأقسام</h4>${CATEGORIES.map((c) => `<a href="category.html?c=${c.id}">${c.name}</a>`).join('')}</div>
      <div><h4>المساعدة</h4><a href="#">الشحن والتوصيل</a><a href="#">الاسترجاع والاستبدال</a><a href="#">الأسئلة الشائعة</a><a href="#">تواصل معانا</a></div>
      <div><h4>تواصل معانا</h4><a href="#" dir="ltr">19XXX</a><a href="#">hello@lamsa.store</a><a href="#">القاهرة، مصر</a></div>
    </div>
    <div class="container footer-bottom">
      <span>© ${new Date().getFullYear()} لمسة. كل الحقوق محفوظة.</span>
      <span class="pay-marks"><b>VISA</b><b>Mastercard</b><b>Meeza</b><b>COD</b></span>
    </div>`;

  updateCartBadge();
}

/* ---------- Global: زرار "أضف للسلة" السريع في الكروت ---------- */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-add]');
  if (!btn) return;
  e.preventDefault();
  const p = getProduct(btn.dataset.add);
  Cart.add(p.id);
  btn.classList.add('added');
  setTimeout(() => btn.classList.remove('added'), 900);
  toast(`<span>اتضاف <b>${p.name}</b> للسلة</span><a href="cart.html">عرض السلة</a>`);
});

/* Sync لو السلة اتغيرت في تاب تاني */
window.addEventListener('storage', (e) => e.key === Cart.KEY && updateCartBadge());
