import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'

import { RowBetween } from '../../components/Row'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { TYPE } from '../../theme'

import { AutoColumn } from '../../components/Column'
import { ButtonPrimaryNormal } from '../../components/Button'
import { Dots } from '../Pool/styleds'

import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'
import useTheme from '../../hooks/useTheme'

import { useBentoBoxContract } from '../../sushi-hooks/useContract'
import useBentoBox from 'sushi-hooks/useBentoBox'
import useTokenBalance from 'sushi-hooks/useTokenBalance'
import { formatFromBalance, formatToBalance } from '../../utils'
import { Paper } from 'kashi/components'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { Token, TokenAmount } from '@sushiswap/sdk'
import { BENTOBOX_ADDRESS } from 'kashi'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

const ButtonSelect = styled.button`
  align-items: center;
  height: 2.2rem;
  font-size: 20px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.primaryButton};
  color: ${({ theme }) => theme.white};
  border-radius: ${({ theme }) => theme.borderRadius};
  border-radius: 0 0 12px 12px;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;
  width: 100%;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.primaryButton)};
    background-color: ${({ theme }) => darken(0.05, theme.primaryButton)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.primaryButton)};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
    background-color: ${({ theme }) => darken(0.15, theme.primaryButton)};
  }
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg2};
  z-index: 1;
`

const Container = styled.div<{ hideInput: boolean; cornerRadiusTopNone?: boolean; cornerRadiusBottomNone?: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '12px')};
  border-radius: ${({ cornerRadiusTopNone }) => cornerRadiusTopNone && '0 0 12px 12px'};
  border-radius: ${({ cornerRadiusBottomNone }) => cornerRadiusBottomNone && '12px 12px 0 0'};
  /* border: 1px solid ${({ theme }) => theme.bg2}; */
  background-color: ${({ theme }) => theme.mediumDarkPurple};
`

const StyledButtonName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 auto;' : '  margin: 0 auto;')}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};
`

const StyledBalanceMax = styled.button`
  height: 28px;
  padding-right: 8px;
  padding-left: 8px;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: ${({ theme }) => theme.borderRadius};
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.primaryText1};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

interface CurrencyInputPanelProps {
  label?: string
  tokenAddress: string
  tokenSymbol?: string
  disableCurrencySelect?: boolean
  hideInput?: boolean
  id: string
  cornerRadiusBottomNone?: boolean
  cornerRadiusTopNone?: boolean
}

export default function CurrencyInputPanel({
  label = '',
  tokenAddress,
  tokenSymbol,
  disableCurrencySelect = false,
  hideInput = false,
  id,
  cornerRadiusBottomNone,
  cornerRadiusTopNone
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  const theme = useTheme()
  const bentoBoxContract = useBentoBoxContract()
  const { deposit } = useBentoBox()
  const tokenBalanceBigInt = useTokenBalance(tokenAddress)
  const tokenBalance = formatFromBalance(tokenBalanceBigInt?.value, tokenBalanceBigInt?.decimals)
  const decimals = tokenBalanceBigInt?.decimals

  const [depositValue, setDepositValue] = useState('')
  const [maxSelected, setMaxSelected] = useState(false)

  const [approvalState, approve] = useApproveCallback(
    new TokenAmount(
      new Token(chainId || 1, tokenAddress, decimals, tokenSymbol, ""), 
      depositValue.toBigNumber(decimals).toString()
    ),
    BENTOBOX_ADDRESS
  )

  // disable buttons if pendingTx, todo: styles could be improved
  const [pendingTx, setPendingTx] = useState(false)

  // track and parse user input for Deposit Input
  const onUserDepositInput = useCallback((depositValue: string, max = false) => {
    setMaxSelected(max)
    setDepositValue(depositValue)
  }, [])
  // used for max input button
  const maxDepositAmountInput = tokenBalanceBigInt
  //const atMaxDepositAmount = true
  const handleMaxDeposit = useCallback(() => {
    maxDepositAmountInput && onUserDepositInput(tokenBalance, true)
  }, [maxDepositAmountInput, onUserDepositInput, tokenBalance])

  return (
    <>
      {/* Deposit Input */}
      <InputPanel id={id}>
        <Paper className="bg-dark-900 rounded-b-none">
          {!hideInput && (
            <LabelRow>
              <RowBetween>
                <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                  {label}
                </TYPE.body>
                {account && (
                  <TYPE.body
                    onClick={handleMaxDeposit}
                    color={theme.text2}
                    fontWeight={500}
                    fontSize={14}
                    style={{ display: 'inline', cursor: 'pointer' }}
                  >
                    Wallet Balance: {tokenBalance} {tokenSymbol}
                  </TYPE.body>
                )}
              </RowBetween>
            </LabelRow>
          )}
          <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
            {!hideInput && (
              <>
                <NumericalInput
                  className="token-amount-input"
                  value={depositValue}
                  onUserInput={val => {
                    onUserDepositInput(val)
                  }}
                />
                {account && label !== 'To' && <StyledBalanceMax onClick={handleMaxDeposit}>MAX</StyledBalanceMax>}
              </>
            )}
          </InputRow>
        </Paper>
      </InputPanel>
      {(approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING) && (
        <ButtonSelect disabled={approvalState === ApprovalState.PENDING} onClick={approve}>
          <Aligner>
            <StyledButtonName>
              {approvalState === ApprovalState.PENDING ? <Dots>Approving </Dots> : 'Approve'}
            </StyledButtonName>
          </Aligner>
        </ButtonSelect>
      )}
      {approvalState === ApprovalState.APPROVED && (
        <ButtonSelect
          disabled={
            pendingTx || !tokenBalance || Number(depositValue) === 0 || Number(depositValue) > Number(tokenBalance)
          }
          onClick={async () => {
            setPendingTx(true)
            if (maxSelected) {
              await deposit(tokenAddress, maxDepositAmountInput)
            } else {
              await deposit(tokenAddress, formatToBalance(depositValue, decimals))
            }
            setPendingTx(false)
          }}
        >
          <Aligner>
            <StyledButtonName>Deposit</StyledButtonName>
          </Aligner>
        </ButtonSelect>
      )}
    </>
  )
}
