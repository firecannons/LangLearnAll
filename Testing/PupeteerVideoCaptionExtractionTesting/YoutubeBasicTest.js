// npm install puppeteer

const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto('https://www.youtube.com/watch?v=lnYeOdax3C4')
        
        const result = await page.evaluate(`
      async function getCaptionJson(url, langCode)
      {
        url = url.replace('m.', 'www.')
        
        let o = (await (await fetch(url)).text())
               .split('ytInitialPlayerResponse = ')[1].split(';var')[0]
        o = await o.split('</script>')[0]
        if(await o.slice(-1) == ';')
        {
          o = await o.substring(0, o.length - 1);
        }
               //return o
               
          console.log('vurl', url)
          console.log('o is', o)
          let ct = JSON.parse(o)
               .captions.playerCaptionsTracklistRenderer.captionTracks
               
          // the ? operator in js https://www.freecodecamp.org/news/how-the-question-mark-works-in-javascript/
          findCaptionUrl = x => ct.find(y => y.vssId.indexOf(x) === 0)?.baseUrl
          firstChoice = findCaptionUrl("." + langCode)
          url = firstChoice ? firstChoice + "&fmt=json3" : (findCaptionUrl(".") || findCaptionUrl("a." + langCode) || ct[0].baseUrl) + "&fmt=json3";
          
          if(ct != null && ct.length > 0)
          {
            if(ct[0].languageCode != langCode)
            {
              url = url + '&tlang=' + langCode
            }
          }
          
          console.log('url', url, findCaptionUrl('.en'), firstChoice, ct[0].baseUrl)
          console.log('caption url', url)
          
          let json = await JSON.stringify(await (await fetch(url)).json(), 0, 2)
          
          return json
          
        }
        getCaptionJson(window.location.href, 'pt')
  `);
        
        
        //const result = await page.evaluate(`getCaptionJson(window.location.href, 'pt')`)
        
        
  console.log('result', result)

        // hl is page shown language, sl is from lang, tl is to lang
	
	await browser.close();
})();
