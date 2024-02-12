import { connectToDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const id = parseInt(req.url.split('/').pop());
    
    if (typeof id !== "number" || id < 0 || Number.isNaN(id)) {
      throw new Error("Rash");
    }
    
    const db = await connectToDatabase();

    // Check if user exists
    const [userData] = await db.query("SELECT * FROM User WHERE id = ?", [id]);

    if (!userData) {
      throw new Error("User not found");
    }

    // Get user's matches
    const [userMatches] = await db.query("SELECT * FROM Matchs WHERE user_id = ? OR other_user_id = ?", [id, id]);

    // Get user's likes
    const [userLikes] = await db.query("SELECT * FROM UserLike WHERE user_id = ?", [id]);

    // Close the connection
    await db.end();

    return NextResponse.json({ userId: id, user: userData, matches: userMatches, likes: userLikes });
  } catch (error) {
    return NextResponse.json(
      {
        type: 'error',
        error_msg: 'Something went wrong, please try again.',
        message: error.message
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const id = parseInt(req.url.split('/').pop());
    
    if (typeof id !== "number" || id < 0 || Number.isNaN(id)) {
      throw new Error("Rash");
    }
    
    const db = await connectToDatabase();

    // Get all users
    const [rows] = await db.query('SELECT * FROM User');

    // insert user
    const newUser = {
      lastName: 'Doe',
      firstName: 'John',
      age: 30,
      passwordHashed: 'hashedpassword',
      email: 'john.doe@example.com',
      loc: 'Paris',
      gender: 'male',
      sexualPreferences: 'female',
      biography: 'Hello, I am John Doe',
      pictures: 'picture1.jpg,picture2.jpg',
      fameRating: 4.5
    };

    const query = 'INSERT INTO User (lastName, firstName, age, passwordHashed, email, loc, gender, sexualPreferences, biography, pictures, fameRating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    await db.query(query, [newUser.lastName, newUser.firstName, newUser.age, newUser.passwordHashed, newUser.email, newUser.loc, newUser.gender, newUser.sexualPreferences, newUser.biography, newUser.pictures, newUser.fameRating]);

    // Close the connection
    await db.end();

    return NextResponse.json({ userId: id, users: rows });
  } catch (error) {
    return NextResponse.json(
      { error_msg: 'Something went wrong, please try again.' },
      { status: 500 }
    );
  }
}
