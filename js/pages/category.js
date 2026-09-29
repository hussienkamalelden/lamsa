const cat = getCat(qs('c')) || CATEGORIES[0];

// الصفحة كلها تاخد ألوان القسم
document.body.dataset.cat = cat.id;
document.title = `لمسة | ${cat.name}`;
renderShell(cat.id);

$('#crumb-name').textContent = cat.name;
$('#cat-name').textContent = cat.name;
$('#cat-tagline').textContent = cat.tagline;
// كولاج البانر: صورة القسم (cover) + صورتين من منتجاته
const heroImgs = [cat.cover, ...PRODUCTS.filter((p) => p.cat === cat.id).map((p) => p.imgs[0]).filter((f) => f !== cat.cover)].slice(0, 3);
$('#cat-media').innerHTML = heroImgs
  .map((f, i) => `<span class="chm chm-${i + 1}"><img src="${IMG_DIR}/${cat.id}/${f}" alt="" data-cat="${cat.id}" onerror="imgFallback(this)"></span>`)
  .join('');
$('#cat-count').textContent = `${num(countIn(cat.id))} منتجات`;

let range = 'all';

function inRange(p) {
  if (range === 'all') return true;
  if (range === 'sale') return !!p.old;
  const [min, max] = range.split('-').map(Number);
  return p.price >= min && p.price < max;
}

function render() {
  const list = PRODUCTS.filter((p) => p.cat === cat.id && inRange(p)).sort(SORTERS[$('#sort').value]);
  $('#cat-grid').innerHTML = list.length
    ? list.map(productCard).join('')
    : `<div class="empty" style="grid-column:1/-1"><div class="big">${ICONS.search}</div><h2>مفيش منتجات في الرينج ده</h2><p>جرّب فلتر تاني</p></div>`;
}

$('#price-chips').addEventListener('click', (e) => {
  const chip = e.target.closest('[data-range]');
  if (!chip) return;
  range = chip.dataset.range;
  $$('#price-chips .chip').forEach((c) => c.classList.toggle('active', c === chip));
  render();
});
$('#sort').addEventListener('change', render);
render();

/* أقسام تانية — سلايدر */
$('#other-cats').innerHTML = `
  <div class="slider" data-per="5,3,2">
    <div class="slider-track">
      ${CATEGORIES.filter((c) => c.id !== cat.id).map((c) => `<div class="slide">${catCard(c)}</div>`).join('')}
    </div>
  </div>`;
new Slider($('#other-cats .slider'));
