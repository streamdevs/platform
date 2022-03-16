# 🚀 `platform`

This is a [NEXT.js](https://nextjs.org/) project bootstrapped with [create-next-app](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Configuration

#### 🔑 Auth

In order to use the social providers you need to add a client secret and client id in the .env The recommendation is to copy that file to a .env.local file to prevent you to push your credentials to the repo.

The structure for the env vars is always the same: [PROVIDER]_CLIENT_ID and [PROVIDER]_CLIENT_SECRET, simply substitute [PROVIDER] with the name of the provider all in capital letters.

- [Twitch Auth](https://next-auth.js.org/providers/twitch)

### 🧑‍💻 Development

First, run the development server:

```
yarn install

yarn dev
```

Open http://localhost:3000 with your browser to see the result.

