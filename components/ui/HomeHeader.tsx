import React from "react";

function HomeHeader() {
  return (
    <div className="container m-auto p-2">
      <header className="relative">
        <div className="relative mt-7 max-w-5xl mx-auto pt-16 sm:pt-20 lg:pt-24">
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center">
            Easily encrypt your texts using the most known algorithms.
          </h1>

          <p className="mt-6 text-lg text-center max-w-3xl mx-auto text-slate-300">
            You can also use LockBox for your personal projects with the free
            REST API reachable at{" "}
            <span className="font-mono font-medium text-sky-500">/api/</span>!{" "}
            <br />
          </p>

          <p className="mt-3 text-sm text-center max-w-3xl mx-auto text-slate-400">
            Created by{" "}
            <a
              href="https://github.com/harshezz"
              className="underline hover:text-sky-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              Harsh Sharma
            </a>
          </p>
        </div>
      </header>
    </div>
  );
}

export default HomeHeader;
