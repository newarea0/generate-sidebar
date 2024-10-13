#!/usr/bin/env node
'use strict';

var fs = require('node:fs');
var path = require('node:path');
var process = require('node:process');
var node_url = require('node:url');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var process__default = /*#__PURE__*/_interopDefaultLegacy(process);

var __filename$1 = node_url.fileURLToPath((typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT' && document.currentScript.src || new URL('index.js', document.baseURI).href)));
path__default["default"].dirname(__filename$1);
function generateSidebar(dir, basePath) {
    if (basePath === void 0) { basePath = ''; }
    var sidebar = [];
    var files = fs__default["default"].readdirSync(dir);
    files.forEach(function (file) {
        var filePath = path__default["default"].join(dir, file);
        var stat = fs__default["default"].statSync(filePath);
        if (stat.isDirectory()) {
            var dirName_1 = path__default["default"].basename(file);
            var items = generateSidebar(filePath, path__default["default"].join(basePath, dirName_1));
            if (items.length > 0) {
                sidebar.push({
                    text: dirName_1,
                    collapsed: true,
                    items: items
                });
            }
        }
        else if (path__default["default"].extname(file) === '.md') {
            var name_1 = path__default["default"].basename(file, '.md');
            if (name_1.toLowerCase() !== 'readme') {
                sidebar.push({
                    text: name_1,
                    // 去掉开头的斜杠，否则侧边栏菜单无法高亮
                    link: "".concat(path__default["default"].join(basePath, name_1).replace(/\\/g, '/'))
                });
            }
        }
    });
    return sidebar;
}
function stringifySidebar(sidebar, indent) {
    if (indent === void 0) { indent = 0; }
    var spaces = ' '.repeat(indent);
    var result = '[\n';
    sidebar.forEach(function (item) {
        if (Object.keys(item).length === 2 && item.text && item.link) {
            // 如果只有 text 和 link，则在一行内显示
            result += "".concat(spaces, "  { text: '").concat(item.text, "', link: '").concat(item.link, "' },");
        }
        else {
            result += "".concat(spaces, "  {\n");
            result += "".concat(spaces, "    text: '").concat(item.text, "',\n");
            if (item.link) {
                result += "".concat(spaces, "    link: '").concat(item.link, "',\n");
            }
            if (item.collapsed !== undefined) {
                result += "".concat(spaces, "    collapsed: ").concat(item.collapsed, ",\n");
            }
            if (item.items) {
                result += "".concat(spaces, "    items: ").concat(stringifySidebar(item.items, indent + 4), ",\n");
            }
            result += "".concat(spaces, "  },");
        }
        result += '\n';
    });
    result += "".concat(spaces, "]");
    return result;
}
function writeSidebarConfig(sidebar, outputPath) {
    var content = "import type { DefaultTheme } from 'vitepress'\n\nexport const ".concat(path__default["default"].basename(outputPath, '.ts'), "Sidebar: DefaultTheme.SidebarItem[] = ").concat(stringifySidebar(sidebar), "\n");
    fs__default["default"].writeFileSync(outputPath, content);
    console.log("\u4FA7\u8FB9\u680F\u914D\u7F6E\u5DF2\u751F\u6210\u5230: ".concat(outputPath));
}
// 获取命令行参数
var args = process__default["default"].argv.slice(2);
if (args.length < 2) {
    console.error('请提供目录名和输出文件路径作为参数');
    process__default["default"].exit(1);
}
var dirName = args[0];
var outputPath = args[1];
var docsDir = path__default["default"].join(path__default["default"].resolve('.'), dirName);
console.log(docsDir);
if (!fs__default["default"].existsSync(docsDir)) {
    console.error("\u76EE\u5F55 \"".concat(dirName, "\" \u4E0D\u5B58\u5728"));
    process__default["default"].exit(1);
}
var sidebar = generateSidebar(docsDir);
writeSidebarConfig(sidebar, outputPath);
