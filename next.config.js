const {join} = require("path");

const nextConfig= {
    sassOptions: {
        includePaths: [join(__dirname, "styles")],
    },
    i18n: {
        defaultLocale: "ka",
        locales: ["ka"],
        localeDetection: true,
    },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    { key: "X-Frame-Options", value: "DENY" },
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    { key: "X-XSS-Protection", value: "1; mode=block" },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
