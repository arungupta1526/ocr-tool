import { useState } from 'react';
import { Button } from './ui/button';
import { Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface CopyButtonProps {
    text: string;
    className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className={cn("transition-all duration-200", isCopied && "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800", className)}
        >
            {isCopied ? (
                <>
                    <Check className="h-3 w-3 mr-2" /> Copied
                </>
            ) : (
                <>
                    <Copy className="h-3 w-3 mr-2" /> Copy
                </>
            )}
        </Button>
    );
}
