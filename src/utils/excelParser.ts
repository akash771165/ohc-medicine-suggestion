import * as XLSX from 'xlsx';
import { MedicineItem } from '../types';

export function parseExcelBuffer(buffer: ArrayBuffer): {
  medicines: MedicineItem[];
  sheetName: string;
  error?: string;
} {
  try {
    const workbook = XLSX.read(buffer, { type: 'array' });
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return { medicines: [], sheetName: '', error: 'Excel file contains no sheets.' };
    }

    // Look for "Detailed Medicine Guide" sheet (case-insensitive)
    let targetSheetName = workbook.SheetNames.find(
      (name) => name.trim().toLowerCase() === 'detailed medicine guide'
    );

    // If not found by exact phrase, look for one containing "detailed" or "medicine"
    if (!targetSheetName) {
      targetSheetName = workbook.SheetNames.find((name) =>
        name.toLowerCase().includes('medicine') || name.toLowerCase().includes('guide')
      );
    }

    // Fall back to first sheet if still not found
    if (!targetSheetName) {
      targetSheetName = workbook.SheetNames[0];
    }

    const worksheet = workbook.Sheets[targetSheetName];
    if (!worksheet) {
      return { medicines: [], sheetName: targetSheetName, error: `Sheet "${targetSheetName}" not found.` };
    }

    const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });

    const medicines: MedicineItem[] = [];

    rawRows.forEach((row, index) => {
      // Find field values with flexible key lookup
      const keys = Object.keys(row);

      const findValue = (possibleNames: string[]): string => {
        for (const name of possibleNames) {
          const matchedKey = keys.find((k) => k.trim().toLowerCase() === name.toLowerCase());
          if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== null) {
            return String(row[matchedKey]).trim();
          }
        }
        // Partial fallback
        for (const name of possibleNames) {
          const matchedKey = keys.find((k) => k.trim().toLowerCase().includes(name.toLowerCase()));
          if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== null) {
            return String(row[matchedKey]).trim();
          }
        }
        return '';
      };

      const name = findValue(['Medicine Name', 'Drug Name', 'Medicine', 'Item Name', 'Name']);
      const composition = findValue(['Composition / Type', 'Composition', 'Type', 'Formulation', 'Dosage Form']);
      const commonUse = findValue([
        'Common Use / When Given',
        'Common Use',
        'When Given',
        'Indications',
        'Indication',
        'Use',
        'Uses',
      ]);
      const rawPrescription = findValue([
        'Prescription / Clinician Direction',
        'Clinician Direction',
        'Prescription Status',
        'Prescription',
        'Direction',
        'Doctor Direction',
        'Status',
        'Remark',
      ]);
      const shelfLocation = findValue([
        'Shelf Location',
        'Location',
        'Shelf',
        'Cabinet',
        'Cupboard',
        'Storage Location',
      ]);

      if (!name && !commonUse) {
        return; // Skip empty rows
      }

      const prescriptionLower = (rawPrescription + ' ' + commonUse).toLowerCase();
      const requiresClinicianDirection =
        prescriptionLower.includes('clinician') ||
        prescriptionLower.includes('doctor') ||
        prescriptionLower.includes('prescription') ||
        prescriptionLower.includes('medical officer') ||
        prescriptionLower.includes('rx');

      medicines.push({
        id: `excel-row-${index + 1}`,
        name: name || `Medicine #${index + 1}`,
        composition: composition || 'OHC Formulation',
        commonUse: commonUse || 'As directed by OHC protocol',
        shelfLocation: shelfLocation || undefined,
        requiresClinicianDirection,
        rawPrescriptionInfo: rawPrescription || (requiresClinicianDirection ? 'Requires Clinician Direction' : 'OTC / OHC First-Aid'),
      });
    });

    return {
      medicines,
      sheetName: targetSheetName,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to parse Excel file.';
    return { medicines: [], sheetName: '', error: message };
  }
}
