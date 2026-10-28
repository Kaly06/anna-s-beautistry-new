/**
 * Piercing consent data + rules, shared by the consent form component and
 * the booking engine. Kept out of the component file so the form module
 * only exports its component (react-refresh hygiene).
 */

export type YesNo = '' | 'yes' | 'no';

/** Minimum age for a piercing booking, enforced in the form and database. */
export const PIERCING_MIN_AGE = 19;

export interface PiercingConsent {
  age: string;
  placement: string;
  hadBefore: YesNo;
  allergies: YesNo;
  medicalConditions: string;
  keloids: YesNo;
  understandsRisks: boolean;
  willFollowAftercare: boolean;
  understandsHealing: boolean;
  consentsToProcedure: boolean;
  agreesToLiabilityWaiver: boolean;
  isAdult: YesNo;
  jewelryAgreement: boolean;
  photoConsent: YesNo;
  signature: string;
  consentDate: string;
}

function todayISO(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export function createEmptyPiercingConsent(): PiercingConsent {
  return {
    age: '',
    placement: '',
    hadBefore: '',
    allergies: '',
    medicalConditions: '',
    keloids: '',
    understandsRisks: false,
    willFollowAftercare: false,
    understandsHealing: false,
    consentsToProcedure: false,
    agreesToLiabilityWaiver: false,
    isAdult: '',
    jewelryAgreement: false,
    photoConsent: '',
    signature: '',
    consentDate: todayISO(),
  };
}

/** Piercing bookings are 19+ only; under-19 requests cannot be submitted. */
export function isPiercingAgeBlocked(value: PiercingConsent): boolean {
  const age = value.age === '' ? null : Number(value.age);
  return (
    value.isAdult === 'no' ||
    (age !== null && Number.isFinite(age) && age < PIERCING_MIN_AGE)
  );
}

export function inferPiercingPlacement(treatment: string | null): string {
  if (!treatment) return '';
  const text = treatment.toLowerCase();

  if (text.includes('earlobe') || text.includes('lobe')) return 'Earlobe';
  if (text.includes('helix') && text.includes('tragus')) return '';
  if (text.includes('helix')) return 'Helix';
  if (text.includes('tragus')) return 'Tragus';
  if (text.includes('nostril')) return 'Nostril';
  if (text.includes('medusa') || text.includes('lip')) return 'Lip / Medusa';
  if (text.includes('tongue')) return 'Tongue';
  if (text.includes('navel')) return 'Navel';
  return '';
}
