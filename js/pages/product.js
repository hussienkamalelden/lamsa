const p = getProduct(qs('id')) || PRODUCTS[0];
const cat = getCat(p.cat);
const sizes = SIZES[p.cat];
const colors = COLORS[p.cat];
const off = discount(p);

document.body.dataset.cat = p.cat;
document.title = `لمسة | ${p.name}`;
renderShell(p.cat);

const state = { size: sizes[0] || '', color: colors[0] || '' };

$('#crumbs').innerHTML = `<a href="index.html">الرئيسية</a><span class="sep">/</span><a href="category.html?c=${cat.id}">${cat.name}</a><span class="sep">/</span><span>${p.name}</span>`;

const SPECS = {
  women: [['الخامة', 'قطن / كتان'], ['القصة', 'ريجولار'], ['الغسيل', 'غسيل على ٣٠ درجة'], ['بلد الصنع', 'مصر']],
  men:   [['الخامة', 'قطن ١٠٠٪'], ['القصة', 'سليم فيت'], ['الغسيل', 'غسيل على ٤٠ درجة'], ['بلد الصنع', 'مصر']],
  kids:  [['الخامة', 'قطن عضوي'], ['مناسب لـ', 'البشرة الحساسة'], ['الغسيل', 'غسيل على ٣٠ درجة'], ['بلد الصنع', 'مصر']],
  shoes: [['الخامة الخارجية', 'جلد / شبك'], ['النعل', 'مطاط طبي'], ['المقاس', 'مظبوط على المقاس'], ['بلد الصنع', 'مصر']],
  home:  [['الخامة', 'حسب المنتج'], ['الضمان', 'سنة'], ['الاستخدام', 'منزلي'], ['بلد الصنع', 'مصر']],
  acc:   [['الخامة', 'ستانلس / جلد'], ['الضمان', '٦ شهور'], ['التغليف', 'علبة هدية'], ['بلد الصنع', 'مستورد']],
};
const sizeLabel = p.cat === 'kids' ? 'السن (سنين)' : 'المقاس';
const gallery = p.imgs.map((_, i) => i);

$('#pdp').innerHTML = `
  <div class="gallery">
    <div class="thumbs" aria-label="صور المنتج" ${gallery.length > 1 ? '' : 'hidden'}>
      ${gallery.map((i) => `<button class="thumb ${i === 0 ? 'active' : ''}" data-img="${i}" aria-label="صورة ${i + 1}">${productImgTag(p, i, { alt: '', lazy: false })}</button>`).join('')}
    </div>
    <div class="main-wrap">
      <div class="slider" data-per="1,1,1" id="g-slider">
        <div class="slider-track">
          ${gallery.map((i) => `<div class="slide g-slide" data-img="${i}">${productImgTag(p, i, { lazy: i > 0 })}</div>`).join('')}
        </div>
      </div>
      <div class="card-badges">
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
        ${off ? `<span class="badge badge-off">خصم ${num(off)}٪</span>` : ''}
      </div>
    </div>
  </div>

  <div class="info">
    <a class="card-cat" href="category.html?c=${cat.id}">${cat.name}</a>
    <h1>${p.name}</h1>
    <div class="rating-row">
      ${stars(p.rating)}
      <span>${num(p.reviews)} تقييم</span>
      <span class="views">${ICONS.eye} ${num(p.views)} مشاهدة</span>
    </div>

    <div class="price-row">
      <strong>${fmt(p.price)}</strong>
      ${p.old ? `<del>${fmt(p.old)}</del><span class="save-pill">وفّر ${fmt(p.old - p.price)}</span>` : ''}
    </div>

    <p class="lead">${p.desc}</p>

    ${colors.length ? `
    <div class="opt">
      <div class="opt-label">اللون</div>
      <div class="swatches">${colors.map((c, i) => `<button class="swatch ${i === 0 ? 'active' : ''}" data-color="${c}" style="background:${c}" aria-label="لون ${i + 1}"></button>`).join('')}</div>
    </div>` : ''}

    ${sizes.length ? `
    <div class="opt">
      <div class="opt-label">${sizeLabel}: <span id="size-label">${sizes[0]}</span></div>
      <div class="sizes">${sizes.map((s, i) => `<button class="size ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</button>`).join('')}</div>
    </div>` : ''}

    <div class="buy-row">
      <div class="qty">
        <button type="button" data-q="1" aria-label="زيادة">${ICONS.plus}</button>
        <input type="number" id="qty" value="1" min="1" max="99" aria-label="الكمية">
        <button type="button" data-q="-1" aria-label="تقليل">${ICONS.minus}</button>
      </div>
      <button class="btn btn-primary" id="add-cart">${ICONS.bag} أضف للسلة</button>
      <button class="btn btn-outline" id="buy-now">اشتري الآن</button>
    </div>

    <div class="perks">
      <div class="perk">${ICONS.truck} ${p.price >= FREE_SHIPPING_FROM ? 'شحن مجاني للمنتج ده' : 'شحن مجاني فوق ' + fmt(FREE_SHIPPING_FROM)}</div>
      <div class="perk">${ICONS.cash} الدفع عند الاستلام</div>
      <div class="perk">${ICONS.back} استرجاع خلال ١٤ يوم</div>
      <div class="perk">${ICONS.shield} منتج أصلي ومضمون</div>
    </div>

    <div class="tabs">
      <div class="tab-btns" role="tablist">
        <button class="tab-btn active" data-tab="desc">الوصف</button>
        <button class="tab-btn" data-tab="specs">المواصفات</button>
        <button class="tab-btn" data-tab="ship">الشحن والاسترجاع</button>
      </div>
      <div class="tab-panel" data-panel="desc">
        <p>${p.desc}</p>
        <ul style="margin-top:10px"><li>تصميم عملي يعيش معاك</li><li>خامات متفحصة وجودة عالية</li><li>متاح بأكتر من اختيار</li></ul>
      </div>
      <div class="tab-panel" data-panel="specs" hidden>
        <table class="specs">${SPECS[p.cat].map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}<tr><td>كود المنتج</td><td>LM-${p.id.toUpperCase()}</td></tr></table>
      </div>
      <div class="tab-panel" data-panel="ship" hidden>
        <ul><li>التوصيل خلال ٢-٥ أيام عمل لكل المحافظات.</li><li>مصاريف الشحن ${fmt(SHIPPING_FEE)}، ومجاني للطلبات فوق ${fmt(FREE_SHIPPING_FROM)}.</li><li>تقدر ترجّع أو تبدّل المنتج خلال ١٤ يوم من الاستلام.</li></ul>
      </div>
    </div>
  </div>`;

/* ---------- Gallery slider ---------- */
const gSlider = new Slider($('#g-slider'), {
  onChange: (i) => {
    const slides = $$('#g-slider .g-slide');
    const imgIdx = slides[i]?.dataset.img;
    $$('.thumb').forEach((t) => t.classList.toggle('active', t.dataset.img === imgIdx));
  },
});

/* ---------- Interactions ---------- */
$('#pdp').addEventListener('click', (e) => {
  const t = e.target.closest('button');
  if (!t) return;

  if (t.classList.contains('thumb')) {
    const idx = $$('#g-slider .g-slide').findIndex((s) => s.dataset.img === t.dataset.img);
    gSlider.go(idx);
  } else if (t.dataset.color) {
    state.color = t.dataset.color;
    $$('.swatch').forEach((b) => b.classList.toggle('active', b === t));
  } else if (t.dataset.size) {
    state.size = t.dataset.size;
    $('#size-label').textContent = state.size;
    $$('.size').forEach((b) => b.classList.toggle('active', b === t));
  } else if (t.dataset.q) {
    const input = $('#qty');
    input.value = Math.min(99, Math.max(1, (+input.value || 1) + +t.dataset.q));
  } else if (t.dataset.tab) {
    $$('.tab-btn').forEach((b) => b.classList.toggle('active', b === t));
    $$('.tab-panel').forEach((pn) => (pn.hidden = pn.dataset.panel !== t.dataset.tab));
  }
});

const addCurrent = () => Cart.add(p.id, Math.min(99, Math.max(1, +$('#qty').value || 1)), state.size, state.color);

$('#add-cart').addEventListener('click', () => {
  addCurrent();
  toast(`<span>اتضاف <b>${p.name}</b> للسلة</span><a href="cart.html">عرض السلة</a>`);
});
$('#buy-now').addEventListener('click', () => {
  addCurrent();
  location.href = 'checkout.html';
});

/* ---------- Related + Most viewed ---------- */
$('#more-link').href = `category.html?c=${cat.id}`;
$('#more-link').insertAdjacentHTML('beforeend', ICONS.arrow);
productSlider($('#related'), PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id));
productSlider($('#most-viewed'), mostViewed(10, p.id));
