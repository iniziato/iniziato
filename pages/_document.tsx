import Document, { Head, Html, Main, NextScript } from 'next/document';
class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <title>Pilates by Keti Kobakhidze</title>
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
