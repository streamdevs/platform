import {
	Box,
	Button,
	Container,
	Heading,
	Image,
	Stack,
	Text,
	useColorMode,
	useTheme,
} from '@chakra-ui/react';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PropsWithChildren } from 'react';
import { useUser } from 'reactfire';

import { useAuth } from '../../hooks/useAuth';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

export const Layout = ({ children }: PropsWithChildren<Props>) => {
	const { signInWithGitHub, signOut } = useAuth();
	const { colorMode, toggleColorMode } = useColorMode();
	const user = useUser();
	const theme = useTheme();

	return (
		<>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				w="100%"
				p={4}
				backgroundColor={colorMode === 'light' ? theme.colors.white : theme.colors.gray[700]}
				borderBottom={`5px solid ${theme.colors.yellow[500]}`}
			>
				<Box display="flex" alignItems="center">
					<Image height="32px" src="/favicon.ico" />
					<Heading as="h1" size="md" marginLeft="8px">
						streamdevs.app
					</Heading>
				</Box>
				<Stack display="flex" alignItems="center" direction="row">
					<Button
						display={{ base: 'none', md: 'inherit' }}
						onClick={() => {
							toggleColorMode();
						}}
					>
						{colorMode === 'light' ? (
							<FontAwesomeIcon icon={faMoon} />
						) : (
							<FontAwesomeIcon icon={faSun} />
						)}
					</Button>
					{!user && (
						<Button
							onClick={() => {
								signInWithGitHub();
							}}
						>
							<Stack direction={'row'}>
								<FontAwesomeIcon icon={faGithub} />
								<Text display={{ base: 'none', md: 'inherit' }}>Login with GitHub</Text>
								<Text display={{ base: 'inherit', md: 'none' }}>Login</Text>
							</Stack>
						</Button>
					)}
					{user && (
						<Button
							onClick={() => {
								signOut();
							}}
						>
							<Text>Logout</Text>
						</Button>
					)}
				</Stack>
			</Box>
			<Container mt={theme.space[4]}>{children}</Container>
		</>
	);
};
