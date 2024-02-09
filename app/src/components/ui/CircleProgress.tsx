export default function CircleProgress() {
  return (
    <div className="inline-flex items-center justify-center overflow-hidden rounded-full">
      <svg className="w-14 h-14">
        <circle
          className="text-gray-300"
          stroke-width="5"
          stroke="currentColor"
          fill="transparent"
          r="24"
          cx="27"
          cy="27"
        ></circle>
        <circle
          className="text-white"
          stroke-width="5"
          strokeDasharray="100"
          strokeDashoffset="0"
          stroke-linecap="round"
          stroke="currentColor"
          fill="transparent"
          r="24"
          cx="27"
          cy="27"
          stroke-dasharray="188.49555921538757"
          stroke-dashoffset="54.6637121724624"
        ></circle>
      </svg>
      <span
        className="absolute font-bold text-white -mt-1"
        x-text="`${percent}%`"
      >
        80%
      </span>
    </div>
  );
}
