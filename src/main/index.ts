import { appInstance } from 'ym-electron/main/app';
import { windowInstance } from 'ym-electron/main/window';
import { Session } from 'ym-electron/main/session';
import { Tray } from 'ym-electron/main/tray';
import { logError } from 'ym-electron/main/log';
import { app } from 'electron';
import { musicApiOn } from '@/main/modular/musicapi';
import { customize, opt } from '@/cfg/window.json';
import tray from '@/assets/tray.png';

appInstance
  .start()
  .then(() => {
    const tary = new Tray();
    const session = new Session();

    tary.on();
    session.on();

    musicApiOn();

    // 调试模式
    if (!app.isPackaged) {
      try {
        import('fs').then(({ readFileSync }) => {
          import('path').then(({ join }) => {
            windowInstance.loadUrl = `http://localhost:${readFileSync(join('.port'), 'utf8')}`;
            windowInstance.create(customize, opt);
          });
        });
      } catch (e) {
        throw 'not found .port';
      }
    } else windowInstance.create(customize, opt);

    tary.create(tray);
  })
  .catch(logError);
