import { styled } from '../theme/stitches.config';

import {
  Table,
  IntVector,
  FloatVector,
  Vector,
  Dictionary,
  Utf8,
  Int32,
} from 'apache-arrow';

const Button = styled('button', {
  backgroundColor: 'medium',
  borderRadius: '9999px',
  fontSize: '13px',
  padding: '10px 15px',
  '&:hover': {
    backgroundColor: 'lightgray',
  },
});

// const LENGTH = 2000;

// const rainAmounts = Float32Array.from(
//     { length: LENGTH },
//     () => Number((Math.random() * 20).toFixed(1)));

// const rainDates = Array.from(
//     { length: LENGTH },
//     (_, i) => new Date(Date.now() - 1000 * 60 * 60 * 24 * i));

// const rainfall = tableFromArrays({
//     precipitation: rainAmounts,
//     date: rainDates
// });

// console.table([...rainfall]);

/**
 *
 * @param {Map<[string,string], any>} rows
 * @param {string} key
 * @param {ArrayBufferView} typedArray
 * @param {(v: any) => any} format
 */
function parseColumn(rows, key, typedArray, format = (v) => v) {
  const iterator = rows.entries();
  return typedArray.from({ length: rows.size }, (...args) => {
    console.log('args', args);
    const {
      value: [[address, contract], balanceEntry],
    } = iterator.next();
    return format(balanceEntry[key]);
  });
}

const example = new Map();
example.set(['0x1', '0x1'], { balance: 1, timestamp: 1 });
example.set(['0x2', '0x2'], { balance: 2, timestamp: 2 });
example.set(['0x3', '0x3'], { balance: 3, timestamp: 3 });

export function Index() {
  console.log('HI', {
    Table,
    IntVector,
    FloatVector,
    Vector,
    Dictionary,
    Utf8,
    Int32,
  });

  console.log('parseColumn', parseColumn(example, 'balance', Int32Array));

  return (
    <div>
      <h2>ECM</h2>
      <Button>This is a stitches button</Button>
    </div>
  );
}

export default Index;
