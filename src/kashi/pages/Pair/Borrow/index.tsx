import React, { useState, useCallback, useContext } from 'react'
import { ChainId, WETH } from '@sushiswap/sdk'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useActiveWeb3React } from 'hooks'
import { KashiContext, useKashiPair } from 'kashi/context'
import { getTokenIcon } from 'kashi/functions'
import { formattedNum, formattedPercent } from 'utils'
import BorrowGraphic from 'assets/kashi/borrow-graphic.png'
import { GradientDot, Button, Card, Layout, BorrowCardHeader, BackButton } from 'kashi/components'
import { BigNumber } from 'ethers'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import Borrow from './Borrow'
import Repay from './Repay'
import { KashiCooker } from 'kashi/entities'
import { useTransactionAdder } from 'state/transactions/hooks'
import QuestionHelper from 'components/QuestionHelper'

export default function BorrowPair({
    match: {
        params: { pairAddress }
    }
}: RouteComponentProps<{ pairAddress: string }>) {
    const [tabIndex, setTabIndex] = useState(0)

    const { account, library, chainId } = useActiveWeb3React()

    const pair = useKashiPair(pairAddress)
    const info = useContext(KashiContext).state.info

    const addTransaction = useTransactionAdder()
    const onUpdateExchangeRate = useCallback(async () => {
        const result = await new KashiCooker(pair, account, library, chainId)
            .updateExchangeRate()
            .cook()

        addTransaction(result.tx, {summary: `Update ${pair.collateral.symbol}/${pair.asset.symbol} exchange rate`})
    }, [pair])

    if (!pair) return info && info.blockTimeStamp.isZero() ? null : (
        <Redirect to="/bento/kashi/borrow"></Redirect>
    )    

    return (
        <Layout
            left={
                <Card
                    className="h-full bg-dark-900"
                    backgroundImage={BorrowGraphic}
                    title={'Add collateral in order to borrow assets'}
                    description={
                        'Gain exposure to tokens without reducing your assets. Leverage will enable you to take short positions against assets and earn from downside movements.'
                    }
                />
            }
            right={
                <Card className="h-full bg-dark-900">
                    <div className="flex-col space-y-2">
                        <div className="flex justify-between">
                            <div className="text-xl text-high-emphesis">Market Info</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-lg text-secondary">Available</div>
                            <div className="flex items-center">
                                <div className="text-lg text-high-emphesis">
                                    {formattedNum(pair.totalAssetAmount.string)} {pair.asset.symbol}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-lg text-secondary">Borrowed</div>
                            <div className="flex items-center">
                                <div className="text-lg text-high-emphesis">
                                    {formattedPercent(pair.utilization.string)}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-lg text-secondary">Supply APR</div>
                            <div className="flex items-center">
                                <div className="text-lg text-high-emphesis">{formattedPercent(pair.currentSupplyAPR.string)}</div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-lg text-secondary">Borrow APR</div>
                            <div className="flex items-center">
                                <div className="text-lg text-high-emphesis">{formattedPercent(pair.currentInterestPerYear.string)}</div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-lg text-secondary">Loan to Value</div>
                            <div className="text-lg text-high-emphesis">75%</div>
                        </div>
                        <div className="flex justify-between pt-3">
                            <div className="text-xl text-high-emphesis">BentoBox</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-lg text-secondary">{pair.collateral.symbol} Strategy</div>
                            <div className="text-lg text-high-emphesis">
                                None
                                <QuestionHelper text="BentoBox strategies can create yield for your collateral tokens. This token does not yet have a strategy in the BentoBox." />
                            </div>
                        </div>
                    </div>
                </Card>
            }
        >
            <Card
                className="h-full bg-dark-900"
                header={
                    <BorrowCardHeader>
                        <div className="flex items-center">
                            <BackButton className="hidden md:flex" defaultRoute="/bento/kashi/borrow" />
                            <div className="flex items-center space-x-2 mr-4">
                                <img
                                    src={pair && getTokenIcon(pair?.asset.address, chainId)}
                                    className="block w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
                                    alt=""
                                />
                                <img
                                    src={pair && getTokenIcon(pair?.collateral.address, chainId)}
                                    className="block w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
                                    alt=""
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="text-3xl text-high-emphesis">
                                        Borrow {pair.asset.symbol}
                                    </div>
                                    <div className="flex items-center">
                                        <div className="text-sm text-secondary mr-1">Collateral:</div>
                                        <div className="text-sm text-high-emphesis mr-2">
                                            {pair.collateral.symbol}
                                        </div>
                                        <div className="text-sm text-secondary mr-1">Oracle:</div>
                                        <div className="text-sm text-high-emphesis">{pair.oracle.name}</div>
                                    </div>
                                </div>
                            </div>                            
                        </div>
                    </BorrowCardHeader>
                }
            >
                <div className="flex justify-between mb-8">
                    <div>
                        <div className="text-secondary text-lg">Collateral</div>
                        <div className="text-blue text-2xl">
                            {formattedNum(pair.userCollateralAmount.string)} {pair.collateral.symbol}
                        </div>
                        <div className="text-high-emphesis text-lg">
                            {formattedNum(pair.userCollateralAmount.usd, true)}
                        </div>
                    </div>
                    <div>
                        <div className="text-secondary text-lg">Borrowed</div>
                        <div className="text-pink text-2xl">
                            {formattedNum(pair.currentUserBorrowAmount.string)} {pair.asset.symbol}
                        </div>
                        <div className="text-high-emphesis text-lg flex items-center">
                            {formattedPercent(pair.health.string)}
                            <GradientDot percent={pair.health.string}></GradientDot>
                        </div>
                    </div>
                    <div className="text-right">
                        <div>
                            <div className="text-secondary text-lg">APR</div>
                            <div className="text-high-emphesis text-2xl">
                                {formattedPercent(pair.interestPerYear.string)}
                            </div>
                        </div>
                    </div>
                </div>
                <Tabs
                    forceRenderTabPanel
                    selectedIndex={tabIndex}
                    onSelect={(index: number) => setTabIndex(index)}
                >
                    <TabList className="flex rounded bg-dark-800 p-1">
                        <Tab
                            className="flex flex-1 justify-center items-center rounded text-lg text-secondary hover:text-primary cursor-pointer focus:outline-none select-none px-3 py-4"
                            selectedClassName="bg-dark-900 text-high-emphesis"
                        >
                            Borrow
                        </Tab>
                        <Tab
                            className="flex flex-1 justify-center items-center rounded text-lg text-secondary hover:text-primary cursor-pointer focus:outline-none select-none px-3 py-4"
                            selectedClassName="bg-dark-900 text-high-emphesis"
                        >
                            Repay
                        </Tab>
                    </TabList>
                    <TabPanel>
                        <Borrow pair={pair} />
                    </TabPanel>
                    <TabPanel>
                        <Repay pair={pair} />
                    </TabPanel>
                </Tabs>
            </Card>
        </Layout>
    )
}
