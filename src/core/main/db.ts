import Database from 'better-sqlite3';
import { sep } from 'path';
import { app, ipcMain } from 'electron';
import { normalize } from '@/main/modular/path';
import { access, mkdir } from '@/main/modular/file';
import { logError } from '@/main/modular/log';

export class Db {
  private static instance: Db;
  private dbPath: string = app.getPath('userData') + `${sep}db`;

  public Dbs: { [key: string]: any } = {};

  static getInstance() {
    if (!Db.instance) Db.instance = new Db();
    return Db.instance;
  }

  constructor() {}

  async createDb(name: string) {
    if (!(await access(this.dbPath))) await mkdir(this.dbPath);
    const filename = normalize(this.dbPath + sep + name + '.db');
    this.Dbs[name] = new Database(filename);
  }

  close(name: string) {
    if (!this.Dbs[name]) return;
    this.Dbs[name].close();
  }

  /**
   * 删除表
   * @param dbName
   * @param tableName
   */
  delTable(dbName: string, tableName: string): Promise<boolean> {
    return new Promise((resolve) => {
      const sql = `DROP TABLE "${tableName}"`;
      this.Dbs[dbName].run(sql, (err) => {
        if (err) {
          console.log(err);
          logError(`[Db ${dbName} ${tableName}]`, err);
          resolve(false);
          return;
        }
        resolve(true);
      });
    });
  }

  /**
   * 执行
   * @param dbName
   * @param sql
   */
  run(dbName: string, sql: string) {
    return new Promise((resolve) => {
      this.Dbs[dbName].run(sql, (err) => {
        if (err) {
          console.log(err);
          logError(`[Db :run: ${dbName} ${sql}]`, err);
          resolve(false);
          return;
        }
        resolve(true);
      });
    });
  }

  /**
   * 获取
   * @param dbName
   * @param sql
   */
  get(dbName: string, sql: string): Promise<any> {
    return new Promise((resolve) => {
      this.Dbs[dbName].get(sql, (err, row) => {
        if (err) {
          console.log(err);
          logError(`[Db ${dbName} ${sql}]`, err);
          resolve(0);
          return;
        }
        resolve(row);
      });
    });
  }

  /**
   * 获取全部
   * @param dbName
   * @param sql
   */
  all(dbName: string, sql: string): Promise<any> {
    return new Promise((resolve) => {
      this.Dbs[dbName].all(sql, (err, rows) => {
        if (err) {
          console.log(err);
          logError(`[Db ${dbName} ${sql}]`, err);
          resolve(0);
          return;
        }
        resolve(rows);
      });
    });
  }

  /**
   * 分页获取
   * @param dbName
   * @param tableName
   * @param page
   * @param size
   */
  page(
    dbName: string,
    tableName: string,
    page: number,
    size: number
  ): Promise<boolean | { code: string; type?: number }[]> {
    return new Promise((resolve) => {
      const sql = `SELECT * FROM "${tableName}" LIMIT (${page}-1)*${size},${size}`;
      this.Dbs[dbName].all(sql, async (err, rows: { code: string; type?: number }[]) => {
        if (err) {
          logError(`[Db ${dbName} ${tableName}]`, err);
          resolve(false);
          return;
        }
        if (rows.length === 0) {
          resolve(false);
          return;
        }
        resolve(rows);
      });
    });
  }

  on() {
    ipcMain.handle('db-create', (event, args) => this.createDb(args.dbName));
    ipcMain.handle('db-del-table', (event, args) => this.delTable(args.dbName, args.sql));
    ipcMain.handle('db-run', (event, args) => this.run(args.dbName, args.sql));
    ipcMain.handle('db-get', (event, args) => this.get(args.dbName, args.sql));
    ipcMain.handle('db-all', (event, args) => this.all(args.dbName, args.sql));
    ipcMain.handle('db-close', (event, args) => this.close(args.dbName));
  }
}

export default Db.getInstance();
