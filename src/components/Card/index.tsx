import { Box, Stack, useColorMode, useTheme } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

export const Card = ({ children }: PropsWithChildren<Props>) => {
	const theme = useTheme();
	const { colorMode } = useColorMode();

	return (
		<Box
			borderBottom={`3px solid ${theme.colors.yellow[500]}`}
			bg={colorMode === 'dark' ? theme.colors.gray[900] : theme.colors.gray[50]}
			p="1.5rem"
			borderRadius="8px"
		>
			<Stack spacing={3}>{children}</Stack>
		</Box>
	);
};
