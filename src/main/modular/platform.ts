import { release } from 'os';
import { dialog, app } from 'electron';

export function win32() {
  if (Number(release().split('.')[0]) < 10) {
    dialog.showMessageBoxSync({
      message: '系统版本过低',
      detail: '仅支持win10及以上版本',
      type: 'none',
      title: app.name
    });
    app.exit();
  }
}

export function linux() {
}

export function darwin() {
}

export const Platform: { [key: string]: Function } = {
  win32,
  linux,
  darwin
};
