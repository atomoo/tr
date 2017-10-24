/**
 * @file translate the word with Bing
 */
const urllib = require('urllib')
const cheerio = require('cheerio')
const yargs = require('yargs')
const colors = require('colors')
const argv = yargs.usage('Usage: $0 <word> translate the word with Bing')
    .options('f', {
        alias: 'format',
        demandOption: false,
        default: false,
        describe: 'format output',
        type: 'boolean'
    })
    .help('h')
    .demandCommand()
    .showHelpOnFail(true, '')
    .alias('h', 'help')
    .alias('help', '*')
    .alias('v', 'version')
    .argv

async function init() {
    let result;
    if (argv._.length > 0) {
        await translate(argv._[0])
    }
}

async function requestBing(word) {
    let res = await urllib.request('https://cn.bing.com/dict/search', {
        type: 'GET',
        data: {
            q: word
        },
        dataType: 'text'
    });
    return res.status === 200 ? res.data : ''
}

async function translate(word) {
    let r = await requestBing(word)
    if (argv.format) {
        const $ = cheerio.load(r);
        let translation = {
            pronunciation: [
                $('.qdef').find('.hd_prUS').text().trim(),
                $('.qdef').find('.hd_pr').text().trim()
            ],
            explanation: []
        }
        $('.qdef').find('ul li').each((i, elem) => {
            translation.explanation.push({
                type: $(elem).find('.pos').text(),
                detail: $(elem).find('.def span').text()
            })
        })
        displayTranslation(translation)
    }
    else {
        const regMeta = /<meta name="description" content="([\s\S]+?)" \/>/
        let match = r.match(regMeta)
        match && displayTranslation(match[1])
    }
}

function displayTranslation(translation) {
    if (argv.format) {
        console.log('\n', translation.pronunciation.join('    '))
        translation.explanation.forEach(item => {
            console.log('', colors.bgWhite.black(item.type), '\t', item.detail)
        })
    }
    else {
        console.log(translation)
    }
}

init()
