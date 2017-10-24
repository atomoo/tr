/**
 * @file translate the word with Bing
 */
const urllib = require('urllib')
const cheerio = require('cheerio')
const colors = require('colors')

const outputToScreen = console.log.bind(console)

function displayTranslation(translation, format) {
    if (format) {
        outputToScreen('\n', translation.pronunciation.join('    '))
        translation.explanation.forEach((item) => {
            outputToScreen('', colors.bgWhite.black(item.type), '\t', item.detail)
        })
    }
    else {
        outputToScreen(translation)
    }
}

async function requestBing(word) {
    const res = await urllib.request('https://cn.bing.com/dict/search', {
        type: 'GET',
        data: {
            q: word,
        },
        dataType: 'text',
    })
    return res.status === 200 ? res.data : ''
}

async function translate(word, format) {
    const r = await requestBing(word)
    if (format) {
        const $ = cheerio.load(r)
        const translation = {
            pronunciation: [
                $('.qdef').find('.hd_prUS').text().trim(),
                $('.qdef').find('.hd_pr').text().trim(),
            ],
            explanation: [],
        }
        $('.qdef').find('ul li').each((i, elem) => {
            translation.explanation.push({
                type: $(elem).find('.pos').text(),
                detail: $(elem).find('.def span').text(),
            })
        })
        displayTranslation(translation, format)
    }
    else {
        const regMeta = /<meta name="description" content="([\s\S]+?)" \/>/
        const match = r.match(regMeta)
        if (match) {
            displayTranslation(match[1], format)
        }
    }
}
async function init(argv) {
    if (argv._.length > 0) {
        outputToScreen('waiting...')
        await translate(argv._[0], argv.format)
    }
}

module.exports = init
