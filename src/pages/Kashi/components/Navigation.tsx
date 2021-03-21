import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { BarChart, User } from 'react-feather'
import BentoBoxLogo from 'assets/kashi/bento-symbol.svg'

export default function Navigation() {
  const location = useLocation()
  return (
    <nav className="-mb-px flex space-x-4 justify-center pb-2 md:pb-0 md:justify-start ">
      <NavLink to="/bento/kashi" className="border-transparent py-2 px-1 border-b-2">
        <div
          className={
            'flex items-center font-medium ' + (location.pathname === '/bento/kashi' ? 'text-white' : 'text-gray-500')
          }
        >
          <div className={'whitespace-nowrap text-base mr-2'}>Markets</div>
          <BarChart size={16} />
          <div className="whitespace-nowrap text-base ml-2">Markets</div>
        </div>
      </NavLink>
      <NavLink to="/bento/kashi/positions" className="border-transparent py-2 px-1 border-b-2">
        <div
          className={
            'flex items-center font-medium ' +
            (location.pathname === '/bento/kashi/positions' ? 'text-white' : 'text-gray-500')
          }
        >
          <div className="whitespace-nowrap text-base mr-2">Positions</div>
          <User size={16} />
          <div className="whitespace-nowrap text-base ml-2">Portfolio</div>
        </div>
      </NavLink>
      <NavLink to="/bento/balances" className="border-transparent py-2 px-1 border-b-2">
        <div
          className={
            'flex items-center font-medium ' +
            (location.pathname === '/bento/balances' ? 'text-white' : 'text-gray-500')
          }
        >
          <div className="whitespace-nowrap text-base mr-2">My Bento</div>
          <img src={BentoBoxLogo} className="w-6" />
          <div className="whitespace-nowrap text-base ml-2">My Bento</div>
        </div>
      </NavLink>
    </nav>
  )
}
