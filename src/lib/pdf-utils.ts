import * as pdfjsLib from 'pdfjs-dist';

// Vite URL import resolves the correct path for GitHub Pages sub-path deployments
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl as string;

const OCR_SCALE = 2.0; // Higher scale = better OCR quality at the cost of memory

export async function convertPdfToImages(file: File): Promise<string[]> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pageImages: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        try {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: OCR_SCALE });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            if (!context) {
                throw new Error('Canvas 2D context not available');
            }

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvas, canvasContext: context, viewport }).promise;

            pageImages.push(canvas.toDataURL('image/png'));

            // Release canvas memory after capturing the data URL
            canvas.width = 0;
            canvas.height = 0;
        } catch (err) {
            console.warn(`Failed to render page ${i}:`, err);
        }
    }

    return pageImages;
}
