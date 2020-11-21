import {
	Button,
	Heading,
	Input,
	InputGroup,
	InputRightElement,
	Stack,
	useClipboard,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useUser } from 'reactfire';

import { Card } from '../Card';

export const GitHubWebhookCard = () => {
	const user = useUser<firebase.User>();
	const [show, setShow] = useState(false);
	const [url, setUrl] = useState('');
	const { hasCopied, onCopy } = useClipboard(url);

	useEffect(() => {
		setUrl(`${location.protocol}//${location.host}/api/webhook/github?token=${user?.uid}`);
	}, [user]);

	return (
		<Card>
			<Heading as="h2" size="md">
				GitHub webhook URL:
			</Heading>
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
		</Card>
	);
};
