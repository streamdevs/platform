import NextAuth from 'next-auth';
import TwitchProvider from 'next-auth/providers/twitch';

export default NextAuth({
	providers: [
		TwitchProvider({
			clientId: process.env.TWITCH_CLIENT_ID,
			clientSecret: process.env.TWITCH_CLIENT_SECRET,
		}),
	],
	secret: process.env.AUTH_SECRET,
});
