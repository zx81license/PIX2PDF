
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Dropzone } from './components/Dropzone';
import { ImageCard } from './components/ImageCard';
import { Controls } from './components/Controls';
import { generatePDF } from './services/pdfService';
import { ImageData, PDFSettings } from './types';
import { FileText, Download, Trash2, Plus, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggestingName, setIsSuggestingName] = useState(false);
  const [pdfName, setPdfName] = useState('My_Document');
  const [settings, setSettings] = useState<PDFSettings>({
    pageSize: 'a4',
    orientation: 'portrait',
    margin: 'none',
    imageScale: 'fit',
    quality: 0.9,
  });

  const handleFilesAdded = useCallback((newFiles: File[]) => {
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImages((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substr(2, 9),
              file,
              previewUrl: e.target?.result as string,
              width: img.width,
              height: img.height,
              name: file.name,
            },
          ]);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const suggestName = async () => {
    if (images.length === 0) return;
    setIsSuggestingName(true);
    try {
      const firstImg = images[0];
      const base64Data = firstImg.previewUrl.split(',')[1];
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { text: "Look at this image. Suggest a short, professional, valid filename (without extension) for a PDF containing this and similar images. Use underscores for spaces. Just return the filename string, nothing else." },
            { inlineData: { mimeType: firstImg.file.type, data: base64Data } }
          ]
        }
      });
      
      const suggested = response.text?.trim().replace(/[^a-zA-Z0-9_]/g, '') || 'My_Document';
      setPdfName(suggested);
    } catch (error) {
      console.error("AI Naming failed", error);
    } finally {
      setIsSuggestingName(false);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const clearAll = () => {
    setImages([]);
    setPdfName('My_Document');
  };

  const moveImage = (id: string, direction: 'left' | 'right') => {
    const index = images.findIndex((img) => img.id === id);
    if (index < 0) return;
    
    const newImages = [...images];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newImages.length) {
      [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
      setImages(newImages);
    }
  };

  const handleDownload = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);
    try {
      await generatePDF(images, settings, pdfName);
    } catch (error) {
      console.error('PDF Generation failed', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="text-blue-600" size={24} />
                  Selected Images ({images.length})
                </h2>
                {images.length > 0 && (
                  <button 
                    onClick={clearAll}
                    className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1 transition-colors"
                  >
                    <Trash2 size={16} />
                    Clear All
                  </button>
                )}
              </div>

              {images.length === 0 ? (
                <Dropzone onFilesAdded={handleFilesAdded} />
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {images.map((img, idx) => (
                      <ImageCard 
                        key={img.id}
                        data={img}
                        index={idx}
                        total={images.length}
                        onRemove={() => removeImage(img.id)}
                        onMove={(dir) => moveImage(img.id, dir)}
                      />
                    ))}
                    <div className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-8 hover:border-blue-400 hover:bg-blue-50 transition-all group cursor-pointer relative overflow-hidden h-64">
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.files) handleFilesAdded(Array.from(e.target.files));
                        }}
                      />
                      <Plus className="text-slate-400 group-hover:text-blue-500 mb-2" size={32} />
                      <span className="text-slate-500 group-hover:text-blue-600 font-medium">Add More</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6">PDF Settings</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Filename</label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <input 
                      type="text"
                      value={pdfName}
                      onChange={(e) => setPdfName(e.target.value)}
                      placeholder="Enter filename..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">.pdf</span>
                  </div>
                  <button
                    onClick={suggestName}
                    disabled={images.length === 0 || isSuggestingName}
                    title="AI Suggested Name"
                    className="p-2.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSuggestingName ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  </button>
                </div>
              </div>

              <Controls 
                settings={settings} 
                setSettings={setSettings} 
                isDisabled={images.length === 0} 
              />

              <button
                onClick={handleDownload}
                disabled={images.length === 0 || isGenerating}
                className={`w-full mt-8 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                  images.length === 0 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                    : isGenerating
                      ? 'bg-blue-400 text-white animate-pulse cursor-wait'
                      : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isGenerating ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Download size={20} />
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-slate-200 bg-white">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Pix2PDF Pro. Fast, Private & Free Image to PDF conversion.
        </div>
      </footer>
    </div>
  );
};

export default App;
