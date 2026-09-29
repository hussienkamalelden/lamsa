renderShell();

// أيقونات الـ SVG مكان data-ico
$$('[data-ico]').forEach((el) => el.insertAdjacentHTML('afterbegin', ICONS[el.dataset.ico]));

const form = $('#checkout-form');
const isExpress = () => form.ship.value === 'express';

if (!Cart.items().length) {
  $('#checkout-root').innerHTML = `
    <div class="empty panel soft" style="margin:40px 0">
      <div class="big">${ICONS.bag}</div>
      <h2>السلة فاضية</h2>
      <p>ضيف منتجات الأول وبعدين كمّل الطلب.</p>
      <a href="index.html#cats" class="btn btn-primary">تصفح الأقسام</a>
    </div>`;
} else {
  initCheckout();
}

function renderSummary() {
  $('#mini-list').innerHTML = Cart.items().map((it) => {
    const p = getProduct(it.id);
    return `
    <div class="mini">
      <span class="th"><span>${productImgTag(p, 0, { alt: '' })}</span><span class="q">${num(it.qty)}</span></span>
      <span class="n">${p.name}<small>${[getCat(p.cat).name, it.size].filter(Boolean).join(' · ')}</small></span>
      <b>${fmt(p.price * it.qty)}</b>
    </div>`;
  }).join('');

  const t = Cart.totals(isExpress());
  $('#totals').innerHTML = `
    <div class="sum-row"><span>المجموع الفرعي</span><b>${fmt(t.subtotal)}</b></div>
    ${t.saved ? `<div class="sum-row saved"><span>وفّرت</span><b>− ${fmt(t.saved)}</b></div>` : ''}
    <div class="sum-row"><span>الشحن</span><b>${t.shipping ? fmt(t.shipping) : 'مجاني'}</b></div>
    <div class="sum-row total"><span>الإجمالي</span><span>${fmt(t.total)}</span></div>`;

  const base = Cart.totals(false).shipping;
  $('#std-fee').textContent = base ? fmt(base) : 'مجاني';
  $('#exp-fee').textContent = fmt(base + EXPRESS_EXTRA);
}

function validate() {
  let ok = true;
  $$('.field', form).forEach((f) => {
    const input = $('input, select', f);
    if (!input) return;
    const valid = input.checkValidity() && (!input.required || input.value.trim() !== '');
    f.classList.toggle('invalid', !valid);
    if (!valid && ok) {
      input.focus();
      ok = false;
    }
  });
  return ok;
}

function initCheckout() {
  renderSummary();

  form.addEventListener('change', (e) => {
    if (e.target.name === 'ship') renderSummary();
    if (e.target.name === 'pay') $('#pay-note').hidden = e.target.value === 'cod';
    e.target.closest('.field')?.classList.remove('invalid');
  });
  form.addEventListener('input', (e) => e.target.closest('.field')?.classList.remove('invalid'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    const t = Cart.totals(isExpress());
    const orderNo = 'LM-' + Date.now().toString().slice(-7);
    const name = $('#name').value.trim().split(' ')[0];
    const payLabel = { cod: 'الدفع عند الاستلام', card: 'كارت بنكي', wallet: 'محفظة إلكترونية' }[form.pay.value];
    const eta = isExpress() ? '٢٤-٤٨ ساعة' : '٣-٥ أيام عمل';
    const where = `${form.gov.value} — ${$('#city').value}`;
    Cart.clear();

    $('#checkout-root').innerHTML = `
      <div class="steps" style="justify-content:center;margin-top:36px">
        <span class="step done"><i>١</i> السلة</span><span class="step-line"></span>
        <span class="step done"><i>٢</i> بيانات التوصيل</span><span class="step-line"></span>
        <span class="step done"><i>٣</i> تأكيد الطلب</span>
      </div>
      <div class="success panel">
        <div class="tick">${ICONS.check}</div>
        <h1>شكراً يا ${name}، طلبك اتأكد</h1>
        <p class="muted">طلبك وصلنا وهنكلمك قريب على الموبايل لتأكيد ميعاد التوصيل.</p>
        <div class="order-no">رقم الطلب: ${orderNo}</div>
        <div style="text-align:start;margin:10px 0 24px">
          <div class="sum-row"><span>الإجمالي</span><b>${fmt(t.total)}</b></div>
          <div class="sum-row"><span>طريقة الدفع</span><b>${payLabel}</b></div>
          <div class="sum-row"><span>التوصيل إلى</span><b>${where}</b></div>
          <div class="sum-row"><span>ميعاد التوصيل المتوقع</span><b>${eta}</b></div>
        </div>
        <a href="index.html" class="btn btn-primary">رجوع للتسوّق</a>
      </div>`;
    scrollTo({ top: 0, behavior: 'smooth' });
  });
}
