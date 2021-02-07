const puppeteer = require('puppeteer');
const fsLibrary = require('fs');

(async () => {
    var final = '';
    var mtgCardName = ['Card1', 'Card2'];
    var mtgURL = ['https://www.mtggoldfish.com/price/Modern+Masters+2015/Tarmogoyf', 'https://www.mtggoldfish.com/price/Kaldheim/Goldspan+Dragon'];

    let browser = await puppeteer.launch();
    let page = await browser.newPage();

    for (var i = 0; i < mtgURL.length; i++) {
        await page.goto(mtgURL[i], { waitUntil: 'networkidle2' });

        let data = await page.evaluate(() => {
            let spread = document.querySelector('table[class=price-card-statistics-table] > tbody > tr > td:nth-child(2)').innerText;
            let highestBuylist = document.querySelector('table[class=price-card-statistics-table] > tbody > tr:nth-child(2) > td:nth-child(2)').innerText;
            let weeklyChange = document.querySelector('table[class=price-card-statistics-table] + table > tbody > tr:nth-child(2) > td:nth-child(2)> span').innerText;
            return {
                spread,
                highestBuylist,
                weeklyChange
            }
        })
        var temp = JSON.stringify(data).split('"');
        final += mtgCardName[i] + ': ' + 'Spread ' + temp[3] + ' Highest-Buylist ' + temp[7] + ' Weekly-Change ' + temp[11] + '\r\n';
        console.log(final);
    }
    fsLibrary.writeFile('location of output text file', final, (error) => {
        if (error) throw err;
    })
    debugger;

    await browser.close();
})();