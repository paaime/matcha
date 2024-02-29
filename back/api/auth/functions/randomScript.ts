import { Response } from 'express';
import bcrypt from 'bcrypt';

import { connectToDatabase } from '../../../utils/db';
import { interestsList } from '../../../types/list';
import { updateFame } from '../../../utils/fame';

const preferences = [
  'male',
  'female',
  'other'
];

const NB_RANDOM_USERS = 30;
const NB_RANDOM_TAGS = 3;
const NB_RANDOM_VISITS = 15;
const NB_RANDOM_LIKES = 8;

async function addRandom(i: number): Promise<boolean> {
  try {
    const password = 'password';
    const email = Math.random().toString(36).substring(2, 15) + '@gmail.com';

    // Api to get random user
    const response = await fetch('https://randomuser.me/api/');

    const datas = (await response.json()) as any;
    const data = datas.results[0];

    const isOther = Math.random() < 0.3;
    const randomPreference = Math.floor(Math.random() * preferences.length);
    const frenchRandomLat = Math.random() * (51.124199 - 41.333740) + 41.333740;
    const frenchRandomLong = Math.random() * (9.559320 - 4.763385) + 4.763385;

    const firstName = data['name']['first'];
    const lastName = data['name']['last'];
    const age = data['dob']['age'];
    const gender = isOther ? 'other' : data['gender'];
    const sexualPreferences = preferences[randomPreference];
    const city = data['location']['city'];
    const loc = frenchRandomLat + ',' + frenchRandomLong;
    const pictures = data['picture']['large'];
    const biography =
      "I'm a random user named " +
      firstName +
      ' ' +
      lastName +
      " and I'm " +
      age +
      " years old. I'm looking for a " +
      sexualPreferences +
      ' partner.';
    const login = firstName.toLowerCase() + lastName.toLowerCase() + city.toLowerCase();

    const random1 = Math.floor(Math.random() * 100);
    const random2 = Math.floor(Math.random() * 100);
    const picturesNumber = pictures.split('/');

    const picture2 = picturesNumber.slice(0, picturesNumber.length - 1).join('/') + '/' + random1 + '.jpg';
    const picture3 = picturesNumber.slice(0, picturesNumber.length - 1).join('/') + '/' + random2 + '.jpg';

    const db = await connectToDatabase();

    // Hash password
    const passwordHashed = bcrypt.hashSync(password, 10);

    const query =
      'INSERT INTO User (lastName, firstName, username, age, passwordHashed, email, emailToken, loc, city, consentLocation, gender, sexualPreferences, biography, pictures, isVerified, isComplete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    // Insert the user into the database and return the id
    const [rows] = (await db.query(query, [
      lastName,
      firstName,
      'random' + login,
      age,
      passwordHashed,
      email,
      null,
      loc,
      city,
      1,
      gender,
      sexualPreferences,
      biography,
      pictures + ',' + picture2 + ',' + picture3,
      1,
      1,
    ])) as any;

    const id = rows.insertId;

    // Close the connection
    await db.end();

    if (!id) {
      throw new Error('User not added');
    }

    return true;
  } catch (error) {
    console.error('Error while generating random user:', error);

    return false;
  }
}

export async function randomScript(res: Response): Promise<boolean>{
  try {
    const db = await connectToDatabase();

    // Clean database
    await db.query('DELETE FROM Blocked');
    await db.query('DELETE FROM Reported');
    await db.query('DELETE FROM History');
    await db.query('DELETE FROM Tags');
    await db.query('DELETE FROM UserLike');
    await db.query('DELETE FROM Notification');
    await db.query('DELETE FROM Chat');
    await db.query('DELETE FROM Matchs');
    await db.query('DELETE FROM User');

    // First, generate users
    for (let i = 0; i < NB_RANDOM_USERS; i++) {
      await addRandom(i);
    }

    // Then, get the users
    const query = 'SELECT * FROM User';
    const [rows] = await db.query(query) as any;

    const minId = rows[0].id;
    const maxId = rows[rows.length - 1].id;

    for (const row of rows) {
      const userId = row.id;

      // Get ids from User where  and sexualPreferences = sexualPreferences
      const [users] = await db.query('SELECT id FROM User WHERE id != ? AND gender = ? AND sexualPreferences = ?', [userId, row.sexualPreferences, row.gender]) as any;

      // Get random user ids
      const randomUserId = users.map((user: any) => user.id).sort(() => Math.random() - 0.5).slice(0, NB_RANDOM_LIKES);

      for (const like of randomUserId) {
        if (like === userId) {
          continue;
        }

        const isSuper = Math.random() < 0.2;

        // Insert if not already in the database
        const [check] = await db.query('SELECT * FROM UserLike WHERE user_id = ? AND liked_user_id = ?', [userId, like]) as any;

        if (check.length > 0) {
          continue;
        }


        const query = 'INSERT INTO UserLike (user_id, liked_user_id, isSuperLike) VALUES (?, ?, ?)';
        await db.query(query, [userId, like, isSuper ? 1 : 0]);

        // Check if new match
        const [match] = await db.query('SELECT * FROM Matchs WHERE user_id IN (?, ?) AND other_user_id IN (?, ?)', [userId, like, userId, like]) as any;

        const isMatch = match.length > 0;

        // Update fame
        updateFame(like, isSuper ? 'newSuperLike' : 'newLike');
        if (isMatch) {
          updateFame(userId, 'newMatch');
          updateFame(like, 'newMatch');
        }
      }

      // Add random tags
      const tagsToAdd = interestsList.sort(() => Math.random() - 0.5).slice(0, NB_RANDOM_TAGS);

      for (const tag of tagsToAdd) {
        // Insert if not already in the database
        const [tags] = await db.query('SELECT * FROM Tags WHERE user_id = ? AND tagName = ?', [userId, tag]) as any;

        if (tags.length > 0) {
          continue;
        }

        const query = 'INSERT INTO Tags (user_id, tagName) VALUES (?, ?)';

        await db.query(query, [userId, tag]);
      }

      // Add random visit with id between minId and maxId
      const randomUsers = Array.from({ length: NB_RANDOM_VISITS }, () => Math.floor(Math.random() * (maxId - minId + 1) + minId));

      for (const visit of randomUsers) {
        if (visit === userId) {
          continue;
        }

        const query = 'INSERT INTO History (user_id, visited_user_id) VALUES (?, ?)';

        await db.query(query, [userId, visit]);

        // Update fame
        updateFame(visit, 'newVisit');
      }
    }

    // Close the connection
    await db.end();

    res.status(200).json({
      message: 'Script executed'
    });
    return true;
  } catch (error) {
    console.error('Error while adding user', ':', error);

    res.status(401).json({ // 501 for real but not tolerated by 42
      error: 'Server error',
      message: 'An error occurred while adding the user'
    });
    return false;
  }
}
