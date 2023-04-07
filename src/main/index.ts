import { appInstance } from '@youliso/electronic/main/app';
import { windowInstance } from '@youliso/electronic/main/window';
import { globalInstance } from '@youliso/electronic/main/global';
import { Session } from '@youliso/electronic/main/session';
import { createTray } from '@youliso/electronic/main/tray';
import { logError } from '@youliso/electronic/main/log';
import { app } from 'electron';
import { customize, opt } from '@/cfg/window.json';
import { musicApiOn, appStartCfg } from './modular/musicapi';
import { dialogOn } from './modular/dialog';
import { fileOn } from './modular/resources';
import logo from '@/assets/logo.png';

appInstance.start().then(async () => {
  const tray = createTray({
    name: customize.title,
    iconPath: logo as string
  });
  const session = new Session();
  tray.on('click', () => windowInstance.func('show'));

  session.on();
  dialogOn();
  fileOn();
  musicApiOn();
  await appStartCfg();

  const tingCfg = globalInstance.getGlobal<{ [key: string]: unknown } | 0>('setting.cfg');
  if (tingCfg === 0 || (tingCfg && tingCfg.first)) {
    opt.width = 800;
    opt.height = 600;
    customize.route = '/welcome';
  }

  // 调试模式
  if (!app.isPackaged) {
    try {
      import('fs').then(({ readFileSync }) => {
        import('path').then(({ join }) => {
          windowInstance.setDefaultCfg({
            defaultLoadType: 'url',
            defaultUrl: `http://localhost:${readFileSync(join('.port'), 'utf8')}`
          });
          const win = windowInstance.create(customize, {
            ...opt,
            webPreferences: {
              devTools: true
            }
          });
          win &&
            windowInstance
              .load(win, {
                openDevTools: true
              })
              .catch(console.error);
        });
      });
    } catch (e) {
      throw 'not found .port';
    }
  } else {
    const win = windowInstance.create(customize, opt);
    win && windowInstance.load(win).catch(logError);
  }
});
