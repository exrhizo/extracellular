import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Pipe My DAO</title>
      </Head>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default App;