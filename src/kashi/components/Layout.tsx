import React from 'react'
import { TeardropCard, Navigation } from '.'
import styled from 'styled-components'
import { TYPE } from 'theme'
import KashiLogo from 'assets/images/kashi-kanji-wires.png'
import MarketsNavigation from './MarketsNavigation'
import { BaseCard } from 'components/Card'

const Kashi = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 8px;
`

interface LayoutProps {
  left?: JSX.Element
  children?: React.ReactChild | React.ReactChild[]
  right?: JSX.Element
}

const KashiImage = styled.img`
  width: 116px;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 58px;
  `};
`

export default function Layout({ left = undefined, children = undefined, right = undefined }: LayoutProps) {
  return (
    <>
      <div className={`md:px-4 grid grid-cols-1 lg:grid-cols-12 gap-4`}>
        <div className="flex col-span-3 justify-center lg:justify-start">
          <div className="flex items-center pb-3">
            <img src={KashiLogo} className="w-10 y-10 sm:w-20 sm:y-20 lg:w-28 lg:y-28" />
            <TYPE.extraLargeHeader color="extraHighEmphesisText" lineHeight={1}>
              Kashi
            </TYPE.extraLargeHeader>
          </div>
        </div>
        <div className="flex col-span-9 items-end">
          <div className="w-full flex justify-center lg:justify-between pb-1">
            <div className="hidden lg:block">
              <MarketsNavigation />
            </div>
            <Navigation />
          </div>
        </div>
      </div>
      <div className={`md:px-4 grid grid-cols-1 lg:grid-cols-12 gap-4`}>
        {left && <div className={`hidden lg:block lg:col-span-3`}>{left}</div>}
        <TeardropCard className={`${right ? 'lg:col-span-6' : 'lg:col-span-9'}`}>{children}</TeardropCard>
        {right && <BaseCard className="hidden lg:block lg:col-span-3">{right}</BaseCard>}
      </div>
    </>
  )
}
