import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
	public render() {
		return (
			<Html>
				<Head>
					<link rel="icon" href="/favicon.ico" />
					<link href="https://unpkg.com/nes.css@latest/css/nes.min.css" rel="stylesheet" />
					<link
						href="https://fonts.googleapis.com/css?family=Press+Start+2P&display=swap"
						rel="stylesheet"
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
