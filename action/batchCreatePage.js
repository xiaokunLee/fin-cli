/**
 * @file batchCreatePage
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/4/7
 */

'use strict';

require('console.table');

const FS = require('fs');
const PATH = require('path');

const FSE = require('fs-extra');

const STRING = require('string');

const CHALK = require('chalk');

const READ_PROJECT_YAML = require('../util/readProjectConfigYaml');

let batchCreatePage = (userData, list, dirPath, createPage) => {
    let pageTrace = [];

    if (Array.isArray(list)) {
        list.forEach(item => {
            if (!item.name) {
                console.log(CHALK.bold.red('\n × Page `name` does not exist!'));
                return false;
            }

            const START = +(new Date());

            let {name, title} = item;
            let pageName = STRING(item.name).dasherize().s;
            let data = Object.assign({}, userData, {title});

            createPage(pageName, data, dirPath);
            pageTrace.push({'Page name': pageName, 'Consumption time': `${+(new Date())- START}ms`});
        });
    }

    return pageTrace;
};

module.exports = (userData, createPage) => {
    const START = + (new Date());
    const CWD = process.cwd();
    const INDEX_DOC = READ_PROJECT_YAML(CWD);

    let keyMap = Object.keys(INDEX_DOC);

    if (keyMap === 0) {
       console.log(CHALK.bold.red('\n × `index.yml` has some error!'));
       process.exit();
    }

    let pagesMessage = [];

    Object.keys(INDEX_DOC).forEach(key => {
        let dirName = STRING(key).dasherize().s;
        let dirPath = PATH.join(CWD, 'page', dirName);

        if (!FS.existsSync(dirPath)) {
            FSE.ensureDirSync(dirPath);
        }

        let page = batchCreatePage(userData, INDEX_DOC[key], dirPath, createPage);

        pagesMessage = pagesMessage.concat(page);
    });


    console.log(CHALK.green('\n √ Batch generation completed! \n'));
    console.table(pagesMessage);
    console.log(CHALK.green(`Total: ${pagesMessage.length} pages was created, Take ${+(new Date) - START}ms.`));

    process.exit();
};
