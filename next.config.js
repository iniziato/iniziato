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
};

module.exports = nextConfig;