import type { OpenDialogOptions } from 'electron';

/**
 * 打开dialog
 * @param winId
 * @param params
 */
export async function openDialog(
  params: OpenDialogOptions,
  winId: number = window.customize.winId!
) {
  return window.ipc.invoke('open-dialog', { winId, params });
}
