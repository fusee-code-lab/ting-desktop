import searchDetail from './searchDetail';

type RT = 'searchDetail';
let rI: RT = 'searchDetail';

const r: { [key: string]: any } = {
  searchDetail: new searchDetail()
};

export function render(path?: RT) {
  if (!path) {
    r[rI].un();
    return r[rI].render();
  }
  if (rI === path) return;
  r[rI].un();
  rI = path;
  return r[rI].render();
}
