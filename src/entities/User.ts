export interface User {
	streamLabs?: {
		accessToken?: string;
	};

	twitch?: {
		token?: string;
		channel?: string;
		bot?: string;
	};
}
