import { Center, Stack, Text } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from 'reactfire';

import { Layout } from '../components/Layout';

export default function Home() {
	const user = useUser();
	const router = useRouter();

	useEffect(() => {
		if (user) {
			router.push('/');
		}
	}, [user]);

	return (
		<Layout>
			<Head>
				<title>Login | streamdevs.app</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Center minH="100vh">
				<Stack spacing={3}>
					<Text align="center">We're in a closed beta</Text>
				</Stack>
			</Center>
		</Layout>
	);
}
