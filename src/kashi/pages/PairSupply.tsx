import React, { useState } from 'react'
import { ChainId } from '@sushiswap/sdk'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import { useActiveWeb3React } from 'hooks'
import useTheme from 'hooks/useTheme'
import { AutoColumn } from 'components/Column'
import Card from 'components/Card'
import { Debugger } from 'components/Debugger'
import { useKashiPair } from 'kashi/context'
import getTokenIcon from 'sushi-hooks/queries/getTokenIcons'
import { KashiAction, Navigation, TeardropCard, CardHeader, PrimaryTabs, SecondaryTabs } from '../../kashi/components'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { TYPE } from 'theme'
import { AutoRow, RowBetween } from 'components/Row'
import { formattedNum, formattedPercent } from 'utils'
import KashiLogo from 'assets/images/kashi-kanji-wires.png'
import { InfoCard, Layout } from '../../kashi/components'
import DepositGraphic from '../../assets/kashi/deposit-graphic.png'

const PageWrapper = styled.div`
  max-width: 1280px;
  width: 100%;
`

export default function KashiPair({
  match: {
    params: { pairAddress }
  }
}: RouteComponentProps<{ pairAddress: string }>) {
  const [tabIndex, setTabIndex] = useState(0)

  const { chainId } = useActiveWeb3React()

  const pair = useKashiPair(pairAddress)
  const theme = useTheme()

  if (!pair) return null

  // console.log({ pair })

  return (
    <PageWrapper>
      <Layout
        left={
          <InfoCard
            backgroundImage={DepositGraphic}
            title={'Deposit tokens into BentoBox for all the yields.'}
            description={
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
            }
          />
        }
        right={
          <>
            <TYPE.mediumHeader color="highEmphesisText">Net Worth in this Pair</TYPE.mediumHeader>
            <TYPE.largeHeader color="extraHighEmphesisText" marginBottom={18}>
              {formattedNum(pair.user.pairNetWorth.usdString, true)} USD
            </TYPE.largeHeader>
            <Card backgroundColor={theme.extraDarkPurple}>
              <RowBetween>
                <TYPE.body color="mediumEmphesisText">Debt Ceiling:</TYPE.body>
                <TYPE.body color="highEmphesisText">???</TYPE.body>
              </RowBetween>
              <RowBetween>
                <TYPE.body color="mediumEmphesisText">Utilization rate:</TYPE.body>
                <TYPE.body color="highEmphesisText">
                  {formattedPercent(pair.details.total.utilization.string)}
                </TYPE.body>
              </RowBetween>
            </Card>
          </>
        }
      >
        <CardHeader market={'Supply'} border>
          <div className="flex items-center">
            <div className="flex space-x-2 mr-4">
              <a
                href={
                  `${
                    chainId === ChainId.MAINNET
                      ? 'https://www.etherscan.io/address/'
                      : chainId === ChainId.ROPSTEN
                      ? 'https://ropsten.etherscan.io/address/'
                      : null
                  }` + pair?.collateral.address
                }
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={pair && getTokenIcon(pair?.collateral.address)}
                  className="w-10 y-10 sm:w-12 sm:y-12 rounded-lg"
                />
              </a>
              <a
                href={
                  `${
                    chainId === ChainId.MAINNET
                      ? 'https://www.etherscan.io/address/'
                      : chainId === ChainId.ROPSTEN
                      ? 'https://ropsten.etherscan.io/address/'
                      : null
                  }` + pair?.asset.address
                }
                target="_blank"
                rel="noreferrer"
              >
                <img src={pair && getTokenIcon(pair?.asset.address)} className="w-10 y-10 sm:w-12 sm:y-12 rounded-lg" />
              </a>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <TYPE.extraLargeHeader color="highEmphesisText" lineHeight={1}>
                  {pair && `${pair.collateral.symbol + ' / ' + pair.asset.symbol}`}
                </TYPE.extraLargeHeader>
                <AutoRow>
                  <TYPE.subHeader color="mediumEmphesisText" style={{ marginRight: 4 }}>
                    Oracle:
                  </TYPE.subHeader>
                  <TYPE.subHeader color="highEmphesisText">{pair && pair.oracle.name}</TYPE.subHeader>
                  {/* <QuestionHelper text="" /> */}
                </AutoRow>
              </div>
            </div>
          </div>
        </CardHeader>

        <RowBetween style={{ padding: '32px 48px 0' }} align="top">
          <div>
            <TYPE.mediumHeader color="mediumEmphesisText">Supply Balance</TYPE.mediumHeader>
            <TYPE.largeHeader color="primaryBlue">
              {formattedNum(pair.user.supply.string)} {pair.asset.symbol}
            </TYPE.largeHeader>
            <TYPE.body color="highEmphesisText">≈ {formattedNum(pair.user.supply.usdString, true)}</TYPE.body>
          </div>
          <div>
            <TYPE.mediumHeader color="mediumEmphesisText">Market Supply</TYPE.mediumHeader>
            <TYPE.largeHeader color="highEmphesisText">
              {formattedNum(pair.details.total.supply.string)} {pair.asset.symbol}
            </TYPE.largeHeader>
            <TYPE.body color="highEmphesisText">≈ {formattedNum(pair.details.total.supply.usdString, true)}</TYPE.body>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div>
              <TYPE.mediumHeader color="mediumEmphesisText">Supply APR</TYPE.mediumHeader>
              <TYPE.largeHeader color="highEmphesisText">
                {formattedPercent(pair.details.apr.currentSupplyAPR)}
              </TYPE.largeHeader>
            </div>
          </div>
        </RowBetween>

        <PrimaryTabs
          forceRenderTabPanel
          defaultIndex={0}
          selectedIndex={tabIndex}
          onSelect={index => setTabIndex(index)}
        >
          <TabList>
            <Tab>Deposit {pair.asset.symbol}</Tab>
            <Tab>Withdraw {pair.asset.symbol}</Tab>
          </TabList>
          <TabPanel>
            <KashiAction pair={pair} action="Deposit" direction="From" label="Balance" />
          </TabPanel>
          <TabPanel>
            <KashiAction pair={pair} action="Withdraw" direction="Into" label="Balance" />
          </TabPanel>
        </PrimaryTabs>
      </Layout>
    </PageWrapper>
  )
}
