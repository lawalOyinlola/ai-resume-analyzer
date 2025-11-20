const ScoreCircle = ({ score = 75 }: { score?: number }) => {
  const clampedScore = Math.min(100, Math.max(0, score));

  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = clampedScore / 100;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div
      className="relative w-[100px] h-[100px]"
      role="img"
      aria-label={`Score: ${score} out of 100`}
    >
      <svg
        height="100%"
        width="100%"
        viewBox="0 0 100 100"
        className="transform -rotate-90"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={normalizedRadius}
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="transparent"
        />
        {/* Partial circle with gradient */}
        <defs>
          <linearGradient id="grad" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF97AD" />
            <stop offset="100%" stopColor="#5171FF" />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r={normalizedRadius}
          stroke="url(#grad)"
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>

      {/* Score and issues */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-semibold text-sm"
          aria-hidden="true"
        >{`${clampedScore}/100`}</span>
      </div>
    </div>
  );
};

export default ScoreCircle;
