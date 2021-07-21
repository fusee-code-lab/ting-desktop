/**
 * 指定headers
 */
export function sessionSetHeaders(args: { [key: string]: { [key: string]: string } }) {
    window.ipc.send("session-set-headers", args);
}
