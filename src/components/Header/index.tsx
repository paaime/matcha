import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Profile from '../Sidebar/Profile';

export default function Header() {
  return (
    <header className="hidden lg:flex border-b h-16 items-center px-6 gap-6">
      <form className="relative flex flex-1 h-full" action="#" method="GET">
        <label htmlFor="search-field" className="sr-only">
          Search
        </label>
        <MagnifyingGlassIcon
          className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
          aria-hidden="true"
        />
        <input
          id="search-field"
          className="block h-full w-full border-0 py-0 pl-8 pr-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm bg-transparent outline-none"
          placeholder="Search..."
          type="search"
          name="search"
        />
      </form>
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 ml-auto"
      >
        <span className="sr-only">View notifications</span>
        <BellIcon className="h-6 w-6" aria-hidden="true" />
      </button>
      <div
        className="hidden lg:block lg:h-6 lg:w-px dark:bg-white/5 bg-gray-200"
        aria-hidden="true"
      />
      <Profile isMobile={false} />
    </header>
  );
}
