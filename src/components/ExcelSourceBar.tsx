import React, { useRef } from 'react';
import { FileSpreadsheet, Upload, Download, RefreshCw, CheckCircle2 } from 'lucide-react';
import { parseExcelBuffer } from '../utils/excelParser';
import { MedicineItem } from '../types';

interface ExcelSourceBarProps {
  sourceName: string;
  medicineCount: number;
  onMedicinesLoaded: (medicines: MedicineItem[], sourceName: string) => void;
  onResetDefault: () => void;
  isCustomLoaded: boolean;
}

export const ExcelSourceBar: React.FC<ExcelSourceBarProps> = ({
  sourceName,
  medicineCount,
  onMedicinesLoaded,
  onResetDefault,
  isCustomLoaded,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const buffer = evt.target?.result as ArrayBuffer;
      if (buffer) {
        const { medicines, sheetName, error } = parseExcelBuffer(buffer);
        if (error || medicines.length === 0) {
          alert(error || 'No medicines found in the Excel sheet.');
        } else {
          onMedicinesLoaded(medicines, `${file.name} [Sheet: ${sheetName}]`);
        }
      }
    };
    reader.readAsArrayBuffer(file);
    // Reset file input value so same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 px-4 py-2.5 rounded-lg bg-slate-100/90 border border-slate-200 text-xs text-slate-600">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="flex items-center gap-1.5 font-medium text-slate-800">
          <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Excel Database:</span>
        </span>
        <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-mono text-[11px]">
          {sourceName}
        </span>
        <span className="text-slate-400">•</span>
        <span className="text-slate-600 font-medium">
          {medicineCount} medicines
        </span>
        {isCustomLoaded && (
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Custom File Active
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".xlsx, .xls, .csv"
          className="hidden"
          id="excel-file-input"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-300 font-medium shadow-2xs transition-colors cursor-pointer"
          title="Upload an Excel file containing Detailed Medicine Guide sheet"
        >
          <Upload className="w-3.5 h-3.5 text-slate-500" />
          <span>Load .xlsx</span>
        </button>

        <a
          href="/detailed_medicine_guide.xlsx"
          download="Detailed_Medicine_Guide.xlsx"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-300 font-medium shadow-2xs transition-colors"
          title="Download the authoritative Detailed Medicine Guide Excel spreadsheet"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Download Excel</span>
        </a>

        {isCustomLoaded && (
          <button
            type="button"
            onClick={onResetDefault}
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-slate-500 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            title="Reset to default Detailed Medicine Guide"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
