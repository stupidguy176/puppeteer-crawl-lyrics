const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  // const browser = await puppeteer.launch({ headless: false })
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  await page.goto('https://www.nhaccuatui.com/playlist/acoustic-viet-gay-nghien-va.b7dMcA0UhTPw.html')
  const songs = await page.evaluate(() => {
    let songs = document.getElementsByClassName('item_content')
    songs = [...songs]
    let array = songs.map((song) => {
      return {
        title: song
          .getElementsByClassName('name_song')[0]
          .innerHTML.trim(),
        url: song.getElementsByClassName('name_song')[0].href,
      }
    })
    return array
  })

  if (songs.length) {
    for (let song of songs) {
      await page.goto(song.url)
      let lyric = await page.evaluate(() => {
        let ly = document
        .getElementById('divLyric'),
        lyric = ''

        if(ly) {
          lyric = document
            .getElementById('divLyric')
            .innerHTML.replace(/\<br\>/g, '')
        }

        return lyric
      })
      await fs.writeFile(`songs/${song.title}.txt`, lyric, function (err) {
        if (err) throw err
        console.log('Đã lưu:' + song.title)
      })
    }
  }
  await browser.close()

})()

