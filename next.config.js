// We update the config following: https://github.com/FirebaseExtended/reactfire/issues/234
module.exports = {
	reactStrictMode: true,

	experimental: {
		reactMode: 'concurrent', // or you can make it blocking
	},
};
