import Database from 'better-sqlite3';
import path from 'path';

export interface PC {
  id: string;
  aula: string;
  numero: number;
  estado: string;
}

export interface Ticket {
  id: string;
  pc_id: string;
  aula: string;
  falla: string;
  creado_en: string;
}

const dbPath = path.join(process.cwd(), 'laboratorios.db');

declare global {
  var _db: Database.Database | undefined;
}

function getDatabase(): Database.Database {
  if (!global._db) {
    global._db = initDatabase(new Database(dbPath));
  }
  return global._db;
}

function initDatabase(dbInstance: Database.Database): Database.Database {
  dbInstance.pragma('journal_mode = WAL');

  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS pcs (
      id TEXT PRIMARY KEY,
      aula TEXT NOT NULL,
      numero INTEGER NOT NULL,
      estado TEXT NOT NULL DEFAULT 'OPERATIVO'
    );

    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      pc_id TEXT NOT NULL,
      aula TEXT NOT NULL,
      falla TEXT NOT NULL,
      creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pc_id) REFERENCES pcs(id)
    );
  `);

  const countRow = dbInstance.prepare('SELECT COUNT(*) as count FROM pcs').get() as { count: number };
  if (countRow.count === 0) {
    const aulas = ['201', '202', '203', '301', '302', '303'];
    const insertPc = dbInstance.prepare('INSERT INTO pcs (id, aula, numero, estado) VALUES (?, ?, ?, ?)');

    const seedTransaction = dbInstance.transaction(() => {
      for (const aula of aulas) {
        for (let num = 1; num <= 30; num++) {
          const paddedNum = String(num).padStart(2, '0');
          const pcId = `PC-${paddedNum}-LAB${aula}`;
          insertPc.run(pcId, aula, num, 'OPERATIVO');
        }
      }
    });

    seedTransaction();
    console.log('✅ Base de datos inicializada y 180 PCs creadas exitosamente.');
  }

  return dbInstance;
}

export const db = getDatabase();
export default db;