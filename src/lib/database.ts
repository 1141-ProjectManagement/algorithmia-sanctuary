import initSqlJs, { Database } from 'sql.js';

let db: Database | null = null;

export interface User {
  id: number;
  email: string;
  nickname: string;
  created_at: string;
}

export interface Progress {
  id: number;
  user_id: number;
  chapter_id: string;
  gate_id: string;
  completed: boolean;
  completed_at?: string;
}

export async function initDatabase(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`
  });

  // Try to load existing database from localStorage
  const savedDb = localStorage.getItem('algorithmia_db');
  
  if (savedDb) {
    const uint8Array = new Uint8Array(JSON.parse(savedDb));
    db = new SQL.Database(uint8Array);
  } else {
    db = new SQL.Database();
    
    // Create tables
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        nickname TEXT NOT NULL,
        created_at TEXT NOT NULL,
        auth_provider TEXT DEFAULT 'local'
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        chapter_id TEXT NOT NULL,
        gate_id TEXT NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT 0,
        completed_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id, chapter_id, gate_id)
      );
    `);

    saveDatabase();
  }

  return db;
}

export function saveDatabase(): void {
  if (!db) return;
  
  const data = db.export();
  const buffer = Array.from(data);
  localStorage.setItem('algorithmia_db', JSON.stringify(buffer));
}

export async function createUser(email: string, nickname: string): Promise<User | null> {
  const database = await initDatabase();
  
  try {
    database.run(
      'INSERT INTO users (email, nickname, created_at) VALUES (?, ?, ?)',
      [email, nickname, new Date().toISOString()]
    );
    saveDatabase();

    const result = database.exec('SELECT * FROM users WHERE email = ?', [email]);
    if (result[0]) {
      const row = result[0].values[0];
      return {
        id: row[0] as number,
        email: row[1] as string,
        nickname: row[2] as string,
        created_at: row[3] as string,
      };
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }

  return null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const database = await initDatabase();
  
  const result = database.exec('SELECT * FROM users WHERE email = ?', [email]);
  
  if (result[0] && result[0].values.length > 0) {
    const row = result[0].values[0];
    return {
      id: row[0] as number,
      email: row[1] as string,
      nickname: row[2] as string,
      created_at: row[3] as string,
    };
  }
  
  return null;
}

export async function saveProgress(
  userId: number,
  chapterId: string,
  gateId: string,
  completed: boolean
): Promise<void> {
  const database = await initDatabase();
  
  try {
    database.run(
      `INSERT OR REPLACE INTO progress (user_id, chapter_id, gate_id, completed, completed_at)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, chapterId, gateId, completed ? 1 : 0, completed ? new Date().toISOString() : null]
    );
    saveDatabase();
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

export async function getProgress(userId: number, chapterId: string): Promise<Progress[]> {
  const database = await initDatabase();
  
  const result = database.exec(
    'SELECT * FROM progress WHERE user_id = ? AND chapter_id = ?',
    [userId, chapterId]
  );
  
  if (result[0]) {
    return result[0].values.map((row) => ({
      id: row[0] as number,
      user_id: row[1] as number,
      chapter_id: row[2] as string,
      gate_id: row[3] as string,
      completed: Boolean(row[4]),
      completed_at: row[5] as string | undefined,
    }));
  }
  
  return [];
}

export async function getCurrentUser(): Promise<User | null> {
  const currentUserEmail = localStorage.getItem('current_user_email');
  if (!currentUserEmail) return null;
  
  return getUserByEmail(currentUserEmail);
}

export function setCurrentUser(email: string): void {
  localStorage.setItem('current_user_email', email);
}

export function logoutUser(): void {
  localStorage.removeItem('current_user_email');
}

// Define all chapters and gates
const ALL_GATES = [
  { chapterId: 'chapter1', gates: ['gate1', 'gate2', 'gate3', 'gate4', 'gate5'] },
  { chapterId: 'chapter2', gates: ['gate1', 'gate2', 'gate3', 'gate4', 'gate5', 'gate6', 'gate7', 'gate8'] },
  { chapterId: 'chapter3', gates: ['gate1', 'gate2', 'gate3', 'gate4', 'gate5', 'gate6', 'gate7', 'gate8', 'gate9', 'gate10'] },
  { chapterId: 'chapter4', gates: ['gate1', 'gate2', 'gate3', 'gate4', 'gate5', 'gate6', 'gate7', 'gate8', 'gate9', 'gate10', 'gate11', 'gate12'] },
  { chapterId: 'chapter5', gates: ['gate1', 'gate2', 'gate3', 'gate4', 'gate5', 'gate6', 'gate7', 'gate8'] },
  { chapterId: 'chapter6', gates: ['gate1', 'gate2', 'gate3', 'gate4'] },
];

export async function unlockAllGates(userId: number): Promise<void> {
  const database = await initDatabase();
  
  try {
    for (const chapter of ALL_GATES) {
      for (const gateId of chapter.gates) {
        database.run(
          `INSERT OR REPLACE INTO progress (user_id, chapter_id, gate_id, completed, completed_at)
           VALUES (?, ?, ?, ?, ?)`,
          [userId, chapter.chapterId, gateId, 1, new Date().toISOString()]
        );
      }
    }
    saveDatabase();
  } catch (error) {
    console.error('Error unlocking all gates:', error);
  }
}
