import { AppProps } from 'next/app';
import Head from 'next/head';
// import './styles.css';
import './globals.css';

function App({ Component, pageProps }: AppProps) {
  // console.log({vault});

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
