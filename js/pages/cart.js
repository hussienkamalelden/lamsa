renderShell();

function summaryHTML() {
  const t = Cart.totals();
  const left = Math.max(0, FREE_SHIPPING_FROM - t.subtotal);
  const pct = Math.min(100, (t.subtotal / FREE_SHIPPING_FROM) * 100);
  return `
  <aside class="panel soft sticky">
    <h3>ملخص الطلب</h3>
    <div class="ship-meter" style="background:#fff">
      ${left > 0 ? `فاضل <b>${fmt(left)}</b> وتاخد شحن مجاني` : `طلبك عليه <b>شحن مجاني</b>`}
      <div class="meter"><i style="width:${pct}%"></i></div>
    </div>
    <div class="sum-row"><span>المجموع الفرعي (${num(Cart.count())} قطعة)</span><b>${fmt(t.subtotal)}</b></div>
    ${t.saved ? `<div class="sum-row saved"><span>وفّرت</span><b>− ${fmt(t.saved)}</b></div>` : ''}
    <div class="sum-row"><span>الشحن</span><b>${t.shipping ? fmt(t.shipping) : 'مجاني'}</b></div>
    <div class="sum-row total"><span>الإجمالي</span><span>${fmt(t.total)}</span></div>
    <a href="checkout.html" class="btn btn-primary btn-block" style="margin-top:18px">إتمام الشراء ${ICONS.arrow}</a>
    <a href="index.html#all" class="btn btn-ghost btn-block" style="margin-top:4px">كمّل تسوّق</a>
  </aside>`;
}

function render() {
  const items = Cart.items();
  const root = $('#cart-root');

  if (!items.length) {
    root.innerHTML = `
      <div class="empty panel soft" style="margin-bottom:24px">
        <div class="big">${ICONS.bag}</div>
        <h2>السلة فاضية</h2>
        <p>لسه ما اخترتش حاجة؟ الأقسام مستنياك.</p>
        <a href="index.html#cats" class="btn btn-primary">تصفح الأقسام</a>
      </div>`;
    return;
  }

  root.innerHTML = `
    <div class="layout-2">
      <div class="cart-list">
        <div class="cart-head"><span>المنتج</span><span>الكمية</span><span style="text-align:end">الإجمالي</span></div>
        ${items.map((it, i) => {
          const p = getProduct(it.id);
          return `
          <div class="cart-item" data-cat="${p.cat}" data-i="${i}">
            <div class="ci-prod">
              <a class="ci-img" href="product.html?id=${p.id}">${productImgTag(p)}</a>
              <div>
                <a class="card-cat" href="category.html?c=${p.cat}">${getCat(p.cat).name}</a>
                <a class="ci-name" href="product.html?id=${p.id}">${p.name}</a>
                <div class="ci-opts">
                  <span>${fmt(p.price)}</span>
                  ${it.color ? `<span><i class="dot" style="background:${it.color}"></i></span>` : ''}
                  ${it.size ? `<span>المقاس: ${it.size}</span>` : ''}
                </div>
                <button class="remove" data-act="remove">${ICONS.trash} حذف</button>
              </div>
            </div>
            <div class="qty sm">
              <button type="button" data-act="inc" aria-label="زيادة">${ICONS.plus}</button>
              <input type="number" value="${it.qty}" min="1" max="99" data-act="set" aria-label="الكمية">
              <button type="button" data-act="dec" aria-label="تقليل">${ICONS.minus}</button>
            </div>
            <div class="ci-total">${fmt(p.price * it.qty)}</div>
          </div>`;
        }).join('')}
      </div>
      ${summaryHTML()}
    </div>`;
}

$('#cart-root').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-act]');
  if (!btn || btn.tagName === 'INPUT') return;
  const i = +btn.closest('[data-i]').dataset.i;
  const it = Cart.items()[i];
  if (btn.dataset.act === 'inc') Cart.setQty(i, it.qty + 1);
  if (btn.dataset.act === 'dec') Cart.setQty(i, it.qty - 1);
  if (btn.dataset.act === 'remove') Cart.remove(i);
  render();
});
$('#cart-root').addEventListener('change', (e) => {
  if (e.target.dataset.act !== 'set') return;
  Cart.setQty(+e.target.closest('[data-i]').dataset.i, +e.target.value || 1);
  render();
});

render();

// الإضافة السريعة من سلايدر الاقتراحات — نعيد رسم السلة
document.addEventListener('click', (e) => e.target.closest('[data-add]') && setTimeout(render));
productSlider($('#suggest'), mostViewed(10));
