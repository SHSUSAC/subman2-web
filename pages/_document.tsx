import React from "react";
import crypto from "crypto"
import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import { store } from "react-context-hook";

const cspHashOf = (text: string) => {
	const hash = crypto.createHash("sha256")
	hash.update(text)
	return `'sha256-${hash.digest("base64")}'`
}

export default class MyDocument extends Document {
	render() {
		// let csp = `default-src 'self'; require-trusted-types-for 'script'; base-uri 'self'; object-src 'none'; script-src 'self' 'strict-dynamic' ${cspHashOf(
		// 		NextScript.getInlineScriptSource(this.props)
		// )};`
		// if (process.env.NODE_ENV !== 'production') {
		// 	csp = " report-uri 'http://localhost/report';"
		// }
		// if (process.env.NODE_ENV !== 'production') {
		// 	csp = `default-src 'self' 'unsafe-inline'; base-uri 'self'; object-src 'none'; script-src 'self' 'strict-dynamic' 'unsafe-eval' ${cspHashOf(
		// 			NextScript.getInlineScriptSource(this.props)
		// 	)}`
		// }
		// noinspection HtmlRequiredTitleElement - Handled by child pages
		return (
				<Html lang="en">
					<Head>
						{/*<meta httpEquiv="Content-Security-Policy" content={csp} />*/}
						<link
								href="https://fonts.googleapis.com/css2?family=Cairo&display=optional"
								rel="stylesheet"
						/>
						<Script
								strategy="afterInteractive"
								src="https://accounts.google.com/gsi/client"
								onLoad={() => {
									store.set("gisLoaded", true);
								}}
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