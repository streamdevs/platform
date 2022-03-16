import { signOut, useSession } from 'next-auth/react';
import { Button } from 'ui';

export default function Dashboard() {
	const { data: session } = useSession();

	return (
		<>
			{session && <pre>{JSON.stringify(session?.user)}</pre>}
			<Button onClick={() => signOut()}>Sign out</Button>
		</>
	);
}
