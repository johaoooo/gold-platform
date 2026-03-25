const GoldenLogo = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#C9A227" />
        <stop offset="100%" stopColor="#FFF2B2" />
      </linearGradient>
    </defs>

    <circle cx="50" cy="50" r="45" stroke="url(#goldGradient)" strokeWidth="2" opacity="0.6" />
    <circle cx="50" cy="50" r="35" stroke="url(#goldGradient)" strokeWidth="1.5" opacity="0.4" />

    <path
      d="M65 50H50V60H60C57 66 52 70 45 70C35 70 28 63 28 50C28 37 35 30 45 30C51 30 56 33 59 38"
      stroke="url(#goldGradient)"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <circle cx="70" cy="30" r="3" fill="url(#goldGradient)" />
  </svg>
);

export default GoldenLogo;
