import { FC, ReactNode, useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";

import "@/lib/i18n";
import { NextComponentType, NextPageContext } from "next";
import {Layout} from "@/components/Layout";

import '../public/styles/globals.scss'

type ComponentWithLayout = NextComponentType<NextPageContext, any, any> & {
    Layout?: FC<{ children: ReactNode }>;
};

interface AppPropsWithLayout extends AppProps {
    Component: ComponentWithLayout;
}

function App({ Component, pageProps }: AppPropsWithLayout) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <>
            <Head>
                <title>INIZIATO</title>
            </Head>
            <Layout>
                <div suppressHydrationWarning>
                    {mounted ? <Component {...pageProps} /> : null}
                </div>
            </Layout>
        </>
    );
}

export default App;
