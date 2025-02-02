import { socials } from '@/lib/item'
import React from 'react'

const Footer = () => {
  return (
    <div className='bottom-0 left-0 py-10 px-0 border-t-2 w-[100%] ' >
              <div className="container flex sm:justify-between p-6 justify-center items-center mt-[10rem] gap-10 max-sm:flex-col">
        <p className="caption text-n-4 lg:block">
          © {new Date().getFullYear()}. All rights reserved.
        </p>
        {/* <p className="caption text-n-4 lg:block">
          PhoneNo: 8600646080
        </p> */}
        {/* <ul className="flex gap-5 flex-wrap">
          {socials.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              className="flex items-center justify-center w-10 h-10 bg-n-7 rounded-full transition-colors hover:bg-n-6"
            >
              <img src={item.iconUrl} width={16} height={16} alt={item.title} />
            </a>
          ))}
        </ul> */}
      </div>
    </div>
  )
}

export default Footer