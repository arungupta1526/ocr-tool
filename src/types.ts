export type OCRStatus = 'idle' | 'processing' | 'success' | 'error' | 'cancelled';

export interface OCRResult {
    text: string;
    confidence: number;
}

export interface OCRFile {
    id: string;
    file: File;
    preview: string; // URL or base64
    status: OCRStatus;
    progress: number;
    result?: OCRResult;
    error?: string;
    pages?: string[]; // For PDFs, array of page images
}
