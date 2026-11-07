export default function HatIcon({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" fill="none">
      <path d="M32 15c-8 0-13.5 5.4-13.5 12.5V31h27v-3.5C45.5 20.4 40 15 32 15Z" fill="#f2d78c" />
      <path d="M22 24h20v4.5H22z" fill="#b3202a" />
      <path
        d="M9 38c0-3.4 9-6.2 23-6.2S55 34.6 55 38s-9 7.2-23 7.2S9 41.4 9 38Z"
        fill="#e9c46a"
      />
      <path
        d="M9 38c0-1.2 9-2.1 23-2.1s23 .9 23 2.1"
        stroke="#fdfaf3"
        strokeOpacity=".55"
        strokeWidth="1.4"
      />
    </svg>
  );
}
