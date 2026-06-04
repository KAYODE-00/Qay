/**
 * Commerce Elements Templates
 */

import { BlockTemplate } from '@/types';
import { getTemplateRef } from '@/lib/templates/blocks';
import { getTiptapTextContent } from '@/lib/text-format-utils';

function textRef(text: string, tag: 'span' | 'p' | 'h2' | 'h3' = 'p', classes: string[] = []) {
  return getTemplateRef(tag === 'h2' || tag === 'h3' ? 'heading' : 'text', {
    settings: { tag },
    classes,
    restrictions: { editText: true },
    variables: {
      text: {
        type: 'dynamic_rich_text',
        data: { content: getTiptapTextContent(text) },
      },
    },
  });
}

function productCard(title: string, price: string, tag: string) {
  return {
    name: 'div',
    customName: 'Product card',
    classes: ['group', 'flex', 'flex-col', 'overflow-hidden', 'rounded-[18px]', 'border', 'border-[#000000]/10', 'bg-[#ffffff]'],
    attributes: { 'data-qay-commerce': 'product-card' },
    children: [
      {
        name: 'div',
        customName: 'Product image',
        classes: ['flex', 'aspect-[4/5]', 'w-full', 'items-center', 'justify-center', 'bg-[#f2f0ea]'],
        attributes: { 'data-qay-commerce': 'product-image' },
        children: [
          textRef(tag, 'span', ['text-[11px]', 'font-[600]', 'uppercase', 'tracking-[0.22em]', 'text-[#000000]/35']),
        ],
      },
      {
        name: 'div',
        classes: ['flex', 'flex-col', 'gap-[14px]', 'p-[18px]'],
        children: [
          {
            ...textRef(title, 'h3', ['text-[20px]', 'font-[600]', 'leading-[1.1]', 'text-[#111111]']),
            attributes: { 'data-qay-commerce': 'product-title' },
          },
          {
            ...textRef('A short product description from your Medusa catalog will appear here.', 'p', ['text-[13px]', 'leading-[1.6]', 'text-[#111111]/60']),
            attributes: { 'data-qay-commerce': 'product-description' },
          },
          {
            name: 'div',
            classes: ['flex', 'items-center', 'justify-between', 'gap-[12px]'],
            children: [
              {
                ...textRef(price, 'span', ['text-[14px]', 'font-[700]', 'text-[#111111]']),
                attributes: { 'data-qay-commerce': 'product-price' },
              },
              {
                name: 'button',
                customName: 'Add to cart button',
                classes: ['rounded-[999px]', 'bg-[#111111]', 'px-[16px]', 'py-[10px]', 'text-[12px]', 'font-[600]', 'text-[#ffffff]'],
                attributes: {
                  type: 'button',
                  'data-qay-commerce': 'add-to-cart',
                },
                children: [textRef('Add', 'span')],
              },
            ],
          },
        ],
      },
    ],
  };
}

export const commerceTemplates: Record<string, BlockTemplate> = {
  storefrontHero: {
    icon: 'box',
    name: 'Storefront hero',
    template: {
      name: 'section',
      customName: 'Storefront hero',
      classes: ['grid', 'min-h-[680px]', 'w-full', 'items-stretch', 'bg-[#10100f]', 'text-[#f8f3e8]', 'lg:grid-cols-[1.1fr_0.9fr]'],
      children: [
        {
          name: 'div',
          classes: ['flex', 'flex-col', 'justify-center', 'gap-[28px]', 'px-[24px]', 'py-[96px]', 'md:px-[64px]'],
          children: [
            textRef('New collection', 'span', ['text-[12px]', 'font-[700]', 'uppercase', 'tracking-[0.32em]', 'text-[#c7a45d]']),
            textRef('Build a storefront that feels expensive before checkout.', 'h2', ['max-w-[760px]', 'text-[54px]', 'font-[700]', 'leading-[0.95]', 'tracking-[-0.04em]', 'md:text-[84px]']),
            textRef('Connect Medusa once, then use QAY commerce blocks to shape product grids, cart actions, collection sections, and landing pages.', 'p', ['max-w-[560px]', 'text-[16px]', 'leading-[1.8]', 'text-[#f8f3e8]/70']),
            {
              name: 'div',
              classes: ['flex', 'flex-wrap', 'gap-[12px]'],
              children: [
                {
                  name: 'button',
                  customName: 'Cart button',
                  classes: ['rounded-[999px]', 'bg-[#f8f3e8]', 'px-[22px]', 'py-[13px]', 'text-[13px]', 'font-[700]', 'text-[#10100f]'],
                  attributes: { type: 'button', 'data-qay-commerce': 'cart-button', 'data-qay-cart-label': 'Cart' },
                  children: [textRef('Cart (0)', 'span')],
                },
                {
                  name: 'button',
                  customName: 'Shop button',
                  classes: ['rounded-[999px]', 'border', 'border-[#f8f3e8]/20', 'px-[22px]', 'py-[13px]', 'text-[13px]', 'font-[700]', 'text-[#f8f3e8]'],
                  attributes: { type: 'button', 'data-qay-hover': 'scale-btn' },
                  children: [textRef('Explore products', 'span')],
                },
              ],
            },
          ],
        },
        {
          name: 'div',
          classes: ['relative', 'min-h-[420px]', 'overflow-hidden', 'bg-[#d8c7aa]'],
          attributes: { 'data-qay-hover': 'img-zoom' },
          children: [
            {
              name: 'image',
              customName: 'Hero product image',
              classes: ['h-full', 'w-full', 'object-cover'],
              settings: {
                tag: 'img',
                src: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=1400&auto=format&q=80',
                alt: 'Premium product display',
              },
            },
          ],
        },
      ],
    },
  },
  productGrid: {
    icon: 'box',
    name: 'Product grid',
    template: {
      name: 'section',
      customName: 'Product grid',
      classes: ['flex', 'w-full', 'flex-col', 'gap-[32px]', 'bg-[#faf8f2]', 'px-[24px]', 'py-[72px]', 'text-[#111111]'],
      attributes: { 'data-qay-commerce': 'product-grid' },
      children: [
        {
          name: 'div',
          classes: ['mx-auto', 'flex', 'w-full', 'max-w-[1120px]', 'flex-col', 'gap-[12px]'],
          children: [
            textRef('Featured products', 'h2', ['text-[40px]', 'font-[700]', 'leading-[1]', 'tracking-[-0.02em]', 'text-[#111111]']),
            textRef('Connect Medusa in Settings -> Commerce, then map this section to your product feed.', 'p', ['max-w-[560px]', 'text-[15px]', 'leading-[1.7]', 'text-[#111111]/60']),
          ],
        },
        {
          name: 'div',
          classes: ['mx-auto', 'grid', 'w-full', 'max-w-[1120px]', 'gap-[18px]', 'md:grid-cols-3'],
          children: [
            productCard('Signature product', '$49', 'Product 01'),
            productCard('Premium bundle', '$89', 'Product 02'),
            productCard('Limited drop', '$129', 'Product 03'),
          ],
        },
      ],
    },
  },
  productDetail: {
    icon: 'box',
    name: 'Product detail',
    template: {
      name: 'section',
      customName: 'Product detail',
      classes: ['grid', 'w-full', 'gap-[32px]', 'bg-[#ffffff]', 'px-[24px]', 'py-[80px]', 'text-[#111111]', 'lg:grid-cols-2', 'lg:px-[64px]'],
      attributes: { 'data-qay-commerce': 'product-card' },
      children: [
        {
          name: 'div',
          customName: 'Product media',
          classes: ['overflow-hidden', 'rounded-[28px]', 'bg-[#eee9df]'],
          attributes: { 'data-qay-commerce': 'product-image', 'data-qay-hover': 'img-zoom' },
          children: [
            {
              name: 'image',
              classes: ['aspect-[4/5]', 'w-full', 'object-cover'],
              settings: {
                tag: 'img',
                src: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1000&auto=format&q=80',
                alt: 'Product image',
              },
            },
          ],
        },
        {
          name: 'div',
          classes: ['flex', 'flex-col', 'justify-center', 'gap-[22px]'],
          children: [
            { ...textRef('Signature product', 'h2', ['text-[48px]', 'font-[700]', 'leading-[1]', 'tracking-[-0.03em]']), attributes: { 'data-qay-commerce': 'product-title' } },
            { ...textRef('A focused product story, pulled from your connected Medusa catalog when available.', 'p', ['max-w-[560px]', 'text-[16px]', 'leading-[1.8]', 'text-[#111111]/62']), attributes: { 'data-qay-commerce': 'product-description' } },
            { ...textRef('$49', 'span', ['text-[22px]', 'font-[800]']), attributes: { 'data-qay-commerce': 'product-price' } },
            {
              name: 'button',
              customName: 'Add to cart button',
              classes: ['h-[52px]', 'w-full', 'max-w-[320px]', 'rounded-[999px]', 'bg-[#111111]', 'px-[24px]', 'text-[14px]', 'font-[700]', 'text-[#ffffff]'],
              attributes: { type: 'button', 'data-qay-commerce': 'add-to-cart' },
              children: [textRef('Add to cart', 'span')],
            },
          ],
        },
      ],
    },
  },
  collectionCards: {
    icon: 'box',
    name: 'Collection cards',
    template: {
      name: 'section',
      customName: 'Collection cards',
      classes: ['bg-[#111111]', 'px-[24px]', 'py-[72px]', 'text-[#ffffff]'],
      children: [
        {
          name: 'div',
          classes: ['mx-auto', 'grid', 'max-w-[1120px]', 'gap-[16px]', 'md:grid-cols-3'],
          children: ['New arrivals', 'Best sellers', 'Limited drops'].map((label) => ({
            name: 'div',
            customName: 'Collection card',
            classes: ['flex', 'min-h-[220px]', 'flex-col', 'justify-between', 'rounded-[22px]', 'border', 'border-[#ffffff]/10', 'bg-[#ffffff]/5', 'p-[22px]'],
            attributes: { 'data-qay-hover': 'luxe-lift' },
            children: [
              textRef(label, 'h3', ['text-[26px]', 'font-[700]', 'leading-[1]']),
              textRef('Curated products from your Medusa catalog.', 'p', ['text-[13px]', 'leading-[1.7]', 'text-[#ffffff]/55']),
            ],
          })),
        },
      ],
    },
  },
  cartDrawer: {
    icon: 'box',
    name: 'Cart drawer',
    template: {
      name: 'div',
      customName: 'Cart drawer',
      classes: ['hidden', 'fixed', 'right-[20px]', 'top-[90px]', 'z-50', 'w-[min(360px,calc(100vw-40px))]', 'rounded-[20px]', 'border', 'border-[#000000]/10', 'bg-[#ffffff]', 'p-[20px]', 'text-[#111111]', 'shadow-2xl'],
      attributes: { 'data-qay-commerce': 'cart-drawer' },
      children: [
        textRef('Cart', 'h3', ['text-[20px]', 'font-[800]']),
        {
          name: 'div',
          customName: 'Cart items',
          classes: ['mt-[12px]', 'text-[14px]', 'text-[#111111]/70'],
          attributes: { 'data-qay-commerce': 'cart-items' },
          children: [textRef('Your cart is empty.', 'p')],
        },
        {
          name: 'button',
          customName: 'Checkout button',
          classes: ['mt-[18px]', 'h-[44px]', 'w-full', 'rounded-[999px]', 'bg-[#111111]', 'text-[13px]', 'font-[700]', 'text-[#ffffff]'],
          attributes: { type: 'button', 'data-qay-commerce': 'checkout-button' },
          children: [textRef('Checkout', 'span')],
        },
      ],
    },
  },
  trustBar: {
    icon: 'box',
    name: 'Trust bar',
    template: {
      name: 'section',
      customName: 'Commerce trust bar',
      classes: ['grid', 'w-full', 'gap-[12px]', 'border-y', 'border-[#000000]/10', 'bg-[#f7f3ea]', 'px-[24px]', 'py-[18px]', 'text-[#111111]', 'md:grid-cols-3'],
      children: ['Secure checkout', 'Fast delivery', 'Easy returns'].map((label) => ({
        name: 'div',
        classes: ['flex', 'items-center', 'justify-center', 'rounded-[14px]', 'bg-[#ffffff]/70', 'px-[16px]', 'py-[14px]'],
        children: [textRef(label, 'span', ['text-[12px]', 'font-[800]', 'uppercase', 'tracking-[0.18em]'])],
      })),
    },
  },
  cartButton: {
    icon: 'box',
    name: 'Cart button',
    template: {
      name: 'button',
      customName: 'Cart button',
      classes: ['inline-flex', 'items-center', 'justify-center', 'rounded-[999px]', 'border', 'border-[#000000]/10', 'bg-[#ffffff]', 'px-[18px]', 'py-[10px]', 'text-[13px]', 'font-[600]', 'text-[#111111]'],
      attributes: {
        type: 'button',
        'data-qay-commerce': 'cart-button',
      },
      children: [textRef('Cart (0)', 'span')],
    },
  },
};
