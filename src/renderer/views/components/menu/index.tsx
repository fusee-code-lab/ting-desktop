import Search from './components/search';
import style from './style';

export default class Menu {
  search = new Search();

  render() {
    return (
      <div class={style}>
        <div class="elastic"></div>
        <div class="search">{this.search.render()}</div>
      </div>
    );
  }
}
