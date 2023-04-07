import { dialog, ipcMain } from 'electron';
import { windowInstance } from '@youliso/electronic/main/window';

/**
 * 监听
 */
export function dialogOn() {
  ipcMain.handle('open-dialog', (event, args) =>
    dialog.showOpenDialog(windowInstance.get(args.winId)!, args.params)
  );
}
