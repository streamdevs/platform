import { Stack } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from 'reactfire';

import { GitHubWebhookCard } from '../components/GitHubWebhookCard';
import { Layout } from '../components/Layout';
import { TwitchConfigurationCard } from '../components/TwitchConfigurationCard';

export default function Home() {
	const user = useUser<firebase.User>();
	const router = useRouter();

	useEffect(() => {
		if (!user) {
			router.push('/login');
		}
	}, [user]);

	return (
		<>
			<Head>
				<title>Home | streamdevs.app</title>
			</Head>
			<Layout>
				<Stack spacing="4">
					<GitHubWebhookCard />
					{user && <TwitchConfigurationCard />}
				</Stack>
			</Layout>
		</>
	);
}
