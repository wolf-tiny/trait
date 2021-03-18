// mainnet addresses for tokens:
export const BAT = '0x0D8775F648430679A709E98d2b0Cb6250d2887EF'
export const COMP = '0xc00e94Cb662C3520282E6f5717214004A7f26888'
export const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
export const LINK = '0x514910771AF9Ca656af840dff83E8264EcF986CA'
export const UNI = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
export const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
export const WBTC = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
export const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
export const ZRX = '0xE41d2489571d322189246DaFA5ebDe1F4699F498'

const CONVERSION = {
  //ROPSTEN
  [String('0x443Fd8D5766169416aE42B8E050fE9422f628419').toLowerCase()]: BAT,
  [String('0x1Fe16De955718CFAb7A44605458AB023838C2793').toLowerCase()]: COMP,
  [String('0xc2118d4d90b274016cB7a54c03EF52E6c537D957').toLowerCase()]: DAI,
  [String('0xb19c7BFc9a7CbE4C35189d475725557A96bFb50A').toLowerCase()]: LINK,
  [String('0x71d82Eb6A5051CfF99582F4CDf2aE9cD402A4882').toLowerCase()]: UNI,
  [String('0x0D9C8723B343A8368BebE0B5E89273fF8D712e3C').toLowerCase()]: USDC,
  [String('0xBde8bB00A7eF67007A96945B3a3621177B615C44').toLowerCase()]: WBTC,
  [String('0xc778417E063141139Fce010982780140Aa0cD5Ab').toLowerCase()]: WETH,
  [String('0xE4C6182EA459E63B8F1be7c428381994CcC2D49c').toLowerCase()]: ZRX
}

const getMainnetAddress = (address: string) => {
  const MAINNET_ADDRESS = CONVERSION[address?.toLowerCase()]
  if (!MAINNET_ADDRESS) {
    return address?.toLowerCase()
  } else {
    return MAINNET_ADDRESS?.toLowerCase()
  }
}

export default getMainnetAddress
