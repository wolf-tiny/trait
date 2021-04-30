import React, { useContext, useState } from 'react'
import { Helmet } from 'react-helmet'
import { ThemeContext } from 'styled-components'
import { shortenAddress } from '../../utils'
import TransactionHistory from './TransactionHistory'
import LiquidityPositions from './LiquidityPositions'
import { ChevronLeft, User, Copy, ExternalLink } from 'react-feather'

const mock = {
    transactions: [
        'Swap 0.1234 ETH for 32.1245 SUSHI',
        'Swap 0.1235 ETH for 32.1245 SUSHI',
        'Swap 0.1236 ETH for 32.1245 SUSHI',
        'Swap 0.1237 ETH for 32.1245 SUSHI'
    ],
    liquidity: [
        'Add 0.05 WBTC & 0.05 DIGG Liquidity',
        'Add 0.06 WBTC & 0.05 DIGG Liquidity',
        'Add 0.07 WBTC & 0.05 DIGG Liquidity',
        'Add 0.08 WBTC & 0.05 DIGG Liquidity'
    ]
}

export default function Transactions() {
    const theme = useContext(ThemeContext)
    const [showTransactions, setShowTransactions] = useState(true)

    return (
        <>
            <Helmet>
                <title>Transactions | Sushi</title>
            </Helmet>

            <div className="w-full max-w-2xl p-4 mb-5">
                <div className="flex items-center mb-3">
                    <ChevronLeft strokeWidth={2} size={18} color={theme.white} />
                    <span className="ml-1">Go Back</span>
                </div>
                <div className="text-xl font-medium text-white">Your History & Positions</div>
            </div>

            <div className="bg-dark-900 w-full max-w-2xl rounded mb-3 p-4">
                <div className="flex justify-between">
                    <div className="flex">
                        <div className="p-1.5 bg-dark-800 rounded">
                            <User strokeWidth={1} size={34} color={theme.white} />
                        </div>
                        <div className="ml-3">
                            <div className="font-semibold text-gray-300">
                                {shortenAddress('0x25E6C5A2a60c960E5b0708c9C500C89e46399E22')}
                            </div>
                            <div className="text-sm text-primary">0.01373 ETH</div>
                        </div>
                    </div>

                    <div className="text-sm text-primary font-semibold">
                        <div className="flex items-center">
                            <Copy strokeWidth={0.5} size={14} color={theme.white} />
                            <div className="ml-1">Copy Address</div>
                        </div>
                        <div className="flex items-center">
                            <ExternalLink strokeWidth={0.5} size={14} color={theme.white} />
                            <div className="ml-1">View on Explorer</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-dark-900 w-full max-w-2xl rounded p-4">
                <div className="w-auto flex justify-between items-center rounded bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto mt-3 mb-6">
                    <div
                        className={`w-3/6 p-3 text-center rounded-lg ${
                            showTransactions ? 'text-primary text-bold bg-dark-900' : 'text-secondary'
                        }`}
                        onClick={() => setShowTransactions(true)}
                    >
                        Transaction History
                    </div>
                    <div
                        className={`w-3/6 p-3 text-center rounded-lg ${
                            !showTransactions ? 'text-primary text-bold bg-dark-900' : 'text-secondary'
                        }`}
                        onClick={() => setShowTransactions(false)}
                    >
                        Liquidity Positions
                    </div>
                </div>
                {showTransactions ? (
                    <TransactionHistory transactions={mock.transactions} />
                ) : (
                    <LiquidityPositions positions={mock.liquidity} />
                )}
            </div>
        </>
    )
}
