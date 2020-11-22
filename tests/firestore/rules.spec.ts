import * as firebase from '@firebase/rules-unit-testing';
import fs from 'fs';

describe('firestore rules', () => {
	describe('a user without authentication', () => {
		let app;

		beforeAll(() => {
			app = firebase.initializeTestApp({
				projectId: 'my-test-project',
			});

			firebase.loadFirestoreRules({
				projectId: 'my-test-project',
				rules: fs.readFileSync(__dirname + '/../../firestore.rules', 'utf8'),
			});
		});

		beforeEach(() => {
			firebase.clearFirestoreData({
				projectId: 'my-test-project',
			});
		});

		afterAll(async () => {
			await Promise.all(firebase.apps().map((app) => app.delete()));
		});

		it('rejects all the reads', async () => {
			await firebase.assertFails(
				app.firestore().collection('private').doc('super-secret-document').get(),
			);
		});

		it('rejects all the writes', async () => {
			await firebase.assertFails(
				app.firestore().collection('private').doc('super-secret-document').set({ foo: 'bar' }),
			);
		});
	});

	describe('a user with authentication', () => {
		let app;

		beforeAll(() => {
			app = firebase.initializeTestApp({
				projectId: 'my-test-project',
				auth: { uid: '1234', email: 'test@streamdevs.app' },
			});

			firebase.loadFirestoreRules({
				projectId: 'my-test-project',
				rules: fs.readFileSync(__dirname + '/../../firestore.rules', 'utf8'),
			});
		});

		beforeEach(() => {
			firebase.clearFirestoreData({
				projectId: 'my-test-project',
			});
		});

		afterAll(async () => {
			await Promise.all(firebase.apps().map((app) => app.delete()));
		});

		it('accepts reads for the user document', async () => {
			await firebase.assertSucceeds(app.firestore().doc('/users/1234').get());
		});

		it('accepts writes for the user document', async () => {
			await firebase.assertSucceeds(app.firestore().doc('/users/1234').set({ foo: 'bar' }));
		});

		it('reject reads for other user document', async () => {
			await firebase.assertFails(app.firestore().doc('/users/5678').get());
		});

		it('rejects writes for other user document', async () => {
			await firebase.assertFails(app.firestore().doc('/users/5678').set({ foo: 'bar' }));
		});
	});
});
