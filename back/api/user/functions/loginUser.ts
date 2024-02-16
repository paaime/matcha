import { Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { connectToDatabase } from '../../../utils/db';
import { checkIfFieldExist } from './addUser';
import { emailRegex } from '../../../types/regex';
import { ThrownError } from '../../../types/type';

export async function loginUser(body: any, res: Response): Promise<undefined>{
  try {
    // Get infos from body
    const { email, password } = body;

    // Check if fields exist
    if (checkIfFieldExist("email", email, res)) return;
    if (checkIfFieldExist("password", password, res)) return;

    const datas = {
      email: email?.trim(),
      password: password?.trim()
        ?.slice(0, 35)
        // Replace dangerous characters
        ?.replace(/&/g, '')
        ?.replace(/"/g, '')
        ?.replace(/'/g, '')
        ?.replace(/</g, '')
        ?.replace(/>/g, '')
    }

    // Check if fields exist
    if (checkIfFieldExist("email", email, res)) return;
    if (checkIfFieldExist("password", password, res)) return;

    // Test values with regex
    if (!emailRegex.test(datas.email)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Email is not valid'
      });
      return;
    }

    const db = await connectToDatabase();

    const query = 'SELECT id, firstName, lastName, email, passwordHashed, isVerified FROM User WHERE email = ?';

    // Execute the query and check the result
    const [rows] = await db.execute(query, [datas.email]) as any;
    
    db.end();

    if (rows.length === 0) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
      return;
    }

    const user = rows[0];

    // Check if the password is correct
    const passwordCorrect = await bcrypt.compare(datas.password, user.passwordHashed);

    if (!passwordCorrect) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
      return;
    }

    if (user.isVerified === 0) {
      // TODO : Send a new email to verify the account
      // res.status(403).json({
      //   error: 'Forbidden',
      //   message: 'User is not verified'
      // });

      // return;

      console.log('User is not verified, but we will continue for now.');
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h'
      }
    );

    // Add token in httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    // Send the token
    res.status(200).json({
      token: token,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || "Unknown error";
    const message = e?.message || "Unknown message";

    console.error({ code, message });
    
    res.status(501).json({
      error: 'Server error',
      message: 'An error occurred while login the user',
    });
  }
}
