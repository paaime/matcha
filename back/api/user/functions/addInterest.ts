import { Response } from 'express';
import { connectToDatabase } from '../../../utils/db';
import { interestRegex } from '../../../types/regex';

export async function addInterest(body: any, res: Response): Promise<undefined>{
  try {
    // Get infos from body
    const { interest } = body;

    if (!interest || !interestRegex.test(interest)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Interest is missing',
      });
      return;
    }

    const db = await connectToDatabase();

    const user_id = 14; // TODO get from request auth

    const query = 'INSERT INTO Tags (user_id, tagName) VALUES (?, ?)';

    // Execute the query and check the result
    const [rows] = await db.query(query, [user_id, interest]) as any;
    const id = rows.insertId;

    // Close the connection
    await db.end();

    if (!id) {
      throw new Error('Interest not added');
    }

    res.status(200).json({
      tagName: interest,
      added: true
    });
  } catch (error) {
    console.error('Error while adding interest', ':', error);
    
    res.status(501).json({
      error: 'Server error',
      message: 'An error occurred while adding the interest',
    });
  }
}
