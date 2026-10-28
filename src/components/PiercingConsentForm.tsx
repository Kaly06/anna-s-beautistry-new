import { ShieldAlert } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import {
  PIERCING_MIN_AGE,
  type PiercingConsent,
  type YesNo,
} from '../lib/piercingConsent';

const PLACEMENTS = ['Earlobe', 'Helix', 'Tragus', 'Nostril', 'Lip / Medusa', 'Tongue', 'Navel'] as const;

interface PiercingConsentFormProps {
  value: PiercingConsent;
  onChange: (next: PiercingConsent) => void;
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="border-y border-gold-300/20 bg-gold-400/10 px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-200">
      {children}
    </h3>
  );
}

interface YesNoGroupProps {
  id: string;
  legend: string;
  value: YesNo;
  onChange: (value: YesNo) => void;
}

function YesNoGroup({ id, legend, value, onChange }: YesNoGroupProps) {
  return (
    <fieldset>
      <legend className="field-label">
        {legend} <span className="text-gold-200">*</span>
      </legend>
      <div className="mt-3 flex flex-wrap gap-6">
        {(['yes', 'no'] as const).map((choice) => (
          <label
            key={choice}
            htmlFor={`${id}-${choice}`}
            className="inline-flex cursor-pointer items-center gap-2.5 font-sans text-[12px] font-light tracking-wide text-ivory-200"
          >
            <input
              id={`${id}-${choice}`}
              name={id}
              type="radio"
              required
              checked={value === choice}
              onChange={() => onChange(choice)}
              className="h-4 w-4 shrink-0 accent-[#d4af37]"
            />
            {choice === 'yes' ? 'Yes' : 'No'}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

interface ConsentCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}

function ConsentCheckbox({ id, checked, onChange, children }: ConsentCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 font-sans text-[12px] font-light leading-relaxed tracking-wide text-ivory-200"
    >
      <input
        id={id}
        type="checkbox"
        required
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#d4af37]"
      />
      <span>
        {children} <span className="text-gold-200">*</span>
      </span>
    </label>
  );
}

export default function PiercingConsentForm({ value, onChange }: PiercingConsentFormProps) {
  const [ageTouched, setAgeTouched] = useState(false);

  const update = <Key extends keyof PiercingConsent>(key: Key, next: PiercingConsent[Key]) => {
    onChange({ ...value, [key]: next });
  };

  const numericAge = value.age === '' ? null : Number(value.age);
  const ageEntered = numericAge !== null && Number.isFinite(numericAge);
  // Wait for a two-digit age (or blur) so typing “24” does not flash the block on “2”.
  const ageLooksComplete = ageTouched || value.age.trim().length >= 2;
  const ageBlocked = ageEntered && ageLooksComplete && numericAge < PIERCING_MIN_AGE;
  const adultDeclarationBlocked = value.isAdult === 'no';

  return (
    <section
      aria-labelledby="piercing-consent-title"
      className="mt-12 border border-gold-300/25 bg-ink-950/55 px-5 py-7 sm:px-6"
    >
      <div className="flex items-start gap-3">
        <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-300/40 text-gold-200">
          <ShieldAlert className="h-4 w-4" strokeWidth={1.5} />
        </span>
        <div>
          <p className="font-sans text-[9px] uppercase tracking-[0.28em] text-gold-300/80">
            Required for piercings
          </p>
          <h2
            id="piercing-consent-title"
            className="mt-2 font-display text-3xl font-light leading-tight text-ivory-50"
          >
            Piercing Consent &amp; Liability Form
          </h2>
          <p className="mt-3 font-sans text-[11.5px] font-light leading-[1.85] text-ivory-300/70">
            Piercing bookings are for clients aged 19 or older. Please complete this health check
            and consent form before we can confirm a piercing appointment. Your answers are used
            only to assess suitability, plan safe placement and provide aftercare.
          </p>
        </div>
      </div>

      <div className="mt-9 space-y-10">
        <div className="space-y-7">
          <SectionHeading>1. Client &amp; Placement Information</SectionHeading>

          <div>
            <label htmlFor="piercing-age" className="field-label">
              Age (19+ only) <span className="text-gold-200">*</span>
            </label>
            <input
              id="piercing-age"
              type="number"
              inputMode="numeric"
              min={PIERCING_MIN_AGE}
              max={120}
              step={1}
              required
              value={value.age}
              aria-invalid={ageBlocked || undefined}
              aria-describedby={ageBlocked ? 'piercing-age-error' : 'piercing-age-help'}
              onBlur={() => setAgeTouched(true)}
              onChange={(event) => {
                const nextAge = event.currentTarget.value;
                const parsedAge = nextAge === '' ? null : Number(nextAge);
                event.currentTarget.setCustomValidity(
                  parsedAge !== null && Number.isFinite(parsedAge) && parsedAge < PIERCING_MIN_AGE
                    ? 'You must be 19 or older to book a piercing. This booking cannot continue.'
                    : '',
                );
                update('age', nextAge);
              }}
              placeholder="e.g. 24"
              className="field mt-3"
            />
            <p
              id="piercing-age-help"
              className="mt-2 font-sans text-[10px] font-light leading-relaxed text-ivory-500"
            >
              You must be at least 19 years old to book a piercing.
            </p>
            {ageBlocked ? (
              <p
                id="piercing-age-error"
                role="alert"
                className="mt-3 border border-red-300/40 bg-red-400/10 px-4 py-3 font-sans text-[11px] font-light leading-relaxed text-red-100"
              >
                You must be 19 or older to book a piercing. This booking cannot continue.
              </p>
            ) : null}
          </div>

          {!ageBlocked ? (
            <>
          <fieldset>
            <legend className="field-label">
              What piercing do you want? <span className="text-gold-200">*</span>
            </legend>
            <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3">
              {PLACEMENTS.map((placement) => {
                const id = `piercing-placement-${placement.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                return (
                  <label
                    key={placement}
                    htmlFor={id}
                    className="inline-flex cursor-pointer items-center gap-2.5 font-sans text-[12px] font-light tracking-wide text-ivory-200"
                  >
                    <input
                      id={id}
                      name="piercing-placement"
                      type="radio"
                      required
                      checked={value.placement === placement}
                      onChange={() => update('placement', placement)}
                      className="h-4 w-4 shrink-0 accent-[#d4af37]"
                    />
                    {placement}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <YesNoGroup
            id="piercing-had-before"
            legend="Have you had this piercing before?"
            value={value.hadBefore}
            onChange={(next) => update('hadBefore', next)}
          />
            </>
          ) : null}
        </div>

        {!ageBlocked ? (
          <>
        <div className="space-y-7">
          <SectionHeading>Section 2: Health Check</SectionHeading>

          <YesNoGroup
            id="piercing-allergies"
            legend="Do you have any allergies?"
            value={value.allergies}
            onChange={(next) => update('allergies', next)}
          />

          <div>
            <label htmlFor="piercing-medical-conditions" className="field-label">
              Do you have any medical condition we should know about?
              {value.allergies === 'yes' ? <span className="text-gold-200"> *</span> : null}
            </label>
            <input
              id="piercing-medical-conditions"
              type="text"
              required={value.allergies === 'yes'}
              value={value.medicalConditions}
              onChange={(event) => update('medicalConditions', event.target.value)}
              placeholder="Type 'None' or describe any allergies or conditions..."
              className="field mt-3"
            />
            {value.allergies === 'yes' ? (
              <p className="mt-2 font-sans text-[10px] font-light leading-relaxed text-gold-200/80">
                Please describe the allergy above so we can assess suitable jewellery and products.
              </p>
            ) : null}
          </div>

          <YesNoGroup
            id="piercing-keloids"
            legend="Do you have a history of keloids (thick scars)?"
            value={value.keloids}
            onChange={(next) => update('keloids', next)}
          />
        </div>

        <div className="space-y-6">
          <SectionHeading>Section 3: Consent &amp; Liability</SectionHeading>

          <div className="border border-ivory-100/10 bg-ink-900/70 px-4 py-4">
            <p className="font-sans text-[11px] font-light leading-[1.9] text-ivory-300/75">
              I voluntarily request a piercing at Anna&apos;s Beautistry. I understand that
              piercing carries inherent risks, including pain, bleeding, swelling, infection,
              scarring, allergic reaction, migration or rejection, and that healing and results
              vary by person and placement. I confirm that the health information I have provided
              is true and complete. To the extent permitted by law, I release Anna&apos;s
              Beautistry from liability for outcomes arising from undisclosed health conditions,
              unsuitable anatomy that could not reasonably be identified beforehand, or failure to
              follow the aftercare instructions provided.
            </p>
          </div>

          <div className="space-y-4">
            <ConsentCheckbox
              id="piercing-understands-risks"
              checked={value.understandsRisks}
              onChange={(checked) => update('understandsRisks', checked)}
            >
              I understand piercing risks (infection, swelling, scarring, rejection)
            </ConsentCheckbox>
            <ConsentCheckbox
              id="piercing-aftercare"
              checked={value.willFollowAftercare}
              onChange={(checked) => update('willFollowAftercare', checked)}
            >
              I will follow aftercare instructions given
            </ConsentCheckbox>
            <ConsentCheckbox
              id="piercing-healing"
              checked={value.understandsHealing}
              onChange={(checked) => update('understandsHealing', checked)}
            >
              I understand healing takes weeks to months
            </ConsentCheckbox>
            <ConsentCheckbox
              id="piercing-procedure-consent"
              checked={value.consentsToProcedure}
              onChange={(checked) => update('consentsToProcedure', checked)}
            >
              I consent to the piercing procedure
            </ConsentCheckbox>
            <ConsentCheckbox
              id="piercing-liability-waiver"
              checked={value.agreesToLiabilityWaiver}
              onChange={(checked) => update('agreesToLiabilityWaiver', checked)}
            >
              I have read and agree to the consent and liability acknowledgement above
            </ConsentCheckbox>
          </div>
        </div>

        <div className="space-y-7">
          <SectionHeading>Section 4: Age &amp; Agreement</SectionHeading>

          <YesNoGroup
            id="piercing-is-adult"
            legend="Are you 19 years or older?"
            value={value.isAdult}
            onChange={(next) => update('isAdult', next)}
          />

          {adultDeclarationBlocked ? (
            <p
              role="alert"
              className="border border-red-300/40 bg-red-400/10 px-4 py-3 font-sans text-[11px] font-light leading-relaxed text-red-100"
            >
              You must be 19 or older to book a piercing. This booking cannot continue.
            </p>
          ) : null}

          <div className="border border-ivory-100/10 bg-ink-900/70 px-4 py-4">
            <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.24em] text-gold-200">
              Jewelry Agreement
            </p>
            <p className="mt-3 font-sans text-[11px] font-light leading-[1.85] text-ivory-300/75">
              I understand that jewelry used is sterile and suitable for initial piercing, titanium
              is recommended for healing, and I will not change jewelry too early. I will return
              for downsizing if required at a cost.
            </p>
            <div className="mt-4">
              <ConsentCheckbox
                id="piercing-jewelry-agreement"
                checked={value.jewelryAgreement}
                onChange={(checked) => update('jewelryAgreement', checked)}
              >
                I agree
              </ConsentCheckbox>
            </div>
          </div>

          <YesNoGroup
            id="piercing-photo-consent"
            legend="May we take photos for portfolio/social media?"
            value={value.photoConsent}
            onChange={(next) => update('photoConsent', next)}
          />
        </div>

        <div className="space-y-7">
          <SectionHeading>Final Section</SectionHeading>

          <div>
            <label htmlFor="piercing-signature" className="field-label">
              Full Name (Signature) <span className="text-gold-200">*</span>
            </label>
            <input
              id="piercing-signature"
              type="text"
              autoComplete="name"
              required
              value={value.signature}
              onChange={(event) => update('signature', event.target.value)}
              placeholder="Type your full name..."
              className="field mt-3"
            />
            <p className="mt-2 font-sans text-[10px] font-light leading-relaxed text-ivory-500">
              Typing your full name acts as your electronic signature for this booking request.
            </p>
          </div>

          <div>
            <label htmlFor="piercing-consent-date" className="field-label">
              Date <span className="text-gold-200">*</span>
            </label>
            <input
              id="piercing-consent-date"
              type="date"
              required
              value={value.consentDate}
              onChange={(event) => update('consentDate', event.target.value)}
              className="field mt-3"
            />
          </div>
        </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
