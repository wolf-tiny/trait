import React, { useState, useCallback } from 'react'
import useTheme from '../../../hooks/useTheme'
import { TYPE } from '../../../theme'
import { RowBetween } from '../../../components/Row'
import { Input as NumericalInput } from '../../../components/NumericalInput'
import { Dots } from '../../Pool/styleds'
import { useActiveWeb3React } from '../../../hooks'
import { useBentoBoxContract } from '../../../sushi-hooks/useContract'
import { ApprovalState, useApproveCallback } from '../../../sushi-hooks/useApproveCallback'
import useKashiBalances from '../../../sushi-hooks/queries/useKashiBalances'
import useKashi from '../../../sushi-hooks/useKashi'
import { formatFromBalance, formatToBalance } from '../../../utils'

import {
  InputRow,
  ButtonSelect,
  LabelRow,
  Aligner,
  InputPanel,
  Container,
  StyledButtonName,
  StyledSwitch,
  StyledBalanceMax
} from '../styled'

interface WithdrawInputPanelProps {
  id: string
  label?: string
  tokenAddress: string
  tokenSymbol?: string
  pairAddress: string
}

export default function WithdrawInputPanel({
  id,
  label = '',
  tokenAddress,
  tokenSymbol,
  pairAddress
}: WithdrawInputPanelProps) {
  const [balanceFrom, setBalanceFrom] = useState<any>('bento')

  const kashiBalances = useKashiBalances(pairAddress)

  const assetBalance = kashiBalances?.asset

  const { account } = useActiveWeb3React()
  const theme = useTheme()

  const { removeAsset, removeWithdrawAsset } = useKashi()

  //const tokenBalanceBigInt = useTokenBalance(tokenAddress)
  const tokenBalance = formatFromBalance(assetBalance?.value, assetBalance?.decimals)
  const decimals = assetBalance?.decimals

  // check whether the user has approved BentoBox on the token
  const bentoBoxContract = useBentoBoxContract()
  const [approvalA, approveACallback] = useApproveCallback(tokenAddress, bentoBoxContract?.address)

  // track and parse user input for Deposit Input
  const [depositValue, setDepositValue] = useState('')
  const [maxSelected, setMaxSelected] = useState(false)
  const onUserDepositInput = useCallback((depositValue: string, max = false) => {
    setMaxSelected(max)
    setDepositValue(depositValue)
  }, [])

  // disable buttons if pendingTx, todo: styles could be improved
  const [pendingTx, setPendingTx] = useState(false)
  // used for max input button
  const maxDepositAmountInput = assetBalance
  //const atMaxDepositAmount = true
  const handleMaxDeposit = useCallback(() => {
    maxDepositAmountInput && onUserDepositInput(assetBalance?.value, true)
  }, [maxDepositAmountInput, onUserDepositInput, assetBalance])

  console.log('state:', depositValue, maxSelected)

  return (
    <>
      <InputPanel id={id}>
        <Container cornerRadiusTopNone={true} cornerRadiusBottomNone={false}>
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                Withdraw <span className="font-semibold">{tokenSymbol}</span> to{' '}
                <span>
                  {balanceFrom === 'bento' ? (
                    <StyledSwitch onClick={() => setBalanceFrom('wallet')}>Bento</StyledSwitch>
                  ) : (
                    balanceFrom === 'wallet' && (
                      <StyledSwitch onClick={() => setBalanceFrom('bento')}>Wallet</StyledSwitch>
                    )
                  )}
                </span>
              </TYPE.body>
              {account && (
                <TYPE.body
                  onClick={handleMaxDeposit}
                  color={theme.text2}
                  fontWeight={500}
                  fontSize={14}
                  style={{ display: 'inline', cursor: 'pointer' }}
                >
                  Supplied: {tokenBalance} {tokenSymbol}
                </TYPE.body>
              )}
            </RowBetween>
          </LabelRow>
          <InputRow>
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
            {(approvalA === ApprovalState.NOT_APPROVED || approvalA === ApprovalState.PENDING) && (
              <ButtonSelect disabled={approvalA === ApprovalState.PENDING} onClick={approveACallback}>
                <Aligner>
                  <StyledButtonName>
                    {approvalA === ApprovalState.PENDING ? <Dots>Approving </Dots> : 'Approve'}
                  </StyledButtonName>
                </Aligner>
              </ButtonSelect>
            )}
            {approvalA === ApprovalState.APPROVED && (
              <ButtonSelect
                disabled={
                  pendingTx ||
                  !tokenBalance ||
                  Number(depositValue) === 0 ||
                  // todo this should be a bigInt comparison
                  Number(depositValue) > Number(tokenBalance)
                }
                onClick={async () => {
                  setPendingTx(true)
                  if (balanceFrom === 'wallet') {
                    if (maxSelected) {
                      await removeWithdrawAsset(pairAddress, tokenAddress, maxDepositAmountInput, true)
                    } else {
                      await removeWithdrawAsset(
                        pairAddress,
                        tokenAddress,
                        formatToBalance(depositValue, decimals),
                        false
                      )
                    }
                  } else if (balanceFrom === 'bento') {
                    if (maxSelected) {
                      await removeAsset(pairAddress, tokenAddress, maxDepositAmountInput, true)
                    } else {
                      await removeAsset(pairAddress, tokenAddress, formatToBalance(depositValue, decimals), false)
                    }
                  }
                  setPendingTx(false)
                }}
              >
                <Aligner>
                  <StyledButtonName>Withdraw</StyledButtonName>
                </Aligner>
              </ButtonSelect>
            )}
          </InputRow>
        </Container>
      </InputPanel>
    </>
  )
}
