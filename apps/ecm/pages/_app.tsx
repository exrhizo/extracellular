import { AppProps } from 'next/app';
import Head from 'next/head';
// import './styles.css';
import './globals.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <>    
      <Head>
        <title>ECM</title>
      </Head>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default App;
