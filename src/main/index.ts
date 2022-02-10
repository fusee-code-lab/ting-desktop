import App from './modular/app';
import Shortcut from './modular/shortcut';
import Global from './modular/global';
import Window from './modular/window';
import Tray from './modular/tray';
import Session from './modular/session';
import Dialog from './modular/dialog';
import Menu from './modular/menu';
import Socket from './modular/socket';
import { logOn } from './modular/log';
import { pathOn } from './modular/path';
import { fileOn } from './modular/file';
import { musicApiOn, appStartCfg } from '@/core/main/musicapi';
import { customize, opt } from '@/cfg/window.json';

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
await Promise.all([App.use([Session, Dialog, Menu, Socket]), appStartCfg()]);
// 窗口
const tingCfg = Global.getGlobal<{ [key: string]: unknown } | 0>('setting.cfg');
if (tingCfg === 0 || tingCfg!.first) {
  opt.width = 800;
  opt.height = 600;
  customize.route = '/welcome';
}
Window.create(customize, opt);
// 托盘
Tray.create();
