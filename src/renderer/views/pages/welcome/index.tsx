import { windowShow, windowCreate, windowClose } from '@/renderer/common/window';
import style from './style';
import logo from '@/assets/logo.png';
import rocket from '@/assets/rocket.png';

export default class Welcome implements View {
  bgImgLoad() {
    const el = (<img class="bg" src={rocket} alt="bg" />) as HTMLImageElement;
    el.onload = () => this.load();
    return el;
  }

  logoImgLoad() {
    const el = (<img class="bg" src={logo} alt="logo" />) as HTMLImageElement;
    el.onload = () => this.load();
    return el;
  }

  num: number = 0;
  load() {
    this.num++;
    this.num === 2 && windowShow();
  }

  start() {
    windowCreate(
      {
        title: 'Ting',
        route: '/index',
        data: 'first'
      },
      {
        width: 980,
        height: 700,
        resizable: true
      }
    );
    windowClose();
  }

  render() {
    return (
      <div class={style}>
        {this.bgImgLoad()}
        <div class="main">
          <div class="content">
            {this.logoImgLoad()}
            <div class="title">
              欢迎来到
              <span style="margin-left: 10px">Ting</span>
            </div>
            <button class="but" onClick={this.start}>
              开始
            </button>
          </div>
        </div>
      </div>
    );
  }
}
