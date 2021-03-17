import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { transparentize } from 'polished'
import { DarkCard, BaseCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import QuestionHelper from '../../components/QuestionHelper'
import { BarChart, User, Search } from 'react-feather'
import getTokenIcon from '../../sushi-hooks/queries/getTokenIcons'
import BentoBoxLogo from '../../assets/kashi/bento-symbol.svg'
import { formattedPercent, formattedNum } from '../../utils'
import { useKashiPairs, useKashiCounts } from 'contexts/kashi'

const PageWrapper = styled(AutoColumn)`
  max-width: 800px;
  width: 100%;
`

const StyledBaseCard = styled(BaseCard)`
  border: none
  background: ${({ theme }) => transparentize(0.6, theme.bg1)};
  position: relative;
  overflow: hidden;
`

export default function Pool() {
  const counts = useKashiCounts()
  const pairs = useKashiPairs()

  const supplyPositions = pairs.filter(function(pair: any) {
    return pair.user.asset.value.gt(0)
  })
  const borrowPositions = pairs.filter(function(pair: any) {
    return pair.user.borrow.value.gt(0)
  })

  if (!supplyPositions.length || !borrowPositions.length) return null

  return (
    <>
      <PageWrapper>
        <AutoColumn style={{ width: '100%' }}>
          <div className="flex-col space-y-8">
            <Summary suppliedPairCount={counts.pairsSupplied} borrowedPairCount={counts.pairsBorrowed} />
            <Title count={counts.markets} />
            <PositionsDashboard supplyPositions={supplyPositions} borrowPositions={borrowPositions} />
          </div>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}

interface SummaryProps {
  suppliedPairCount: any
  borrowedPairCount: any
}
const Summary = ({ suppliedPairCount, borrowedPairCount }: SummaryProps) => {
  return (
    <div className="w-full md:w-2/3 m-auto">
      <StyledBaseCard>
        <div className="flex space-x-4">
          <div className="flex-none">
            <DarkCard style={{ position: 'relative', overflow: 'hidden' }} borderRadius="12px">
              <div className="items-center text-center">
                <div className="text-2xl font-semibold">{suppliedPairCount}</div>
                <div className="text-sm font-semibold" style={{ color: '#bfbfbf' }}>
                  Pairs Supplied
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-2 flex">
                <div className="h-2 flex-1" style={{ background: '#6ca8ff' }} />
              </div>
            </DarkCard>
          </div>
          <div className="flex-grow">
            <DarkCard style={{ position: 'relative', overflow: 'hidden' }} borderRadius="12px">
              <div className="items-center text-center">
                <div className="text-2xl font-semibold">$0.00</div>
                <div className="text-sm font-semibold" style={{ color: '#bfbfbf' }}>
                  Net Worth
                </div>
              </div>
            </DarkCard>
          </div>
          <div className="flex-none">
            <DarkCard style={{ position: 'relative', overflow: 'hidden' }} borderRadius="12px">
              <div className="items-center text-center">
                <div className="text-2xl font-semibold">{borrowedPairCount}</div>
                <div className="text-sm font-semibold" style={{ color: '#bfbfbf' }}>
                  Pairs Borrowed
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-2 flex">
                <div className="h-2 flex-1" style={{ background: '#de5597' }} />
              </div>
            </DarkCard>
          </div>
        </div>
      </StyledBaseCard>
    </div>
  )
}

const Title = ({ count }: any) => {
  return <div className="text-3xl font-semibold text-center">{count} Kashi Markets</div>
}

interface PositionsDashboardProps {
  supplyPositions: any
  borrowPositions: any
}

const PositionsDashboard = ({ supplyPositions, borrowPositions }: PositionsDashboardProps) => {
  const [selected, setSelected] = useState<string>('supply')
  return (
    <div>
      <Options
        supplyPositionsCount={supplyPositions?.length}
        borrowPositionsCount={borrowPositions?.length}
        selected={selected}
        setSelected={setSelected}
      />
      {selected && selected === 'supply' && <SupplyPositions supplyPositions={supplyPositions} />}
      {selected && selected === 'borrow' && <BorrowPositions borrowPositions={supplyPositions} />}
    </div>
  )
}

interface OptionsProps {
  supplyPositionsCount: number
  borrowPositionsCount: number
  selected?: string
  setSelected?: any
}

const Options = ({ supplyPositionsCount, borrowPositionsCount, selected, setSelected }: OptionsProps) => {
  const theme = useContext(ThemeContext)
  return (
    <div className="flex-col md:flex md:justify-between pb-2 px-7">
      <div className="block">
        <nav className="-mb-px flex space-x-4">
          <Link to="/bento/kashi" className="border-transparent py-2 px-1 border-b-2">
            <div className="flex items-center text-gray-500 hover:text-gray-400 font-medium">
              <div className="whitespace-nowrap text-base mr-2">Markets</div>
              <BarChart size={16} />
            </div>
          </Link>
          <Link to="/bento/kashi/positions" className="border-transparent py-2 px-1 border-b-2">
            <div className="flex items-center text-gray-500 font-medium">
              <div className="whitespace-nowrap text-base mr-2 text-white">Positions</div>
              <User size={16} />
            </div>
          </Link>
          <Link to="/bento/balances" className="border-transparent py-2 px-1 border-b-2">
            <div className="flex items-center text-gray-500 hover:text-gray-400 font-medium">
              <div className="whitespace-nowrap text-base mr-2">My Bento</div>
              <img src={BentoBoxLogo} className="w-6" />
            </div>
          </Link>
        </nav>
      </div>
      <div className="w-full flex md:w-1/2 md:justify-end">
        <div className="flex items-center">
          <div className="flex items-center space-x-2 mr-4">
            <div
              className="px-2 py-1 font-semibold rounded"
              style={{ background: transparentize(0.6, theme.bg1), color: '#6ca8ff' }}
            >
              {supplyPositionsCount}
            </div>
            <button
              className={
                selected === 'supply' ? 'text-white cursor-pointer' : 'text-gray-500 hover:text-gray-400 cursor-pointer'
              }
              onClick={() => setSelected('supply')}
            >
              Supply Pairs
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className="px-2 py-1 font-semibold rounded"
              style={{ background: transparentize(0.6, theme.bg1), color: '#de5597' }}
            >
              {borrowPositionsCount}
            </div>
            <button
              className={
                selected === 'borrow' ? 'text-white cursor-pointer' : 'text-gray-500 hover:text-gray-400 cursor-pointer'
              }
              onClick={() => setSelected('borrow')}
            >
              Borrow Pairs
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const SupplyPositions = ({ supplyPositions }: any) => {
  return (
    <>
      <StyledBaseCard>
        <div className="pb-4 px-4 grid grid-cols-5 md:grid-cols-5 text-sm font-semibold text-gray-500">
          <div className="hover:text-gray-400 col-span-2 md:col-span-2">Market</div>
          <div className="text-right pl-4 col-span-2 hover:text-gray-400">Supplying</div>
          <div className="text-right hover:text-gray-400">APY</div>
        </div>
        <div className="flex-col space-y-2">
          {supplyPositions &&
            supplyPositions.length > 0 &&
            supplyPositions.map((pair: any) => {
              return (
                <>
                  <Link to={'/bento/kashi/' + pair.address} className="block" key={pair.address}>
                    <div
                      className="py-4 px-4 items-center align-center grid grid-cols-5 md:grid-cols-5 text-sm font-semibold"
                      style={{ background: '#19212e', borderRadius: '12px' }}
                    >
                      <div className="flex space-x-2 col-span-2 md:col-span-1">
                        <img src={getTokenIcon(pair.collateral.address)} className="w-12 y-12 rounded-lg" />
                        <img src={getTokenIcon(pair.asset.address)} className="w-12 y-12 rounded-lg" />
                      </div>
                      <div className="text-left hidden md:block pl-4">
                        <div>
                          {pair.collateral.symbol} / {pair.asset.symbol}
                        </div>
                        <div>{pair.oracle.name}</div>
                      </div>
                      <div className="text-right col-span-2">
                        <div>
                          {pair.user.asset.string} {pair.asset.symbol}
                        </div>
                        <div className="text-gray-500 text-sm">≈ {formattedNum(pair.user.asset.usdString, true)}</div>
                      </div>
                      <div className="text-right">{formattedPercent(pair.details.apr.asset)}</div>
                    </div>
                  </Link>
                </>
              )
            })}
        </div>
      </StyledBaseCard>
    </>
  )
}

const BorrowPositions = ({ borrowPositions }: any) => {
  return (
    <>
      <StyledBaseCard>
        <div className="pb-4 px-4 grid grid-cols-5 md:grid-cols-6 text-sm font-semibold text-gray-500">
          <div className="hover:text-gray-400 col-span-2 md:col-span-1">Market</div>
          <div className="hover:text-gray-400 col-span-2 md:col-span-1"></div>
          <div className="text-right hidden md:block pl-4 hover:text-gray-400">Borrowing</div>
          <div className="text-right hover:text-gray-400">Collateral</div>
          <div className="text-right hover:text-gray-400">Limit Used</div>
          <div className="text-right hover:text-gray-400">Borrow APR</div>
        </div>
        <div className="flex-col space-y-2">
          {borrowPositions &&
            borrowPositions.length > 0 &&
            borrowPositions.map((pair: any) => {
              return (
                <>
                  <Link to={'/bento/kashi/pair/' + pair.address} className="block" key={pair.address}>
                    <div
                      className="py-4 px-4 items-center align-center grid grid-cols-5 md:grid-cols-6 text-sm font-semibold"
                      style={{ background: '#19212e', borderRadius: '12px' }}
                    >
                      <div className="flex space-x-2 col-span-1 md:col-span-1">
                        <img src={getTokenIcon(pair.collateral.address)} className="w-12 y-12 rounded-lg" />
                        <img src={getTokenIcon(pair.asset.address)} className="w-12 y-12 rounded-lg" />
                      </div>
                      <div className="text-left hidden md:block pl-4">
                        <div>
                          {pair.collateral.symbol} / {pair.collateral.symbol}
                        </div>
                        <div>{pair.oracle.name}</div>
                      </div>
                      <div className="text-right">{pair.collateral.symbol}</div>
                      <div className="text-right">{pair.asset.symbol}</div>
                      <div className="text-right">{formattedPercent(pair.details.apr.asset)}</div>
                      <div className="text-right">{formattedPercent(pair.details.apr.asset)}</div>
                    </div>
                  </Link>
                </>
              )
            })}
        </div>
      </StyledBaseCard>
    </>
  )
}
