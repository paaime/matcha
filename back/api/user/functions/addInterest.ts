import { Response } from 'express';
import { connectToDatabase } from '../../../utils/db';

// Regex for interest : starts with emoji, then 1 to 20 letters or spaces
const interestRegex = /^[\u{1F000}-\u{1FFFF}\u{2000}-\u{2BFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}]\s[a-zA-Z]{1,20}$/u;

export async function addInterest(body: any, res: Response): Promise<boolean>{
  try {
    // Get infos from body
    const { interest } = body;

    if (!interest) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Interest is missing',
      });
      throw new Error('Interest is missing');
    }

    if (!interestRegex.test(interest)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Interest is not valid',
      });
      throw new Error('Interest is not valid');
    }

    const db = await connectToDatabase();

    const user_id = 1; // TODO get from request auth

    const query = 'INSERT INTO Tags (user_id, tagName) VALUES (?, ?)';

    // Execute the query and check the result
    const [rows] = await db.query(query, [user_id, interest]) as any;
    const id = rows.insertId;

    if (!id) {
      db.end();
      res.status(501).json({
        error: 'Server error',
        message: 'An error occurred while adding interest',
      });
      throw new Error('Error while adding interest');
    }

    // Close the connection
    await db.end();

    return true;
  } catch (error) {
    console.error('Error while adding interest', ':', error);
    return false;
  }
}
