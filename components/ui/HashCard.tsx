import React from 'react'
import Link from 'next/link'
import LockIcon from '../icons/LockIcon'
import RightArrowIcon from '../icons/RightArrowIcon'
import ClockIcon from '../icons/ClockIcon'
import ShieldIcon from '../icons/ShieldIcon'
import BookIcon from '../icons/BookIcon'

type Props = {
    destination: string | {
        pathname: string, 
        query: any
    },
    shortName: string,
    name: string,
    bruteforceTime: string,
    securityLevel: string,
    blockSize: string
}

export default function HashCard({destination, shortName, name, bruteforceTime, securityLevel, blockSize}: Props) {
  return (
    <Link href={destination} className="card-link"> 
        <article>
            <div className='card-link-header'>
                <LockIcon />

                <div className='card-link-title'>
                    {shortName}
                </div>

                <RightArrowIcon />
            </div>

            <div className='my-3 font-semibold text-slate-100'>
                {name}
            </div>

            <div className='font-semibold text-slate-300'>
                <div className='mb-2'>
                    <ClockIcon />

                    <span className='align-middle'>
                        {bruteforceTime}
                    </span>
                </div>
                <div className='mb-2'>
                    <ShieldIcon />

                    <span className='align-middle'>
                        {securityLevel}
                    </span>
                </div>
                <div className='mb-2'>
                    <BookIcon />

                    <span className='align-middle'>{blockSize}</span>
                </div>
            </div>
        </article>
    </Link>
  )
}
