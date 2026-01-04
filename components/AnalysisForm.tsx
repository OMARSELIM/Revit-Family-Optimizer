import React, { useState, useRef } from 'react';
import { AnalysisInput, FamilyCategory } from '../types';
import { ArrowUpTrayIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface AnalysisFormProps {
  onAnalyze: (data: AnalysisInput) => void;
  isAnalyzing: boolean;
}

const AnalysisForm: React.FC<AnalysisFormProps> = ({ onAnalyze, isAnalyzing }) => {
  const [category, setCategory] = useState<FamilyCategory>(FamilyCategory.Furniture);
  const [fileSize, setFileSize] = useState<string>('0.5');
  const [context, setContext] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({
      category,
      fileSizeMB: parseFloat(fileSize),
      image: imagePreview,
      additionalContext: context
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-revit-panel p-8 rounded-lg shadow-xl border border-gray-700">
      <h2 className="text-2xl font-light mb-6 text-white border-b border-gray-600 pb-2">
        New Analysis
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Family Category</label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value as FamilyCategory)}
            className="w-full bg-revit-dark border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-revit-accent transition-colors"
          >
            {Object.values(FamilyCategory).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* File Size */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Estimated File Size (MB)</label>
          <input 
            type="number" 
            step="0.1"
            value={fileSize}
            onChange={(e) => setFileSize(e.target.value)}
            className="w-full bg-revit-dark border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-revit-accent transition-colors"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Upload 3D View Screenshot
            <span className="text-gray-500 ml-2 text-xs">(Crucial for AI Analysis)</span>
          </label>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all
              ${imagePreview ? 'border-revit-success bg-opacity-10 bg-green-900' : 'border-gray-600 hover:border-revit-accent hover:bg-gray-800'}
            `}
          >
            {imagePreview ? (
              <div className="relative w-full h-48">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-20 transition-all">
                  <span className="text-white text-sm bg-black px-2 py-1 rounded">Click to change</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Click to upload screenshot (PNG/JPG)</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Additional Context */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Additional Context / Parameters (Optional)</label>
          <textarea 
            rows={3}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="E.g., Contains 50 visibility parameters, nested families, high detail screws..."
            className="w-full bg-revit-dark border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-revit-accent transition-colors"
          />
        </div>

        <button 
          type="submit" 
          disabled={isAnalyzing || !imagePreview}
          className={`
            w-full flex items-center justify-center py-3 px-4 rounded font-semibold text-white transition-all
            ${isAnalyzing || !imagePreview ? 'bg-gray-600 cursor-not-allowed' : 'bg-revit-accent hover:bg-blue-600 shadow-lg shadow-blue-900/20'}
          `}
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Geometry...
            </>
          ) : (
            <>
              <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
              Analyze Family
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AnalysisForm;
