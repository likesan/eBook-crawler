module.exports = {
    millieCrawler: async function (page, inputBookName) {

        await page.goto(`https://www.millie.co.kr/v3/search/result/${inputBookName}?toapp=stop&type=all&category=1`, {waitUntil: 'networkidle2'});

        //page is working but, evaluate function doesn't involved.
        const titleSelector = `#wrap > section > div > section.search-list > div > ul > li > a > div.body > span.title`;
        const titlesProc = await page.evaluate((titleSelector) => {
            var titles = Array.from(document.querySelectorAll(titleSelector));
            var returnTitles = titles
                .map(title => title.textContent)
                .slice(0, 9);

            return returnTitles;
        }, titleSelector)

        const writerProc = await page.evaluate(() => {
            var writers = Array.from(document.querySelectorAll("#wrap > section > div > section.search-list > div > ul > li> a > div.body > div " +
                    "> span"));
            var returnWriters = writers
                .map(writer => writer.textContent.substr(0, 15))
                .slice(0, 9);

            return returnWriters;
        },)

        const urlProc = await page.evaluate(() => {
            var urls = Array.from(document.querySelectorAll(`#wrap > section > div > section.search-list > div > ul > li > a`));
            var returnUrls = urls
                .map(url => url.href)
                .slice(0, 9);

            return returnUrls;
        },)

        const imgProc = await page.evaluate(() => {
            var imgs = Array.from(document.querySelectorAll(`#wrap > section > div > section.search-list > div > ul > li > a > div.image.book-icon > div > img`));
            var returnImgs = imgs
                .map(img => img.src)
                .slice(0, 9);

            return returnImgs;
        },)

        // proc to put all info into an array
        console.log(`[Milie ] put into Array!`)
        const millieBookInfo = [];
        for (var i = 0; i < titlesProc.length; i++) {

            millieBookInfo[i] = {
                title: titlesProc[i],
                writer: writerProc[i],
                url: urlProc[i],
                img: imgProc[i]
            }

        }

        console.log(`[Millie] ${millieBookInfo}`);

        return millieBookInfo;

    },
    ridiCrawler: async function (page, inputBookName) {
        page.on('console', msg => {
            for (let i = 0; i < msg._args.length; ++i) 
                console.log(`${i}: ${msg._args[i]}`);
            }
        );

        await page.goto(`https://select.ridibooks.com/search?q=${inputBookName}&type=Books`);

        const titleSelector = `#app > main > ul > li > div > div > a > h3`;
        const titlesProc = await page.evaluate((titleSelector) => {
            var titles = Array.from(document.querySelectorAll(titleSelector));

            var resultTitleProc = titles
                .map(title => title.textContent)
                .slice(0, 9); // 3 > 9

            console.log(`[resultTitleProc]${resultTitleProc}`);
            return resultTitleProc;
        }, titleSelector)

        const writerProc = await page.evaluate(() => {
            var writers = Array.from(document.querySelectorAll(`#app > main > ul > li > div > div > a > span.SearchResultBookList_Authors`));
            var writerProcResult = writers
                .map(writer => writer.textContent)
                .slice(0, 9);

            console.log(`[writerProcResult] ${writerProcResult}`)

            return writerProcResult;
        },)

        const publisherProc = await page.evaluate(() => {
            var publishers = Array.from(document.querySelectorAll(`#app > main > ul > li > div > div > a > span.SearchResultBookList_Publisher`));
            var resultPublisherProc = publishers
                .map(publisher => publisher.textContent)
                .slice(0, 9);
            console.log(`[resultPublisherProc] ${resultPublisherProc}`);

            return resultPublisherProc;
        },)

        const imgSelector = `#app > main > ul > li > div > div > div > a > div > img`;
        const imgProc = await page.evaluate(async(imgSelector) => {
            await new Promise((resolve, reject) => {
                var totalHeight = 0;
                var distance = 100;
                var timer = setInterval(() => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 35);
            })

            var imgs = Array.from(document.querySelectorAll(imgSelector));
            var resultImgProc = imgs
                .map(img => img.src)
                .slice(0, 9);
            console.log(`[resultImgProc] ${resultImgProc}`);

            return resultImgProc;
        }, imgSelector);

        // proc to put all info into an array
        const ridiBookInfo = [];
        for (var i = 0; i < titlesProc.length; i++) {

            ridiBookInfo[i] = {
                title: titlesProc[i],
                writer: writerProc[i],
                publisher: publisherProc[i],
                img: imgProc[i]

            }

        }
        console.log(`[ridiBookInfo] ${ridiBookInfo}`);
        return ridiBookInfo

    },
    yesCrawler: async function (page, inputBookName) {

        await page.goto(`http://m.yes24.com/BookClub/Search?keyword=${inputBookName}`);

        const titleSelector = `#ulGoodsList > li > div > div > div > a`;
        const titlesProc = await page.evaluate((titleSelector) => {
            var titles = Array.from(document.querySelectorAll(titleSelector));
            var returnTitles = titles
                .map(title => title.textContent)
                .slice(0, 9);

            return returnTitles;
        }, titleSelector)

        const urlProc = await page.evaluate(() => {
            var urls = Array.from(document.querySelectorAll(`#ulGoodsList > li > div > p > span > a`));
            var returnUrls = urls
                .map(url => url.href)
                .slice(0, 9);

            return returnUrls;
        },)

        const imgProc = await page.evaluate(() => {
            var imgs = Array.from(document.querySelectorAll(`#ulGoodsList > li > div > p > span > a > img`));
            var returnImgs = imgs
                .map(img => img.src)
                .slice(0, 9);

            return returnImgs;
        },)

        // proc to put all info into an array
        const yesBookInfo = [];
        for (var i = 0; i < titlesProc.length; i++) {

            yesBookInfo[i] = {
                title: titlesProc[i],
                url: urlProc[i],
                img: imgProc[i]
            }

        }

        console.log(`[YES] ${yesBookInfo}`);

        return yesBookInfo;

    }
}
