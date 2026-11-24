/* Jara Market - Phase 1 DEMONSTRATION frontend.
   DEMO DATA below is sample data for design only. In Phase 2 it is replaced by calls to the backend API.
   Totals here are for display only; the real backend will recalculate every price and total at checkout. */
"use strict";

const DEMO_CATEGORIES = [
  {id: "grains", img: "images/products/rice.jpg", name: "Grains and cereals"},
  {id: "beans", img: "images/products/brown-beans.jpg", name: "Beans and legumes"},
  {id: "tubers", img: "images/products/yam.jpg", name: "Tubers and roots"},
  {id: "veg", img: "images/products/tomatoes.jpg", name: "Vegetables"},
  {id: "fruit", img: "images/products/plantain.jpg", name: "Fruits"},
  {id: "food", img: "images/products/palm-oil.jpg", name: "Foodstuffs and oils"}
];
// price = whole naira (DEMO). unit = what the price is for.
const DEMO_PRODUCTS = [
  {id: 1, img: "images/products/rice.jpg", name: "Rice (local, white)", cat: "grains", price: 2200, unit: "kg", stock: 80},
  {id: 2, img: "images/products/brown-beans.jpg", name: "Brown beans", cat: "beans", price: 2500, unit: "kg", stock: 40},
  {id: 3, img: "images/products/yam.jpg", name: "Yam tubers", cat: "tubers", price: 3000, unit: "piece", stock: 25},
  {id: 4, img: "images/products/tomatoes.jpg", name: "Tomatoes", cat: "veg", price: 1800, unit: "basket", stock: 12},
  {id: 5, img: "images/products/fresh-peppers.jpg", name: "Fresh peppers (tatashe)", cat: "veg", price: 1200, unit: "kg", stock: 0},
  {id: 6, img: "images/products/onions.jpg", name: "Onions", cat: "veg", price: 1500, unit: "kg", stock: 60},
  {id: 7, img: "images/products/ugu.jpg", name: "Ugu (pumpkin leaf)", cat: "veg", price: 500, unit: "bunch", stock: 30},
  {id: 8, img: "images/products/plantain.jpg", name: "Plantain", cat: "fruit", price: 1000, unit: "bunch", stock: 20},
  {id: 9, img: "images/products/watermelon.jpg", name: "Watermelon", cat: "fruit", price: 2000, unit: "piece", stock: 15},
  {id: 10, img: "images/products/garri.jpg", name: "Garri (white)", cat: "food", price: 28000, unit: "bag", stock: 10},
  {id: 11, img: "images/products/palm-oil.jpg", name: "Palm oil", cat: "food", price: 3500, unit: "litre", stock: 35},
  {id: 13, img: "images/products/potatoes.jpg", name: "Irish potatoes", cat: "tubers", price: 2000, unit: "kg", stock: 45},
  {id: 14, img: "images/products/spring-onions.jpg", name: "Spring onions", cat: "veg", price: 500, unit: "bunch", stock: 30},
  {id: 12, img: "images/products/crayfish.jpg", name: "Crayfish", cat: "food", price: 1500, unit: "100 g", stock: 50}
];
const DELIVERY_FEE_DEMO = 1500; // placeholder; real fees come from the backend by area

const $ = id => document.getElementById(id);
const naira = n => "₦" + Number(n).toLocaleString("en-NG");
let cart = {};          // productId -> quantity
let filter = {cat: null, q: ""};

try { cart = JSON.parse(localStorage.getItem("jara_demo_cart") || "{}") || {}; } catch (e) { cart = {}; }
const save = () => { try { localStorage.setItem("jara_demo_cart", JSON.stringify(cart)); } catch (e) {} };
const find = id => DEMO_PRODUCTS.find(p => p.id === Number(id));

function toast(msg) {
  const t = $("toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2600);
}

function renderCategories() {
  $("catGrid").innerHTML = DEMO_CATEGORIES.map(c =>
    `<button class="cat" type="button" data-cat="${c.id}" aria-pressed="${filter.cat === c.id}"><img src="${c.img}" alt="" loading="lazy"><span class="cat-label">${c.name}</span></button>`).join("");
}

function renderProducts() {
  const q = filter.q.trim().toLowerCase();
  const list = DEMO_PRODUCTS.filter(p => (!filter.cat || p.cat === filter.cat) && (!q || p.name.toLowerCase().includes(q)));
  const cat = DEMO_CATEGORIES.find(c => c.id === filter.cat);
  $("prodTitle").textContent = q ? `Results for "${filter.q.trim()}"` : cat ? cat.name : "Featured products";
  $("clearFilter").hidden = !(q || cat);
  $("prodGrid").innerHTML = list.length ? list.map(p => {
    const out = p.stock <= 0;
    return `<article class="card"><div class="pic"><img src="${p.img}" alt="${p.name}" loading="lazy" width="400" height="300"><span class="tag">Demo</span></div>
      <div class="body"><h3>${p.name}</h3>
      <div class="price">${naira(p.price)} <small>per ${p.unit}</small></div>
      <div class="stock ${out ? "out" : ""}">${out ? "Out of stock" : "In stock"}</div>
      <button class="btn btn-green" type="button" data-add="${p.id}" ${out ? "disabled" : ""}>${out ? "Unavailable" : "Add to Cart"}</button></div></article>`;
  }).join("") : `<div class="empty"><h3>No products found</h3><p>Try a different search or browse a category.</p></div>`;
}

function renderCart() {
  const ids = Object.keys(cart);
  $("cartCount").textContent = ids.reduce((s, id) => s + cart[id], 0);
  if (!ids.length) {
    $("cartBody").innerHTML = `<p class="empty">Your cart is empty. Add something from the shop.</p>`;
    $("cartFoot").innerHTML = ""; return;
  }
  let sub = 0;
  $("cartBody").innerHTML = ids.map(id => {
    const p = find(id), line = p.price * cart[id]; sub += line;
    return `<div class="line"><div><strong>${p.name}</strong><br><small>${naira(p.price)} per ${p.unit}</small></div><strong>${naira(line)}</strong>
      <div class="qty"><button type="button" data-dec="${id}" aria-label="Decrease ${p.name}">−</button><span>${cart[id]}</span><button type="button" data-inc="${id}" aria-label="Increase ${p.name}">+</button></div>
      <button class="rm" type="button" data-rm="${id}">Remove</button></div>`;
  }).join("");
  $("cartFoot").innerHTML = `<div class="row"><span>Subtotal</span><span>${naira(sub)}</span></div>
    <div class="row"><span>Delivery (demo estimate)</span><span>${naira(DELIVERY_FEE_DEMO)}</span></div>
    <div class="row total"><span>Estimated total</span><span>${naira(sub + DELIVERY_FEE_DEMO)}</span></div>
    <p class="note">Final totals will be calculated by the server at checkout.</p>
    <button class="btn btn-yellow" type="button" data-demo="Checkout arrives in Phase 4." style="width:100%">Checkout</button>`;
}

function setCart(open) {
  $("drawer").classList.toggle("open", open);
  $("drawer").setAttribute("aria-hidden", String(!open));
  $("scrim").hidden = !open;
  (open ? $("closeCart") : $("openCart")).focus();
}

document.addEventListener("click", e => {
  const t = e.target.closest("button,a"); if (!t) return;
  const d = t.dataset;
  if (d.demo) { e.preventDefault(); toast(d.demo); return; }
  if (d.add) {
    const p = find(d.add), have = cart[p.id] || 0;
    if (have >= p.stock) return toast("That is all we have in stock for this item.");
    cart[p.id] = have + 1; save(); renderCart(); toast(`${p.name} added to cart`);
  } else if (d.inc) {
    const p = find(d.inc);
    if (cart[p.id] >= p.stock) toast("No more stock available."); else cart[p.id]++;
    save(); renderCart();
  } else if (d.dec) { if (--cart[d.dec] <= 0) delete cart[d.dec]; save(); renderCart(); }
  else if (d.rm) { delete cart[d.rm]; save(); renderCart(); }
  else if (d.cat) { filter.cat = filter.cat === d.cat ? null : d.cat; filter.q = ""; $("q").value = ""; renderCategories(); renderProducts(); $("products").scrollIntoView(); }
  else if (t.id === "clearFilter") { filter = {cat: null, q: ""}; $("q").value = ""; renderCategories(); renderProducts(); }
  else if (t.id === "openCart") setCart(true);
  else if (t.id === "closeCart") setCart(false);
});
$("scrim").addEventListener("click", () => setCart(false));
document.addEventListener("keydown", e => { if (e.key === "Escape") setCart(false); });
$("searchForm").addEventListener("submit", e => {
  e.preventDefault(); filter = {cat: null, q: $("q").value}; renderCategories(); renderProducts(); $("products").scrollIntoView();
});

// Real photos only: if a photo file is missing, show a plain notice instead of a fake image
document.addEventListener("error", e => {
  const el = e.target;
  if (el.tagName !== "IMG") return;
  if (el.closest(".cat")) { el.remove(); return; }
  if (el.closest(".hero-photo")) { el.closest(".hero-photo").remove(); return; }
  const note = document.createElement("span"); note.className = "nophoto"; note.textContent = "Photo coming soon";
  el.replaceWith(note);
}, true);

// Drop saved items that no longer exist in the catalogue
Object.keys(cart).forEach(id => { if (!find(id) || !(cart[id] > 0)) delete cart[id]; });
renderCategories(); renderProducts(); renderCart();