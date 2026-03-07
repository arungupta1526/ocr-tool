/**
 * Smart OCR Tool
 * Copyright (c) 2026 Arun Gupta
 * Licensed under the MIT License.
 * See LICENSE file in the project root for details.
 */

import Tesseract from 'tesseract.js';

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function sliceImage(img: HTMLImageElement, columns: number, colIndex: number): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2d context');

    const sliceWidth = img.width / columns;
    canvas.width = sliceWidth;
    canvas.height = img.height;

    ctx.drawImage(
        img,
        sliceWidth * colIndex, 0, sliceWidth, img.height, // Source coordinates
        0, 0, sliceWidth, img.height                      // Destination coordinates
    );

    return canvas.toDataURL('image/png');
}

export async function recognizeText(
    imagePath: string,
    lang: string,
    columns: number = 1,
    onProgress?: (progress: number) => void
): Promise<{ text: string; confidence: number }> {

    // If only 1 column, just do a normal pass
    if (columns <= 1) {
        const result = await Tesseract.recognize(
            imagePath,
            lang,
            {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        onProgress?.(m.progress * 100);
                    }
                }
            }
        );
        return {
            text: result.data.text,
            confidence: result.data.confidence,
        };
    }

    // Multiple columns: split and process sequentially
    const img = await loadImage(imagePath);
    let fullText = '';
    let totalConfidence = 0;

    for (let i = 0; i < columns; i++) {
        const sliceDataUrl = sliceImage(img, columns, i);

        // Calculate progress distribution for this column slice
        const sliceBaseProgress = (i / columns) * 100;

        const result = await Tesseract.recognize(
            sliceDataUrl,
            lang,
            {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        // Map internal 0-100 to the overall 0-100 across all columns
                        const overallProgress = sliceBaseProgress + (m.progress * (100 / columns));
                        onProgress?.(overallProgress);
                    }
                }
            }
        );

        // Add a few newlines between columns to separate them visually
        fullText += (i > 0 ? '\n\n' : '') + result.data.text;
        totalConfidence += result.data.confidence;
    }

    return {
        text: fullText,
        confidence: totalConfidence / columns,
    };
}
