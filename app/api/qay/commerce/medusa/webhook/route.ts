import { createHmac, createHash, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getQayAdmin } from '@/qay/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SUPPORTED_EVENTS = new Set([
  'order.placed',
  'payment.captured',
  'product.updated',
  'customer.created',
]);

function normalizeSecret(value: string | undefined) {
  return (value || '').trim().replace(/^["']|["']$/g, '');
}

function signBody(body: string, secret: string) {
  return createHmac('sha256', secret).update(body).digest('hex');
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function verifySignature(body: string, signature: string | null) {
  const secret = normalizeSecret(process.env.QAY_WEBHOOK_SECRET);
  if (!secret) {
    return { ok: false, reason: 'QAY_WEBHOOK_SECRET is not configured' };
  }

  if (!signature) {
    return { ok: false, reason: 'Missing x-qay-signature header' };
  }

  const expected = signBody(body, secret);
  return safeEqual(signature, expected)
    ? { ok: true, reason: null }
    : { ok: false, reason: 'Invalid x-qay-signature header' };
}

function getEventName(payload: Record<string, unknown>) {
  const candidates = [
    payload.event,
    payload.eventName,
    payload.event_name,
    payload.type,
  ];

  return candidates.find((value): value is string => typeof value === 'string' && value.trim().length > 0)?.trim() || '';
}

function getEventKey(body: string, payload: Record<string, unknown>, eventName: string) {
  const idCandidates = [
    payload.id,
    payload.eventId,
    payload.event_id,
    payload.emittedAt,
    payload.emitted_at,
    payload.created_at,
  ];
  const stableId = idCandidates.find((value): value is string => typeof value === 'string' && value.trim().length > 0);

  if (stableId) {
    return `${eventName}:${stableId.trim()}`;
  }

  return `${eventName}:${createHash('sha256').update(body).digest('hex')}`;
}

export async function POST(request: Request) {
  const body = await request.text();
  const verification = verifySignature(body, request.headers.get('x-qay-signature'));

  if (!verification.ok) {
    return NextResponse.json({ error: verification.reason }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const eventName = getEventName(payload);
  if (!eventName) {
    return NextResponse.json({ error: 'Webhook event name is required' }, { status: 400 });
  }

  if (!SUPPORTED_EVENTS.has(eventName)) {
    return NextResponse.json({ received: true, ignored: true, eventName });
  }

  const supabase = getQayAdmin() as any;
  const eventKey = getEventKey(body, payload, eventName);
  const { error } = await supabase
    .from('qay_commerce_events')
    .upsert(
      {
        source: 'medusa',
        event_key: eventKey,
        event_name: eventName,
        payload,
        status: 'received',
        received_at: new Date().toISOString(),
      },
      { onConflict: 'source,event_key', ignoreDuplicates: true }
    );

  if (error) {
    console.error('[QAY commerce webhook] Failed to store event:', error);
    return NextResponse.json({ error: 'Failed to store commerce event' }, { status: 500 });
  }

  return NextResponse.json({ received: true, eventName, eventKey });
}
