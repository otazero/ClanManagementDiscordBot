const StealthPlugin = require('puppeteer-extra-plugin-stealth');

module.exports = {
    option :{
        headless: false
    },
    remodelingPuppeteer(puppeteer){
        puppeteer.use(StealthPlugin());
    }
}