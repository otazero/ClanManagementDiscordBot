/**
 * Win10用(chromium使ってます)
 */
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

module.exports = {
    option :{
        headless: false
    },
    remodelingPuppeteer(puppeteer){
        puppeteer.use(StealthPlugin());
    }
}