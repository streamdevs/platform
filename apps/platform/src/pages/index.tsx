import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from 'ui';

export default function Home() {
	const { data: session } = useSession();

	if (!session) {
		return (
			<>
				Not signed in <br />
				<Button onClick={() => signIn()}>Sign in</Button>
			</>
		);
	}

	return (
		<>
			Signed in as {session.user.email} <br />
			<Button onClick={() => signOut()}>Sign out</Button>
		</>
	);
}
