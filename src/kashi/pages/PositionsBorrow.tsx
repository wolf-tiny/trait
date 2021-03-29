import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import { BaseCard } from 'components/Card'
import { getTokenIcon } from 'kashi/functions'
import { formattedPercent, formattedNum } from 'utils'
import { useKashiPairs } from '../context'
import PositionsSelector from './Positions/Selector'
import { InfoCard, SectionHeader, Layout, FixedScrollable, GradientDot } from '../components'
import DepositGraphic from 'assets/kashi/deposit-graphic.png'

const StyledBaseCard = styled(BaseCard)`
  border: none;
  background: ${({ theme }) => theme.baseCard};
  position: relative;
  overflow: hidden;
  border-radius: 0 0 15px 15px;
`

export default function Positions() {
  const pairs = useKashiPairs()

  const borrowPositions = pairs.filter(function(pair: any) {
    return pair.user.borrow.value.gt(0) || pair.user.collateral.value.gt(0)
  })

  return (
    <Layout
      left={
        <InfoCard
          backgroundImage={DepositGraphic}
          title={'Mind the borrow limit.'}
          description={
            'Track your open borrow positions and your borow limits. If your borrow limit is approaching 80% we recommend you repay or add more collateral in order to avoid liquidation.'
          }
        />
      }
    >
      <div className="flex-col space-y-8" style={{ minHeight: '35rem' }}>
        <div>
          <SectionHeader portfolio={true}>
            <PositionsSelector />
          </SectionHeader>
          <BorrowPositions borrowPositions={borrowPositions} />
        </div>
      </div>
    </Layout>
  )
}

// TODO: Use table component
const BorrowPositions = ({ borrowPositions }: any) => {
  const theme = useContext(ThemeContext)
  return (
    <>
      <StyledBaseCard>
        {borrowPositions && borrowPositions.length > 0 ? (
          <div className="pb-4 px-4 grid grid-cols-3 sm:grid-cols-6 text-sm font-semibold text-gray-500">
            <div className="hover:text-gray-400 col-span-1 md:col-span-1">Market</div>
            <div className="hidden sm:block"></div>
            <div className="text-right pl-4 hover:text-gray-400">Borrowing</div>
            <div className="text-right hover:text-gray-400">Collateral</div>
            <div className="hidden sm:block text-right hover:text-gray-400">Limit Used</div>
            <div className="hidden sm:block text-right hover:text-gray-400">Borrow APR</div>
          </div>
        ) : (
          <div className="items-center text-center p-6 w-full">
            <div className="text-2xl font-semibold text-gray-400 pb-2">You have no open borrow positions.</div>
            <div className="text-base font-base text-gray-400">
              Swing by once you have borrowed assets from various markets
            </div>
            <div className="flex mx-auto justify-center">
              <Link
                to={'/bento/kashi/borrow'}
                className="my-8 px-3 py-2 text-base font-medium rounded-md shadow-sm text-white"
                style={{ background: `${theme.primaryPink}` }}
              >
                View Borrow Markets
              </Link>
            </div>
          </div>
        )}

        <FixedScrollable height="22rem">
          {borrowPositions &&
            borrowPositions.length > 0 &&
            borrowPositions.map((pair: any) => {
              return (
                <>
                  <Link
                    to={'/bento/kashi/pair/' + pair.address + '/borrow'}
                    className="block"
                    key={pair.address}
                    style={{ color: theme.highEmphesisText }}
                  >
                    <div
                      className="mb-2 py-4 px-4 items-center align-center grid grid-cols-3 sm:grid-cols-6 text-sm font-semibold"
                      style={{ background: theme.mediumDarkPurple, borderRadius: '15px' }}
                    >
                      <div className="flex space-x-2 col-span-1">
                        <img
                          src={getTokenIcon(pair.collateral.address)}
                          className="block w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
                        />
                        <img
                          src={getTokenIcon(pair.asset.address)}
                          className="block w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
                        />
                      </div>
                      <div className="text-left hidden sm:block pl-4">
                        <div>
                          {pair.collateral.symbol} / {pair.asset.symbol}
                        </div>
                        <div>{pair.oracle.name}</div>
                      </div>
                      <div className="text-right">
                        <div>
                          {formattedNum(pair.user.borrow.string, false)} {pair.asset.symbol}
                        </div>
                        <div className="text-gray-500 text-sm">≈ {formattedNum(pair.user.borrow.usdString, true)}</div>
                      </div>
                      <div className="text-right">
                        <div>
                          {formattedNum(pair.user.collateral.string, false)} {pair.collateral.symbol}
                        </div>
                        <div className="text-gray-500 text-sm">
                          ≈ {formattedNum(pair.user.collateral.usdString, true)}
                        </div>
                      </div>
                      <div className="hidden sm:block">
                        <div className="flex text-right float-right items-center">
                          {formattedPercent(pair.user.health.percentage)}
                          <GradientDot percent={pair.user.health.percentage} />
                        </div>
                      </div>
                      <div className="hidden sm:block text-right">
                        {formattedPercent(pair.details.apr.currentInterestPerYear)}
                      </div>
                      <div className="sm:hidden text-right col-span-3">
                        <div className="flex justify-between px-2 py-2 mt-4 bg-gray-800 rounded-lg">
                          <div className="flex items-center">
                            <div className="text-gray-500 mr-2">Limit Used: </div>
                            <div>{formattedPercent(pair.user.health.percentage)}</div>
                            <GradientDot percent={pair.user.health.percentage} />
                          </div>
                          <div className="flex">
                            <div className="text-gray-500 mr-2">Borrow APY: </div>
                            <div>{formattedPercent(pair.details.apr.currentInterestPerYear)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </>
              )
            })}
        </FixedScrollable>
      </StyledBaseCard>
    </>
  )
}
