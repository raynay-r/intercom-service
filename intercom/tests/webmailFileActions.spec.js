require('dotenv').config();
const assert = require('assert');

const {test, expect} = require('@playwright/test')
test('test nextcloud actions', async ({browser}) => {
    const context = await browser.newContext({"proxy": {"server": "localhost:8079"}});
    //const context = await browser.newContext();

    const page = await context.newPage();

    // login into ox(fake), get "silent login'ed" to ics
    await page.goto("http://oxfake.p.test/conference");

    await page.locator('input[name="username"]').fill(process.env.TESTUSER);

    await page.locator('input[name="password"]').fill(process.env.TESTPASSWORD);

    await page.locator('input:has-text("Sign In")').click();

    await expect(page.locator('text=Imagine Creating a Videoconference')).toBeVisible()

    await expect(page.locator('text={"sessionStatus": true}')).toBeVisible()

    /*
        The following is JS executed in the browser by playwright. A shortcut to not having to implement
        a fake/test app doing all the stuff
     */

    // test preview creation
    const res = await page.evaluate(async () => {
        // TODO: Get valid fileId somehow beforehand
        const r = await fetch('http://ic.p.test/fs/index.php/core/preview?fileId=93&x=128&y=128&forceIcon=0&a=0', {
            method: "GET",
            credentials: 'include'

        })
        return r.status
    })

    assert(res === 200)

    // test link creation
    const f = async () => {
        const r = await fetch('http://ic.p.test/fs/ocs/v2.php/apps/files_sharing/api/v1/shares', {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify({path: "/Photos/Birdie.jpg", shareType: 3})
        })
        return r.status
    }

    const res2 = await page.evaluate(f)
    assert(res2 === 200)

    await page.pause()

    // Test webdav access
    const res3 = await page.evaluate(async () => {
        const r = await fetch('http://ic.p.test/fs/remote.php/dav/files/usera1/Photos', {
            method: "PROPFIND",
            credentials: 'include'

        })
        const text = await r.text()
        console.log(text)
        return text
    })

    assert(res3.includes('/Photos/Birdie.jpg'))
})
