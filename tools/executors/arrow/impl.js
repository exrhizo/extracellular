'use strict';

var path = require('path');
var fs = require('fs');
var process = require('process');

const {
  makeVector,
  vectorFromArray,
  Uint8,
  Uint16,
  Uint32,
  Int8,
  Int16,
  Int32,
  Utf8,
  Float64,
  tableFromArrays,
  Dictionary,
  tableToIPC,
  // tableFromIPC,
} = require('apache-arrow');


function arrowExecutor(options, context) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      // console.log('OPTIONS', options);
      // console.log('CONTEXT', context);

      const sourcePath = path.join(context.cwd, options.source);
      console.log('Reading file '.concat(sourcePath));
      const rawData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

      const [balanceTable, tokenTable] = balancesToArrow(rawData);


      const outputDir = path.dirname(sourcePath)
      const balanceOutput = path.join(outputDir, 'covalent-balances.ipc');
      const tokenOutput = path.join(outputDir, 'covalent-tokens.ipc');

      console.log('writing balances to ', balanceOutput);
      fs.writeFileSync(balanceOutput, tableToIPC(balanceTable, 'file'));

      console.log('writing tokens to ', tokenOutput);
      fs.writeFileSync(tokenOutput, tableToIPC(tokenTable, 'file'));

      return [2 /*return*/, { success: true }];
    });
  });
}

function iterOf (source, key) {
  return mapIter(source.values(), (v) => v[key]);
} 

function balancesToArrow(balances) {
  const rows = balancesToMap(balances);
  const tokens = extractTokens(rows);
  console.log('----------------------------------------');
  console.log('Number of rows', rows.size);
  console.log('Number of tokens', tokens.size);
  console.log('----------------------------------------');


  const tokenTable = tableFromArrays({
    address: vectorFromArray(tokens.keys(), new Utf8()),
    name: vectorFromArray(iterOf(tokens, 'name'), new Utf8()),
    symbol: vectorFromArray(iterOf(tokens, 'symbol'), new Utf8()),
    decimals: vectorFromArray(iterOf(tokens, 'decimals'), new Uint16()),
    // supports_erc: dictionaryVector(iterOf(tokens, 'supports_erc')),
    total_held: vectorFromArray(iterOf(tokens, 'total_held'), new Float64()),
    holder_count: vectorFromArray(iterOf(tokens, 'holder_count'), new Float64()),
  });

  const balanceTable = tableFromArrays({
    address: vectorFromArray(mapIter(rows.keys(), ([o, _]) => o), new Utf8()),
    // Would a dictionary save space with the token contract addresses?
    contract_address: vectorFromArray(mapIter(rows.keys(), ([_, t]) => t), new Utf8()),
    // Balance could be uint256
    balance: vectorFromArray(mapIter(rows.values(), (v) => Number(v.balance)), new Float64()),
    balance_24h: vectorFromArray(mapIter(rows.values(), (v) => Number(v.balance_24h)), new Float64()),
    quote: vectorFromArray(mapIter(rows.values(), (v) => Number(v.quote)), new Float64()),
    quote_24h: vectorFromArray(mapIter(rows.values(), (v) => Number(v.quote_24h)), new Float64()),
    quote_rate: vectorFromArray(mapIter(rows.values(), (v) => Number(v.quote_rate)), new Float64()),
    quote_rate_24h: vectorFromArray(mapIter(rows.values(), (v) => Number(v.quote_rate_24h)), new Float64()),
    type: dictionaryVector(mapIter(rows.values(), (v) => v.type)),
    last_transferred_at: vectorFromArray(mapIter(rows.values(), (v) => new Date(v.last_transferred_at).getUTCSeconds()), new Uint32()), 
  });

  
  // console.log(tokenTable);
  // console.log(balanceTable);
  const types = vectorFromArray(mapIter(rows.values(), (v) => v.type), new Utf8());
  const typesD = dictionaryVector(mapIter(rows.values(), (v) => v.type));
  // console.log(types);
  console.log(summarizeVector('types', types));
  console.log(summarizeVector('typesD', typesD));
  // throw new Error('Stop');
  // process.exit(0);

  // console.log('');
  // console.log('');
  // console.log('Print arrow information');
  // console.log('========================================');

  // const iter = iterOf(rows, 'last_transferred_at');
  // const last_transferred_at = Array.from({ length: rows.size}, () => iter.next().value);
  // const lta = vectorFromArray(last_transferred_at);
  // // console.log(lta);
  // summarizeVector('rows.last_transferred_at', lta);

  
  // const iterType = iterOf(rows, 'type');
  // const type_array = Array.from({ length: rows.size}, () => iterType.next().value);
  // const ta = vectorFromArray(type_array);
  // summarizeVector('rows.type', ta);

  // const decimals = vectorFromArray(iterOf(tokens, 'decimals'), new Uint16());
  // summarizeVector('tokens.decimals', decimals);

  return [balanceTable, tokenTable];
}

function summarizeVector(s, v) {
  console.log('----------------------------------------');
  console.log(s, v.length, v.getByteLength());
  // console.log(`${s}.type`, v.type);
  // console.log(v);
  const d = v.data[0].dictionary;
  if (d) {
    console.log(`\`With dictionary length: `, d.length);
  }
  console.log('----------------------------------------');
}


function dictionaryVector(iterator) {
  const m = new Map();
  const data = [];
  for (const value of iterator) {
    if (m.has(value)) {
      data.push(m.get(value));
    } else {
      const i = m.size;
      m.set(value, i);
      data.push(i);
    }
  }

  // Unit isn't supported when we move into pandas..
  // Will it work with the negative indicies?
  let type = new Int8();
  if (m.size > 255 / 2) {
    type = new Int16();
  } else if (m.size > 65535 / 2) {
    type = new Int32();
  } else if (m.size > 4294967295 / 2) {
    throw new Error('Too many unique values');
  }

  return makeVector({
    data,
    dictionary: vectorFromArray(m.keys(), new Utf8()),
    type: new Dictionary(new Utf8(), type),
  });
}

// function toArrowColumn(iterator, bufferType) {
//   //   const dict = vectorFromArray(new Set(getIterator()), new Utf8());
//   //   return vectorFromArray(getIterator(), new Utf8());
//   if (bufferType) {
//     return vectorFromArray(iterator, bufferType);
//   } else {
//     return makeVector(iterator);
//   }
// }

// /**
//  *
//  * @param {Map<[string,string], any>} rows
//  * @param {string} key
//  * @param {{from: ({length: number}, iterator) => any}} typedArray
//  * @param {(v: any) => any} format
//  */
// function parseColumn(rows, key, typedArray, format = (v) => v) {
//   const iterator = rows.entries();
//   return typedArray.from({ length: rows.size }, (...args) => {
//     const {
//       value: [[address, contract], balanceEntry],
//     } = iterator.next();
//     if (key === 'address') {
//       return format(address);
//     } else if (key === 'contract_address') {
//       return format(contract);
//     }
//     return format(balanceEntry[key]);
//   });
// }

function balancesToMap(balances) {
  const rows = new Map();
  for (const [address, balanceEntries] of Object.entries(balances)) {
    for (const balanceEntry of balanceEntries) {
      const key = [address, balanceEntry.contract_address];
      if (key in rows) {
        throw new Error('Duplicate address/contract_address pair');
      }
      rows.set(key, balanceEntry);
    }
  }
  return rows;
}

/**
 * @param {Map<[string,string], any>} rows
 */
 function extractTokens(rows) {
  /** @type {Map<string, {name: string; symbol: string; decimals: number; address: string; supports_erc: string; logo_url: string;}>} */
  const tokens = new Map();
  for (const [[_, token], value] of rows.entries()) {
    if (!tokens.has(token)) {
      tokens.set(token, {
        name: value.contract_name,
        symbol: value.contract_ticker_symbol,
        decimals: value.contract_decimals,
        address: value.contract_address,
        supports_erc: value.supports_erc?.join(',') ?? '',
        logo_url: value.logo_url,
        total_held: value.quote,
        holder_count: 1,
      });
    } else {
      tokens.get(token).total_held += value.quote;
      tokens.get(token).holder_count ++;
    }
  }
  return tokens;
}

/**
 *
 * @param {IterableIterator<T1>} iterable
 * @param {(value: T1) => T2} callback
 */
function* mapIter(iterable, callback) {
  for (let x of iterable) {
    yield callback(x);
  }
}




exports['default'] = arrowExecutor;





//
//
//
//
///
///
/////
///////
///////////////////
////////////////////////////////////////////////////////////////////////////////////////

// Writing this in Javascript, so we can use the __awaiter and __generator functions
// that I cribed from the TypeScript compiler.
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
