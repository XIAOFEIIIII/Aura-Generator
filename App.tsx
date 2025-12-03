
import React, { useState } from 'react';
import { ColorPicker } from './components/ColorPicker';
import { Button } from './components/Button';
import { generateAuraImage } from './services/geminiService';
import { ColorStop } from './types';

const App: React.FC = () => {
  const [colors, setColors] = useState<ColorStop[]>([
    { id: '1', value: '#FF9A9E' },
    { id: '2', value: '#FECFEF' },
  ]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleAddColor = () => {
    if (colors.length < 3) {
      const newId = Math.random().toString(36).substr(2, 9);
      // Generate a somewhat harmonious random color or just a default
      const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
      setColors([...colors, { id: newId, value: randomColor }]);
    }
  };

  const handleRemoveColor = (id: string) => {
    if (colors.length > 2) {
      setColors(colors.filter(c => c.id !== id));
    }
  };

  const handleColorChange = (id: string, newValue: string) => {
    setColors(colors.map(c => c.id === id ? { ...c, value: newValue } : c));
  };

  const onGenerate = async () => {
    setStatus('generating');
    setError(null);
    try {
      const colorValues = colors.map(c => c.value);
      const imageUrl = await generateAuraImage(colorValues);
      setGeneratedImage(imageUrl);
      setStatus('success');
    } catch (e: any) {
      setStatus('error');
      setError(e.message || "Failed to generate image");
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'aura-background.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Controls */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-slate-200 p-6 flex flex-col z-10 shadow-xl overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            Aura Generator
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Create ethereal, dreamy backgrounds from your favorite colors.
          </p>
        </header>

        <div className="flex-1 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                Palette ({colors.length}/3)
              </h2>
            </div>
            
            <div className="space-y-3">
              {colors.map((color, index) => (
                <ColorPicker
                  key={color.id}
                  label={`Color ${index + 1}`}
                  color={color.value}
                  onChange={(val) => handleColorChange(color.id, val)}
                  onRemove={() => handleRemoveColor(color.id)}
                  canRemove={colors.length > 2}
                />
              ))}
            </div>

            {colors.length < 3 && (
              <button
                onClick={handleAddColor}
                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-medium hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Add Color
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
           {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2">
               <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               {error}
            </div>
          )}
          <Button 
            onClick={onGenerate} 
            isLoading={status === 'generating'}
            className="w-full"
          >
            {status === 'generating' ? 'Dreaming...' : 'Generate Aura'}
          </Button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 bg-slate-100 relative flex items-center justify-center p-4 md:p-12 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)',
            backgroundSize: '24px 24px'
        }}></div>

        <div className="relative w-full max-w-2xl aspect-square bg-white rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center border border-white/50 ring-1 ring-slate-900/5">
          {generatedImage ? (
            <div className="relative w-full h-full group">
              <img 
                src={generatedImage} 
                alt="Generated Aura" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100">
                 <div className="flex gap-3">
                    <Button variant="secondary" onClick={handleDownload} className="shadow-xl bg-white/90 backdrop-blur-sm hover:bg-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download HD
                    </Button>
                 </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 max-w-md">
              <div className="w-24 h-24 bg-indigo-50 rounded-full mx-auto mb-6 flex items-center justify-center text-indigo-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line></svg>
              </div>
              <h3 className="text-xl font-medium text-slate-800 mb-2">Ready to Dream</h3>
              <p className="text-slate-500">
                Select your colors on the left and click "Generate Aura" to create your unique atmospheric background.
              </p>
            </div>
          )}
          
          {/* Loading Overlay */}
          {status === 'generating' && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-20">
               <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
               </div>
               <p className="mt-6 text-indigo-600 font-medium animate-pulse">Blending colors...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
    