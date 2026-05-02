export function QayLogo() {
  return (
    <div className="flex items-center gap-3 text-white">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="15" stroke="white" strokeWidth="1.5" />
        <path
          d="M10 10L16 16M16 16L22 22M16 16L22 10M16 16L10 22"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-sans text-lg font-semibold tracking-normal">QAY</span>
    </div>
  );
}
