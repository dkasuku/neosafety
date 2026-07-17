export default function RatingStars({ value = 5 }: { value?: number }) {
  return (
    <div className="flex items-center gap-0.5 text-green" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < value ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
          <path d="m12 2 3 6.5 7 .6-5.3 4.6 1.6 6.9L12 17l-6.9 3.6 1.6-6.9L1.4 9.1l7-.6L12 2Z" />
        </svg>
      ))}
    </div>
  );
}
