import { Button } from './ui/button';
import { FileText } from 'lucide-react';

interface TextDownloadButtonProps {
    text: string;
    filename: string;
}

export function TextDownloadButton({ text, filename }: TextDownloadButtonProps) {
    const handleDownload = () => {
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename.replace(/\.[^/.]+$/, '') + '.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            disabled={!text}
        >
            <FileText className="h-3 w-3 mr-2" /> Text
        </Button>
    );
}
