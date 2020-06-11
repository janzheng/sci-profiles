// const metascraper = require('metascraper')([
//   require('metascraper-author')(),
//   require('metascraper-date')(),
//   require('metascraper-description')(),
//   require('metascraper-image')(),
//   require('metascraper-logo')(),
//   require('metascraper-clearbit')(),
//   require('metascraper-publisher')(),
//   require('metascraper-title')(),
//   require('metascraper-url')()
// ])

// const got = require('got')

// const targetUrl = 'https://www.mdpi.com/2079-6382/9/5/241/htm'

// export async function get(req, res) {

//   const { body: html, url } = await got(targetUrl)
//   const metadata = await metascraper({ html, url })
//   console.log(metadata)

// }