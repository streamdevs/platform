import { Button, Center, Stack, Text } from '@chakra-ui/react';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from 'reactfire';

import { useAuth } from '../hooks/useAuth';

export default function Home() {
	const { signInWithGitHub } = useAuth();
	const user = useUser();
	const router = useRouter();

	useEffect(() => {
		if (user) {
			router.push('/');
		}
	}, [user]);

	return (
		<div>
			<Head>
				<title>login | streamdevs.app</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Center minH="100vh">
				<Stack spacing={3}>
					<Text align="center">We're in a closed beta</Text>
					<Button
						onClick={() => {
							signInWithGitHub();
						}}
					>
						<Stack direction={'row'}>
							<FontAwesomeIcon icon={faGithub} />
							<Text>Login with GitHub</Text>
						</Stack>
					</Button>
				</Stack>
			</Center>
		</div>
	);
}
