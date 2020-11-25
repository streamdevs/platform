export const isTestEnv = () => {
	return process.env.NEXT_PUBLIC_APP_ENV === 'test';
};
