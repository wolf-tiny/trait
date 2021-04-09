import { useCallback, useEffect, useState } from 'react'

import { exchange, masterchef } from 'sushi-hooks/apollo/client'
import { getAverageBlockTime } from 'sushi-hooks/apollo/getAverageBlockTime'
import { liquidityPositionSubsetQuery, pairSubsetQuery, poolsQuery } from 'sushi-hooks/apollo/queries'

import sushiData from '@sushiswap/sushi-data'
import _ from 'lodash'

import { POOL_DENY } from '../constants'

// Todo: Rewrite in terms of web3 as opposed to subgraph
const useFarms = () => {
  const [farms, setFarms] = useState<any | undefined>()

  const fetchAllFarms = useCallback(async () => {
    const results = await Promise.all([
      masterchef.query({
        query: poolsQuery
      }),
      exchange.query({
        query: liquidityPositionSubsetQuery,
        variables: { user: '0xc2edad668740f1aa35e4d8f227fb8e17dca888cd' }
      }),
      getAverageBlockTime(),
      sushiData.sushi.priceUSD()
    ])
    const pools = results[0]?.data.pools
    const pairAddresses = pools
      .map((pool: any) => {
        return pool.pair
      })
      .sort()
    const pairsQuery = await exchange.query({
      query: pairSubsetQuery,
      variables: { pairAddresses }
    })

    const liquidityPositions = results[1]?.data.liquidityPositions
    const pairs = pairsQuery?.data.pairs
    const averageBlockTime = results[2]
    const sushiPrice = results[3]

    const farms = pools
      .filter((pool: any) => {
        return !POOL_DENY.includes(pool.id) && pairs.find((pair: any) => pair?.id === pool.pair)
      })
      .map((pool: any) => {
        const pair = pairs.find((pair: any) => pair.id === pool.pair)
        const liquidityPosition = liquidityPositions.find(
          (liquidityPosition: any) => liquidityPosition.pair.id === pair.id
        )
        const blocksPerHour = 3600 / averageBlockTime
        const balance = Number(pool.balance / 1e18) > 0 ? Number(pool.balance / 1e18) : 0.1
        const totalSupply = pair.totalSupply > 0 ? pair.totalSupply : 0.1
        const reserveUSD = pair.reserveUSD > 0 ? pair.reserveUSD : 0.1
        const balanceUSD = (balance / Number(totalSupply)) * Number(reserveUSD)
        const rewardPerBlock = ((pool.allocPoint / pool.owner.totalAllocPoint) * pool.owner.sushiPerBlock) / 1e18
        const roiPerBlock = (rewardPerBlock * sushiPrice) / balanceUSD
        const roiPerHour = roiPerBlock * blocksPerHour
        const roiPerDay = roiPerHour * 24
        const roiPerMonth = roiPerDay * 30
        const roiPerYear = roiPerMonth * 12

        return {
          ...pool,
          symbol: pair.token0.symbol + '-' + pair.token1.symbol,
          name: pair.token0.name + ' ' + pair.token1.name,
          pid: Number(pool.id),
          pairAddress: pair.id,
          slpBalance: pool.balance,
          liquidityPair: pair,
          roiPerBlock,
          roiPerHour,
          roiPerDay,
          roiPerMonth,
          roiPerYear,
          rewardPerThousand: 1 * roiPerDay * (1000 / sushiPrice),
          tvl: liquidityPosition?.liquidityTokenBalance
            ? (pair.reserveUSD / pair.totalSupply) * liquidityPosition.liquidityTokenBalance
            : 0.1
        }
      })

    //console.log('farms:', farms)
    const sorted = _.orderBy(farms, ['pid'], ['desc'])
    setFarms(sorted)
  }, [])

  useEffect(() => {
    fetchAllFarms()
  }, [fetchAllFarms])

  return farms
}

export default useFarms
