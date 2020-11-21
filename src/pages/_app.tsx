import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Head from 'next/head';
import { Suspense } from 'react';
import { FirebaseAppProvider } from 'reactfire';

import firebaseConfig from '../../config/firebase.json';

const config = {
	useSystemColorMode: true,
};

const customTheme = extendTheme({ config });

export default function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<title>streamdevs.app</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<ChakraProvider theme={customTheme}>
				<FirebaseAppProvider firebaseConfig={firebaseConfig}>
					<Suspense fallback="loading">
						<Component {...pageProps} />
					</Suspense>
				</FirebaseAppProvider>
			</ChakraProvider>
		</>
	);
}
