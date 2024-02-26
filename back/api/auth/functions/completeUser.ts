import { Response } from 'express';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '../../../utils/db';
import {
  ageRegex,
  biographyRegex,
  genderEnum,
  interestRegex,
  nameRegex,
  picturesRegex,
  preferenceEnum,
} from '../../../types/regex';
import { getEmailData } from '../../../utils/emails';
import { transporter } from '../../..';
import { getAuthId } from '../../../middlewares/authCheck';
import { RequestUser } from '../../../types/express';

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

export async function completeUser(
  body: any,
  req: RequestUser,
  res: Response
): Promise<undefined> {
  try {
    // Get infos from body
    const { gender, sexualPreferences, age, interests, pictures, biography } =
      body;

    const user_id = getAuthId(req);

    // Check user_id
    if (!user_id || user_id < 1) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid user id',
      });
      return;
    }

    // Check if fields exist
    if (checkIfFieldExist('gender', gender, res)) return;
    if (checkIfFieldExist('sexualPreferences', sexualPreferences, res)) return;
    if (checkIfFieldExist('age', age, res)) return;
    if (checkIfFieldExist('interests', interests, res)) return;
    // if (checkIfFieldExist('pictures', pictures, res)) return;
    if (checkIfFieldExist('biography', biography, res)) return;

    // Test values with regex
    if (!genderEnum.includes(gender)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Gender invalid',
      });
      return;
    }
    if (!preferenceEnum.includes(sexualPreferences)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Sexual preferences invalid',
      });
      return;
    }
    if (!ageRegex.test(age.toString())) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Age invalid',
      });
      return;
    }
    // Remove duplicates with Set

    // Check if interests are valid
    if (!interests || !Array.isArray(interests)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid interests',
      });
      return;
    }

    const uniqueInterests = Array.from(new Set(interests));

    for (const interest of uniqueInterests) {
      if (!interestRegex.test(interest)) {
        console.log(interest);
        res.status(400).json({
          error: 'Bad request',
          message: 'Invalid interests',
        });
        return;
      }
    }
    // if (pictures.length > 0 && !picturesRegex.test(pictures)) {
    //   res.status(400).json({
    //     error: 'Bad request',
    //     message: 'Pictures is not valid',
    //   });
    //   return;
    // }
    if (!biographyRegex.test(biography)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Biography is not valid',
      });
      return;
    }

    const db = await connectToDatabase();

    // Update the user in the database
    const queryUpdate =
      'UPDATE User SET gender = ?, sexualPreferences = ?, age = ?, pictures = ?, biography = ?, isComplete = 1 WHERE id = ?';
    await db.execute(queryUpdate, [
      gender,
      sexualPreferences,
      age,
      pictures,
      biography,
      user_id,
    ]);

    // Reset the user's interests
    const resetQuery = 'DELETE FROM Tags WHERE user_id = ?';
    await db.query(resetQuery, [user_id]);

    // Add the new interests
    const insertQuery = 'INSERT INTO Tags (user_id, tagName) VALUES ?';
    const values = uniqueInterests.map((tag: string) => [user_id, tag]);
    await db.query(insertQuery, [values]);

    // Close the connection
    db.end();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error('Error while completing user:', error);

    res.status(501).json({
      error: 'Server error',
      message: 'An error occurred while completing the user',
    });
  }
}