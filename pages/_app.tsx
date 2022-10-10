import { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"
import { useEffect } from "react"
import Head from "next/head"
import "bootstrap/dist/css/bootstrap.min.css"
import "@styles/globals.css"

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap")
  }, [])
  return (
    <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
    </>
  );
};

export default App;
