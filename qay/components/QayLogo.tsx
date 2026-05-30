type QayLogoProps = {
  className?: string;
  imageClassName?: string;
  theme?: 'auto' | 'light' | 'dark';
};

export function QayLogo({ className = '', imageClassName = 'h-10 w-auto', theme = 'auto' }: QayLogoProps) {
  if (theme === 'light') {
    return (
      <span className={`inline-flex items-center ${className}`}>
        <img
          src="/qaylight.svg" alt="QAY"
          className={imageClassName}
        />
      </span>
    );
  }

  if (theme === 'dark') {
    return (
      <span className={`inline-flex items-center ${className}`}>
        <img
          src="/qayDark.svg" alt="QAY"
          className={imageClassName}
        />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center ${className}`}>
      <img
        src="/qaylight.svg"
        alt="QAY"
        className={`block dark:hidden ${imageClassName}`}
      />
      <img
        src="/qayDark.svg"
        alt="QAY"
        className={`hidden dark:block ${imageClassName}`}
      />
    </span>
  );
}
