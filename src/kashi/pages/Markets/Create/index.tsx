import React, { useEffect, useState } from 'react'
import DepositGraphic from 'assets/kashi/deposit-graphic.png'
import { BackButton, Button, Card, Layout, LendCardHeader, ListBox } from '../../../components'
import {
    CHAINLINK_MAPPING,
    CHAINLINK_ORACLE_ADDRESS,
    CHAINLINK_TOKENS,
    ChainlinkToken,
    KASHI_ADDRESS
} from 'kashi/constants'
import { useActiveWeb3React, useBentoBoxContract } from 'hooks'
import { ethers } from 'ethers'
import { e10 } from 'kashi/functions/math'
import { useTransactionAdder } from 'state/transactions/hooks'

const CreatePair = () => {
    const { chainId } = useActiveWeb3React()
    const bentoBoxContract = useBentoBoxContract()
    const addTransaction = useTransactionAdder()

    const tokens: ChainlinkToken[] = CHAINLINK_TOKENS[chainId || 1] || []
    const empty = { symbol: '', name: 'Select a token', address: '0', decimals: 0 }
    const [selectedAsset, setSelectedAsset] = useState(empty)
    const [selectedCollateral, setSelectedCollateral] = useState(empty)

    useEffect(() => {
        if (selectedAsset.symbol && selectedCollateral.symbol && !getOracleData(selectedAsset, selectedCollateral)) {
            setSelectedCollateral(empty)
        }
    }, [selectedAsset])

    const getOracleData = (asset: any, collateral: any) => {
        const mapping = CHAINLINK_MAPPING[chainId || 1] || {}
        for (const address in mapping) {
            mapping[address].address = address
        }

        let multiply = ethers.constants.AddressZero
        let divide = ethers.constants.AddressZero
        const multiplyMatches = Object.values(mapping).filter(
            m => m.from == asset.address && m.to == collateral.address
        )
        const oracleData = ''
        let decimals = 0
        if (multiplyMatches.length) {
            const match = multiplyMatches[0]
            multiply = match.address!
            decimals = 18 + match.decimals - match.toDecimals + match.fromDecimals
        } else {
            const divideMatches = Object.values(mapping).filter(
                m => m.from == collateral.address && m.to == asset.address
            )
            if (divideMatches.length) {
                const match = divideMatches[0]
                divide = match.address!
                decimals = 36 - match.decimals - match.toDecimals + match.fromDecimals
            } else {
                const mapFrom = Object.values(mapping).filter(m => m.from == asset.address)
                const mapTo = Object.values(mapping).filter(m => m.from == collateral.address)
                const match = mapFrom
                    .map(mfrom => ({ mfrom: mfrom, mto: mapTo.filter(mto => mfrom.to == mto.to) }))
                    .filter(path => path.mto.length)
                if (match.length) {
                    multiply = match[0].mfrom.address!
                    divide = match[0].mto[0].address!
                    decimals =
                        18 + match[0].mfrom.decimals - match[0].mto[0].decimals - collateral.decimals + asset.decimals
                } else {
                    return ''
                }
            }
        }
        return ethers.utils.defaultAbiCoder.encode(['address', 'address', 'uint256'], [multiply, divide, e10(decimals)])
    }

    const assetTokens = tokens.filter((token: any) => {
        return true
    })
    const collateralTokens = tokens.filter((token: any) => {
        return token !== selectedAsset && (!selectedAsset.symbol || getOracleData(selectedAsset, token))
    })

    const handleCreate = async () => {
        try {
            const oracleData = getOracleData(selectedAsset, selectedCollateral)
            if (!oracleData) {
                console.log('No path')
                return
            }

            const kashiData = ethers.utils.defaultAbiCoder.encode(
                ['address', 'address', 'address', 'bytes'],
                [selectedCollateral.address, selectedAsset.address, CHAINLINK_ORACLE_ADDRESS, oracleData]
            )
            addTransaction(await bentoBoxContract?.deploy(KASHI_ADDRESS, kashiData, true), {
                summary: `Add Kashi market ${selectedAsset.symbol}/${selectedCollateral.symbol} Chainlink`
            })
            setSelectedAsset(empty)
            setSelectedCollateral(empty)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <Layout
            left={
                <Card
                    className="h-full bg-dark-900"
                    backgroundImage={DepositGraphic}
                    title={'Create a new Kashi Market'}
                    description={
                        'If you want to supply to a market that is not listed yet, you can use this tool to create a new pair.'
                    }
                />
            }
        >
            <Card
                className="h-full bg-dark-900"
                header={
                    <LendCardHeader>
                        <div className="flex items-center">
                            <BackButton defaultRoute={'/bento/kashi/lend'} />
                            <div className="text-3xl text-high-emphesis">Create a Market</div>
                        </div>
                    </LendCardHeader>
                }
            >
                <div className="space-y-6">
                    <p>
                        Currently only Chainlink oracles are available. Support for more oracles, such as SushiSwap
                        on-chain time weighted average pricing (TWAP) oracles will be added later.
                    </p>
                    <ListBox
                        label={'Asset to Borrow (SHORT)'}
                        tokens={assetTokens}
                        selectedToken={selectedAsset}
                        setSelectedToken={setSelectedAsset}
                    />
                    <ListBox
                        label={'Collateral (LONG)'}
                        tokens={collateralTokens}
                        selectedToken={selectedCollateral}
                        setSelectedToken={setSelectedCollateral}
                    />
                    <Button
                        color="gradient"
                        className="w-full rounded text-base text-high-emphesis px-4 py-3"
                        onClick={() => handleCreate()}
                        disabled={selectedCollateral === empty || selectedAsset === empty}
                    >
                        Create Market
                    </Button>
                </div>
            </Card>
        </Layout>
    )
}

export default CreatePair
