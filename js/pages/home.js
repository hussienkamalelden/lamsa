renderShell('all');

/* ---------- Hero slider: شريحة لكل قسم بألوانه ---------- */
$('#hero').innerHTML = `
  <div class="slider" data-per="1,1,1">
    <div class="slider-track">
      ${CATEGORIES.map((c, i) => {
        const p = PRODUCTS.find((x) => x.cat === c.id);
        const H = i === 0 ? 'h1' : 'h2';
        return `
        <div class="slide hero-slide" data-cat="${c.id}">
          <div>
            <span class="hero-kicker">${c.en} Collection</span>
            <${H}>${c.name}</${H}>
            <p>${c.tagline}. تشكيلة جديدة بأسعار تبدأ من ${fmt(Math.min(...PRODUCTS.filter((x) => x.cat === c.id).map((x) => x.price)))}.</p>
            <div class="hero-actions">
              <a href="category.html?c=${c.id}" class="btn btn-primary">تسوّق القسم ${ICONS.arrow}</a>
              <a href="#all" class="btn btn-light">كل المنتجات</a>
            </div>
          </div>
          <div class="hero-media">
            <div class="frame">${productImgTag(p, 0, { lazy: i > 0 })}</div>
            <a class="float-card" href="product.html?id=${p.id}">
              <span class="ic">${catIcon(c.id, 20)}</span>
              <span><span class="muted">${p.name}</span><b>${fmt(p.price)}</b></span>
            </a>
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
new Slider($('#hero .slider'), { autoplay: 5500, loop: true });

/* ---------- Category tiles ---------- */
$('#cat-grid').innerHTML = CATEGORIES.map(catCard).join('');

/* ---------- Most viewed slider ---------- */
productSlider($('#most-viewed'), mostViewed(10));

/* ---------- Promo ---------- */
$('#promo').innerHTML = `
  <a class="promo-card" data-cat="women" href="category.html?c=women">
    <span class="big-ico">${catIcon('women', 140)}</span>
    <span class="kicker">New Season</span>
    <h3>أطقم البليزر الحريمي وصلت</h3>
    <span class="link-more">اكتشفي دلوقتي ${ICONS.arrow}</span>
  </a>
  <a class="promo-card dark" href="category.html?c=shoes">
    <span class="big-ico" style="color:#fff">${catIcon('shoes', 140)}</span>
    <span class="kicker">Up to 25% off</span>
    <h3>خصومات على الأحذية الجلد لفترة محدودة</h3>
    <span class="link-more">تسوّق العرض ${ICONS.arrow}</span>
  </a>`;

/* ---------- All products + filter + sort ---------- */
let filter = 'all';
$('#filter-chips').innerHTML =
  `<button class="chip active" data-filter="all">الكل</button>` +
  CATEGORIES.map((c) => `<button class="chip" data-filter="${c.id}" data-cat="${c.id}">${c.name}</button>`).join('');

function renderAll() {
  const list = PRODUCTS.filter((p) => filter === 'all' || p.cat === filter).sort(SORTERS[$('#sort').value]);
  $('#all-grid').innerHTML = list.map(productCard).join('');
  $('#all-count').textContent = `${num(list.length)} منتج`;
}

$('#filter-chips').addEventListener('click', (e) => {
  const chip = e.target.closest('[data-filter]');
  if (!chip) return;
  filter = chip.dataset.filter;
  $$('#filter-chips .chip').forEach((c) => c.classList.toggle('active', c === chip));
  renderAll();
});
$('#sort').addEventListener('change', renderAll);
renderAll();

/* ---------- Features ---------- */
$('#features').innerHTML = [
  [ICONS.truck, 'توصيل سريع', 'لكل المحافظات خلال ٢-٥ أيام'],
  [ICONS.cash, 'الدفع عند الاستلام', 'ادفع لما الأوردر يوصلك'],
  [ICONS.back, 'استرجاع سهل', 'خلال ١٤ يوم من الاستلام'],
  [ICONS.shield, 'جودة مضمونة', 'منتجات أصلية ومتفحصة'],
].map(([ico, t, s]) => `<div class="feature"><span class="ico">${ico}</span><div><b>${t}</b><span>${s}</span></div></div>`).join('');
