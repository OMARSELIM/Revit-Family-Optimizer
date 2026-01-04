import React from 'react';
import { OptimizationResult } from '../types';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  CubeIcon, 
  TrashIcon, 
  DocumentMagnifyingGlassIcon,
  AdjustmentsHorizontalIcon 
} from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface ResultsDashboardProps {
  results: OptimizationResult;
  onReset: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results, onReset }) => {
  
  // Data for chart
  const complexityData = [
    { name: 'Complexity', value: results.complexityScore },
    { name: 'Optimized', value: 100 - results.complexityScore },
  ];
  
  const COLORS = [results.complexityScore > 70 ? '#d83b01' : '#0078d4', '#2d2d30'];

  return (
    <div className="w-full max-w-6xl mx-auto animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-light text-white">Optimization Report</h2>
        <button 
          onClick={onReset}
          className="text-sm text-gray-400 hover:text-white underline"
        >
          Analyze Another Family
        </button>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Status Card */}
        <div className={`p-6 rounded-lg border-l-4 ${results.isOverModeled ? 'bg-red-900/20 border-revit-warning' : 'bg-green-900/20 border-revit-success'} bg-revit-panel shadow-md`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wider">Status</p>
              <h3 className={`text-2xl font-bold ${results.isOverModeled ? 'text-revit-warning' : 'text-revit-success'}`}>
                {results.isOverModeled ? 'Over-Modeled' : 'Optimized'}
              </h3>
            </div>
            {results.isOverModeled ? (
              <ExclamationTriangleIcon className="h-10 w-10 text-revit-warning opacity-80" />
            ) : (
              <CheckCircleIcon className="h-10 w-10 text-revit-success opacity-80" />
            )}
          </div>
        </div>

        {/* Complexity Card */}
        <div className="p-6 rounded-lg border-l-4 border-revit-accent bg-revit-panel shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wider">Polygon Est.</p>
              <h3 className="text-2xl font-bold text-white">{results.polygonEstimate}</h3>
            </div>
            <CubeIcon className="h-10 w-10 text-revit-accent opacity-80" />
          </div>
        </div>

         {/* Score Card */}
         <div className="p-6 rounded-lg border-l-4 border-purple-500 bg-revit-panel shadow-md flex items-center justify-between">
            <div className="w-full">
               <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Complexity Score</p>
               <div className="h-24 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={complexityData}
                        cx="50%"
                        cy="100%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={30}
                        outerRadius={50}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {complexityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="text-center -mt-8">
                   <span className="text-2xl font-bold text-white">{results.complexityScore}</span>
                   <span className="text-xs text-gray-500">/100</span>
                 </div>
               </div>
            </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Col: Analysis & Suggestions */}
        <div className="space-y-8">
          
          {/* AI Analysis Text */}
          <div className="bg-revit-panel p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-medium text-white mb-4 flex items-center">
              <DocumentMagnifyingGlassIcon className="h-5 w-5 mr-2 text-revit-accent" />
              AI Analysis
            </h3>
            <p className="text-gray-300 leading-relaxed text-sm">
              {results.overallAnalysis}
            </p>
          </div>

          {/* Actionable Suggestions */}
          <div className="bg-revit-panel p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-medium text-white mb-4 flex items-center">
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2 text-revit-accent" />
              Optimization Opportunities
            </h3>
            <div className="space-y-4">
              {results.suggestions.map((suggestion, idx) => (
                <div key={idx} className="bg-[#2d2d30] p-4 rounded border-l-2 border-l-revit-accent">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-gray-200">{suggestion.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded font-mono ${
                      suggestion.impact === 'High' ? 'bg-red-900 text-red-200' :
                      suggestion.impact === 'Medium' ? 'bg-yellow-900 text-yellow-200' :
                      'bg-green-900 text-green-200'
                    }`}>
                      {suggestion.impact} Impact
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{suggestion.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Specific Lists */}
        <div className="space-y-8">
          
          {/* Symbolic Conversion Candidates */}
          <div className="bg-revit-panel p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-medium text-white mb-4">
              Solid to Symbolic <span className="text-gray-500 text-sm font-normal">(Rec. for Plan View)</span>
            </h3>
            <ul className="space-y-2">
              {results.symbolicCandidates.length > 0 ? (
                results.symbolicCandidates.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-300">
                    <span className="text-revit-accent mr-2">•</span>
                    {item}
                  </li>
                ))
              ) : (
                <li className="text-gray-500 italic">No obvious candidates detected.</li>
              )}
            </ul>
          </div>

          {/* Unused Parameters (Inferred) */}
          <div className="bg-revit-panel p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-medium text-white mb-4 flex items-center">
              <TrashIcon className="h-5 w-5 mr-2 text-gray-400" />
              Potential Unused Parameters
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              *Inferred based on category standards and visual inspection. Verify in Revit.
            </p>
            <div className="flex flex-wrap gap-2">
              {results.unusedParams.length > 0 ? (
                results.unusedParams.map((param, idx) => (
                  <span key={idx} className="px-3 py-1 bg-[#1e1e1e] border border-gray-700 rounded-full text-xs text-gray-400">
                    {param}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 italic">No suspicious parameters flagged.</span>
              )}
            </div>
          </div>

          {/* LOD Recommendations */}
          <div className="bg-revit-panel p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-medium text-white mb-4">LOD Strategy</h3>
            <div className="text-sm text-gray-300 whitespace-pre-line">
              {results.lodRecommendations}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
