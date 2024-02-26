// Adaptive circle progress bar
export const CircleProgress = ({ percent }: { percent: number }) => {

  percent = percent > 100 ? 100 : percent;
  percent = percent < 0 ? 0 : percent;

  percent = Math.floor(percent);

  const circumference = Math.PI * 2 * 24;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="inline-flex items-center justify-center overflow-hidden rounded-full">
      <svg className="w-14 h-14">
        <circle
          className="text-gray-300"
          strokeWidth="5"
          stroke="currentColor"
          fill="transparent"
          r="24"
          cx="27"
          cy="27"
        ></circle>
        <circle
          className="text-white"
          strokeWidth="5"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="24"
          cx="27"
          cy="27"
        ></circle>
      </svg>

      <span className="absolute font-bold text-white -mt-1">{percent}%</span>
    </div>
  );
};
