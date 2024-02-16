import { Response } from 'express';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '../../../utils/db';

// TODO: temporary, remove when the real api is ready

export async function addRandom( res: Response): Promise<undefined>{
  try {
    const password = "password";
    const email = Math.random().toString(36).substring(2, 15) + "@gmail.com";

    // Api to get random user
    const response = await fetch('https://randomuser.me/api/');

    const datas = await response.json() as any;
    const data = datas.results[0];

    const firstName = data['name']['first'];
    const lastName = data['name']['last'];
    const age = data['dob']['age'];
    const gender = data['gender'];
    const sexualPreferences = gender === "male" ? "female" : "male";
    const city = data['location']['city'];
    const loc = data['location']['coordinates']['latitude'] + ',' + data['location']['coordinates']['longitude'];
    const pictures = data['picture']['large'];
    const biography = "I'm a random user named " + firstName + " " + lastName + " and I'm " + age + " years old. I'm looking for a " + sexualPreferences + " partner.";

    const db = await connectToDatabase();

    // Hash password
    const passwordHashed = bcrypt.hashSync(password, 10);

    // Generate token to verify email
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const tokenHashed = bcrypt.hashSync(token, 10);
    
    const query = 'INSERT INTO User (lastName, firstName, age, passwordHashed, email, emailToken, loc, city, gender, sexualPreferences, biography, pictures) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    // Insert the user into the database and return the id
    const [rows] = await db.query(query, [
      lastName,
      firstName,
      age,
      passwordHashed,
      email,
      tokenHashed,
      loc,
      city,
      gender,
      sexualPreferences,
      biography,
      pictures
    ]) as any;

    const id = rows.insertId;

    // Close the connection
    await db.end();

    if (!id) {
      throw new Error('User not added');
    }

    // TODO : Send email to verify the account

    res.status(200).json({
      id: id,
      lastName: lastName,
      firstName: firstName,
      email: email,
      password: password,
    });
  } catch (error) {
    console.error('Error while adding user', ':', error);

    res.status(501).json({
      error: 'Server error',
      message: 'An error occurred while adding the user'
    });
  }
}
