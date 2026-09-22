export interface MedicineItem {
  id: string;
  name: string;
  composition: string;
  commonUse: string;
  shelfLocation?: string;
  requiresClinicianDirection: boolean;
  rawPrescriptionInfo?: string;
}

export const COMMON_PROBLEMS = [
  'Fever',
  'Headache',
  'Acidity / Heartburn',
  'Stomach Pain',
  'Gas / Bloating',
  'Indigestion',
  'Nausea',
  'Vomiting',
  'Diarrhea',
  'Constipation',
  'Cold',
  'Nasal Congestion',
  'Cough',
  'Sore Throat',
  'Eye Irritation / Dry Eyes',
  'Ear Problem',
  'Toothache',
  'Muscle Pain',
  'Joint Pain',
  'Back Pain',
  'Minor Injury',
  'Minor Wound / Abrasion',
  'Sprain / Swelling',
  'Skin Irritation',
  'Itching',
  'Menstrual Pain',
  'Weakness / Dehydration',
  'Chest Pain / Suspected Cardiac Emergency',
  'High Blood Pressure',
  'Other',
] as const;

export type CommonProblemType = (typeof COMMON_PROBLEMS)[number];
