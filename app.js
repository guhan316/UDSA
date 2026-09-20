const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const state = {
  quantity: 1,
  colour: "Graphite",
  unitPrice: 6499,
  view: 0,
  cartCount: Number(localStorage.getItem("aeris-cart-count") || 0),
};

const views = [
  { name: "Three-quarter view", transform: "rotate(0deg) scale(1)", alt: "Aeris One wireless headphones in graphite, three-quarter view" },
  { name: "Side profile", transform: "rotate(-9deg) scale(.88)", alt: "Aeris One wireless headphones shown from the side" },
  { name: "Earcup detail", transform: "scale(1.48) translate(-7%, 7%)", alt: "Close view of the Aeris One earcup and control surface" },
  { name: "Comfort detail", transform: "scale(1.38) translate(8%, -10%)", alt: "Close view of the Aeris One padded headband and ear cushions" },
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const mainImage = $("[data-main-image]");
const imageModal = $("[data-image-modal]");
const cartDrawer = $("[data-cart-drawer]");
const overlay = $("[data-overlay]");
const toast = $("[data-toast]");

function updatePurchase() {
  const total = state.unitPrice * state.quantity;
  $("[data-quantity]").textContent = state.quantity;
  $("[data-total]").textContent = currency.format(total);
}

function selectView(index) {
  state.view = index;
  const view = views[index];
  mainImage.style.setProperty("--image-transform", view.transform);
  mainImage.alt = view.alt;
  $("[data-view-index]").textContent = String(index + 1).padStart(2, "0");
  $("[data-view-name]").textContent = view.name;
  $$("[data-view]").forEach((button, buttonIndex) => {
    const selected = buttonIndex === index;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", selected);
  });
}

function setOverlay(visible) {
  overlay.hidden = !visible;
  document.body.classList.toggle("has-dialog", visible);
}

function openCart(showToast = false) {
  const total = state.unitPrice * state.quantity;
  $("[data-cart-colour]").textContent = state.colour;
  $("[data-cart-quantity]").textContent = state.quantity;
  ["[data-cart-total]", "[data-cart-subtotal]", "[data-cart-grand-total]"].forEach((selector) => {
    $(selector).textContent = currency.format(total);
  });
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  setOverlay(true);
  $("[data-close-cart]").focus();
  if (showToast) {
    toast.classList.add("is-visible");
    window.setTimeout(() => toast.classList.remove("is-visible"), 1900);
  }
}

function closeDialogs() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  imageModal.classList.remove("is-open");
  imageModal.setAttribute("aria-hidden", "true");
  setOverlay(false);
}

$$("[data-view]").forEach((button) => button.addEventListener("click", () => selectView(Number(button.dataset.view))));

$$("[data-colour]").forEach((button) => {
  button.addEventListener("click", () => {
    state.colour = button.dataset.colour;
    mainImage.style.filter = `${button.dataset.filter} drop-shadow(0 28px 24px rgba(12,23,39,.2))`;
    $("[data-selected-colour]").textContent = state.colour;
    $$("[data-colour]").forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-checked", selected);
    });
  });
});

$("[data-decrease]").addEventListener("click", () => { state.quantity = Math.max(1, state.quantity - 1); updatePurchase(); });
$("[data-increase]").addEventListener("click", () => { state.quantity = Math.min(5, state.quantity + 1); updatePurchase(); });

$("[data-pin-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = $("#pincode");
  const result = $("[data-delivery-result]");
  if (!/^\d{6}$/.test(input.value)) {
    result.textContent = "Enter a valid 6-digit pincode.";
    result.classList.add("is-error");
    input.focus();
    return;
  }
  result.textContent = `Delivery to ${input.value} by ${new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short" }).format(new Date(Date.now() + 3 * 86400000))} · Free`;
  result.classList.remove("is-error");
});

$("[data-toggle-specs]").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const specs = $("#full-specs");
  const expanded = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!expanded));
  specs.hidden = expanded;
  button.innerHTML = `${expanded ? "View full specifications" : "Hide full specifications"} <span aria-hidden="true">${expanded ? "↓" : "↑"}</span>`;
});

$("[data-add-cart]").addEventListener("click", () => {
  state.cartCount += state.quantity;
  localStorage.setItem("aeris-cart-count", state.cartCount);
  $(".cart-count").textContent = state.cartCount;
  openCart(true);
});

$$("[data-open-cart]").forEach((button) => button.addEventListener("click", () => openCart(false)));
$$("[data-close-cart]").forEach((button) => button.addEventListener("click", closeDialogs));
overlay.addEventListener("click", closeDialogs);

$("[data-expand-image]").addEventListener("click", () => {
  const modalImage = $("img", imageModal);
  modalImage.style.filter = mainImage.style.filter;
  modalImage.alt = mainImage.alt;
  imageModal.classList.add("is-open");
  imageModal.setAttribute("aria-hidden", "false");
  setOverlay(true);
  $("[data-close-image]").focus();
});
$("[data-close-image]").addEventListener("click", closeDialogs);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDialogs();
  if (!cartDrawer.classList.contains("is-open") && !imageModal.classList.contains("is-open")) {
    if (event.key === "ArrowRight") selectView((state.view + 1) % views.length);
    if (event.key === "ArrowLeft") selectView((state.view - 1 + views.length) % views.length);
  }
});

$(".cart-count").textContent = state.cartCount;
updatePurchase();
