import { resolve, join } from 'path';
import { app, BrowserWindow, globalShortcut, ipcMain, Menu, screen } from 'electron';
import { IPC_MSG_TYPE } from '@/lib/interface';
import { logOn } from './modular/log';
import { fileOn } from './modular/file';
import { Session } from './modular/session';
import { Window } from './modular/window';
import { Menus } from './modular/menu';
import Global from './modular/global';
import { musicApiOn } from '@/main/modular/musicapi';
import { readFileSync } from 'original-fs';

class Init {
  private menus = new Menus();
  private window = new Window();
  private session = new Session();

  constructor() {}

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
    //重复启动
    if (!app.requestSingleInstanceLock()) {
      app.quit();
    } else {
      app.on('second-instance', () => {
        // 当运行第二个实例时,将会聚焦到main窗口
        if (this.window.main) {
          if (this.window.main.isMinimized()) this.window.main.restore();
          this.window.main.focus();
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
      if (this.window.getAllWindows().length === 0) {
        this.window.createWindow({ isMainWin: true });
        this.attachFrameLessContext();
      }
    });
    //获得焦点时发出
    app.on('browser-window-focus', () => {
      //关闭刷新
      globalShortcut.register('CommandOrControl+R', () => {});
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
    //app常用获取路径
    ipcMain.on('app-path-get', (event, args) => {
      event.returnValue = app.getPath(args.key);
    });
    //启动
    await Promise.all([Global.init(), app.whenReady()]);
    //模块、创建窗口、托盘
    this.modular();
    this.window.createWindow({ isMainWin: true });
    this.attachFrameLessContext();
    this.window.createTray();
  }

  /**
   * 模块
   * */
  modular() {
    //消息反馈(根据需要增加修改)
    ipcMain.on('message-send', (event, args) => {
      switch (args.type) {
        case IPC_MSG_TYPE.WIN: //window模块
          for (let i in this.window.group)
            if (this.window.group[i])
              this.window.getWindow(Number(i)).webContents.send('message-back', args);
          break;
      }
    });
    //开启模块监听
    logOn();
    fileOn();
    musicApiOn();
    this.menus.on();
    this.window.on();
    this.session.on();
  }

  private async attachFrameLessContext() {
    // TODO support multiple screen
    await app.whenReady();

    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    const mainWindow = this.window.main;
    const window = new BrowserWindow({
      width,
      height,
      frame: false,
      skipTaskbar: true,
      focusable: false,
      show: true,
      resizable: false,
      transparent: true,
      webPreferences: {
        preload: join(__dirname, './preload.bundle.js'),
        contextIsolation: true,
        nodeIntegration: false,
        devTools: !app.isPackaged,
        webSecurity: false
      }
    });

    if (!app.isPackaged) {
      //调试模式
      let appPort = '';
      try {
        appPort = readFileSync(join('.port'), 'utf8');
      } catch (e) {
        throw 'not found .port';
      }
      window.loadURL(`http://localhost:${appPort}`).then();
    } else {
      window.loadFile(join(__dirname, './index.html')).then();
    }

    window.webContents.on('did-finish-load', () => {
      console.log(new Date(), 'here');
      window.webContents.send('window-load', {
        platform: Global.sharedObject['platform'],
        appInfo: Global.sharedObject['appInfo'],
        route: '/contextEnv'
      });
    });

    // window.webContents.openDevTools();
    window.setFocusable(false);
    window.setAlwaysOnTop(true);
    window.setIgnoreMouseEvents(true);

    let isFocusOnContextEnv = false;
    ipcMain.on('mouse-right-click', (e, arg) => {
      console.log('c', arg);
      const { x: windowX, y: windowY } = mainWindow.getBounds();
      window.webContents.send('show-context-menu', {
        left: arg.x + (isFocusOnContextEnv ? 0 : windowX),
        top: arg.y + (isFocusOnContextEnv ? 0 : windowY)
      });
      isFocusOnContextEnv = true;
      window.setIgnoreMouseEvents(false);
    });
    ipcMain.on("mouse-left-click", (e, arg) => {
      window.webContents.send('hide-context-menu');
      isFocusOnContextEnv = false;
      window.setIgnoreMouseEvents(true);
    });
    ipcMain.on('mouse-move', (e, arg) => {
      const mainBounds = mainWindow.getBounds();
      const x = arg.x + (isFocusOnContextEnv ? 0 : mainBounds.x);
      const y = arg.y + (isFocusOnContextEnv ? 0 : mainBounds.y);
      if (
        x < mainBounds.x ||
        y > mainBounds.x + mainBounds.width ||
        y < mainBounds.y ||
        y > mainBounds.y + mainBounds.height
      ) {
        // isFocusOnContextEnv = false;
        console.log("out here")
        window.setIgnoreMouseEvents(true);
      } else if (isFocusOnContextEnv) {
        window.setIgnoreMouseEvents(false);
      }
    });

    window.on('show', () => {});

    app.on('browser-window-blur', (event, win) => {
      window.webContents.send('hide-context-menu');
      isFocusOnContextEnv = false;
      window.setIgnoreMouseEvents(true);
      window.setAlwaysOnTop(false);
      window.hide();
    });
    app.on('browser-window-focus', (event, win) => {
      window.setAlwaysOnTop(true);
      window.show();
    });
    ipcMain.on('show-context-menu', () => {});
  }
}

/**
 * 启动
 * */
new Init().init().then();
