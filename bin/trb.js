#!/usr/bin/env node
const yargs = require('yargs')
const init = require('../lib/tr')

const { argv } = yargs.usage('Usage: $0 <word> translate the word with Bing')
    .options('f', {
        alias: 'format',
        demandOption: false,
        default: false,
        describe: 'format output',
        type: 'boolean',
    })
    .help('h')
    .demandCommand()
    .showHelpOnFail(true, '')
    .alias('h', 'help')
    .alias('help', '*')
    .alias('v', 'version')
try {
    init(argv)
}
catch (e) {
    console.error(e)
    process.exit(1)
}
