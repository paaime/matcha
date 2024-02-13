import Image from 'next/image';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-[#FDF7FD]">
      <div className="relative hidden h-full flex-col items-center justify-center bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-pink" />
        <div className="relative z-20 flex flex-col items-center text-lg font-medium">
          <div className="flex">
            <Image src="/img/logo.svg" height={40} width={40} alt="Logo" />
            <h1 className="font-extrabold text-5xl ml-3">Matcha</h1>
          </div>
          <p className="text-lg font-normal ml-3">Find your soulmate</p>
        </div>
        <Image
          src="/img/background.png"
          width={300}
          height={300}
          alt="Background"
          className="absolute right-0 z-10 top-[20%]"
        />
      </div>
      <div className="py-5 p-8 h-full w-screen lg:w-auto">{children}</div>
    </div>
  );
}
