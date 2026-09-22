import React from 'react';
import { COMMON_PROBLEMS, CommonProblemType } from '../types';
import { Stethoscope, Check } from 'lucide-react';

interface CommonProblemSelectorProps {
  selectedProblem: CommonProblemType | '';
  onSelectProblem: (problem: CommonProblemType) => void;
}

export const CommonProblemSelector: React.FC<CommonProblemSelectorProps> = ({
  selectedProblem,
  onSelectProblem,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between gap-3 mb-3">
        <label
          htmlFor="problem-select"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-slate-900"
        >
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
            1
          </span>
          <span>Common Problem Selector</span>
        </label>
        {selectedProblem && (
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            Selected
          </span>
        )}
      </div>

      <div className="relative">
        <select
          id="problem-select"
          value={selectedProblem}
          onChange={(e) => onSelectProblem(e.target.value as CommonProblemType)}
          className="w-full appearance-none bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 border border-slate-300 focus:border-blue-600 rounded-lg px-4 py-3.5 text-base font-medium shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
        >
          <option value="" disabled>
            -- Choose a Common Health Problem / Complaint --
          </option>
          {COMMON_PROBLEMS.map((problem) => (
            <option key={problem} value={problem} className="text-slate-900 py-1">
              {problem}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>

      {/* Quick Select Frequent Complaints */}
      <div className="mt-3.5 pt-3 border-t border-slate-100">
        <p className="text-xs font-medium text-slate-400 mb-2">
          Frequent OHC Complaints:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              'Fever',
              'Headache',
              'Acidity / Heartburn',
              'Stomach Pain',
              'Cold',
              'Cough',
              'Minor Wound / Abrasion',
              'Muscle Pain',
            ] as CommonProblemType[]
          ).map((item) => {
            const isSelected = selectedProblem === item;
            return (
              <button
                key={item}
                type="button"
                id={`quick-select-${item.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
                onClick={() => onSelectProblem(item)}
                className={`text-xs px-2.5 py-1.5 rounded-md font-medium transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 active:bg-slate-300'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
