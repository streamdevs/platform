import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from 'ui';

export default function Web() {
	const { data: session } = useSession();

	if (session) {
		return (
			<>
				Signed in as {session.user.email} <br />
				<Button onClick={() => signOut()}>Sign out</Button>
			</>
		);
	}
	return (
		<>
			Not signed in <br />
			<Button onClick={() => signIn('twitch')}>Sign in</Button>
		</>
	);
}
