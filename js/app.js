// ===========================================
// ⚠️ CHANGE THIS TO YOUR WHATSAPP NUMBER
// Format: country code + number, no + or spaces
// Example: 14155551234 (US), 447700900123 (UK)
// ===========================================
const WHATSAPP_NUMBER = "27743709573";

async function loadProducts() {
  const grid = document.getElementById("product-grid");

  try {
    const res = await fetch("data/products.json");
    if (!res.ok) throw new Error("Could not load products.json");
    const products = await res.json();

    grid.innerHTML = "";

    if (!products || products.length === 0) {
      grid.innerHTML = '<p class="loading">No products yet! Add some using the editor.</p>';
      return;
    }

    products.forEach(p => grid.appendChild(createCard(p)));
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p class="loading">Error loading products. Make sure <code>data/products.json</code> exists.</p>`;
  }
}

function createCard(p) {
  const card = document.createElement("article");
  card.className = "product-card" + (p.inStock === false ? " out-of-stock" : "");

  const img = p.image
    ? `<img src="${p.image}" alt="${escapeHtml(p.title)}" class="product-image" loading="lazy" />`
    : `<div class="product-image placeholder">📦</div>`;

  const outBadge = p.inStock === false
    ? `<span class="badge-out">Out of stock</span>`
    : "";

  const price = p.price !== undefined ? `$${Number(p.price).toFixed(2)}` : "Contact us";

  const message = encodeURIComponent(
    `Hi! I'm interested in ordering:\n\n` +
    `🛍️ ${p.title}\n` +
    `💰 Price: ${price}\n\n` +
    `Is it available?`
  );

  card.innerHTML = `
    ${img}
    <div class="product-info">
      ${outBadge}
      <h3>${escapeHtml(p.title)}</h3>
      <div class="product-price">${price}</div>
      <p class="product-desc">${escapeHtml(p.description || "")}</p>
      <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${message}" 
         target="_blank" rel="noopener" class="btn-whatsapp">
        💬 Order via WhatsApp
      </a>
    </div>
  `;
  return card;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

loadProducts();
