import { Response } from 'express';
import { connectToDatabase } from '../../../utils/db';
import {
  ageRegex,
  biographyRegex,
  genderEnum,
  preferenceEnum,
  usernameRegex,
} from '../../../types/regex';
import { getAuthId } from '../../../middlewares/authCheck';
import { RequestUser } from '../../../types/express';
import { interestsList } from '../../../types/list';

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
    const { gender, sexualPreferences, age, interests, username, biography } =
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
    if (checkIfFieldExist('username', username, res)) return;
    if (checkIfFieldExist('biography', biography, res)) return;

    // Test values with regex
    if (!usernameRegex.test(username)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'username is not valid',
      });
      return;
    }
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
      // Remove interests that not match interests regex
      if (!interestsList.includes(interest)) {
        uniqueInterests.splice(uniqueInterests.indexOf(interest), 1);
      }
    }

    if (!biographyRegex.test(biography)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Biography is not valid',
      });
      return;
    }

    const db = await connectToDatabase();

    // Check if username is already taken
    const queryUsername = 'SELECT id FROM User WHERE username = ? AND id != ?';
    const [rowsUsername] = (await db.execute(queryUsername, [username, user_id])) as any;

    if (rowsUsername[0]) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Username already taken',
      });
      return;
    }

    // Update the user in the database
    const queryUpdate =
      'UPDATE User SET username = ?, gender = ?, sexualPreferences = ?, age = ?, biography = ?, isComplete = 1 WHERE id = ?';
    
    await db.execute(queryUpdate, [
      username?.trim()?.toLowerCase(),
      gender,
      sexualPreferences,
      age,
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

    res.status(401).json({ // 501 for real but not tolerated by 42
      error: 'Server error',
      message: 'An error occurred while completing the user',
    });
  }
}
