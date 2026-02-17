import { Button } from './ui/button';
import { FileText } from 'lucide-react';
import { saveAs } from 'file-saver';

interface TextDownloadButtonProps {
    text: string;
    filename: string;
}

export function TextDownloadButton({ text, filename }: TextDownloadButtonProps) {
    const handleDownload = () => {
        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        const saveName = filename.replace(/\.[^/.]+$/, "") + ".txt";
        saveAs(blob, saveName);
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
