// window['runLocalHostZexporter'] in the roam frontend.
const port = 8010;

const publishBlocks = () => {
  console.log('Publishing blocks,');

  const pages = window.roamAlphaAPI
    .q(`[:find ?p :where [?p :node/title ?title]]`)
    .map(([id]) => window.roamAlphaAPI.pull('[*]', id));
  const blocks = window.roamAlphaAPI
    .q(`[:find ?b :where [?b :block/page ?pid]]`)
    .map(([id]) => window.roamAlphaAPI.pull('[*]', id));

  var xhr = new XMLHttpRequest();
  xhr.open('POST', `http://localhost:${port}`, true);

  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      console.log(
        `POST operation done. Server response status: ${this.status}`
      );
    }
  };
  xhr.send(JSON.stringify({ pages, blocks }));
  console.log(blocks);
};

function getLastEdit() {
  return window.roamAlphaAPI.q(
    `[:find (max ?time) :where [?b :block/uid ?uid] [?b :edit/time ?time]]`
  )[0][0];
}

let timeoutId = null;
let lastEdit = 0;

function rerun() {
  console.log('rerun');
  const newLastEdit = getLastEdit();
  if (newLastEdit > lastEdit) {
    lastEdit = newLastEdit;
    publishBlocks();
    timeoutId = setTimeout(rerun, 10000);
  } else {
    timeoutId = setTimeout(rerun, 10000);
  }
}

function runZexporter() {
  console.log('starting localhost zexporter.');
  rerun();
}

function stopZexporter() {
  console.log('stopping localhost zexporter.');
  timeoutId && clearTimeout(timeoutId);
  timeoutId = null;
}

function toggleZexporter() {
  if (timeoutId) {
    stopZexporter();
  } else {
    runZexporter();
  }
}

// window['runLocalHostZexporter'] = runZexporter;
// window['stopLocalHostZexporter'] = stopZexporter;
window['toggleLocalHostZexporter'] = toggleZexporter;
