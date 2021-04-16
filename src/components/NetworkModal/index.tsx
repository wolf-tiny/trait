import { ChainId } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'hooks'
import React from 'react'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useNetworkModalToggle } from '../../state/application/hooks'
import { NETWORK_ICON, NETWORK_LABEL } from '../../constants/networks'
import Modal from '../Modal'

const PARAMS: {
    [chainId in ChainId]?: {
        chainId: string
        chainName: string
        nativeCurrency: {
            name: string
            symbol: string
            decimals: string
        }
        rpcUrls: string[]
        blockExplorerUrls: string[]
    }
} = {
    [ChainId.FANTOM]: {
        chainId: '0xfa',
        chainName: 'Fantom',
        nativeCurrency: {
            name: 'Fantom',
            symbol: 'FTM',
            decimals: '18'
        },
        rpcUrls: ['https://rpcapi.fantom.network'],
        blockExplorerUrls: ['https://ftmscan.com']
    },
    [ChainId.BSC]: {
        chainId: '0x38',
        chainName: 'Binance Smart Chain',
        nativeCurrency: {
            name: 'Binance Coin',
            symbol: 'BNB',
            decimals: '18'
        },
        rpcUrls: ['https://bsc-dataseed.binance.org'],
        blockExplorerUrls: ['https://bscscan.com']
    },
    [ChainId.MATIC]: {
        chainId: '0x89',
        chainName: 'Matic',
        nativeCurrency: {
            name: 'Matic',
            symbol: 'MATIC',
            decimals: '18'
        },
        rpcUrls: ['https://rpc-mainnet.maticvigil.com'],
        blockExplorerUrls: ['https://explorer-mainnet.maticvigil.com']
    },
    [ChainId.HECO]: {
        chainId: '0x80',
        chainName: 'Heco',
        nativeCurrency: {
            name: 'Heco Token',
            symbol: 'HT',
            decimals: '18'
        },
        rpcUrls: ['https://http-mainnet.hecochain.com'],
        blockExplorerUrls: ['https://hecoinfo.com']
    }
}

export default function NetworkModal(): JSX.Element | null {
    const { chainId, library, account } = useActiveWeb3React()
    const networkModalOpen = useModalOpen(ApplicationModal.NETWORK)
    const toggleNetworkModal = useNetworkModalToggle()

    if (!chainId) return null

    return (
        <Modal isOpen={networkModalOpen} onDismiss={toggleNetworkModal}>
            <div className="text-2xl font-bold mb-3 text-high-emphesis">Select a Network</div>

            <div className="text-lg text-primary mb-6">
                You are currently browsing <span className="font-bold text-pink">SUSHI</span>
                <br /> on the <span className="font-bold text-blue">{NETWORK_LABEL[chainId]}</span> network
            </div>

            <div className="flex flex-col space-y-5 overflow-y-auto">
                {[
                    ChainId.MAINNET,
                    ChainId.FANTOM,
                    ChainId.BSC,
                    ChainId.MATIC,
                    ChainId.HECO,
                    ChainId.XDAI,
                    ChainId.HARMONY
                ].map((key: ChainId, i: number) => {
                    if (chainId === key) {
                        return (
                            <div className="bg-gradient-to-r from-blue to-pink w-full rounded p-px">
                                <div className="flex items-center h-full w-full bg-dark-1000 rounded p-3">
                                    <img
                                        src={NETWORK_ICON[key]}
                                        alt="Switch Network"
                                        className="rounded-md mr-3 w-8 h-8"
                                    />
                                    <div className="text-primary font-bold">{NETWORK_LABEL[key]}</div>
                                </div>
                            </div>
                        )
                    }
                    return (
                        <div
                            key={i}
                            onClick={() => {
                                toggleNetworkModal()
                                const params = PARAMS[key]
                                library?.send('wallet_addEthereumChain', [params, account])
                            }}
                            className="flex items-center bg-dark-800 hover:bg-dark-700 w-full rounded p-3 cursor-pointer"
                        >
                            <img src={NETWORK_ICON[key]} alt="Switch Network" className="rounded-md mr-2 w-8 h-8" />
                            <div className="text-primary font-bold">{NETWORK_LABEL[key]}</div>
                        </div>
                    )
                })}
            </div>
        </Modal>
    )
}
