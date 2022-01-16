import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
	render() {
		// noinspection HtmlRequiredTitleElement - Handled by child pages
		return (
			<Html lang="en">
				<Head>
					{/*<meta httpEquiv="Content-Security-Policy" content={csp} />*/}
					<link href="https://fonts.googleapis.com/css2?family=Cairo&display=optional" rel="stylesheet" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
