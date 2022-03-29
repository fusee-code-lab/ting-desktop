import searchDetail from './searchDetail';

type RT = 'searchDetail';
let rI: RT = 'searchDetail';

const r: { [key: string]: any } = {
  searchDetail: new searchDetail()
};

const el = <div class="content"></div>;

function removeChild() {
  el.firstChild && el.removeChild(el.firstChild);
}

export function contentLoad() {
  el.childNodes.length === 0 && el.appendChild(r[rI].render());
  return el;
}

export function contentRender(path: RT) {
  if (rI === path) return;
  r[rI].un();
  rI = path;
  removeChild();
  el.appendChild(r[rI].render());
}
