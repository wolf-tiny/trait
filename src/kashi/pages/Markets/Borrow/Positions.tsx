import React from 'react'
import { Link } from 'react-router-dom'
import getTokenIcon from 'kashi/functions/getTokenIcon'
import { formattedPercent, formattedNum } from 'utils'
import { GradientDot } from '../../../components'
import { useActiveWeb3React } from 'hooks'

// TODO: Use table component
function Positions({ pairs }: any): JSX.Element | null {
    const { chainId } = useActiveWeb3React()
    return (
        <div>
            <div className="grid gap-4 grid-cols-4 md:grid-cols-6 lg:grid-cols-7 pb-4 px-4 text-sm  text-secondary">
                <div className="hover:text-secondary col-span-1 md:col-span-2 lg:col-span-3">
                    <span className="hidden md:inline-block">Your</span> Positions
                </div>
                <div className="text-left hover:text-secondary">Borrowed</div>
                <div className="hidden md:block text-right hover:text-secondary">Collateral</div>
                <div className="text-right hover:text-secondary">
                    Limit <span className="hidden md:inline-block">Used</span>
                </div>
                <div className="text-right hover:text-secondary">APR</div>
            </div>
            <div className="flex-col space-y-2">
                {pairs.map((pair: any) => {
                    return (
                        <div key={pair.address}>
                            <Link to={'/bento/kashi/borrow/' + pair.address} className="block text-high-emphesis">
                                <div className="grid gap-4 grid-cols-4 md:grid-cols-6 lg:grid-cols-7 py-4 px-4 items-center align-center  text-sm  rounded bg-dark-800 hover:bg-dark-pink">
                                    <div className="hidden space-x-2 md:flex">
                                        <img
                                            src={getTokenIcon(pair.asset.address, chainId)}
                                            className="block w-5 h-5 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg"
                                            alt=""
                                        />
                                        <img
                                            src={getTokenIcon(pair.collateral.address, chainId)}
                                            className="block w-5 h-5 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg"
                                            alt=""
                                        />
                                    </div>
                                    <div className="sm:block md:col-span-1 lg:col-span-2">
                                        <div>
                                            <strong>{pair.asset.symbol}</strong> / {pair.collateral.symbol}
                                        </div>
                                        <div>{pair.oracle.name}</div>
                                    </div>
                                    <div className="text-left">
                                        <div>{formattedNum(pair.currentUserBorrowAmount.string, false)}</div>
                                        <div>{pair.asset.symbol}</div>
                                        <div className="text-secondary text-sm">
                                            {formattedNum(pair.currentUserBorrowAmount.usd, true)}
                                        </div>
                                    </div>
                                    <div className="hidden md:block text-right">
                                        <div>{formattedNum(pair.userCollateralAmount.string, false)}</div>
                                        <div>{pair.collateral.symbol}</div>
                                        <div className="text-secondary text-sm">
                                            {formattedNum(pair.userCollateralAmount.usd, true)}
                                        </div>
                                    </div>
                                    <div className="flex justify-end items-center">
                                        {formattedPercent(pair.health.string)}
                                        <GradientDot percent={pair.health.string} />
                                    </div>
                                    <div className="text-right">{formattedPercent(pair.interestPerYear.string)}</div>
                                </div>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Positions
