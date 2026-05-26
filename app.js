// ========== DATA ==========
const phones = [
  { id: 1, brand: 'apple', name: 'iPhone 17 Pro Max', price: 1399, emoji: '📱', specs: '6.9" 120Hz OLED · A19 Pro · Triple 48MP · Vapor Cheamber cooling', badge: 'New' },
  { id: 2, brand: 'apple', name: 'iPhone 17 Pro', price: 1299, emoji: '📱', specs: '6.3" 120Hz OLED · A19 Pro · 48MP · Vapor Cheamber cooling  3600mAh', badge: 'New' },
  { id: 3, brand: 'apple', name: 'iPhone 16 Pro Max', price: 1099, emoji: '📱', specs: '6.9" OLED · A18 Pro · 48MP · 4422mAh', badge: 'New' },
  { id: 4, brand: 'apple', name: 'iPhone 16', price: 799, emoji: '📱', specs: '6.1" OLED · A18 · 48MP · 3279mAh', badge: null },
  { id: 5, brand: 'samsung', name: 'Galaxy S25 Ultra', price: 1299, emoji: '📲', specs: '6.9" AMOLED · Snapdragon 8 Elite · 200MP · 5000mAh', badge: 'Hot' },
  { id: 6, brand: 'samsung', name: 'Galaxy S25+', price: 999, emoji: '📲', specs: '6.7" AMOLED · Snapdragon 8 Elite · 50MP · 4900mAh', badge: null },
  { id: 7, brand: 'samsung', name: 'Galaxy Z Fold 6', price: 1799, emoji: '📲', specs: '7.6" Foldable · Snapdragon 8 Gen 3 · 50MP · 4400mAh', badge: 'Foldable' },
  { id: 8, brand: 'google', name: 'Pixel 9 Pro XL', price: 1099, emoji: '🤖', specs: '6.8" OLED · Google Tensor G4 · 50MP · 5060mAh', badge: 'AI' },
  { id: 9, brand: 'google', name: 'Pixel 9', price: 799, emoji: '🤖', specs: '6.3" OLED · Google Tensor G4 · 50MP · 4700mAh', badge: null },
  { id: 10, brand: 'xiaomi', name: 'Xiaomi 14 Ultra', price: 899, emoji: '🔴', specs: '6.73" AMOLED · Snapdragon 8 Gen 3 · 200MP · 5000mAh', badge: 'Camera King' },
  { id: 11, brand: 'xiaomi', name: 'Xiaomi 14T Pro', price: 649, emoji: '🔴', specs: '6.67" AMOLED · Dimensity 9300+ · 50MP · 5000mAh', badge: null },
  { id: 12, brand: 'oneplus', name: 'OnePlus 13', price: 799, emoji: '🔵', specs: '6.82" AMOLED · Snapdragon 8 Elite · 50MP · 6000mAh', badge: 'Fast Charge' },
  { id: 13, brand: 'oneplus', name: 'OnePlus Open 2', price: 1499, emoji: '🔵', specs: '7.82" Foldable · Snapdragon 8 Gen 3 · 50MP · 4800mAh', badge: 'Foldable' },
  { id: 14, brand: 'apple', name: 'iPhone 15', price: 599, emoji: '📱', specs: '6.1" OLED · A16 · 48MP · 3349mAh', badge: 'Deal' },
];

// ========== STATE ==========
let cart = JSON.parse(localStorage.getItem('phonezone-cart') || '[]');

// ========== NAVIGATION ==========
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));

  document.getElementById('page-' + page).classList.add('active');

  const navEl = document.getElementById('nav-' + page);
  if (navEl) navEl.classList.add('active');

  window.scrollTo(0, 0);

  if (page === 'phones') renderPhones(phones);
  if (page === 'cart') renderCart();
  if (page === 'checkout') renderCheckout();
}

// ========== PHONES ==========
function renderPhones(data) {
  const grid = document.getElementById('phones-grid');
  if (data.length === 0) {
    grid.innerHTML = '<p style="color:var(--muted); padding:40px; grid-column:1/-1">No phones found.</p>';
    return;
  }
  grid.innerHTML = data.map(phone => `
    <div class="phone-card">
      <div class="phone-img">
        ${phone.badge ? `<div class="phone-badge">${phone.badge}</div>` : ''}
        <span>${phone.emoji}</span>
      </div>
      <div class="phone-info">
        <div class="phone-brand">${phone.brand}</div>
        <div class="phone-name">${phone.name}</div>
        <div class="phone-specs">${phone.specs}</div>
        <div class="phone-footer">
          <div class="phone-price">$${phone.price}</div>
          <button class="add-btn" onclick="addToCart(${phone.id})">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterPhones(brand, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filtered = brand === 'all' ? phones : phones.filter(p => p.brand === brand);
  renderPhones(filtered);
}

// ========== CART ==========
function addToCart(id) {
  const phone = phones.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...phone, qty: 1 });
  }
  saveCart();
  updateCartCount();
  showToast(`${phone.name} added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartCount();
  renderCart();
}

function updateQty(id, change) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += change;
  if (item.qty <= 0) removeFromCart(id);
  else {
    saveCart();
    renderCart();
  }
}

function saveCart() {
  localStorage.setItem('phonezone-cart', JSON.stringify(cart));
}

function updateCartCount() {
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cart-count').textContent = total;
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function renderCart() {
  const content = document.getElementById('cart-content');
  if (cart.length === 0) {
    content.innerHTML = `
      <div class="cart-empty">
        <div class="empty-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p style="margin-bottom:24px">Looks like you haven't added anything yet.</p>
        <button class="btn-primary" onclick="showPage('phones')">Browse Phones</button>
      </div>
    `;
    return;
  }

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  content.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items">
        ${cart.map(item => `
          <div class="cart-item">
            <div class="cart-item-img">${item.emoji}</div>
            <div class="cart-item-info">
              <div class="cart-item-brand">${item.brand}</div>
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-price">$${(item.price * item.qty).toLocaleString()}</div>
            </div>
            <div class="cart-item-actions">
              <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
              <span class="qty-display">${item.qty}</span>
              <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
              <button class="remove-btn" onclick="removeFromCart(${item.id})">✕</button>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="cart-summary">
        <h3>Order Summary</h3>
        <div class="summary-row">
          <span style="color:var(--muted)">Subtotal</span>
          <span>$${subtotal.toLocaleString()}</span>
        </div>
        <div class="summary-row">
          <span style="color:var(--muted)">Shipping</span>
          <span style="color:#4ecca3">Free</span>
        </div>
        <div class="summary-row">
          <span style="color:var(--muted)">Tax (8%)</span>
          <span>$${tax.toFixed(2)}</span>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <span>$${total.toFixed(2)}</span>
        </div>
        <button class="btn-primary" style="width:100%; margin-top:24px; padding:16px" onclick="showPage('checkout')">
          Proceed to Checkout
        </button>
        <button class="btn-outline" style="width:100%; margin-top:12px" onclick="showPage('phones')">
          Continue Shopping
        </button>
      </div>
    </div>
  `;
}

// ========== CHECKOUT ==========
function renderCheckout() {
  const itemsEl = document.getElementById('checkout-items');
  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  itemsEl.innerHTML = cart.map(item => `
    <div class="order-item">
      <div class="order-item-img">${item.emoji}</div>
      <div class="order-item-name">${item.name} x${item.qty}</div>
      <div class="order-item-price">$${(item.price * item.qty).toLocaleString()}</div>
    </div>
  `).join('');

  document.getElementById('checkout-subtotal').textContent = '$' + subtotal.toLocaleString();
  document.getElementById('checkout-tax').textContent = '$' + tax.toFixed(2);
  document.getElementById('checkout-total').textContent = '$' + total.toFixed(2);
}

function placeOrder() {
  cart = [];
  saveCart();
  updateCartCount();
  showPage('success');
}

// ========== AUTH ==========
function handleLogin() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  if (!email || !password) {
    showToast('Please fill in all fields!');
    return;
  }
  showToast('Welcome back! Logged in successfully.');
  showPage('phones');
}

function handleRegister() {
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  if (!name || !email || !password) {
    showToast('Please fill in all fields!');
    return;
  }
  showToast('Account created! Welcome to E-Mobix!');
  showPage('phones');
}

function showRegister() {
  document.getElementById('login-card').style.display = 'none';
  document.getElementById('register-card').style.display = 'block';
}

function showLogin() {
  document.getElementById('register-card').style.display = 'none';
  document.getElementById('login-card').style.display = 'block';
}

// ========== TOAST ==========
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ========== CARD FORMAT ==========
document.addEventListener('input', function(e) {
  if (e.target.id === 'card-number') {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    e.target.value = val.replace(/(.{4})/g, '$1 ').trim();
  }
});

// ========== INIT ==========
updateCartCount();
renderPhones(phones);