import type { BrowserWindowConstructorOptions } from 'electron';
import App from './modular/app';
import Shortcut from './modular/shortcut';
import Global from './modular/global';
import Window from './modular/window';
import Tray from './modular/tray';
import { logOn } from './modular/log';
import { pathOn } from './modular/path';
import { fileOn } from './modular/file';
import { musicApiOn, appStartCfg } from './modular/musicapi';

await App.start();
// 主要模块
Shortcut.on();
Global.on();
Window.on();
Tray.on();
logOn();
// 可选模块
fileOn();
pathOn();
musicApiOn();
await App.use([import('./modular/session'), import('./modular/dialog'), import('./modular/menu')]);
await appStartCfg();
// 窗口
const tingCfg = Global.getGlobal<{ [key: string]: unknown } | 0>('setting.cfg');
let opt: BrowserWindowConstructorOptions = {
  customize: {
    route: '/main'
  }
};
if (tingCfg === 0 || tingCfg.first) {
  opt.width = 800;
  opt.height = 600;
  opt.customize.route = '/welcome';
}
Window.create(opt);
// 托盘
Tray.create();
