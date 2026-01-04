import React, { useState } from 'react';
import AnalysisForm from './components/AnalysisForm';
import ResultsDashboard from './components/ResultsDashboard';
import { analyzeFamily } from './services/geminiService';
import { AnalysisInput, OptimizationResult } from './types';

const App: React.FC = () => {
  const [results, setResults] = useState<OptimizationResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (input: AnalysisInput) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeFamily(input);
      setResults(data);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-revit-dark flex flex-col">
      {/* Header */}
      <header className="bg-revit-panel border-b border-gray-700 p-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-revit-accent rounded flex items-center justify-center">
              <span className="font-bold text-white">R</span>
            </div>
            <h1 className="text-xl font-semibold text-white tracking-tight">Revit Family Optimizer <span className="text-xs font-normal text-revit-accent ml-2 border border-revit-accent px-1 rounded">AI BETA</span></h1>
          </div>
          <div className="text-sm text-gray-500">
            v1.0.0
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {error && (
             <div className="bg-red-900/30 border border-red-500 text-red-200 p-4 rounded mb-6 flex items-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               {error}
             </div>
          )}

          {!results ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
               <div className="text-center mb-10 max-w-2xl">
                 <h2 className="text-4xl font-light text-white mb-4">Optimize Your Content</h2>
                 <p className="text-gray-400 text-lg">
                   Upload a screenshot of your Revit Family. Our AI identifies over-modeling, unused parameters, and geometry that should be symbolic.
                 </p>
               </div>
               <AnalysisForm onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            </div>
          ) : (
            <ResultsDashboard results={results} onReset={handleReset} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-revit-panel border-t border-gray-700 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Revit Family Optimizer. Not affiliated with Autodesk.</p>
          <p className="mt-1">AI analysis may vary. Always verify changes in Revit.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
