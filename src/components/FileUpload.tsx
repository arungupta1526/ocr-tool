import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image } from 'lucide-react';
import { cn } from '../lib/utils'; // Corrected import path

interface FileUploadProps {
    onFileSelect: (files: File[]) => void;
    className?: string;
}

export function FileUpload({ onFileSelect, className }: FileUploadProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles?.length > 0) {
            onFileSelect(acceptedFiles);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
            'application/pdf': ['.pdf'],
        },
        multiple: true,
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                'border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors hover:bg-muted/50',
                isDragActive ? 'border-primary bg-muted' : 'border-muted-foreground/25',
                className
            )}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-muted rounded-full">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Drop files here or click to upload</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Support for Images (PNG, JPG) and PDF documents
                    </p>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Image className="w-4 h-4" /> Images</span>
                    <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> PDFs</span>
                </div>
            </div>
        </div>
    );
}
