import { preload } from '@youliso/electronic/render';
import type { Customize } from '@youliso/electronic/types';
import type {
  BrowserWindowConstructorOptions,
  OpenDialogOptions,
  OpenDialogReturnValue,
  SaveDialogOptions,
  SaveDialogReturnValue
} from 'electron';

export const showOpenDialog = (
  options: OpenDialogOptions,
  winId: number = window.customize.winId
) => preload.invoke<OpenDialogReturnValue>('open-directory-dialog', { options, winId });

export const showSaveDialog = (
  options: SaveDialogOptions,
  winId: number = window.customize.winId
) => preload.invoke<SaveDialogReturnValue>('save-directory-dialog', { options, winId });

export const createDialogWindow = (
  route: string,
  customize?: Customize,
  bwopts?: BrowserWindowConstructorOptions,
  winId?: number
) => preload.invoke<number | undefined>('window-dialog', { route, winId, customize, bwopts });
