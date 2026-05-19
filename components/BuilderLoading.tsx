'use client';

interface BuilderLoadingProps {
  title?: string;
  message?: string;
}

/**
 * BuilderLoading - Reusable loading screen for builder initialization
 * Used for migrations, data loading, and other blocking operations
 */
export default function BuilderLoading({
  title = 'Opening QAY Studio',
  message = 'Preparing your workspace...'
}: BuilderLoadingProps) {
  return (
    <div className="absolute inset-0 z-[200] flex items-center justify-center bg-background text-foreground">
      <div className="absolute inset-x-0 top-0 h-px bg-border" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-border" />

      <div className="mx-4 flex w-full max-w-[420px] flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-foreground text-background shadow-sm">
          <img
            src="/ycode-webclip.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            QAY
          </p>
          <h1 className="text-xl font-semibold tracking-normal">
            {title}
          </h1>
          <p className="min-h-5 text-sm text-muted-foreground">
            {message}
          </p>
        </div>

        <div className="mt-8 w-full overflow-hidden rounded-full border border-border bg-muted p-1">
          <div className="h-2 w-1/2 animate-[qay-loader_1.4s_ease-in-out_infinite] rounded-full bg-foreground" />
        </div>

        <div className="mt-5 grid w-full grid-cols-3 gap-2 text-[11px] font-medium text-muted-foreground">
          <div className="rounded-md border border-border px-2 py-2">
            Workspace
          </div>
          <div className="rounded-md border border-border px-2 py-2">
            Pages
          </div>
          <div className="rounded-md border border-border px-2 py-2">
            Studio
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes qay-loader {
          0% {
            transform: translateX(-105%);
          }
          50% {
            transform: translateX(55%);
          }
          100% {
            transform: translateX(205%);
          }
        }
      `}</style>
    </div>
  );
}
