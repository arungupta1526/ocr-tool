/**
 * Smart OCR Tool
 * Copyright (c) 2026 Arun Gupta
 * Licensed under the MIT License.
 * See LICENSE file in the project root for details.
 */

import { useState, useRef } from 'react';
import { FileUpload } from './components/FileUpload';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Progress } from './components/ui/progress';
import { Tabs, TabsTrigger } from './components/ui/tabs';
import type { OCRFile } from './types';
import { convertPdfToImages } from './lib/pdf-utils';
import { recognizeText } from './lib/ocr';
import { FileText, Trash2, CheckCircle, Loader2, X, Moon, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { CopyButton } from './components/CopyButton';
import { TextDownloadButton } from './components/TextDownloadButton';
import { Footer } from './components/Footer';
import { useDarkMode } from './hooks/useDarkMode';
import { LanguageSelector } from './components/LanguageSelector';
import { LayoutSelector } from './components/LayoutSelector';
// import { LANGUAGES } from './lib/languages';

type TabValue = 'upload' | 'process' | 'results';

function App() {
  const [activeTab, setActiveTab] = useState<TabValue>('upload');
  const [files, setFiles] = useState<OCRFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLang, setSelectedLang] = useState('eng');
  const [selectedColumns, setSelectedColumns] = useState(1);
  const abortControllers = useRef<Map<string, AbortController>>(new Map());
  const { isDark, toggle: toggleDark } = useDarkMode();

  const handleFilesSelected = (selectedFiles: File[]) => {
    const newFiles: OCRFile[] = selectedFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: file.type === 'application/pdf' ? '' : URL.createObjectURL(file),
      status: 'idle',
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newFiles]);
    setActiveTab('process');
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== id);
      if (updated.length === 0) setActiveTab('upload');
      return updated;
    });
  };

  const cancelFile = (id: string) => {
    const controller = abortControllers.current.get(id);
    controller?.abort();
  };

  const processFiles = async () => {
    setIsProcessing(true);

    const processedFiles = await Promise.all(files.map(async (ocrFile) => {
      if (ocrFile.status === 'success') return ocrFile;

      // Create a fresh AbortController for this file
      const controller = new AbortController();
      abortControllers.current.set(ocrFile.id, controller);
      const { signal } = controller;

      try {
        setFiles(prev => prev.map(f => f.id === ocrFile.id ? { ...f, status: 'processing', progress: 0 } : f));

        let imagesToProcess: string[] = [];

        if (ocrFile.file.type === 'application/pdf') {
          setFiles(prev => prev.map(f => f.id === ocrFile.id ? { ...f, status: 'processing', progress: 10 } : f));
          const images = await convertPdfToImages(ocrFile.file);
          if (signal.aborted) throw new DOMException('Cancelled', 'AbortError');
          imagesToProcess = images;
          setFiles(prev => prev.map(f => f.id === ocrFile.id ? { ...f, pages: images, preview: images[0] } : f));
        } else {
          imagesToProcess = [ocrFile.preview];
        }

        let fullText = '';
        let avgConfidence = 0;
        const totalImages = imagesToProcess.length;

        for (let i = 0; i < totalImages; i++) {
          if (signal.aborted) throw new DOMException('Cancelled', 'AbortError');

          const result = await recognizeText(imagesToProcess[i], selectedLang, selectedColumns, (progress) => {
            const currentImageBaseProgress = (i / totalImages) * 100;
            const imageProgress = (progress / 100) * (1 / totalImages) * 100;
            const totalProgress = currentImageBaseProgress + imageProgress;
            setFiles(prev =>
              prev.map(f =>
                f.id === ocrFile.id ? { ...f, progress: Math.round(totalProgress) } : f
              )
            );
          });

          fullText += result.text + '\n\n';
          avgConfidence += result.confidence;
        }

        avgConfidence = avgConfidence / totalImages;

        abortControllers.current.delete(ocrFile.id);
        return {
          ...ocrFile,
          status: 'success' as const,
          progress: 100,
          result: {
            text: fullText,
            // confidence: 100,
            confidence: avgConfidence,
            lang: selectedLang,
            columns: selectedColumns
          },
          pages: imagesToProcess
        };

      } catch (error) {
        abortControllers.current.delete(ocrFile.id);
        if (error instanceof DOMException && error.name === 'AbortError') {
          return { ...ocrFile, status: 'cancelled' as const, progress: 0 };
        }
        console.error(error);
        return { ...ocrFile, status: 'error' as const, error: 'Failed to process file' };
      }
    }));

    setFiles(processedFiles);
    setIsProcessing(false);
    // Only switch to results if at least one succeeded
    if (processedFiles.some(f => f.status === 'success')) setActiveTab('results');
  };



  return (
    <div className="min-h-screen bg-background text-foreground p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-2 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDark}
            className="absolute right-0 top-0"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Smart OCR
          </h1>
          <p className="text-muted-foreground text-lg">
            Extract text from Images and PDFs instantly.
          </p>
        </div>

        {/* Main Content */}
        <Card className="min-h-[600px] shadow-lg border-muted/40">
          <div className="p-2 border-b">
            <div className="flex justify-center">
              <Tabs className="w-full max-w-md grid grid-cols-3">
                <TabsTrigger
                  isActive={activeTab === 'upload'}
                  onClick={() => setActiveTab('upload')}
                  disabled={isProcessing}
                >
                  Upload
                </TabsTrigger>
                <TabsTrigger
                  isActive={activeTab === 'process'}
                  onClick={() => setActiveTab('process')}
                  disabled={files.length === 0 || isProcessing}
                >
                  Process ({files.length})
                </TabsTrigger>
                <TabsTrigger
                  isActive={activeTab === 'results'}
                  onClick={() => setActiveTab('results')}
                  disabled={!files.some(f => f.status === 'success') || isProcessing}
                >
                  Results
                </TabsTrigger>
              </Tabs>
            </div>
          </div>

          <CardContent className="p-6 h-[550px] overflow-y-hidden relative">
            <AnimatePresence mode="wait">
              {activeTab === 'upload' && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col items-center justify-center"
                >
                  <FileUpload onFileSelect={handleFilesSelected} className="w-full h-full max-h-[400px]" />
                </motion.div>
              )}

              {activeTab === 'process' && (
                <motion.div
                  key="process"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 h-full overflow-y-auto pr-4"
                >
                  <div className="flex flex-wrap justify-between items-center gap-3">
                    <h2 className="text-2xl font-semibold">Processing Queue</h2>
                    <div className="flex items-center gap-3 flex-wrap justify-end">
                      <LayoutSelector
                        value={selectedColumns}
                        onChange={setSelectedColumns}
                        disabled={isProcessing}
                      />
                      <LanguageSelector
                        value={selectedLang}
                        onChange={setSelectedLang}
                        disabled={isProcessing}
                      />
                      <Button onClick={processFiles} disabled={isProcessing} size="lg">
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                          </>
                        ) : (
                          'Start OCR'
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {files.map(file => (
                      <div key={file.id} className="flex items-center gap-4 p-4 border rounded-lg bg-card hover:bg-accent/10 transition-colors">
                        <div className="h-16 w-16 bg-muted rounded overflow-hidden flex items-center justify-center shrink-0">
                          {file.preview ? (
                            <img src={file.preview} alt="preview" className="h-full w-full object-cover" />
                          ) : (
                            <FileText className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between">
                            <p className="font-medium truncate max-w-[300px]">{file.file.name}</p>
                            <span className="text-xs text-muted-foreground uppercase">{file.file.type.split('/')[1] || 'FILE'}</span>
                          </div>
                          <Progress value={file.progress} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              {file.status === 'idle' && 'Ready to process'}
                              {file.status === 'processing' && 'Processing...'}
                              {file.status === 'success' && 'Completed'}
                              {file.status === 'cancelled' && <span className="text-orange-500">Cancelled</span>}
                              {file.status === 'error' && <span className="text-destructive">Error</span>}
                            </span>
                            <span>{Math.round(file.progress)}%</span>
                          </div>
                        </div>
                        {/* Cancel button when processing, delete otherwise */}
                        {file.status === 'processing' ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => cancelFile(file.id)}
                            title="Cancel processing"
                            className="text-orange-500 hover:text-orange-700 hover:bg-orange-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" onClick={() => removeFile(file.id)} disabled={isProcessing}>
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'results' && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-6 h-full"
                >
                  {/* File List / Preview Side */}
                  <div className="space-y-4 overflow-y-auto pr-2">
                    <h3 className="font-semibold text-lg sticky top-0 bg-background pb-2 z-10">Processed Files</h3>
                    {files.filter(f => f.status === 'success').map(file => (
                      <div key={file.id} className="border p-4 rounded-lg space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-10 w-10 bg-muted rounded flex items-center justify-center overflow-hidden">
                            {file.preview ? <img src={file.preview} alt={file.file.name} className="h-full w-full object-cover" /> : <FileText className="h-5 w-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.file.name}</p>
                            <p className="text-xs text-muted-foreground">{file.result?.columns} columns | {file.result?.lang}</p>
                          </div>
                          <CopyButton text={file.result?.text || ''} />
                          <TextDownloadButton text={file.result?.text || ''} filename={file.file.name} />
                        </div>
                        <textarea
                          className="w-full h-48 p-3 text-sm border rounded-md font-mono bg-muted/30 focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                          readOnly
                          value={file.result?.text ?? ''}
                          onChange={() => { }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Stats or dedicated view could go here, for now just expanding the list */}
                  <div className="hidden md:flex flex-col items-center justify-center text-center text-muted-foreground space-y-4 border-l pl-6">
                    <CheckCircle className="h-16 w-16 text-green-500/50" />
                    <h3 className="text-xl font-semibold text-foreground">All Done!</h3>
                    <p>You have processed {files.filter(f => f.status === 'success').length} files successfully.</p>
                    <Button variant="outline" onClick={() => { setFiles([]); setActiveTab('upload'); }}>Start Over</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

export default App;
