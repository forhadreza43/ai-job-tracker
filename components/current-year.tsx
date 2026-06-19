'use client';

export function CurrentYear() {
  return (
    <span className="text-xs text-muted-foreground">
      © {new Date().getFullYear()}
    </span>
  );
}
