import { Github, Mail } from 'lucide-react';

export function Footer() {
    return (
        <footer className="mt-8 pb-6 text-center text-sm text-muted-foreground space-y-2">
            <div className="flex items-center justify-center gap-4">
                <a
                    href="https://github.com/arungupta1526"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                    <Github className="h-4 w-4" />
                    <span>arungupta1526</span>
                </a>
                <span className="text-border">|</span>
                <a
                    href="mailto:arungupta1526@gmail.com"
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                    <Mail className="h-4 w-4" />
                    <span>Contact</span>
                </a>
            </div>
            <p>
                Made with ❤️ by <span className="font-medium text-foreground">Arun Gupta</span>
            </p>
        </footer>
    );
}
