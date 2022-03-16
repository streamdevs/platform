import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import TwitchProvider from 'next-auth/providers/twitch';

export default NextAuth({
	providers: [
		TwitchProvider({
			clientId: process.env.TWITCH_CLIENT_ID,
			clientSecret: process.env.TWITCH_CLIENT_SECRET,
		}),

		...(process.env.NODE_ENV !== 'production'
			? [
					CredentialsProvider({
						name: 'offline-login',
						credentials: {
							username: { label: 'Username', type: 'text' },
							password: { label: 'Password', type: 'password' },
						},
						async authorize(credentials) {
							return {
								id: 'fake-id',
								name: credentials.username,
								email: `${credentials.username}@example.com`,
							};
						},
					}),
			  ]
			: []),
	],

	secret: process.env.NEXTAUTH_SECRET || 'patata',
	// Enable debug messages in the console if you are having problems
	debug: process.env.NODE_ENV === 'development',
});
