import Card from '../components/Card'
import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/Layout'
import Link from 'next/link'
import React from 'react'
import Web3Status from '../components/Web3Status'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'

export default function BenotBox() {
    const { i18n } = useLingui()
    const { account } = useActiveWeb3React()
    return (
        <Layout>
            <Head>
                <title>BentoBox | Sushi</title>
                <meta
                    name="description"
                    content="BentoBox is a token vault that generates yield for liquidity providers. BentoBox creates a source of liquidity that any user can access with minimal approvals, minimal gas usage, and maximal capital efficiency."
                />
            </Head>
            <div className="absolute top-0 right-0 left-0" style={{ maxHeight: 700, zIndex: -1 }}>
                <Image
                    className="opacity-50"
                    src="/bentobox-hero.jpg"
                    alt="BentoBox Hero"
                    objectFit="contain"
                    objectPosition="top"
                    layout="responsive"
                    width="auto"
                    height="100%"
                />
            </div>
            <div className="text-center">
                <Image
                    src="/bentobox-logo.png"
                    alt="BentoBox Logo"
                    className="object-scale-down m-w-40 md:m-w-60 h-auto"
                    width="100%"
                    height="auto"
                />

                <div className="container mx-auto max-w-5xl">
                    <div className="font-bold text-3xl md:text-5xl text-high-emphesis">{i18n._(t`BentoBox Apps`)}</div>
                    <div className="font-medium text-base md:text-lg lg:text-xltext-high-emphesis mt-0 md:mt-4 mb-8 p-4">
                        {i18n._(t`BentoBox is an innovative way to use dapps gas-efficiently and gain extra yield.`)}
                    </div>
                </div>

                <div className="container mx-auto max-w-5xl">
                    <div className="grid gap-4 sm:gap-12 grid-flow-auto grid-cols-4">
                        <Card className="col-span-2 md:col-span-1 w-full bg-dark-800 hover:bg-dark-900 cursor-pointer rounded shadow-pink-glow hover:shadow-pink-glow-hovered">
                            <div className="relative w-full">
                                <Image
                                    src="/kashi-neon.png"
                                    alt="Kashi Logo"
                                    className="mb-4"
                                    objectFit="scale-down"
                                    width="100%"
                                    height="auto"
                                />
                                {account ? (
                                    <Link href="/borrow">
                                        <div className="w-full border-gradient px-4 py-2 text-center">
                                            {i18n._(t`Enter`)}
                                        </div>
                                    </Link>
                                ) : (
                                    <Web3Status />
                                )}
                            </div>
                        </Card>
                        <Card className="flex items-center justify-center col-span-2 md:col-span-1  bg-dark-800 hover:bg-dark-900 cursor-pointer shadow-blue-glow hover:shadow-blue-glow-hovered transition-colors">
                            <Image
                                src="/coming-soon.png"
                                alt="Coming Soon"
                                className="mb-4"
                                objectFit="scale-down"
                                width="100%"
                                height="auto"
                            />
                        </Card>
                        <Card className="flex items-center justify-center col-span-2 md:col-span-1 bg-dark-800 hover:bg-dark-900 cursor-pointer shadow-pink-glow hover:shadow-pink-glow-hovered transition-colors">
                            <Image
                                src="/coming-soon.png"
                                alt="Coming Soon"
                                className="mb-4"
                                objectFit="scale-down"
                                width="100%"
                                height="auto"
                            />
                        </Card>
                        <Card className="flex items-center justify-center col-span-2 md:col-span-1 bg-dark-800 hover:bg-dark-900 cursor-pointer shadow-blue-glow hover:shadow-blue-glow-hovered transition-colors">
                            <Image
                                src="/coming-soon.png"
                                alt="Coming Soon"
                                className="mb-4"
                                objectFit="scale-down"
                                width="100%"
                                height="auto"
                            />
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
