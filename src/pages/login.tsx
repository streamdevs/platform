import { Button, Center, Stack, Text } from '@chakra-ui/react';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as firebase from 'firebase/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth, useUser } from 'reactfire';

export default function Home() {
	const auth = useAuth();
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
							auth.signInWithPopup(new firebase.auth.GithubAuthProvider());
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
