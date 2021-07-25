const puppeteer = require('puppeteer');
const path = require('path');
const hs = require('hs-test-web');
const react = require("hs-test-web-server");

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function stageTest() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args:['--start-maximized', '--disable-infobar'],
        ignoreDefaultArgs: ['--enable-automation'],
    });

    const page = await browser.newPage();
    await page.goto('http://localhost:31328');

    page.on('console', msg => console.log(msg.text()));

    let result = await hs.testPage(page,
        () => {
            const monthData = [
                { name: 'January', dayCount: 31 },
                { name: 'February', dayCount: 28 },
                { name: 'March', dayCount: 31 },
                { name: 'April', dayCount: 30 },
                { name: 'May', dayCount: 31 },
                { name: 'June', dayCount: 30 },
                { name: 'July', dayCount: 31 },
                { name: 'August', dayCount: 31 },
                { name: 'September', dayCount: 30 },
                { name: 'October', dayCount: 31 },
                { name: 'November', dayCount: 30 },
                { name: 'December', dayCount: 31 }
            ];

            const monthNamesExpected = monthData.map(month => { return month.name }).join(', ');
            const monthNamesActual = Array.from(document.querySelectorAll('.monthCard-name')).map(name => { return name.innerHTML; }).join(', ');

            if (monthNamesExpected !== monthNamesActual) {
                return hs.wrong(`The names of the months differ from the expected ones! Expected: '${monthNamesExpected}'; Actual: '${monthNamesActual}'`);
            }

            //------------------------------------------------------------------------------------------------------

            let monthNumberDifference = false;

            monthData.forEach((month, index) => {
                const monthNumberExpected = index + 1;
                const monthNumberActual = Number(document.querySelectorAll('.monthCard')[index].querySelectorAll('.monthCard-number')[0].innerHTML.replace('.', ''));

                if (!monthNumberDifference && (monthNumberExpected !== monthNumberActual)) {
                    monthNumberDifference = `The number of month in ${month.name} is incorrect! Expected: '${monthNumberExpected}'; Actual: '${monthNumberActual}'`;
                }
            });

            if (monthNumberDifference) {
                return hs.wrong(monthNumberDifference);
            }

            //------------------------------------------------------------------------------------------------------

            let dayCountDifference = false;

            monthData.forEach((month, index) => {
                const dayCountExpected = month.dayCount;
                const dayCountActual = document.querySelectorAll('.monthCard')[index].querySelectorAll('.monthCard-day').length;

                if (!dayCountDifference && (dayCountExpected !== dayCountActual)) {
                    dayCountDifference = `The number of days in ${month.name} is incorrect! Expected: '${dayCountExpected}'; Actual: '${dayCountActual}'`;
                }
            });

            if (dayCountDifference) {
                return hs.wrong(dayCountDifference);
            }

            return hs.correct();
        }
    );

    await sleep(3000);

    await browser.close();

    return result;
}

jest.setTimeout(30000);

test("Test stage", async () => {
    let result = await react.startServerAndTest(
        'localhost', 31328, path.resolve(__dirname, '..'), stageTest
    );

    if (result['type'] === 'wrong') {
        throw new Error(result['message']);
    }
});

