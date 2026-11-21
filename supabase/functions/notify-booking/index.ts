// Supabase Edge Function: notify-booking
//
// The booking form calls this straight after a hold is created. Its only job is
// to put the booking in the studio inbox, as a backup for when the customer
// never presses send in WhatsApp — phone offline, app closed, link ignored.
//
// It is deliberately best-effort. If RESEND_API_KEY is not set, it answers 503
// and the website carries on: nothing the customer sees depends on this.
//
// Deploy once with:  supabase functions deploy notify-booking
// Secrets:           supabase secrets set RESEND_API_KEY=re_...
//                    supabase secrets set STUDIO_EMAIL=annasbeautistry@gmail.com

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const STUDIO_EMAIL = Deno.env.get('STUDIO_EMAIL') ?? 'annasbeautistry@gmail.com';
const FROM_ADDRESS = Deno.env.get('STUDIO_FROM') ?? "Anna's Beautistry <onboarding@resend.dev>";

// Only the live site (and local development) may call this function. A
// wildcard origin would let any website on the internet spend the studio's
// Resend quota by POSTing here directly.
const ALLOWED_ORIGINS = new Set([
  'https://anna-s-beautistry-new.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173',
]);

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin') ?? '';
  const headers: Record<string, string> = {
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  };
  if (ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

interface BookingEmail {
  reference?: string;
  service?: string;
  option?: string | null;
  startsAt?: string;
  endsAt?: string;
  totalGhs?: number;
  depositGhs?: number;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function money(value: number | undefined): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '—';
  return `GH₵ ${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

/** Ghana stays on UTC all year, so the stored instant is the studio's wall clock. */
function when(startsAt?: string, endsAt?: string): string {
  if (!startsAt || !endsAt) return '—';
  const date = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Accra',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(startsAt));
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Accra',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${date}, ${time.format(new Date(startsAt))}–${time.format(new Date(endsAt))} (Ghana time)`;
}

function json(request: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), 'Content-Type': 'application/json' },
  });
}

function isValidBooking(booking: BookingEmail): boolean {
  if (!booking || typeof booking !== 'object') return false;
  // Booking references are issued by the database as AB- + 8 hex chars.
  if (!/^AB-[A-Z0-9]{8}$/i.test((booking.reference ?? '').trim())) return false;
  const start = Date.parse(booking.startsAt ?? '');
  const end = Date.parse(booking.endsAt ?? '');
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return false;
  const limits: [string | undefined, number][] = [
    [booking.service, 120],
    [booking.option ?? undefined, 120],
    [booking.customerName, 120],
    [booking.customerPhone, 40],
    [booking.notes, 2000],
  ];
  return limits.every(([value, max]) => value === undefined || value.length <= max);
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders(request) });
  }
  if (request.method !== 'POST') {
    return json(request, { ok: false, error: 'Method not allowed' }, 405);
  }

  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    return json(request, { ok: false, error: 'Email backup is not configured yet (no RESEND_API_KEY).' }, 503);
  }

  let booking: BookingEmail;
  try {
    booking = (await request.json()) as BookingEmail;
  } catch {
    return json(request, { ok: false, error: 'Invalid JSON body' }, 400);
  }

  if (!isValidBooking(booking)) {
    return json(request, { ok: false, error: 'Invalid booking payload' }, 400);
  }

  const serviceLine = booking.option
    ? `${booking.service ?? 'Service'} — ${booking.option}`
    : (booking.service ?? 'Service');

  const rows: [string, string][] = [
    ['When', when(booking.startsAt, booking.endsAt)],
    ['Service', serviceLine],
    ['Total', money(booking.totalGhs)],
    ['30% to secure', money(booking.depositGhs)],
    ['Client', booking.customerName ?? '—'],
    ['WhatsApp', booking.customerPhone ?? '—'],
    ['Notes', booking.notes?.trim() || '—'],
    ['Reference', booking.reference],
  ];

  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
  const html = `
    <div style="font-family:Georgia,serif;color:#170429;line-height:1.6">
      <h1 style="font-size:20px;margin:0 0 12px">New booking — ${escapeHtml(booking.reference)}</h1>
      <p style="margin:0 0 16px;color:#5b4a68">A client booked on the website. This is the backup copy.</p>
      <table style="border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;font-size:14px">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:6px 16px 6px 0;color:#7a6a86">${escapeHtml(label)}</td><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`,
          )
          .join('')}
      </table>
      <p style="margin:20px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#5b4a68">
        If the client has already messaged you on WhatsApp, reply there — they will not be watching this inbox.
      </p>
    </div>`;

  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [STUDIO_EMAIL],
      subject: `New booking ${booking.reference} — ${serviceLine}`,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error('Resend rejected the email', response.status, detail);
    return json(request, { ok: false, error: 'The email provider refused the message' }, 502);
  }

  return json(request, { ok: true });
});
