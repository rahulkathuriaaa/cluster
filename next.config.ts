/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config: any, { isServer }: { isServer: boolean }) => {
        // Mock the missing module
        config.resolve.alias["@tailwindcss/postcss"] = require.resolve(
            "./tailwindcss-fix.js"
        );

        // Ignore the keyv dependency warning
        config.ignoreWarnings = [
            { module: /node_modules\/keyv/ },
            {
                message:
                    /Critical dependency: the request of a dependency is an expression/,
            },
        ];

        return config;
    },
};

module.exports = nextConfig;
