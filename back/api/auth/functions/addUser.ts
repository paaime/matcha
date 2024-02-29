import { Response } from 'express';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '../../../utils/db';
import {
  emailRegex,
  nameRegex,
  passwordRegex,
  usernameRegex,
} from '../../../types/regex';
import { getEmailData } from '../../../utils/emails';
import { transporter } from '../../..';

export const checkIfFieldExist = (
  name: string,
  field: string,
  res: Response
): number => {
  if (!field || field === '') {
    res.status(400).json({
      error: 'Bad request',
      message: `Property '${name}' is missing`,
    });

    return 1;
  }

  return 0;
};

export async function addUser(body: any, res: Response): Promise<undefined> {
  try {
    // Get infos from body
    const { lastName, firstName, password, confirmPassword, email, username } =
      body;

    // Check if fields exist
    if (checkIfFieldExist('lastName', lastName, res)) return;
    if (checkIfFieldExist('firstName', firstName, res)) return;
    if (checkIfFieldExist('password', password, res)) return;
    if (checkIfFieldExist('confirmPassword', confirmPassword, res)) return;
    if (checkIfFieldExist('email', email, res)) return;
    if (checkIfFieldExist('username', username, res)) return;

    // Check if password and confirmPassword are the same
    if (password !== confirmPassword) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Passwords do not match',
      });
      return;
    }

    // Trim all values
    const newUser = {
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      passwordHashed: password,
      email: email?.trim(),
      username: username?.trim(),
    };

    // Test values with regex
    if (!nameRegex.test(newUser.firstName)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'First name is not valid',
      });
      return;
    }
    if (!nameRegex.test(newUser.lastName)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Last name is not valid',
      });
      return;
    }
    if (!emailRegex.test(newUser.email)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Email is not valid',
      });
      return;
    }
    if (!passwordRegex.test(newUser.passwordHashed)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Password is not valid',
      });
      return;
    }
    if (!usernameRegex.test(username)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Username is not valid',
      });
      return;
    }

    const db = await connectToDatabase();

    // Check if email already exists
    const queryCheckEmail = 'SELECT * FROM User WHERE email = ?';
    const [rowsCheckEmail] = (await db.query(queryCheckEmail, [
      newUser.email,
    ])) as any;

    if (rowsCheckEmail.length > 0) {
      db.end();

      res.status(400).json({
        error: 'Bad request',
        message: 'Email already exists',
      });
      return;
    }

    // Check if username already exists
    const queryCheckUsername = 'SELECT * FROM User WHERE username = ?';
    const [rowsCheckUsername] = (await db.query(queryCheckUsername, [
      newUser.username,
    ])) as any;

    if (rowsCheckEmail.length > 0) {
      db.end();

      res.status(400).json({
        error: 'Bad request',
        message: 'Username already exists',
      });
      return;
    }

    // Hash password
    const passwordHashed = bcrypt.hashSync(newUser.passwordHashed, 10);

    // Generate token to verify email
    const token =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const tokenHashed = bcrypt.hashSync(token, 10);

    const query =
      'INSERT INTO User (lastName, firstName, passwordHashed, email, username, emailToken) VALUES (?, ?, ?, ?, ?, ?)';

    // Insert the user into the database and return the id
    const [rows] = (await db.query(query, [
      newUser.lastName,
      newUser.firstName,
      passwordHashed,
      newUser.email,
      newUser.username,
      tokenHashed,
    ])) as any;

    const id = rows.insertId;

    // Close the connection
    await db.end();

    if (!id) {
      throw new Error('User not added');
    }

    const confirmLink =
      process.env.NEXT_PUBLIC_API +
      '/auth/confirm/' +
      newUser.email +
      '/' +
      token;
    const emailData = getEmailData('verifyEmail');

    if (!emailData) {
      throw new Error('Email template not found');
    }

    const mailData = {
      from: process.env.MAIL_USER,
      to: newUser.email,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html
        .replace('[FIRST_NAME]', newUser.firstName)
        .replaceAll('[CONFIRM_LINK]', confirmLink),
    };

    transporter.sendMail(mailData, function (err, info) {
      if (err) {
        throw new Error('Email not sent');
      }
    });

    res.status(200).json({
      id: id,
      lastName: newUser.lastName,
      firstName: newUser.firstName,
      email: newUser.email,
    });
  } catch (error) {
    console.error('Error while adding user:', error);

    res.status(401).json({
      // 501 for real but not tolerated by 42
      error: 'Server error',
      message: 'An error occurred while adding the user',
    });
  }
}
