# 📄 Smart OCR Tool

A modern, fast, and powerful web-based OCR (Optical Character Recognition) tool that allows you to extract text from images and PDF documents instantly. Built with a focus on ease of use, speed, and a premium user experience.

![GitHub last commit](https://img.shields.io/github/last-commit/arungupta1526/ocr-tool?style=for-the-badge)
![GitHub repo size](https://img.shields.io/github/repo-size/arungupta1526/ocr-tool?style=for-the-badge)
![License](https://img.shields.io/github/license/arungupta1526/ocr-tool?style=for-the-badge)

## ✨ Features

- **🖼️ Image OCR**: Extract text from PNG, JPG, JPEG, and WebP images.
- **📄 PDF Support**: Full support for multi-page PDF documents. Each page is processed individually.
- **🚀 Real-time Progress**: Track the OCR progress for each file with visual progress bars.
- **📋 Instant Copy**: Copy extracted text to your clipboard with a single click (includes "Copied!" feedback).
- **✨ Modern UI**: A clean, responsive interface with smooth animations and dark mode support.
- **🛠️ Privacy First**: All processing happens locally in your browser using WebAssembly. Your files are never uploaded to a server.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **OCR Engine**: [Tesseract.js](https://tesseract.projectnaptha.com/)
- **PDF Handling**: [PDF.js](https://mozilla.github.io/pdf.js/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/arungupta1526/ocr-tool.git
   cd ocr-tool
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 📖 How to Use

1. **Upload**: Drag and drop your images or PDF files into the upload area, or click to browse.
2. **Process**: Once your files are in the queue, click the **"Start OCR"** button.
3. **Review**: Switch to the **"Results"** tab to view the extracted text side-by-side with the file name.
4. **Copy**: Click the **"Copy"** button on any result card to quickly copy the text for use elsewhere.

## 🤝 Contributing

Contributions are welcome! If you have ideas for improvements or new features, feel free to open an issue or submit a pull request.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Made with ❤️ by [Arun Gupta](https://github.com/arungupta1526)
