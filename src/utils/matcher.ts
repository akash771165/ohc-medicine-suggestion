import { CommonProblemType, MedicineItem } from '../types';

export function matchMedicinesForProblem(
  problem: CommonProblemType,
  medicines: MedicineItem[]
): MedicineItem[] {
  if (!problem || problem === 'Other') {
    return [];
  }

  const problemKeywords: Record<CommonProblemType, string[]> = {
    Fever: ['fever', 'temperature', 'pyrexia', 'antipyretic'],
    Headache: ['headache', 'tension headache', 'head ache', 'migraine'],
    'Acidity / Heartburn': ['acidity', 'heartburn', 'acid reflux', 'gerd', 'sour stomach', 'gastric reflux'],
    'Stomach Pain': ['stomach pain', 'abdominal colic', 'spasmodic abdominal', 'stomach cramp', 'intestinal cramp', 'abdominal cramp'],
    'Gas / Bloating': ['gas', 'bloating', 'flatulence', 'belching', 'antiflatulent'],
    Indigestion: ['indigestion', 'digestive enzyme', 'heavy feeling after food', 'slow gastric', 'dyspepsia'],
    Nausea: ['nausea', 'feeling sick'],
    Vomiting: ['vomiting', 'vomit', 'emesis'],
    Diarrhea: ['diarrhea', 'diarrhoea', 'loose stool', 'loose motion'],
    Constipation: ['constipation', 'laxative', 'hard stool', 'bowel evacuation'],
    Cold: ['cold', 'running nose', 'runny nose', 'sneezing', 'head cold'],
    'Nasal Congestion': ['nasal congestion', 'blocked nose', 'sinus blockage', 'decongestant', 'blocked sinus'],
    Cough: ['cough', 'antitussive', 'expectorant', 'chest congestion'],
    'Sore Throat': ['sore throat', 'throat irritation', 'pharyngitis', 'throat inflammation', 'gargle', 'throat pain', 'swallowing'],
    'Eye Irritation / Dry Eyes': ['eye irritation', 'dry eye', 'dry eyes', 'screen fatigue', 'eye burning', 'ocular'],
    'Ear Problem': ['ear pain', 'earache', 'ear drop', 'ear problem', 'ear fullness', 'otitis'],
    Toothache: ['toothache', 'dental pain', 'tooth cavity', 'dental'],
    'Muscle Pain': ['muscle pain', 'muscular pain', 'body ache', 'muscle strain', 'myalgia', 'skeletal ache', 'body soreness'],
    'Joint Pain': ['joint pain', 'joint stiffness', 'arthritis', 'joint inflammation'],
    'Back Pain': ['back pain', 'back spasm', 'back stiffness', 'lumbago', 'lumbar'],
    'Minor Injury': ['minor injury', 'superficial cut', 'scrape', 'cut', 'scratch', 'wound disinfection', 'minor burn', 'burn'],
    'Minor Wound / Abrasion': ['minor wound', 'abrasion', 'scrapes', 'scratch', 'graze', 'cut'],
    'Sprain / Swelling': ['sprain', 'swelling', 'blunt trauma'],
    'Skin Irritation': ['skin irritation', 'prickly heat', 'dermatitis', 'rash', 'eczema flare', 'sunburn'],
    Itching: ['itching', 'itch', 'pruritus', 'urticaria', 'hives', 'insect bite'],
    'Menstrual Pain': ['menstrual pain', 'dysmenorrhea', 'menstrual cramp', 'period pain'],
    'Weakness / Dehydration': ['weakness', 'fatigue', 'dehydration', 'exhaustion', 'nutritional recovery', 'energy powder', 'multivitamin'],
    'Chest Pain / Suspected Cardiac Emergency': ['chest pain', 'angina', 'cardiac', 'cardiovascular', 'heart emergency', 'blood thinner'],
    'High Blood Pressure': ['high blood pressure', 'hypertension', 'blood pressure', 'antihypertensive'],
    Other: [],
  };

  const keywords = problemKeywords[problem] || [];
  if (keywords.length === 0) {
    return [];
  }

  // Filter medicines whose "commonUse" contains any matching keyword
  const matched = medicines.filter((med) => {
    const textToSearch = (med.commonUse + ' ' + med.name + ' ' + med.composition).toLowerCase();
    
    // Check direct matching with keyword
    return keywords.some((kw) => {
      // Word boundary check or substring check
      return textToSearch.includes(kw.toLowerCase());
    });
  });

  return matched;
}
