import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CalendarOff, KeyRound, Loader2, LogOut, Trash2 } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { addDaysISO, todayInGhanaISO } from '../lib/booking';
import { SITE_URL, usePageMeta } from '../lib/usePageTitle';
import AdminBookings from '../components/AdminBookings';
import Eyebrow from '../components/ui/Eyebrow';
import DateField from '../components/ui/DateField';
import TimeField from '../components/ui/TimeField';

interface StudioClosure {
  id: string;
  starts_at: string;
  ends_at: string;
  reason: string;
}

const REASON_PRESETS = ['Busy', 'Closed', 'On a break', 'Off-site booking', 'Personal time'];

function formatClosureWindow(startsAt: string, endsAt: string): string {
  const date = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Accra',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Accra',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const sameDay = date.format(start) === date.format(end);
  return sameDay
    ? `${date.format(start)} · ${time.format(start)} – ${time.format(end)}`
    : `${date.format(start)}, ${time.format(start)} – ${date.format(end)}, ${time.format(end)}`;
}

function friendlyAdminError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error ?? '');
  const lower = message.toLowerCase();
  if (lower.includes('studio_closures') || lower.includes('relation') || lower.includes('schema cache')) {
    return 'The busy-times table is not set up in the database yet. The latest database update (migration) needs to be applied first.';
  }
  if (lower.includes('invalid login credentials')) {
    return 'That email and password did not match. Please try again.';
  }
  if (lower.includes('row-level security') || lower.includes('permission')) {
    return 'This account is signed in but is not allowed to change busy times.';
  }
  return message || 'Something went wrong. Please try again.';
}

/** Ghana is UTC all year, so Ghana wall-clock can be stored as UTC ISO. */
function ghanaISO(date: string, time: string): string {
  return `${date}T${time}:00.000Z`;
}

export default function AdminClosures() {
  usePageMeta({
    title: 'Studio admin',
    description: 'Private studio tools.',
    path: '/admin',
    noindex: true,
  });
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [resetNotice, setResetNotice] = useState('');
  const [resetSending, setResetSending] = useState(false);

  const today = todayInGhanaISO();
  const [startDate, setStartDate] = useState(today);
  const [startTime, setStartTime] = useState('12:00');
  const [endDate, setEndDate] = useState(today);
  const [endTime, setEndTime] = useState('14:00');
  const [reason, setReason] = useState('Busy');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [closures, setClosures] = useState<StudioClosure[]>([]);
  const [listError, setListError] = useState('');
  const [loadingList, setLoadingList] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setSession(data.session);
        setCheckingSession(false);
      })
      .catch(() => {
        if (mounted) setCheckingSession(false);
      });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setCheckingSession(false);
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const loadClosures = useCallback(async () => {
    setLoadingList(true);
    setListError('');
    const { data, error } = await supabase
      .from('studio_closures')
      .select('id, starts_at, ends_at, reason')
      .gte('ends_at', new Date().toISOString())
      .order('starts_at', { ascending: true });
    if (error) {
      setListError(friendlyAdminError(error));
      setClosures([]);
    } else {
      setClosures((data ?? []) as StudioClosure[]);
    }
    setLoadingList(false);
  }, []);

  useEffect(() => {
    if (session) void loadClosures();
  }, [session, loadClosures]);

  async function handleSignIn(event: FormEvent) {
    event.preventDefault();
    setAuthError('');
    setSigningIn(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) setAuthError(friendlyAdminError(error));
    setSigningIn(false);
  }

  async function handleSendReset() {
    setAuthError('');
    setResetNotice('');
    if (!email.trim()) {
      setAuthError('Type your email first, then tap “Email me a new password”.');
      return;
    }
    setResetSending(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${SITE_URL}/set-password`,
    });
    setResetSending(false);
    if (error) {
      setAuthError(friendlyAdminError(error));
      return;
    }
    setResetNotice(
      `If ${email.trim()} has a studio login, a link is on its way. Open it on this device and it will let you choose a new password.`,
    );
  }

  async function handleAddClosure(event: FormEvent) {
    event.preventDefault();
    setFormError('');
    const startsAt = ghanaISO(startDate, startTime);
    const endsAt = ghanaISO(endDate, endTime);
    if (!startDate || !endDate || !startTime || !endTime) {
      setFormError('Choose the date and times for this blocked period.');
      return;
    }
    if (Date.parse(endsAt) <= Date.parse(startsAt)) {
      setFormError('The end must be after the start. Check the dates and times.');
      return;
    }
    if (!reason.trim()) {
      setFormError('Give this period a label, like Busy or Closed.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('studio_closures').insert({
      starts_at: startsAt,
      ends_at: endsAt,
      reason: reason.trim(),
    });
    if (error) {
      setFormError(friendlyAdminError(error));
    } else {
      await loadClosures();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    setListError('');
    const { error } = await supabase.from('studio_closures').delete().eq('id', id);
    if (error) {
      setListError(friendlyAdminError(error));
      return;
    }
    setClosures((current) => current.filter((closure) => closure.id !== id));
  }

  return (
    <main className="bg-ink-950 pb-28 pt-36 sm:pt-44">
      <div className="container-luxe">
        <div className="max-w-3xl">
          <Eyebrow>Studio admin</Eyebrow>
          <h1 className="mt-6 font-display text-4xl font-light text-ivory-50 sm:text-5xl">
            Busy &amp; closed times
          </h1>
          <p className="mt-5 font-sans text-[12.5px] font-light leading-[1.95] text-ivory-300/65">
            Block off any time you will be busy — a break, an off-site job, a day
            closed. Clients booking online will see those hours as{' '}
            <span className="text-gold-200">Busy</span> and will not be able to book
            over them. Open hours stay: Wednesday–Friday 9:00 AM–7:00 PM,
            Saturday–Sunday 10:00 AM–4:00 PM. Mondays and Tuesdays are closed.
          </p>
        </div>

        {checkingSession ? (
          <p className="mt-12 flex items-center gap-3 font-sans text-[12px] font-light text-ivory-400">
            <Loader2 className="h-4 w-4 animate-spin text-gold-200" strokeWidth={1.5} />
            Checking your session…
          </p>
        ) : !session ? (
          <form
            onSubmit={handleSignIn}
            className="mt-12 max-w-md border border-ivory-100/10 bg-ink-900/60 px-6 py-8"
          >
            <p className="font-sans text-[9px] uppercase tracking-[0.28em] text-gold-200">
              Anna&apos;s sign in
            </p>
            <div className="mt-8">
              <label htmlFor="admin-email" className="field-label">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="field mt-3"
                placeholder="annasbeautistry@gmail.com"
              />
            </div>
            <div className="mt-8">
              <label htmlFor="admin-password" className="field-label">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="field mt-3"
                placeholder="••••••••"
              />
            </div>
            {authError ? (
              <p role="alert" className="mt-6 font-sans text-[11.5px] leading-relaxed text-rose-200">
                {authError}
              </p>
            ) : null}
            <button type="submit" disabled={signingIn} className="btn-gold mt-10 disabled:opacity-50">
              {signingIn ? 'Signing in…' : 'Sign in'}
            </button>
            <button
              type="button"
              onClick={() => void handleSendReset()}
              disabled={resetSending}
              className="link-underline mt-6 disabled:opacity-50"
            >
              {resetSending ? 'Sending…' : 'Email me a new password'}
            </button>
            {resetNotice ? (
              <p role="status" className="mt-4 font-sans text-[11px] font-light leading-relaxed text-gold-100">
                {resetNotice}
              </p>
            ) : null}
            <p className="mt-6 font-sans text-[11px] font-light leading-relaxed text-ivory-500">
              This page is only for the studio. Nobody without a login can see or change
              anything here.
            </p>
          </form>
        ) : (
          <>
          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <form
              onSubmit={handleAddClosure}
              className="border border-ivory-100/10 bg-ink-900/60 px-6 py-8"
            >
              <p className="flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.28em] text-gold-200">
                <CalendarOff className="h-4 w-4" strokeWidth={1.4} />
                Block a period
              </p>

              <div className="mt-8 grid grid-cols-2 gap-6">
                <DateField
                  id="closure-start-date"
                  label="From date"
                  value={startDate}
                  min={addDaysISO(today, -1)}
                  onChange={(next) => {
                    setStartDate(next);
                    if (next > endDate) setEndDate(next);
                  }}
                />
                <TimeField id="closure-start-time" label="From time" value={startTime} onChange={setStartTime} />
                <DateField
                  id="closure-end-date"
                  label="To date"
                  value={endDate}
                  min={startDate}
                  onChange={setEndDate}
                />
                <TimeField id="closure-end-time" label="To time" value={endTime} onChange={setEndTime} />
              </div>

              <div className="mt-8">
                <label htmlFor="closure-reason" className="field-label">
                  What should clients see?
                </label>
                <input
                  id="closure-reason"
                  type="text"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  className="field mt-3"
                  placeholder="Busy"
                  maxLength={60}
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  {REASON_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setReason(preset)}
                      className={`border px-3 py-1.5 font-sans text-[9px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                        reason === preset
                          ? 'border-gold-300/70 bg-gold-400/10 text-gold-100'
                          : 'border-ivory-100/15 text-ivory-400 hover:border-gold-300/40 hover:text-gold-200'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {formError ? (
                <p role="alert" className="mt-6 font-sans text-[11.5px] leading-relaxed text-rose-200">
                  {formError}
                </p>
              ) : null}

              <button type="submit" disabled={saving} className="btn-gold mt-10 disabled:opacity-50">
                {saving ? 'Blocking…' : 'Block this time'}
              </button>
              <p className="mt-5 font-sans text-[11px] font-light leading-relaxed text-ivory-500">
                Example: to close all of Saturday, set From Saturday 10:00 AM to To
                Saturday 4:00 PM and label it Closed. For a full day off, use
                9:00 AM to 7:00 PM (or wider — extra cover does no harm).
              </p>
            </form>

            <div className="border border-ivory-100/10 bg-ink-900/60 px-6 py-8">
              <div className="flex items-center justify-between gap-4">
                <p className="font-sans text-[9px] uppercase tracking-[0.28em] text-gold-200">
                  Coming up blocked
                </p>
                <div className="flex items-center gap-5">
                  <Link
                    to="/set-password"
                    title="Choose a new password for this page."
                    className="flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.2em] text-ivory-400 transition-colors hover:text-gold-200"
                  >
                    <KeyRound className="h-3.5 w-3.5" strokeWidth={1.4} />
                    Change password
                  </Link>
                  <button
                    type="button"
                    onClick={() => void supabase.auth.signOut()}
                    className="flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.2em] text-ivory-400 transition-colors hover:text-gold-200"
                  >
                    <LogOut className="h-3.5 w-3.5" strokeWidth={1.4} />
                    Sign out
                  </button>
                </div>
              </div>
              <p className="mt-3 font-sans text-[11px] font-light text-ivory-500">
                Signed in as {session.user.email}
              </p>

              {loadingList ? (
                <p className="mt-8 flex items-center gap-3 font-sans text-[12px] font-light text-ivory-400">
                  <Loader2 className="h-4 w-4 animate-spin text-gold-200" strokeWidth={1.5} />
                  Loading blocked periods…
                </p>
              ) : listError ? (
                <p role="alert" className="mt-8 font-sans text-[11.5px] leading-relaxed text-rose-200">
                  {listError}
                </p>
              ) : closures.length === 0 ? (
                <p className="mt-8 font-sans text-[12px] font-light leading-relaxed text-ivory-400">
                  No blocked periods coming up. The studio is bookable at all open
                  hours.
                </p>
              ) : (
                <ul className="mt-8 space-y-3">
                  {closures.map((closure) => (
                    <li
                      key={closure.id}
                      className="flex items-center justify-between gap-4 border border-ivory-100/10 bg-ink-950/60 px-4 py-3.5"
                    >
                      <div>
                        <p className="font-sans text-[12px] font-medium text-ivory-100">
                          {closure.reason}
                        </p>
                        <p className="mt-1 font-sans text-[11px] font-light text-ivory-400">
                          {formatClosureWindow(closure.starts_at, closure.ends_at)} (Ghana time)
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleDelete(closure.id)}
                        aria-label={`Remove blocked period: ${closure.reason}, ${formatClosureWindow(closure.starts_at, closure.ends_at)}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ivory-100/15 text-ivory-300 transition-colors duration-300 hover:border-rose-300/50 hover:text-rose-200"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.4} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <AdminBookings />
          </>
        )}
      </div>
    </main>
  );
}
