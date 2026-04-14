import React, { ReactNode } from 'react'

export default function CardsContainer({children}: {children: ReactNode}) {
  return (
    <div className='container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 m-auto p-4 sm:p-6 lg:px-12 xl:px-16 mt-8 md:mt-10 gap-8'>
        {children}
    </div>
  )
}
