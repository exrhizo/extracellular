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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
function roamCaptureExecutor(_a, context) {
    var port = _a.port, options = __rest(_a, ["port"]);
    return __awaiter(this, void 0, void 0, function () {
        var outputBase, output, outputRaw, rawData, processData;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    outputBase = (0, path_1.join)(context.cwd, options.output);
                    output = outputBase + '.json';
                    outputRaw = outputBase + '-raw.json';
                    if (!port) return [3 /*break*/, 2];
                    return [4 /*yield*/, runZexportCaputureServer({ outputRaw: outputRaw, output: output, port: port })];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    console.log("Reading file ".concat(outputRaw));
                    rawData = JSON.parse((0, fs_1.readFileSync)(outputRaw, 'utf8'));
                    processData = processRoamData(rawData, options.unfiltered);
                    console.log('writing to ', output);
                    //   const s = jq.json(processData, '.');
                    (0, fs_1.writeFileSync)(output, JSON.stringify(processData, null, 2), {
                        flag: 'w'
                    });
                    _b.label = 3;
                case 3: return [2 /*return*/, { success: true }];
            }
        });
    });
}
exports["default"] = roamCaptureExecutor;
function runZexportCaputureServer(_a) {
    var outputRaw = _a.outputRaw, output = _a.output, port = _a.port;
    return __awaiter(this, void 0, void 0, function () {
        function captureRoamData(_a) {
            var outputRaw = _a.outputRaw, output = _a.output, data = _a.data;
            console.log('writing to ', outputRaw);
            // const s = jq.json(processData, '.');
            // const s = JSON.stringify(data, null, 2)
            (0, fs_1.writeFileSync)(outputRaw, data, { flag: 'w' });
            var dataObj = JSON.parse(data);
            var processData = processRoamData(dataObj);
            console.log('writing to ', output);
            (0, fs_1.writeFileSync)(output, JSON.stringify(processData, null, 2), { flag: 'w' });
        }
        var server;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
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
                                captureRoamData({ output: output, outputRaw: outputRaw, data: data });
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
                    _b.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    console.info('Press Ctrl+C to stop');
                    return [4 /*yield*/, stdinQuit()];
                case 2:
                    if (_b.sent()) {
                        return [3 /*break*/, 3];
                    }
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function processRoamData(data, unfiltered) {
    if (unfiltered === void 0) { unfiltered = false; }
    var blockByDbId = (0, itiriri_1["default"])(data.blocks).toMap(function (b) { return b[':db/id']; });
    var pageByDbId = (0, itiriri_1["default"])(data.pages).toMap(function (p) { return p[':db/id']; });
    var getParents = function (ps) {
        var pageId = ps[0][':db/id'];
        var blocks = ps.slice(1, ps.length).map(function (b) { return b[':db/id']; });
        return __spreadArray([pageByDbId.get(pageId)], blocks.map(function (b) { return blockByDbId.get(b); }), true);
    };
    var getParentsUids = function (ps) {
        var _a;
        // Returning nulls?
        // TODO: get to the root cause, are they deleted items
        var pageId = ps[0][':db/id'];
        var blocks = ps.slice(1, ps.length).map(function (b) { return b[':db/id']; });
        return __spreadArray([(_a = pageByDbId.get(pageId)) === null || _a === void 0 ? void 0 : _a[':block/uid']], blocks.map(function (b) { var _a; return (_a = blockByDbId.get(b)) === null || _a === void 0 ? void 0 : _a[':block/uid']; }), true);
    };
    var getParentsDbIds = function (ps) {
        // Returning nulls?
        // TODO: get to the root cause, are they deleted items
        var pageId = ps[0][':db/id'];
        var blocks = ps.slice(1, ps.length).map(function (b) { return b[':db/id']; });
        return __spreadArray([pageId], blocks.map(function (b) { return b[':db/id']; }), true);
    };
    var hasPage = function (b) {
        return pageByDbId.get(b[':block/page'][':db/id']) !== undefined;
    };
    var blocks = (0, itiriri_1["default"])(data.blocks)
        .filter(function (b) { return hasPage(b); })
        .map(function (b) {
        var _a, _b, _c;
        var parents = getParents(b[':block/parents']);
        var fallbackTime = (_a = parents.map(function (p) { return p === null || p === void 0 ? void 0 : p[':create/time']; }).filter(function (t) { return t; }).reverse()) === null || _a === void 0 ? void 0 : _a[0];
        return ({
            uid: b[':block/uid'],
            parents: parents.map(function (p) { return p === null || p === void 0 ? void 0 : p[':block/uid']; }),
            parentsDbs: parents.map(function (p) { return p === null || p === void 0 ? void 0 : p[':db/id']; }),
            content: b[':block/string'],
            // toParse: console.log('parsing:', b[':block/string']),
            structure: (0, src_1.parseToStructure)(b[':block/string']),
            ast: (0, src_1.parseToAst)(b[':block/string']),
            heading: b[':block/heading'],
            order: b[':block/order'],
            pageUid: pageByDbId.get(b[':block/page'][':db/id'])[':block/uid'],
            pageTitle: pageByDbId.get(b[':block/page'][':db/id'])[':node/title'],
            createTime: (_b = b[':create/time']) !== null && _b !== void 0 ? _b : fallbackTime,
            editTime: (_c = b[':edit/time']) !== null && _c !== void 0 ? _c : fallbackTime
        });
    })
        .toMap(function (block) { return block.uid; });
    console.log('DONE PARSING');
    var pages = (0, itiriri_1["default"])(data.pages)
        .map(function (p) {
        var _a;
        return ({
            uid: p[':block/uid'],
            title: p[':node/title'],
            children: ((_a = p[':block/children']) !== null && _a !== void 0 ? _a : []).map(function (c) { return blockByDbId.get(c[':db/id'])[':block/uid']; }),
            createTime: p[':create/time'],
            editTime: p[':edit/time']
        });
    })
        .toMap(function (p) { return p.uid; });
    var pageTitleToUid = (0, itiriri_1["default"])(data.pages).toMap(function (p) { return p[':node/title']; }, function (p) { return p[':block/uid']; });
    var filteredBlocksUids = unfiltered ?
        (0, itiriri_1["default"])(blocks.values()).toSet(function (b) { return b.uid; })
        : (0, itiriri_1["default"])(blocks.values())
            .filter(function (b) { return /^#zexport\b/.test(b.content); })
            .map(function (b) { return b.uid; })
            .toSet();
    var zexportBlocks = unfiltered ?
        (0, itiriri_1["default"])(blocks.values()).toArray()
        : (0, itiriri_1["default"])(blocks.values())
            .filter(function (b) { return b.parents.some(function (puid) { return filteredBlocksUids.has(puid); }); })
            .toArray();
    var zexportBlockUids = (0, itiriri_1["default"])(zexportBlocks)
        .map(function (b) { return b.uid; })
        .toSet();
    var zexportPagesUids = (0, itiriri_1["default"])(zexportBlocks)
        .map(function (b) { return b.pageUid; })
        .toSet();
    // TODO: Fix children
    var zexportPages = unfiltered ?
        (0, itiriri_1["default"])(pages.values()).toArray(function (p) { return (__assign(__assign({}, p), { children: [] })); })
        : (0, itiriri_1["default"])(zexportPagesUids)
            .map(function (p) {
            var page = pages.get(p);
            return __assign(__assign({}, page), { children: page.children.filter(function (c) { return zexportBlockUids.has(c); }) });
        })
            .toArray();
    // console.log(zexportBlockUids);
    var bs = (0, itiriri_1["default"])(zexportBlocks)
        // .take(10)
        .map(function (x) {
        var structure = x.structure;
        return {
            uid: x.uid,
            pageTitle: x.pageTitle,
            content: x.content,
            links: structureToLinks(structure.slice(1), pageTitleToUid),
            parents: x.parents,
            createTime: x.createTime,
            editTime: x.editTime,
            type: "block"
            // structure
            // ast: x.ast, AST is multilevel
        };
    })
        .toArray();
    // console.dir(bs, { depth: null });
    // For a graphistry plot, concat pages and blocks with same fields
    var nodes = (0, itiriri_1["default"])(bs).concat((0, itiriri_1["default"])(zexportPages).map(function (p) { return ({
        uid: p.uid,
        pageTitle: p.title,
        content: p.title,
        links: [],
        parents: [],
        createTime: p.createTime,
        editTime: p.editTime,
        type: 'page'
    }); })).toArray();
    return {
        pages: zexportPages,
        blocks: zexportBlocks,
        parsed: bs,
        nodes: nodes
    };
}
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
function structureToLinks(atoms, pageTitleToUid) {
    var _a;
    return ((_a = atoms === null || atoms === void 0 ? void 0 : atoms.map(function (a) {
        var _a;
        switch (a[0]) {
            case 'text-run':
                return null;
            case 'page-link':
                return pageTitleToUid.get(a[2]);
            case 'hashtag':
                return pageTitleToUid.get(a[2]);
            case 'typed-block-ref':
                return (_a = a === null || a === void 0 ? void 0 : a[3]) === null || _a === void 0 ? void 0 : _a[2];
            default:
                // Error with this style: ["block-ref",{"from":"(((khBMIidtC))"},"(khBMI
                // Errow with [failure, ]	
                return null; // JSON.stringify(a);
        }
    }).filter(function (i) { return typeof i == "string" && !/failure/.test(i); })) !== null && _a !== void 0 ? _a : []);
}
