"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var itiriri_1 = require("itiriri");
var http_1 = require("http");
var fs_1 = require("fs");
var path_1 = require("path");
var src_1 = require("../../../libs/roam-wrangler/src");
// TODO:
// npm install jq-web
// const jq = require('jq-web');
// GOAL:
// First get one level closer to the standard JSON
// that means nested children
//
var example = {
    uid: '',
    'edit-time': 888,
    title: 'thing',
    children: null !== null && null !== void 0 ? null : [
        {
            string: 'I got a app and have started practicing!!!',
            uid: '5zWBHxKpM',
            heading: null !== null && null !== void 0 ? null : 3,
            'create-time': 1576303943052,
            'edit-time': 1576311611227
        },
    ]
};
function echoExecutor(options, context) {
    return __awaiter(this, void 0, void 0, function () {
        var fullPath, fullRawPath, rawData, processData;
        return __generator(this, function (_a) {
            fullPath = (0, path_1.join)(context.cwd, options.output);
            fullRawPath = (0, path_1.join)(context.cwd, options.outputRaw);
            console.log("Reading file ".concat(fullRawPath));
            rawData = JSON.parse((0, fs_1.readFileSync)(fullRawPath, 'utf8'));
            processData = processRoamData(rawData);
            console.log('writing to ', fullPath);
            //   const s = jq.json(processData, '.');
            (0, fs_1.writeFileSync)(fullPath, JSON.stringify(processData.parsed, null, 2), {
                flag: 'w'
            });
            return [2 /*return*/, { success: true }];
        });
    });
}
exports["default"] = echoExecutor;
function runZexportCaputureServer(output, port) {
    return __awaiter(this, void 0, void 0, function () {
        var server;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Starting server on port ".concat(port));
                    server = (0, http_1.createServer)(function (req, resp) { return __awaiter(_this, void 0, void 0, function () {
                        var data;
                        return __generator(this, function (_a) {
                            console.log("Received ".concat(req.method));
                            data = '';
                            req.on('data', function (chunk) {
                                data += chunk;
                            });
                            req.on('end', function () {
                                captureRoamData(output, data);
                                resp.writeHead(200, {
                                    'Content-Type': 'text/plain',
                                    'Access-Control-Allow-Origin': '*',
                                    'Access-Control-Allow-Methods': 'POST'
                                });
                                resp.end();
                                console.log('Connection closed');
                            });
                            return [2 /*return*/];
                        });
                    }); });
                    // @ts-ignore
                    server.listen(port, function (err) {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        console.info("Server is listening on port ".concat(port));
                    });
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    console.info('Press Ctrl+C to stop');
                    return [4 /*yield*/, stdinQuit()];
                case 2:
                    if (_a.sent()) {
                        return [3 /*break*/, 3];
                    }
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function processRoamData(data) {
    var blockByDbId = (0, itiriri_1["default"])(data.blocks).toMap(function (b) { return b[':db/id']; });
    var pageByDbId = (0, itiriri_1["default"])(data.pages).toMap(function (p) { return p[':db/id']; });
    var getParentsUids = function (ps) {
        var _a;
        var pageId = ps[0][':db/id'];
        var blocks = ps.slice(1, ps.length).map(function (b) { return b[':db/id']; });
        return __spreadArray([
            (_a = pageByDbId.get(pageId)) === null || _a === void 0 ? void 0 : _a[':block/uid']
        ], blocks.map(function (b) { var _a; return (_a = blockByDbId.get(b)) === null || _a === void 0 ? void 0 : _a[':block/uid']; }), true);
    };
    var hasPage = function (b) {
        return pageByDbId.get(b[':block/page'][':db/id']) !== undefined;
    };
    var blocks = (0, itiriri_1["default"])(data.blocks)
        .filter(function (b) { return hasPage(b); })
        .map(function (b) { return ({
        uid: b[':block/uid'],
        parents: getParentsUids(b[':block/parents']),
        content: b[':block/string'],
        // toParse: console.log('parsing:', b[':block/string']),
        structure: (0, src_1.parseToStructure)(b[':block/string']),
        ast: (0, src_1.parseToAst)(b[':block/string']),
        heading: b[':block/heading'],
        order: b[':block/order'],
        pageUid: pageByDbId.get(b[':block/page'][':db/id'])[':block/uid'],
        pageTitle: pageByDbId.get(b[':block/page'][':db/id'])[':node/title']
    }); })
        .toMap(function (block) { return block.uid; });
    console.log('DONE PARSING');
    var pages = (0, itiriri_1["default"])(data.pages)
        .map(function (p) {
        var _a;
        return ({
            uid: p[':block/uid'],
            title: p[':node/title'],
            children: ((_a = p[':block/children']) !== null && _a !== void 0 ? _a : []).map(function (c) { return blockByDbId.get(c[':db/id'])[':block/uid']; })
        });
    })
        .toMap(function (p) { return p.uid; });
    var zexportTaggedBlocksUids = (0, itiriri_1["default"])(blocks.values())
        .filter(function (b) { return /^#zexport\b/.test(b.content); })
        .map(function (b) { return b.uid; })
        .toSet();
    var zexportBlocks = (0, itiriri_1["default"])(blocks.values())
        .filter(function (b) { return b.parents.some(function (puid) { return zexportTaggedBlocksUids.has(puid); }); })
        .toArray();
    var zexportBlockUids = (0, itiriri_1["default"])(zexportBlocks)
        .map(function (b) { return b.uid; })
        .toSet();
    var zexportPagesUids = (0, itiriri_1["default"])(zexportBlocks)
        .map(function (b) { return b.pageUid; })
        .toSet();
    var zexportPages = (0, itiriri_1["default"])(zexportPagesUids)
        .map(function (p) {
        var page = pages.get(p);
        // console.log(
        //   page,
        //   page.children.filter((c) => zexportBlockUids.has(c))
        // );
        return __assign(__assign({}, page), { children: page.children.filter(function (c) { return zexportBlockUids.has(c); }) });
    })
        .toArray();
    // console.log(zexportBlockUids);
    var bs = (0, itiriri_1["default"])(zexportBlocks)
        // .take(10)
        .map(function (x) { return ({
        uid: x.uid,
        pageTitle: x.pageTitle,
        content: x.content,
        structure: x.structure,
        ast: x.ast
    }); })
        .toArray();
    // console.dir(bs, { depth: null });
    return {
        pages: zexportPages,
        blocks: zexportBlocks,
        parsed: bs
    };
}
function captureRoamData(output, data) { }
function stdinQuit() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            process.stdin.setRawMode(true);
            return [2 /*return*/, new Promise(function (resolve) {
                    return process.stdin.once('data', function (data) {
                        if (data.length > 0 && data.readUInt8(0) === 3) {
                            console.log('^C');
                            resolve(true);
                        }
                        process.stdin.setRawMode(false);
                        resolve(false);
                    });
                })];
        });
    });
}
