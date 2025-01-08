import db from './db';

export function createUser(email, password) {
  const insert = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
  const { lastInsertRowid } = insert.run(email, password);
  return lastInsertRowid;
}

export function getUserByEmail(email) {
  const select = db.prepare('SELECT * FROM users WHERE email = ?');
  return select.get(email);
}