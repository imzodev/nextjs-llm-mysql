import mysql from 'mysql2/promise';
import { ServerConfig } from '../types';

// Database connection configuration
const dbConfig: ServerConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce',
  port: parseInt(process.env.DB_PORT || '3306'),
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

export async function executeQuery<T>(query: string, params: any[] = []): Promise<T> {
  try {
    const [rows] = await pool.execute(query, params);
    return rows as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Failed to execute database query');
  }
}

// Helper functions for common database operations
export async function findAll<T>(table: string): Promise<T[]> {
  return executeQuery<T[]>(`SELECT * FROM ${table}`);
}

export async function findById<T>(table: string, id: string): Promise<T> {
  const results = await executeQuery<T[]>(`SELECT * FROM ${table} WHERE id = ?`, [id]);
  return results[0];
}

export async function findByField<T>(table: string, field: string, value: any): Promise<T[]> {
  return executeQuery<T[]>(`SELECT * FROM ${table} WHERE ${field} = ?`, [value]);
}

export async function create<T>(table: string, data: Record<string, any>): Promise<T> {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => '?').join(', ');
  
  const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
  const result = await executeQuery<any>(query, values);
  
  return { id: result.insertId, ...data } as T;
}

export async function update<T>(table: string, id: string, data: Record<string, any>): Promise<T> {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const setClause = keys.map(key => `${key} = ?`).join(', ');
  
  const query = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
  await executeQuery<any>(query, [...values, id]);
  
  return { id, ...data } as T;
}

export async function remove(table: string, id: string): Promise<void> {
  await executeQuery<any>(`DELETE FROM ${table} WHERE id = ?`, [id]);
}

export default pool;
