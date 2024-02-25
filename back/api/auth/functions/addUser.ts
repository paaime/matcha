import { Response } from 'express';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '../../../utils/db';
import { ageRegex, biographyRegex, genderEnum, nameRegex, picturesRegex, preferenceEnum } from '../../../types/regex';
import { getEmailData } from '../../../utils/emails';
import { transporter } from '../../..';

export const checkIfFieldExist = (name: string, field: string, res: Response): number => {
  if (!field || field === '') {

    res.status(400).json({
      error: 'Bad request',
      message: `Property '${name}' is missing`,
    });

    return 1;
  }

  return 0;
}

export async function addUser(body: any, res: Response): Promise<undefined>{
  try {
    // Get infos from body
    const { lastName, firstName, age, password, email, loc, city, gender, sexualPreferences, biography, pictures } = body;

    // Check if fields exist
    if (checkIfFieldExist("lastName", lastName, res)) return;
    if (checkIfFieldExist("firstName", firstName, res)) return;
    if (checkIfFieldExist("age", age, res)) return;
    if (checkIfFieldExist("password", password, res)) return;
    if (checkIfFieldExist("email", email, res)) return;
    if (checkIfFieldExist("gender", gender, res)) return;
    if (checkIfFieldExist("sexualPreferences", sexualPreferences, res)) return;
    if (checkIfFieldExist("biography", biography, res)) return;

    // Trim all values
    const newUser = {
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      age: parseInt(age),
      passwordHashed: password,
      email: email?.trim(),
      loc: loc?.trim(),
      city: city?.trim(),
      gender: gender?.trim(),
      sexualPreferences: sexualPreferences?.trim(),
      biography: biography?.trim(),
      pictures: pictures?.trim()
    };

    // Test values with regex
    if (!nameRegex.test(newUser.firstName)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'First name is not valid'
      });
      return;
    }
    if (!nameRegex.test(newUser.lastName)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Last name is not valid'
      });
      return;
    }
    if (!ageRegex.test(newUser.age.toString())) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Age is not valid'
      });
      return;
    }
    if (!genderEnum.includes(newUser.gender)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Gender is not valid'
      });
      return;
    }
    if (!preferenceEnum.includes(newUser.sexualPreferences)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Sexual preferences is not valid'
      });
      return;
    }
    if (!biographyRegex.test(newUser.biography)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Biography is not valid'
      });
      return;
    }
    // Location is optional
    if (newUser.loc.length > 0 && !picturesRegex.test(newUser.pictures)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Pictures is not valid'
      });
      return;
    }
    // Pictures is optional
    if (newUser.pictures.length > 0 && !picturesRegex.test(newUser.pictures)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Pictures is not valid'
      });
      return;
    }

    const db = await connectToDatabase();

    // Check if email already exists
    const queryCheckEmail = 'SELECT * FROM User WHERE email = ?';
    const [rowsCheckEmail] = await db.query(queryCheckEmail, [newUser.email]) as any;

    if (rowsCheckEmail.length > 0) {
      db.end();
      res.status(400).json({
        error: 'Bad request',
        message: 'Email already exists: ' + newUser.email
      });
      return;
    }

    // Hash password
    const passwordHashed = bcrypt.hashSync(newUser.passwordHashed, 10);

    // Generate token to verify email
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const tokenHashed = bcrypt.hashSync(token, 10);
    
    const query = 'INSERT INTO User (lastName, firstName, age, passwordHashed, email, emailToken, gender, sexualPreferences, biography, pictures) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    // Insert the user into the database and return the id
    const [rows] = await db.query(query, [
      newUser.lastName,
      newUser.firstName,
      newUser.age,
      passwordHashed,
      newUser.email,
      tokenHashed,
      newUser.gender,
      newUser.sexualPreferences,
      newUser.biography,
      newUser.pictures || null
    ]) as any;

    const id = rows.insertId;

    // Close the connection
    await db.end();

    if (!id) {
      throw new Error('User not added');
    }

    const confirmLink = process.env.NEXT_PUBLIC_API + '/auth/confirm/' + newUser.email + '/' + token;
    const emailData = getEmailData("verifyEmail");

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
        .replaceAll('[CONFIRM_LINK]', confirmLink)
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
      email: newUser.email
    });
  } catch (error) {
    console.error('Error while adding user:', error);

    res.status(501).json({
      error: 'Server error',
      message: 'An error occurred while adding the user'
    });
  }
}
