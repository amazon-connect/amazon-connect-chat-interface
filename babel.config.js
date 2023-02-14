module.exports = (api) => {
    const isTest = api.env('test');
    if (isTest) {
        return {
            // Used only by Jest for ESM support
            presets: ['@babel/preset-env'],
        }
    }
    return {}
}