import { IUser } from '../../../../types/user';
import { connectToDatabase } from '../../../utils/db';

// Définissez la fonction getUserWithId pour récupérer un utilisateur par son identifiant
export async function getUserWithId(userId: number): Promise<IUser | null>{
  try {
    const db = await connectToDatabase();

    // Exécutez une requête SQL pour récupérer l'utilisateur par son identifiant
    const [rows] = await db.query('SELECT * FROM User WHERE id = ?', [userId]) as any;

    // Vérifiez si l'utilisateur a été trouvé
    if (!rows || rows.length === 0) {
      console.error('Aucun utilisateur trouvé avec l\'ID', userId);

      db.end();
      return null;
    }

    const user: IUser = {
      id: rows[0].id,
      firstName: rows[0].firstName,
      lastName: rows[0].lastName,
      age: rows[0].age,
      gender: rows[0].gender,
      sexualPreferences: rows[0].sexualPreferences,
      biography: rows[0].biography,
      pictures: rows[0].pictures,
      fameRating: rows[0].fameRating,
      isMatch: false,
      isLiked: false,
      hasLiked: false,
      isBlocked: false,
      hasBlocked: false,
      matchId: undefined,
      interests: [],
    }

    // Get user interests
    const [interests] = await db.query('SELECT * FROM Tags WHERE user_id = ?', [userId]) as any;

    user.interests = interests || [];

    // Calculate distance
    user.distance = Math.floor(Math.random() * 100) + 1; // ! Random for now

    // Close the connection
    await db.end();

    return user;
  } catch (error) {
    console.error('Error while getting user with ID', userId, ':', error);
    return null;
  }
}
