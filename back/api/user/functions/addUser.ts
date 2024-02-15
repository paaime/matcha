import { connectToDatabase } from '../../../utils/db';

export async function addUser(body: any): Promise<number | null>{
  try {
    const db = await connectToDatabase();

    // Get infos from body
    const newUser = {
      lastName: body?.lastName || 'Doe',
      firstName: body?.firstName || 'John',
      age: body?.age || 30,
      passwordHashed: body?.password || 'hashedpassword',
      email: body?.email || 'aaa.bbb@cc.ddd',
      loc: body?.loc || 'Paris',
      gender: body?.gender || 'other',
      sexualPreferences: body?.sexualPreferences || 'both',
      biography: body?.biography || 'Hello, I am John Doe',
      pictures: body?.pictures || 'picture1.jpg,picture2.jpg'
    }

    const query = 'INSERT INTO User (lastName, firstName, age, passwordHashed, email, loc, gender, sexualPreferences, biography, pictures) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    await db.query(query, [newUser.lastName, newUser.firstName, newUser.age, newUser.passwordHashed, newUser.email, newUser.loc, newUser.gender, newUser.sexualPreferences, newUser.biography, newUser.pictures]) as any;

    // Get last inserted user
    const [rows] = await db.query('SELECT * FROM User ORDER BY id DESC LIMIT 1') as any;
    const id = rows[0].id;

    // Close the connection
    await db.end();

    return id;
  } catch (error) {
    console.error('Error while adding user', ':', error);
    return null;
  }
}
