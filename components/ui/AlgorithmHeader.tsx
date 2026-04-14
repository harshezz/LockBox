import React from "react";

function AlgorithmHeader({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="font-extrabold text-4xl sm:text-5xl lg:text-6xl text-center pt-20 md:pt-28 text-slate-50 tracking-tight">
        {name}
      </div>

      <div className="px-2 py-8 md:py-10 text-slate-300 max-w-5xl m-auto text-center leading-relaxed">
        {children}
      </div>
    </>
  );
}

export default AlgorithmHeader;
