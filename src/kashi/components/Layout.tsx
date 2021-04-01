import React from 'react'
import KashiLogo from 'assets/images/kashi-kanji-wires.png'
import { NavLink, useLocation } from 'react-router-dom'
import BentoBoxLogo from 'assets/kashi/bento-symbol.svg'

interface LayoutProps {
  left?: JSX.Element
  children?: React.ReactChild | React.ReactChild[]
  right?: JSX.Element
}

export default function Layout({ left = undefined, children = undefined, right = undefined }: LayoutProps) {
  const location = useLocation()
  return (
    <div className="container mx-auto px-4">
      <div className={`mb-2 grid grid-cols-12 gap-4`}>
        <div className="flex justify-center col-span-12 lg:col-span-3 lg:justify-start">
          <div className="flex items-center">
            <img src={KashiLogo} className="block w-20 lg:w-26 mr-2" />
            <div className="font-semibold text-2xl">Kashi</div>
          </div>
        </div>
        <div className="flex col-span-12 lg:col-span-9 items-end">
          <nav className="flex justify-between items-center w-full">
            <div className="flex">
              <NavLink to="/bento/kashi/lend" className="border-transparent px-4 border-b-2">
                <div
                  className={
                    'flex items-center font-medium ' +
                    (location.pathname === '/bento/kashi/lend' ? 'text-white' : 'text-gray-500')
                  }
                >
                  <div className="whitespace-nowrap text-base">Lend</div>
                </div>
              </NavLink>
              <NavLink to="/bento/kashi/borrow" className="border-transparent px-4 border-b-2">
                <div
                  className={
                    'flex items-center font-medium ' +
                    (location.pathname === '/bento/kashi/borrow' ? 'text-white' : 'text-gray-500')
                  }
                >
                  <div className="whitespace-nowrap text-base">Borrow</div>
                </div>
              </NavLink>
            </div>
            <div className="flex">
              <NavLink
                to="/bento/updates"
                className={`border-transparent px-6 border-b-2 flex justify-end items-center font-medium ${
                  location.pathname === '/bento/updates' ? 'text-white' : 'text-gray-500'
                }`}
              >
                <div className="whitespace-nowrap text-base">Updates</div>
              </NavLink>
              <NavLink
                to="/bento/balances"
                className={`border-transparent px-6 border-b-2 flex justify-end items-center font-medium ${
                  location.pathname === '/bento/balances' ? 'text-white' : 'text-gray-500'
                }`}
              >
                <img src={BentoBoxLogo} className="flex max-h-4 mr-2" />
                <div className="whitespace-nowrap text-base">My BentoBox</div>
              </NavLink>
            </div>
          </nav>
        </div>
      </div>
      <div className={`grid grid-cols-12 gap-4 min-h-1/2`}>
        {left && (
          <div className={`hidden lg:block lg:col-span-3`} style={{ maxHeight: '40rem' }}>
            {left}
          </div>
        )}
        <div className={`col-span-12 ${right ? 'lg:col-span-6' : 'lg:col-span-9'}`} style={{ minHeight: '40rem' }}>
          {children}
        </div>
        {right && (
          <div className="col-span-12 lg:col-span-3" style={{ maxHeight: '40rem' }}>
            {right}
          </div>
        )}
      </div>
    </div>
  )
}
