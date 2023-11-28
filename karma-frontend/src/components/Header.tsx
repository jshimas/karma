import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <div className="h-14 flex items-center sm:gap-8 border-b-2 border-teal-700 px-8 justify-between">
      <button className="uppercase text-2xl tracking-wide font-light text-teal-700">
        Karma
      </button>
      {/* Show how menu on large screeens */}
      <div className="hidden sm:flex flex-1 items-center justify-between text-slate-800 h-full">
        <div className="flex gap-6 md:gap-8">
          <Link
            to={"/activities"}
            className="transition text-slate-600 hover:text-teal-700"
          >
            Activities
          </Link>
          <Link
            to={"/organizations"}
            className="transition text-slate-600 hover:text-teal-700"
          >
            Organizations
          </Link>
          <button className="transition text-slate-600 hover:text-teal-700">
            Prizes
          </button>
        </div>

        <div className="space-x-4 h-2/3 flex justify-center">
          <Link
            to={"login"}
            className="transition-all px-4 border-2 rounded-md border-teal-700 text-teal-700 font-semibold flex items-center hover:bg-teal-50 "
          >
            <p className="">Log in</p>
          </Link>
          <Link
            to={"/signup"}
            className="transition-all px-4 rounded-md bg-teal-700 text-white font-semibold flex items-center hover:bg-teal-800 active:bg-teal-900"
          >
            <p className="">Sign up</p>
          </Link>
        </div>
      </div>

      {/* Show hamburger on small screeens */}
      {!isMenuOpen && (
        <div
          className="sm:hidden cursor-pointer"
          onClick={() => setMenuOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </div>
      )}

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="transition-all flex flex-col items-start absolute right-0 top-0 w-52 h-full sm:hidden bg-slate-50 z-10 p-6 gap-4">
          <div className="flex flex-col items-start gap-4 w-full">
            <div className="w-full flex justify-between">
              <Link
                to={"/login"}
                className="transition text-slate-600 hover:text-teal-700 flex items-center space-x-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>

                <p className="-translate-y-0.5">Log in</p>
              </Link>

              <button onClick={() => setMenuOpen(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <Link
              to={"/signup"}
              className="transition text-slate-600 hover:text-teal-700 flex items-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path d="M12 4.5v15m7.5-7.5h-15" />
              </svg>

              <p className="-translate-y-0.5">Sign up</p>
            </Link>
          </div>

          <div className="w-full border-b-2"></div>

          <Link
            to={"/activities"}
            className="transition text-slate-600 hover:text-teal-700"
          >
            Activities
          </Link>
          <Link
            to={"/organizations"}
            className="transition text-slate-600 hover:text-teal-700"
          >
            Organizations
          </Link>
          <button className="transition text-slate-600 hover:text-teal-700">
            Prizes
          </button>
        </div>
      )}
    </div>
  );
}
