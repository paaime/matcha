import { connectToDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
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

    return NextResponse.json({ users: rows });
  } catch (error) {
    return NextResponse.json(
      { error_msg: 'Something went wrong, please try again.' },
      { status: 500 }
    );
  }
}
