import { useState, useEffect, useMemo } from 'react';
import { CommonProblemType, MedicineItem } from './types';
import { DEFAULT_OHC_MEDICINES } from './data/defaultMedicines';
import { parseExcelBuffer } from './utils/excelParser';
import { matchMedicinesForProblem } from './utils/matcher';
import { CommonProblemSelector } from './components/CommonProblemSelector';
import { MedicineSuggestionList } from './components/MedicineSuggestionList';
import { ExcelSourceBar } from './components/ExcelSourceBar';
import { Shield, PlusSquare } from 'lucide-react';

export default function App() {
  const [medicines, setMedicines] = useState<MedicineItem[]>(DEFAULT_OHC_MEDICINES);
  const [sourceName, setSourceName] = useState<string>('Detailed Medicine Guide (Excel)');
  const [isCustomLoaded, setIsCustomLoaded] = useState<boolean>(false);
  const [selectedProblem, setSelectedProblem] = useState<CommonProblemType | ''>('');

  // Attempt to read the actual Excel file from /detailed_medicine_guide.xlsx on mount
  useEffect(() => {
    let isMounted = true;
    fetch('/detailed_medicine_guide.xlsx')
      .then((res) => {
        if (!res.ok) throw new Error('Could not fetch file');
        return res.arrayBuffer();
      })
      .then((buffer) => {
        if (!isMounted) return;
        const result = parseExcelBuffer(buffer);
        if (result.medicines && result.medicines.length > 0) {
          setMedicines(result.medicines);
          setSourceName(`Detailed Medicine Guide [${result.sheetName}]`);
        }
      })
      .catch((err) => {
        console.warn('Using built-in Detailed Medicine Guide dataset fallback:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCustomMedicinesLoaded = (newMeds: MedicineItem[], source: string) => {
    setMedicines(newMeds);
    setSourceName(source);
    setIsCustomLoaded(true);
  };

  const handleResetDefault = () => {
    setMedicines(DEFAULT_OHC_MEDICINES);
    setSourceName('Detailed Medicine Guide (Excel)');
    setIsCustomLoaded(false);
  };

  const suggestedMedicines = useMemo(() => {
    if (!selectedProblem) return [];
    return matchMedicinesForProblem(selectedProblem, medicines);
  }, [selectedProblem, medicines]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col justify-between antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation / App Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-2xs">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <PlusSquare className="w-5 h-5 fill-red-50 stroke-red-600 stroke-2" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                OHC Medicine Suggestion
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Occupational Health Centre First-Aid Reference
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/80">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>OHC Stock Database</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl w-full mx-auto px-4 py-6 flex-1 space-y-4">
        {/* Authoritative Excel Source Information Bar */}
        <ExcelSourceBar
          sourceName={sourceName}
          medicineCount={medicines.length}
          onMedicinesLoaded={handleCustomMedicinesLoaded}
          onResetDefault={handleResetDefault}
          isCustomLoaded={isCustomLoaded}
        />

        {/* 1. Common Problem Selector */}
        <CommonProblemSelector
          selectedProblem={selectedProblem}
          onSelectProblem={setSelectedProblem}
        />

        {/* 2. Medicine Suggestion */}
        <MedicineSuggestionList
          selectedProblem={selectedProblem}
          suggestedMedicines={suggestedMedicines}
        />
      </main>

      {/* Clinical Disclaimer & Protocol Notice */}
      <footer className="bg-white border-t border-slate-200 mt-6 py-4">
        <div className="max-w-3xl mx-auto px-4 text-center text-xs text-slate-500 space-y-1">
          <p className="font-medium text-slate-600">
            OHC Support Tool Only — Not a diagnostic system.
          </p>
          <p className="text-[11px] text-slate-400">
            Medicine suggestions are derived strictly from the authoritative Detailed Medicine Guide Excel database. Does not contain dosage, duration, or treatment plans. Dispensing requires compliance with company medical directives and clinician supervision.
          </p>
        </div>
      </footer>
    </div>
  );
}
