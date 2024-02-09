export default function ProfileCard() {
  return (
    <div
      className="border-[5px] border-pink h-72 rounded-3xl"
      style={{
        backgroundImage: 'url(/img/placeholder/LoveCard1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="flex flex-col justify-between items-center h-full rounded-3xl"
        style={{
          background:
            'linear-gradient(to top, rgb(5 20 90 / 84%), transparent)',
        }}
      >
        <div className="bg-pink text-white font-bold px-5 pb-1 rounded-b-2xl text-sm">
          <p>100% Match</p>
        </div>
        <div className="flex flex-col items-center mb-3">
          <div className="border border-[#ffffff1a] backdrop-blur-sm rounded-full py-1 px-3 text-white text-sm bg-white/30 font-semibold w-fit mb-1">
            <p>2.5 km away</p>
          </div>
          <p className="font-extrabold text-white text-xl">Xavier Niel, 20</p>
          <p className="text-[#C0AFC0] font-semibold text-sm tracking-wider">
            HAMBURG, GERMANY
          </p>
        </div>
      </div>
    </div>
  );
}
