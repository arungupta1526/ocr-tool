/**
 * Smart OCR Tool
 * Copyright (c) 2026 Arun Gupta
 * Licensed under the MIT License.
 * See LICENSE file in the project root for details.
 */

import * as pdfjsLib from 'pdfjs-dist';
import { preprocessCanvas } from "./preprocess";

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
                pCtx.drawImage(canvas, 0, 0);
                const cleaned = preprocessCanvas(processedCanvas);
                pageImages.push(cleaned.toDataURL("image/png"));
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
