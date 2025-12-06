module.exports = {
    presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
    plugins: [
        // Only run LocatorJS in development mode
        process.env.NODE_ENV === 'development' && '@locator/babel-jsx/dist',
    ].filter(Boolean),
};