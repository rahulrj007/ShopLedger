'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const invoice = require('../lib/invoice');
const pricing = require('../lib/pricing');

function line(name, price, qty, hsn, gstRate) {
  return { name, price, qty, hsn, gstRate };
}

const orders = [
  {
    id: 1001,
    coupon: '',
    items: [
      line('Rice', 640, 1, '1006', 5),
      line('Ghee', 450, 1, '0405', 12)
    ],
    expectedInvoice: {
      subtotal: 1090,
      discount: 0,
      tax: 86,
      cgst: 43,
      sgst: 43,
      total: 1176,
      gstRates: [5, 12]
    },
    expectedCheckout: { subtotal: 1090, discount: 0, tax: 86, total: 1176 }
  },
  {
    id: 1002,
    coupon: 'SAVE10',
    items: [line('Rice', 640, 1, '1006', 5)],
    expectedInvoice: {
      subtotal: 640,
      discount: 64,
      tax: 28.8,
      cgst: 14.4,
      sgst: 14.4,
      total: 604.8,
      gstRates: [5]
    },
    expectedCheckout: { subtotal: 640, discount: 64, tax: 28.8, total: 604.8 }
  },
  {
    id: 1004,
    coupon: 'SAVE10',
    items: [line('Rice', 2240, 1, '1006', 5)],
    expectedInvoice: {
      subtotal: 2240,
      discount: 150,
      tax: 104.5,
      cgst: 52.25,
      sgst: 52.25,
      total: 2194.5,
      gstRates: [5]
    },
    expectedCheckout: { subtotal: 2240, discount: 150, tax: 104.5, total: 2194.5 }
  },
  {
    id: 1008,
    coupon: '',
    items: [line('Tea', 140, 2, '0902', 18), line('Coffee', 310, 1, '0901', 18)],
    expectedInvoice: {
      subtotal: 590,
      discount: 0,
      tax: 106.2,
      cgst: 53.1,
      sgst: 53.1,
      total: 696.2,
      gstRates: [18, 18]
    },
    expectedCheckout: { subtotal: 590, discount: 0, tax: 106.2, total: 696.2 }
  }
];

for (const sample of orders) {
  test(`CURRENT BEHAVIOUR: invoice figures for order #${sample.id}`, () => {
    const order = { id: sample.id, coupon: sample.coupon, items: sample.items };
    const actualInvoice = invoice.computeInvoiceFigures(order);
    const actualCheckout = pricing.computeTotals(sample.items, sample.coupon);

    assert.deepEqual(
      {
        subtotal: actualInvoice.subtotal,
        discount: actualInvoice.discount,
        tax: actualInvoice.tax,
        cgst: actualInvoice.cgst,
        sgst: actualInvoice.sgst,
        total: actualInvoice.total,
        gstRates: actualInvoice.rows.map(row => row.gstPercent)
      },
      sample.expectedInvoice
    );
    assert.deepEqual(
      {
        subtotal: actualCheckout.subtotal,
        discount: actualCheckout.discount,
        tax: actualCheckout.tax,
        total: actualCheckout.total
      },
      sample.expectedCheckout
    );
  });
}

test('correct behaviour: invoice for HSN 1508 order #1004 matches checkout', () => {
  const items = [
    line('Cold-Pressed Groundnut Oil 5L', 1120, 2, '1508', undefined)
  ];
  const order = { id: 1004, coupon: 'SAVE10', items };
  const actualInvoice = invoice.computeInvoiceFigures(order);
  const checkout = pricing.computeTotals(items, order.coupon);

  assert.deepEqual(
    {
      subtotal: actualInvoice.subtotal,
      discount: actualInvoice.discount,
      tax: actualInvoice.tax,
      cgst: actualInvoice.cgst,
      sgst: actualInvoice.sgst,
      total: actualInvoice.total,
      gstRates: actualInvoice.rows.map(row => row.gstPercent)
    },
    {
      subtotal: checkout.subtotal,
      discount: checkout.discount,
      tax: checkout.tax,
      cgst: checkout.cgst,
      sgst: checkout.sgst,
      total: checkout.total,
      gstRates: checkout.lines.map(row => row.gstPercent)
    }
  );
});
