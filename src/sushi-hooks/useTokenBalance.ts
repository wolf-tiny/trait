import { useCallback, useEffect, useState } from 'react'
import { Contract } from 'ethers'
import { BigNumber } from '@ethersproject/bignumber'
import { useActiveWeb3React, useContract } from 'hooks'
import ERC20_ABI from 'constants/abis/erc20.json'
import { isAddress } from 'utils'
import useTransactionStatus from './useTransactionStatus'
import { WETH } from '@sushiswap/sdk'

export interface BalanceProps {
    value: BigNumber
    decimals: number
}

function useTokenBalance(tokenAddress: string) {
    const [balance, setBalance] = useState<BalanceProps>({ value: BigNumber.from(0), decimals: 18 })
    const { account, chainId, library } = useActiveWeb3React()
    //const currentBlockNumber = useBlockNumber()
    // allows balance to update given transaction updates
    const currentTransactionStatus = useTransactionStatus()
    const addressCheckSum = isAddress(tokenAddress)
    const tokenContract = useContract(addressCheckSum ? addressCheckSum : undefined, ERC20_ABI, false)

    const getBalance = async (contract: Contract | null, owner: string | null | undefined): Promise<BalanceProps> => {
        try {
            if (account && chainId && contract?.address === WETH[chainId].address) {
                const ethBalance = await library?.getBalance(account)
                return { value: BigNumber.from(ethBalance), decimals: 18 }
            }

            const balance = await contract?.balanceOf(owner)
            const decimals = await contract?.decimals()

            return { value: BigNumber.from(balance), decimals: decimals }
            //todo: return as BigNumber as opposed toString since information will
            //return Fraction.from(BigNumber.from(balance), BigNumber.from(10).pow(decimals)).toString()
        } catch (e) {
            return { value: BigNumber.from(0), decimals: 18 }
        }
    }

    const fetchBalance = useCallback(async () => {
        const balance = await getBalance(tokenContract, account)
        setBalance(balance)
    }, [account, tokenContract])

    useEffect(() => {
        if (account && tokenContract) {
            fetchBalance()
        }
    }, [account, setBalance, currentTransactionStatus, tokenAddress, fetchBalance, tokenContract])

    return balance
}

export default useTokenBalance
