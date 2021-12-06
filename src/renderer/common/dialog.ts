import type { OpenDialogOptions } from 'electron';
import Customize from '@/renderer/store/customize';

/**
 * 打开dialog
 * @param winId
 * @param params
 */
export async function openDialog(
  params: OpenDialogOptions,
  winId: number = Customize.get().id
) {
  return window.ipc.invoke('open-dialog', { winId, params });
}
