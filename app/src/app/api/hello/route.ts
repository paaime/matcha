import { connectToDatabase } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    let data = { message: 'loading', users: []};

    try {
      const connection = await connectToDatabase();
      // Utiliser la connexion pour effectuer des requêtes à la base de données

      // Get all users
      const [rows] = await connection.query('SELECT * FROM User');
      console.log('rows', rows);

      // Close the connection
      await connection.end();

      return new Response(JSON.stringify(rows));
    } catch (error) {
      // Gérer les erreurs de connexion

      console.error('Erreur de connexion à MySQL :', error);
    }

    return new Response(JSON.stringify(data));
  } catch (e) {
    return NextResponse.json(
      { error_msg: 'Something went wrong, please try again.' },
      { status: 500 }
    );
  }
}