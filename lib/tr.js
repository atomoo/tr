/**
 * @file translate the word with Bing
 * TODO: format ouput when having 'f' options
 */
const urllib = require('urllib')
const argv = require('yargs')
    .usage('Usage: $0 <word> translate the word with Bing')
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
const reg = /<meta name="description" content="([\s\S]+?)" \/>/


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
    let match = r.match(reg)
    return match ? match[1] : null;
}

async function init() {
    let result;
    if (argv._.length > 0) {
        result = await translate(argv._[0])
    }
    console.log(result)
}

init()
