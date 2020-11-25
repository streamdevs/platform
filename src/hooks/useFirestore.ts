import { useFirestore as useFirestoreFirebase } from 'reactfire';

import { isTestEnv } from '../config/env';

export const useFirestore = () => {
	const firestore = useFirestoreFirebase();

	if (isTestEnv()) {
		firestore.settings({
			host: 'localhost:8080',
			ssl: false,
		});
	}

	return firestore;
};
