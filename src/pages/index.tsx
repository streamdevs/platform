import {
	Button,
	Center,
	Input,
	InputGroup,
	InputRightElement,
	Stack,
	Text,
	useClipboard,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUser } from 'reactfire';

import { useAuth } from '../hooks/useAuth';

export default function Home() {
	const { signOut } = useAuth();
	const user = useUser<firebase.User>();
	const router = useRouter();
	const [show, setShow] = useState(false);
	const [url, setUrl] = useState('');
	const { hasCopied, onCopy } = useClipboard(url);

	useEffect(() => {
		setUrl(`${location.protocol}//${location.host}/api/webhook/github?token=${user?.uid}`);

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
			<Center minH="100vh" display="flex">
				<Stack spacing={3}>
					<Text>GitHub webhook URL:</Text>
					<InputGroup>
						<Input pr="8rem" type={show ? 'text' : 'password'} defaultValue={url} />
						<InputRightElement width="8rem">
							<Stack spacing={1} direction="row" justify="right">
								<Button h="1.75rem" width="3rem" size="sm" onClick={onCopy}>
									{hasCopied ? 'Copied' : 'Copy'}
								</Button>
								<Button h="1.75rem" width="3rem" size="sm" onClick={() => setShow((show) => !show)}>
									{show ? 'Hide' : 'Show'}
								</Button>
							</Stack>
						</InputRightElement>
					</InputGroup>
					<Button
						onClick={() => {
							signOut();
						}}
					>
						<Text>Logout</Text>
					</Button>
				</Stack>
			</Center>
		</div>
	);
}
