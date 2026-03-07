import * as pdfjsLib from 'pdfjs-dist';

// Vite URL import resolves the correct path for GitHub Pages sub-path deployments
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl as string;

const OCR_SCALE = 3.0; // Increased to 3.0 to give Tesseract more detail for special characters

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

            // Apply Image Preprocessing (Grayscale + High Contrast)
            const processedCanvas = document.createElement('canvas');
            processedCanvas.width = canvas.width;
            processedCanvas.height = canvas.height;
            const pCtx = processedCanvas.getContext('2d');

            if (pCtx) {
                // Remove color noise and boldly emphasize text edges
                pCtx.filter = 'grayscale(100%) contrast(150%)';
                pCtx.drawImage(canvas, 0, 0);
                pageImages.push(processedCanvas.toDataURL('image/png'));
            } else {
                // Fallback if 2d context fails
                pageImages.push(canvas.toDataURL('image/png'));
            }

            // Release canvas memory after capturing the data URL
            canvas.width = 0;
            canvas.height = 0;
        } catch (err) {
            console.warn(`Failed to render page ${i}:`, err);
        }
    }

    return pageImages;
}
