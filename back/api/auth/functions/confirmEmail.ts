import { Response } from 'express';
import bcrypt from 'bcrypt';

import { connectToDatabase } from '../../../utils/db';
import { emailRegex } from '../../../types/regex';
import { ThrownError } from '../../../types/type';

export async function confirmEmail(params: any, res: Response): Promise<undefined> {
  const db = await connectToDatabase();

  if (!db) {
    res.status(500).json({
      error: 'Internal server error',
      message: 'Database connection error',
    });
    return;
  }

  try {
    // Get infos from body
    const { email, token } = params;

    // Check if fields exist
    if (!email || email === '' || !token || token === '') {
      res.redirect(process.env.DOMAIN + '/auth/sign-in?mailConfirm=false&error=notValid');
      return;
    }

    const safeEmail = email.trim().toLowerCase();
    const safeToken = token.trim();

    // Check if email is valid
    if (!emailRegex.test(safeEmail)) {
      res.redirect(process.env.DOMAIN + '/auth/sign-in?mailConfirm=false&error=notValid');
      return;
    }

    // Check if token is valid
    if (!/[a-z0-9]/.test(safeToken)) {
      res.redirect(process.env.DOMAIN + '/auth/sign-in?mailConfirm=false&error=notValid');
      return;
    }


    const query = 'SELECT id, emailToken, isVerified FROM User WHERE email = ?';

    // Execute the query and check the result
    const [rows] = (await db.execute(query, [safeEmail])) as any;

    if (rows.length === 0) {
      res.redirect(process.env.DOMAIN + '/auth/sign-in?mailConfirm=false&error=notFound');
      return;
    }

    const user = rows[0];

    if (user.isVerified === 1) {
      res.redirect(process.env.DOMAIN + '/auth/sign-in?mailConfirm=false&error=alreadyVerified');
      return;
    }

    // Check if token is valid
    if (!bcrypt.compareSync(safeToken, user.emailToken)) {
      res.redirect(process.env.DOMAIN + '/auth/sign-in?mailConfirm=false&error=tokenNotValid');
      return;
    }

    // Update the user to set isVerified to 1
    const queryUpdate = 'UPDATE User SET emailToken = ?, isVerified = ? WHERE id = ?';
    await db.execute(queryUpdate, [null, 1, user.id]);

    res.redirect(process.env.DOMAIN + '/auth/sign-in?mailConfirm=true');
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || 'Unknown error';
    const message = e?.message || 'Unknown message';

    // console.error({ code, message });

    res.redirect(process.env.DOMAIN + '/auth/sign-in?mailConfirm=false&error=serverError');
  } finally {
    // Close the connection
    db.end();
  }
}
