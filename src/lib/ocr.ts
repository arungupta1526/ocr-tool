import Tesseract from 'tesseract.js';

export async function recognizeText(
    imagePath: string,
    onProgress?: (progress: number) => void
): Promise<{ text: string; confidence: number }> {

    const result = await Tesseract.recognize(
        imagePath,
        'eng',
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
