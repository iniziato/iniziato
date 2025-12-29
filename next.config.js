const {join} = require("path");

const nextConfig= {
    sassOptions: {
        includePaths: [join(__dirname, "styles")],
    },
    i18n: {
        defaultLocale: "ka",
        locales: ["en", "ka"],
        localeDetection: true,
    },
};

module.exports = nextConfig;