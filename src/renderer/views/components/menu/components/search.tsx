import { searchSheet, searchSong } from '@/renderer/common/musicapi';

export default class {
  sel = (<input />) as HTMLInputElement;
  bel = (<button>搜索</button>) as HTMLButtonElement;

  constructor() {
    this.sel.addEventListener('keydown', (e) => {
      e.key === 'Enter' && this.sel.value && this.search(this.sel.value);
    });
    this.bel.onclick = () => this.sel.value && this.search(this.sel.value);
  }

  async search(keyword: string) {
    let reqs = (await Promise.all([searchSong(keyword), searchSheet(keyword)])) as any;
    dispatchEvent(new CustomEvent('search-song-sheet', { detail: reqs }));
  }

  render() {
    return (
      <>
        {this.sel}
        {this.bel}
      </>
    );
  }
}
