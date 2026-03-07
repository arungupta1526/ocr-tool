import { LANGUAGES } from '../lib/languages';


interface LanguageSelectorProps {
    value: string;
    onChange: (lang: string) => void;
    disabled?: boolean;
}

export function LanguageSelector({ value, onChange, disabled }: LanguageSelectorProps) {
    return (
        <div className="flex items-center gap-2">
            <label htmlFor="lang-select" className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                OCR Language:
            </label>
            <select
                id="lang-select"
                value={value}
                onChange={e => onChange(e.target.value)}
                disabled={disabled}
                className="text-sm border rounded-md px-2 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>
                        {lang.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
