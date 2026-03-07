interface LayoutSelectorProps {
    value: number;
    onChange: (columns: number) => void;
    disabled?: boolean;
}

export function LayoutSelector({ value, onChange, disabled }: LayoutSelectorProps) {
    return (
        <div className="flex items-center gap-2">
            <label htmlFor="layout-select" className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                Layout:
            </label>
            <select
                id="layout-select"
                value={value}
                onChange={e => onChange(Number(e.target.value))}
                disabled={disabled}
                className="text-sm border rounded-md px-2 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <option value={1}>1 Column</option>
                <option value={2}>2 Columns</option>
                <option value={3}>3 Columns</option>
            </select>
        </div>
    );
}
