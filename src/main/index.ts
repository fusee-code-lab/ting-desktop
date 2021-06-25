import { resolve } from 'path';
import { app, globalShortcut, ipcMain, BrowserWindowConstructorOptions } from 'electron';
import { logOn } from './modular/log';
import { fileOn } from './modular/file';
import { pathOn } from './modular/path';
import Window from './modular/window';
import Global from './modular/global';
import { musicApiOn, appStartCfg } from './modular/musicapi';

class Init {

  private initWindowOpt: BrowserWindowConstructorOptions = { //初始化创建窗口参数
    customize: {
      isMainWin: true,
      route: '/main'
    }
  };

  constructor() {
  }

  /**
   * 初始化并加载
   * */
  async init() {
    //协议调起
    let args = [];
    if (!app.isPackaged) args.push(resolve(process.argv[1]));
    args.push('--');
    if (!app.isDefaultProtocolClient(app.name, process.execPath, args))
      app.setAsDefaultProtocolClient(app.name, process.execPath, args);
    app.allowRendererProcessReuse = true;
    //重复启动(单例)
    if (!app.requestSingleInstanceLock()) {
      app.quit();
    } else {
      app.on('second-instance', () => {
        // 当运行第二个实例时,将会聚焦到main窗口
        if (Window.main) {
          if (Window.main.isMinimized()) Window.main.restore();
          Window.main.focus();
        }
      });
    }
    //关闭所有窗口退出
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
    app.on('activate', () => {
      if (Window.windowsAllGet().length === 0) {
        Window.windowCreate(this.initWindowOpt);
      }
    });
    //获得焦点时发出
    app.on('browser-window-focus', () => {
      //关闭刷新
      globalShortcut.register('CommandOrControl+R', () => {
      });
    });
    //失去焦点时发出
    app.on('browser-window-blur', () => {
      // 注销关闭刷新
      globalShortcut.unregister('CommandOrControl+R');
    });
    //app重启
    ipcMain.on('app-relaunch', () => {
      app.relaunch({ args: process.argv.slice(1) });
    });
    //启动
    await Promise.all([Global.init(), app.whenReady()]);
    //模块、创建窗口、托盘
    await this.modular();
    setTimeout(() => {
      Window.windowCreate(this.initWindowOpt);
      Window.trayCreate();
    }, process.platform === 'linux' ? 1000 : 0);
  }

  /**
   * 模块
   * */
  async modular() {
    //开启模块监听
    logOn();
    fileOn();
    pathOn();
    Global.on();
    Window.on();

    //自定义模块
    import('./modular/dialog').then(({ Dialog }) => new Dialog().on());
    import('./modular/menu').then(({ Menus }) => new Menus().on());
    import('./modular/session').then(({ Session }) => new Session().on());

    //ting
    musicApiOn();
    await appStartCfg();

  }
}

/**
 * 启动
 * */
new Init().init().then();
