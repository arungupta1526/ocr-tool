export function preprocessCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
        const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;

        const threshold = gray > 140 ? 255 : 0;

        data[i] = threshold;
        data[i + 1] = threshold;
        data[i + 2] = threshold;
    }

    ctx.putImageData(imgData, 0, 0);

    return canvas;
}