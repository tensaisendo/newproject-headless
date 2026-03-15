import "../../faust.config";
import React from "react";
import { useRouter } from "next/router";
import { FaustProvider } from "@faustwp/core";
import "@/styles/globals.css";
import "@/styles/index.scss";
import { AppProps } from "next/app";
import { WordPressBlocksProvider, fromThemeJson } from "@faustwp/blocks";
import blocks from "@/wp-blocks";
import { Poppins } from "next/font/google";
import SiteWrapperProvider from "@/container/SiteWrapperProvider";
import { Toaster } from "react-hot-toast";
import NextNProgress from "nextjs-progressbar";
import themeJson from "../../theme.json";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '@/lib/apolloClient';
import Head from "next/head";


const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicons/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png"/>
        <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png"/>
      </Head>

      <GoogleAnalytics trackPageViews />
      <ApolloProvider client={apolloClient}>
        <FaustProvider pageProps={pageProps}>
          <WordPressBlocksProvider
            config={{
              blocks,
              theme: fromThemeJson(themeJson),
            }}
          >
            <SiteWrapperProvider {...pageProps}>
              <style jsx global>{`
                html {
                  font-family: ${poppins.style.fontFamily};
                }
              `}</style>
              <NextNProgress color="#818cf8" />
              <Component {...pageProps} key={router.asPath} />
              <Toaster
                position="bottom-left"
                toastOptions={{
                  style: {
                    fontSize: "14px",
                    borderRadius: "0.75rem",
                  },
                }}
                containerClassName="text-sm"
              />
            </SiteWrapperProvider>
          </WordPressBlocksProvider>
        </FaustProvider>
      </ApolloProvider>
    </>
  );
}
