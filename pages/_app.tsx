import { FC, ReactNode } from "react";
import type { AppProps } from "next/app";

import { appWithI18Next } from "ni18n";
import { ni18nConfig } from "@/ni18n.config";
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
    return (
        <>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    );
}

export default appWithI18Next(App, ni18nConfig);
