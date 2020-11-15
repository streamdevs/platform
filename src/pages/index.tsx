import { Button, Center, Stack, Text } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth, useUser } from 'reactfire';

export default function Home() {
	const auth = useAuth();
	const user = useUser();
	const router = useRouter();

	useEffect(() => {
		if (!user) {
			router.push('/login');
		}
	}, [user]);

	return (
		<div>
			<Head>
				<title>streamdevs.app</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Center minH="100vh">
				<Stack spacing={3}>
					<Text align="center">Super secret stuff</Text>
					<Button
						onClick={() => {
							auth.signOut();
						}}
					>
						<Text>Logout</Text>
					</Button>
				</Stack>
			</Center>
		</div>
	);
}
