import React from "react";
import Link from "next/link";
import LogoIcon from "../icons/LogoIcon";
import GitHubIcon from "../icons/GitHubIcon";

function Navbar() {
  return (
    <header className="relative pt-5 lg:pt-7 flex items-center justify-between font-semibold text-md leading-6 text-slate-200">
      <Link href="/">
        <span className="text-xl hover:text-sky-400 transition-colors">
          <LogoIcon />
        </span>
      </Link>

      <div className="flex items-center">
        <div className="flex items-center">
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-8">
              <li>
                <Link
                  href="/"
                  className="hover:text-sky-500 dark:hover:text-sky-400"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/harshezz/LockBox"
                  className="hover:text-sky-500 dark:hover:text-sky-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Docs
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex items-center border-l ml-6 pl-6 border-slate-700">
            <Link
              href="https://github.com/harshezz/LockBox"
              className="block text-slate-400 hover:text-sky-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
