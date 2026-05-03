import Document, { Head, Html, Main, NextScript } from 'next/document';
class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
                    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
                    <link rel="icon" href="/images/favicon.ico" sizes="any" />
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
