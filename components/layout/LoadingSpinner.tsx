import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div 
      className={cn(
        "animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full",
        className
      )}
    />
  );
}