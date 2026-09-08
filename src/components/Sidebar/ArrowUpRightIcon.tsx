interface ArrowUpRightIconProps {
  color: string;
  className?: string;
}

/** Inline version of arrow-up-right.svg with a parameterized stroke color, so it can match the active clade instead of staying fixed pink. */
export function ArrowUpRightIcon({ color, className }: ArrowUpRightIconProps) {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M14 6L6 14M14 12.6667V6H7.33333"
        stroke={color}
        strokeWidth={1.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
