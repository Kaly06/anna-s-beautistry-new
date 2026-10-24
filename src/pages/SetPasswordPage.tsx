import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, KeyRound, Loader2 } from 'lucide-react';
import Eyebrow from '../components/ui/Eyebrow';
import { usePageMeta } from '../lib/usePageTitle';
import { supabase } from '../lib/supabase';

type Phase = 'checking' | 'ready' | 'saved' | 'broken';

/**
 * Where the "Reset your password" email lands.
 *
 * Supabase puts a short-lived token in the URL; the supabase client turns it
 * into a real session on load. If that worked, this page simply asks for a new
 * password. If it didn't — expired, already used, or opened on a different
 * browser — it says so plainly instead of failing silently.
 */
export default function SetPasswordPage() {
  usePageMeta({
    title: 'Choose your password',
    description: 'Set the password for the studio admin page.',
    path: '/set-password',
    noindex: true,
  });

  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('checking');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('error_code=') || hash.includes('error=')) {
      setPhase('broken');
      return;
    }

    let settled = false;
    const markReady = () => {
      if (!settled) {
        settled = true;
        setPhase('ready');
      }
    };

    // The client processes the token in the URL as it loads, which can land
    // slightly after mount — so listen for it as well as asking once.
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) markReady();
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) markReady();
    });

    const timer = window.setTimeout(() => {
      if (!settled) {
        settled = true;
        setPhase('broken');
      }
    }, 2500);

    return () => {
      listener.subscription.unsubscribe();
      window.clearTimeout(timer);
    };
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Use at least 8 characters — this password protects your clients’ details.');
      return;
    }
    if (password !== confirm) {
      setError('The two passwords do not match.');
      return;
    }
    setSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (updateError) {
      setError(
        updateError.message.toLowerCase().includes('expired')
          ? 'That link has expired. Request a new one from the admin page.'
          : updateError.message,
      );
      return;
    }
    setPhase('saved');
    window.setTimeout(() => navigate('/admin'), 1400);
  }

  return (
    <main className="bg-ink-950 pb-28 pt-36 sm:pt-44">
      <div className="container-luxe max-w-xl">
        <Eyebrow>Studio admin</Eyebrow>
        <h1 className="mt-6 font-display text-4xl font-light text-ivory-50 sm:text-5xl">
          Choose your password
        </h1>

        {phase === 'checking' ? (
          <p className="mt-8 flex items-center gap-3 font-sans text-[12px] font-light text-ivory-400">
            <Loader2 className="h-4 w-4 animate-spin text-gold-200" strokeWidth={1.5} />
            Checking your link…
          </p>
        ) : phase === 'broken' ? (
          <div className="mt-8 border border-rose-300/25 bg-rose-400/[0.06] px-6 py-6">
            <p className="font-sans text-[12.5px] font-light leading-relaxed text-rose-100">
              This link has expired, or it has already been used. Links only work once, and
              only for an hour.
            </p>
            <Link to="/admin" className="link-underline mt-5 inline-flex">
              Request a new link
              <ArrowRight className="h-3 w-3" strokeWidth={1.4} />
            </Link>
          </div>
        ) : phase === 'saved' ? (
          <div className="mt-8 border border-emerald-300/30 bg-emerald-400/[0.07] px-6 py-6">
            <p className="font-sans text-[12.5px] font-light leading-relaxed text-emerald-100">
              Password saved. Taking you to the studio page…
            </p>
            <Link to="/admin" className="link-underline mt-5 inline-flex">
              Go now
              <ArrowRight className="h-3 w-3" strokeWidth={1.4} />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 border border-ivory-100/10 bg-ink-900/60 px-6 py-8">
            <p className="flex items-center gap-2 font-sans text-[11px] font-light text-ivory-300/75">
              <KeyRound className="h-4 w-4 text-gold-200" strokeWidth={1.4} />
              Use something you will remember, and that nobody else knows.
            </p>

            <div className="mt-7">
              <label htmlFor="new-password" className="field-label">
                New password
              </label>
              <input
                id="new-password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="field mt-3"
                placeholder="At least 8 characters"
              />
            </div>

            <div className="mt-5">
              <label htmlFor="confirm-password" className="field-label">
                Type it again
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                className="field mt-3"
                placeholder="Same password"
              />
            </div>

            {error ? (
              <p role="alert" className="mt-5 font-sans text-[11.5px] leading-relaxed text-rose-200">
                {error}
              </p>
            ) : null}

            <button type="submit" disabled={saving} className="btn-gold mt-8 disabled:opacity-50">
              {saving ? 'Saving…' : 'Save password'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
