import mysql from 'mysql2/promise';

export async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: parseInt(process.env.MYSQL_PORT || '3306', 10),
      namedPlaceholders: true
    });
    return connection;
  } catch (error) {
    // console.error('Erreur de connexion à MySQL :', error);
    throw error;
    return null;
  }
}
