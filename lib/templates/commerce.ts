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
        children: [
          textRef(tag, 'span', ['text-[11px]', 'font-[600]', 'uppercase', 'tracking-[0.22em]', 'text-[#000000]/35']),
        ],
      },
      {
        name: 'div',
        classes: ['flex', 'flex-col', 'gap-[14px]', 'p-[18px]'],
        children: [
          textRef(title, 'h3', ['text-[20px]', 'font-[600]', 'leading-[1.1]', 'text-[#111111]']),
          textRef('A short product description from your Medusa catalog will appear here.', 'p', ['text-[13px]', 'leading-[1.6]', 'text-[#111111]/60']),
          {
            name: 'div',
            classes: ['flex', 'items-center', 'justify-between', 'gap-[12px]'],
            children: [
              textRef(price, 'span', ['text-[14px]', 'font-[700]', 'text-[#111111]']),
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
