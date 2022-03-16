import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>streamdevs.app</title>
			</Head>
			<Component {...pageProps} />
		</>
	);
}
