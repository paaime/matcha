import { Response } from 'express';
import jwt from 'jsonwebtoken';

import { connectToDatabase } from '../../../utils/db';
import { interestRegex } from '../../../types/regex';
import { JwtDatas, ThrownError } from '../../../types/type';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';

export async function addInterest(body: any, req: RequestUser, res: Response): Promise<undefined>{
  try {
    const user_id = getAuthId(req);

    // Check user_id
    if (!user_id || user_id < 1) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid user id',
      });
      return;
    }

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
      user_id,
      added: true
    });
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || "Unknown error";
    const message = e?.message || "Unknown message";

    // Check if duplicate entry
    if (code === 'ER_DUP_ENTRY') {
      res.status(400).json({
        error: 'Bad request',
        message: 'Interest already added: ' + body.interest
      });
      return;
    }

    console.error({ code, message });
    
    res.status(501).json({
      error: 'Server error',
      message: 'An error occurred while adding the interest'
    });
  }
}
