import React, { ReactNode } from 'react'

export default function ErrorMessage({children}: {children: ReactNode}) {
  return (
    <p className='error-text' role="alert">
        {children}
    </p>
  )
}
