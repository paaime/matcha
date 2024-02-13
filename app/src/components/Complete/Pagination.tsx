export default function Pagination({ step }: { step: number }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-pink/30 font-extrabold text-xl">
        <span className="text-primary">{step}</span>/5
      </p>
      <div className="w-full h-2 bg-pink/10 rounded-full">
        <div
          className="h-full bg-pink rounded-full transition-all duration-500"
          style={{ width: `${(step / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}
