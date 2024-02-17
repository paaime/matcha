import { Response } from 'express';
import jwt from 'jsonwebtoken';

import { connectToDatabase } from '../../../utils/db';
import { interestRegex } from '../../../types/regex';
import { JwtDatas, ThrownError } from '../../../types/type';

export async function addInterest(body: any, token: string, res: Response): Promise<undefined>{
  try {
    // Decryption of token
    const tokenContent = token.trim();

    // Get token JWT infos
    const decoded = jwt.decode(tokenContent) as JwtDatas;

    if (!decoded || !decoded.id || !Number.isInteger(decoded.id) || decoded.id < 1) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token'
      });
      return;
    }

    const user_id = decoded.id;

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

    console.error({ code, message });
    
    res.status(501).json({
      error: 'Server error',
      message: 'An error occurred while adding the interest',
    });
  }
}
