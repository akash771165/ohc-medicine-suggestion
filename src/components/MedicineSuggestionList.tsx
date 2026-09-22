import React from 'react';
import { CommonProblemType, MedicineItem } from '../types';
import { AlertCircle, AlertTriangle, MapPin, Pill, ShieldAlert } from 'lucide-react';

interface MedicineSuggestionListProps {
  selectedProblem: CommonProblemType | '';
  suggestedMedicines: MedicineItem[];
}

export const MedicineSuggestionList: React.FC<MedicineSuggestionListProps> = ({
  selectedProblem,
  suggestedMedicines,
}) => {
  if (!selectedProblem) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <Pill className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-700 mb-1">
          No Problem Selected
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Please select a common problem from the dropdown above to view matching medicines available in OHC stock.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
            2
          </span>
          <h2 className="text-sm font-semibold tracking-tight text-slate-900">
            Medicine Suggestion
          </h2>
          <span className="text-xs text-slate-500 font-normal">
            for <strong className="text-slate-800 font-semibold">{selectedProblem}</strong>
          </span>
        </div>
        {suggestedMedicines.length > 0 && (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {suggestedMedicines.length} {suggestedMedicines.length === 1 ? 'item' : 'items'} in stock
          </span>
        )}
      </div>

      {suggestedMedicines.length === 0 ? (
        <div
          id="no-stock-notice"
          className="rounded-lg border border-amber-200 bg-amber-50/70 p-6 text-center"
        >
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center mb-3">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-amber-900 mb-1">
            No suitable medicine available in OHC stock.
          </h4>
          <p className="text-xs text-amber-800/90 max-w-md mx-auto">
            The OHC inventory does not contain an authoritative pre-approved first-aid medicine for "{selectedProblem}". Please refer the individual to the attending Medical Officer / Clinician for direct clinical assessment.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {suggestedMedicines.map((med, idx) => (
            <div
              key={med.id || idx}
              id={`medicine-card-${idx + 1}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 transition-all hover:bg-slate-50 hover:border-slate-300 shadow-2xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2.5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-blue-600">
                      <Pill className="w-4 h-4" />
                    </span>
                    {med.name}
                  </h3>
                  {med.shelfLocation && (
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-indigo-700 font-medium bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-200/60 w-fit">
                      <MapPin className="w-3 h-3 text-indigo-500" />
                      <span>{med.shelfLocation}</span>
                    </div>
                  )}
                </div>

                {/* Prescription / Clinician Direction Notice */}
                {med.requiresClinicianDirection ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-300 w-fit shrink-0">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                    Requires Clinician Direction
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-emerald-100/70 text-emerald-800 border border-emerald-200 w-fit shrink-0">
                    OTC / OHC First-Aid
                  </span>
                )}
              </div>

              {/* Composition / Type */}
              <div className="mb-2 text-xs text-slate-600 flex items-baseline gap-2">
                <span className="font-semibold text-slate-700 shrink-0">
                  Composition / Type:
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-[11px] text-slate-800">
                  {med.composition}
                </span>
              </div>

              {/* Common Use */}
              <div className="text-xs text-slate-600 flex items-start gap-2">
                <span className="font-semibold text-slate-700 shrink-0 mt-0.5">
                  Common Use:
                </span>
                <span className="text-slate-700 leading-relaxed">
                  {med.commonUse}
                </span>
              </div>

              {/* Specific clinician instruction note if present in raw string */}
              {med.rawPrescriptionInfo && med.requiresClinicianDirection && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/80 text-[11px] text-amber-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{med.rawPrescriptionInfo}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
