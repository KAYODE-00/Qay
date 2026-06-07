'use client';

import { useEffect } from 'react';

type QayCommerceProduct = {
  id: string;
  title: string;
  handle: string | null;
  thumbnail: string | null;
  description: string | null;
  price: string | null;
};

type CartItem = {
  id: string;
  title: string;
  quantity: number;
};

function setText(root: Element, selector: string, value: string) {
  const target = root.querySelector(selector);
  if (target) target.textContent = value;
}

function setImage(root: Element, product: QayCommerceProduct) {
  const wrapper = root.querySelector('[data-qay-commerce="product-image"]') || root;
  const image = wrapper.querySelector('img');
  if (!image || !product.thumbnail) return;

  image.src = product.thumbnail;
  image.alt = product.title;
}

function cartKey(siteId: string) {
  return `qay-commerce-cart:${siteId}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function readCart(siteId: string): CartItem[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(cartKey(siteId)) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(siteId: string, items: CartItem[]) {
  window.localStorage.setItem(cartKey(siteId), JSON.stringify(items));
}

function updateCartUi(siteId: string) {
  const items = readCart(siteId);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  document.querySelectorAll('[data-qay-commerce="cart-button"], [data-qay-commerce="cart-count"]').forEach((element) => {
    const base = element.getAttribute('data-qay-cart-label') || 'Cart';
    element.textContent = element.getAttribute('data-qay-commerce') === 'cart-count'
      ? String(count)
      : `${base} (${count})`;
  });

  document.querySelectorAll('[data-qay-commerce="cart-drawer"]').forEach((drawer) => {
    const list = drawer.querySelector('[data-qay-commerce="cart-items"]');
    if (!list) return;

    list.innerHTML = items.length
      ? items.map((item) => `<div class="flex items-center justify-between gap-3 border-b border-current/10 py-3"><span>${escapeHtml(item.title)}</span><span>x${item.quantity}</span></div>`).join('')
      : '<div class="py-3 opacity-60">Your cart is empty.</div>';
  });
}

function toggleCartDrawer() {
  document.querySelectorAll('[data-qay-commerce="cart-drawer"]').forEach((drawer) => {
    drawer.classList.toggle('hidden');
  });
}

function addToCart(siteId: string, product: QayCommerceProduct) {
  const items = readCart(siteId);
  const existing = items.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    items.push({ id: product.id, title: product.title, quantity: 1 });
  }
  writeCart(siteId, items);
  updateCartUi(siteId);
}

function bindCartControls() {
  document.querySelectorAll('[data-qay-commerce="cart-button"]').forEach((button) => {
    if ((button as HTMLElement).dataset.qayCartBound === 'true') return;
    (button as HTMLElement).dataset.qayCartBound = 'true';
    button.addEventListener('click', toggleCartDrawer);
  });

  document.querySelectorAll('[data-qay-commerce="checkout-button"]').forEach((button) => {
    if ((button as HTMLElement).dataset.qayCheckoutBound === 'true') return;
    (button as HTMLElement).dataset.qayCheckoutBound = 'true';
    button.addEventListener('click', () => {
      window.alert('Checkout connection is ready for Medusa checkout wiring. Cart items are saved locally for this preview.');
    });
  });
}

export default function QayCommerceInitializer({ siteId }: { siteId?: string }) {
  useEffect(() => {
    if (!siteId) return;

    const currentSiteId = siteId;
    let cancelled = false;

    async function init() {
      updateCartUi(currentSiteId);
      bindCartControls();

      const productCards = Array.from(document.querySelectorAll('[data-qay-commerce="product-card"]'));
      if (productCards.length === 0) return;

      let products: QayCommerceProduct[] = [];
      try {
        const response = await fetch(`/api/qay/commerce/${currentSiteId}/products`, { cache: 'no-store' });
        const payload = await response.json().catch(() => null);
        products = Array.isArray(payload?.data) ? payload.data : [];
      } catch (error) {
        console.warn('[QAY commerce] Product fetch failed:', error);
      }

      if (cancelled || products.length === 0) return;

      productCards.forEach((card, index) => {
        const product = products[index % products.length];
        if (!product) return;

        card.setAttribute('data-qay-product-id', product.id);
        if (product.handle) card.setAttribute('data-qay-product-handle', product.handle);

        setText(card, '[data-qay-commerce="product-title"]', product.title);
        setText(card, '[data-qay-commerce="product-description"]', product.description || product.handle || '');
        if (product.price) setText(card, '[data-qay-commerce="product-price"]', product.price);
        setImage(card, product);

        card.querySelectorAll('[data-qay-commerce="add-to-cart"]').forEach((button) => {
          button.setAttribute('type', 'button');
          button.setAttribute('data-qay-product-id', product.id);
        });
      });

      document.querySelectorAll('[data-qay-commerce="add-to-cart"]').forEach((button) => {
        if ((button as HTMLElement).dataset.qayCommerceBound === 'true') return;
        (button as HTMLElement).dataset.qayCommerceBound = 'true';
        button.addEventListener('click', () => {
          const productId = button.getAttribute('data-qay-product-id');
          const product = products.find((item) => item.id === productId) || products[0];
          if (product) addToCart(currentSiteId, product);
        });
      });

    }

    init();

    return () => {
      cancelled = true;
    };
  }, [siteId]);

  return null;
}
