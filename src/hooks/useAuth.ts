import * as firebase from 'firebase/app';
import { useEffect } from 'react';
import { useAuth as useFirebaseAuth } from 'reactfire';

export const useAuth = () => {
	const auth = useFirebaseAuth();

	useEffect(() => {
		if (process.env.NEXT_PUBLIC_APP_ENV === 'test') {
			auth.useEmulator('http://localhost:9099/');
		}
	});

	const signInWithGitHub = () => {
		if (process.env.NEXT_PUBLIC_APP_ENV === 'test') {
			return auth.signInWithCredential(
				firebase.auth.GithubAuthProvider.credential(
					'{"sub": "abc123", "email": "test@streamdevs.app", "email_verified": true}',
				),
			);
		}

		return auth.signInWithPopup(new firebase.auth.GithubAuthProvider());
	};

	const signOut = () => {
		auth.signOut();
	};

	return { signOut, signInWithGitHub };
};
