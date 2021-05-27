import '../bootstrap'
import '../styles/globals.css'
import '@fontsource/dm-sans/index.css'
import 'react-tabs/style/react-tabs.css'

import LanguageProvider, { activate } from '../language'

import type { AppProps } from 'next/app'
import ApplicationUpdater from '../state/application/updater'
import Head from 'next/head'
import { KashiProvider } from '../context'
import ListsUpdater from '../state/lists/updater'
import MulticallUpdater from '../state/multicall/updater'
import { Provider } from 'react-redux'
import ReactGA from 'react-ga'
import TransactionUpdater from '../state/transactions/updater'
import UserUpdater from '../state/user/updater'
import Web3ReactManager from '../components/Web3ReactManager'
import { Web3ReactProvider } from '@web3-react/core'
import dynamic from 'next/dynamic'
import getLibrary from '../functions/getLibrary'
import store from '../state'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Web3ProviderNetwork = dynamic(() => import('../components/Web3ProviderNetwork'), { ssr: false })

if (typeof window !== 'undefined' && !!window.ethereum) {
    window.ethereum.autoRefreshOnNetworkChange = false
}

function Updaters() {
    return (
        <>
            <ListsUpdater />
            <UserUpdater />
            <ApplicationUpdater />
            <TransactionUpdater />
            <MulticallUpdater />
        </>
    )
}

const NOOP = ({ children }) => children

function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        // Activate the default locale on page load
        activate('en')
    }, [])
    const router = useRouter()

    const { pathname, query } = router

    useEffect(() => {
        ReactGA.pageview(`${pathname}${query}`)
    }, [pathname, query])

    // TODO: Refactor KashiProvider to /state/kashi to align with rest of app currently
    const isKashi = ['/lend', '/borrow', '/create', '/balances'].some((path) => router.asPath.includes(path))

    // const Layout = isKashi
    //     ? ({ children }) => (
    //           <KashiProvider>
    //               <KashiLayout>{children}</KashiLayout>
    //           </KashiProvider>
    //       )
    //     : ({ children }) => <DefaultLayout>{children}</DefaultLayout>

    const KashiDataProvider = isKashi ? KashiProvider : NOOP

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
                />
                <meta name="description" content="Description" />
                <meta name="keywords" content="Keywords" />
                <title>Sushi</title>

                <link rel="manifest" href="/manifest.json" />
                <link href="/images/favicon-16x16.png" rel="icon" type="image/png" sizes="16x16" />
                <link href="/images/favicon-32x32.png" rel="icon" type="image/png" sizes="32x32" />
                <link rel="apple-touch-icon" href="/apple-icon-192x192.png"></link>
                <meta name="theme-color" content="#F338C3" />
            </Head>
            <Web3ReactProvider getLibrary={getLibrary}>
                <Web3ProviderNetwork getLibrary={getLibrary}>
                    <LanguageProvider>
                        <Provider store={store}>
                            <Updaters />
                            <Web3ReactManager>
                                <KashiDataProvider>
                                    <Component {...pageProps} />
                                </KashiDataProvider>
                            </Web3ReactManager>
                        </Provider>
                    </LanguageProvider>
                </Web3ProviderNetwork>
            </Web3ReactProvider>
        </>
    )
}

export default MyApp
