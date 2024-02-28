import { Request, Response } from 'express';
import { getGoogleOAuthTokens, getGoogleUser } from '../../../utils/google';
import { connectToDatabase } from '../../../utils/db';
import jwt from 'jsonwebtoken';

export async function googleAuth(
  req: Request,
  res: Response
): Promise<undefined> {
  try {
    const code = req.query.code;
    if (!code) {
      res.redirect(process.env.DOMAIN + '/auth/sign-in');
      return;
    }
    // get the id and access token with the code
    const { id_token, access_token } = await getGoogleOAuthTokens({ code });

    if (!id_token || !access_token) {
      res.redirect(process.env.DOMAIN + '/auth/sign-in');
      return;
    }

    // get user with tokens
    const googleUser = await getGoogleUser({ id_token, access_token });

    if (!googleUser || !googleUser.verified_email) {
      res.redirect(process.env.DOMAIN + '/auth/sign-in');
      return;
    }

    // Check if user exists
    const db = await connectToDatabase();

    const query =
      'SELECT id, firstName, lastName, email, isGoogle FROM User WHERE email = ?';

    // Execute the query and check the result
    const [rows] = (await db.execute(query, [googleUser.email])) as any;

    // If the user already exists but is not a google user, redirect to sign in
    if (rows[0]) {
      const user = rows[0];
      if (!user.isGoogle) {
        db.end();
        res.redirect(process.env.DOMAIN + '/auth/sign-in');
        return;
      } else {
        // Generate token
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          process.env.JWT_SECRET as string,
          {
            expiresIn: '1h',
          }
        );

        // Add token in httpOnly cookie
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });

        res.redirect(process.env.DOMAIN + '/');
        return;
      }
    }

    // If the user does not exist, create it

    const insertQuery =
      'INSERT INTO User (lastName, firstName, email, passwordHashed, isGoogle, isVerified) VALUES (?, ?, ?, ?, ?, ?)';

    // Insert the user into the database and return the id
    const [rowsQuery] = (await db.query(insertQuery, [
      googleUser.given_name,
      googleUser.name,
      googleUser.email,
      '',
      1,
      1,
    ])) as any;

    // Generate token
    const token = jwt.sign(
      {
        id: rowsQuery.insertId,
        email: googleUser.email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h',
      }
    );

    // Add token in httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.redirect(process.env.DOMAIN + '/');
    return;
  } catch (error) {
    console.log(error);
    res.redirect(process.env.DOMAIN + '/auth/sign-in');
    return;
  }
}
