import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
    value?: number;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(({ className, value, ...props }, ref) => (
    <div
        ref={ref}
        role="progressbar"
        aria-valuenow={value ?? 0}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)}
        {...props}
    >
        <div
            className="h-full w-full flex-1 bg-primary transition-all"
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
    </div>
));
Progress.displayName = 'Progress';

export { Progress };
