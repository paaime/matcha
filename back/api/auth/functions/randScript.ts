import ora from 'ora-classic';
import bcrypt from 'bcrypt';
import { Connection } from 'mysql2/promise';

import { randLikes } from './randLikes';
import { randTags } from './randTags';
import { randVisits } from './randVisits';

import { connectToDatabase } from '../../../utils/db';

const getRandomCoordinatesFrance = (): { lat: number; lon: number } => {
  const minLat = 41.333;
  const maxLat = 51.124;
  const minLon = -5.0;
  const maxLon = 9.662;

  const lat = Math.random() * (maxLat - minLat) + minLat;
  const lon = Math.random() * (maxLon - minLon) + minLon;

  return { lat, lon };
}

const getRandomCoordinateLyon = (): { lat: number; lon: number } => {
  const minLat = 45.383;
  const maxLat = 45.969;
  const minLon = 4.584;
  const maxLon = 5.308;

  const lat = Math.random() * (maxLat - minLat) + minLat;
  const lon = Math.random() * (maxLon - minLon) + minLon;

  return { lat, lon };
}

const addRandom = async(db: Connection): Promise<boolean> => {
  try {
    const password = process.env.RANDOM_PASSWORD || 'password';
    const email = Math.random().toString(36).substring(2, 15) + '@gmail.com';

    // Api to get random user
    const response = await fetch('https://randomuser.me/api/');

    const datas = (await response.json()) as any;
    const data = datas.results[0];

    const isOther = Math.random() < 0.2;
    const randomPreference =  Math.random();

    const isHetero = randomPreference < 0.85;
    const isHomo = randomPreference >= 0.85;

    const firstName = data['name']['first'];
    const lastName = data['name']['last'];
    const age = data['dob']['age'];
    const gender = isOther ? 'other' : data['gender']
    const sexualPreferences = isHetero && gender === 'male'
      ? 'female'
      : isHetero && gender === 'female'
      ? 'male'
      : isHomo && gender === 'male'
      ? 'male'
      : isHomo && gender === 'female'
      ? 'female'
      : 'other';
    const city = data['location']['city'];
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

    // Random string of 40 letters
    const login = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Remove numbers from the login
    const username = login.replace(/[0-9]/g, '');

    const random1 = Math.floor(Math.random() * 100);
    const random2 = Math.floor(Math.random() * 100);
    const picturesNumber = pictures.split('/');

    const picture2 = picturesNumber.slice(0, picturesNumber.length - 1).join('/') + '/' + random1 + '.jpg';
    const picture3 = picturesNumber.slice(0, picturesNumber.length - 1).join('/') + '/' + random2 + '.jpg';

    const isLyon = Math.random() < 0.6;
    const coords = isLyon ? getRandomCoordinateLyon() : getRandomCoordinatesFrance();
    const loc = coords.lat + ',' + coords.lon;

    // Hash password
    const passwordHashed = bcrypt.hashSync(password, 10);

    const query =
      'INSERT INTO User (lastName, firstName, username, age, passwordHashed, email, emailToken, loc, city, consentLocation, gender, sexualPreferences, biography, pictures, isVerified, isComplete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    // Insert the user into the database and return the id
    await db.query(query, [
      lastName,
      firstName,
      'random' + username,
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
    ]);

    return true;
  } catch (error) {
    return false;
  }
}

const NB_USERS = 500;
const NB_LIKES = 15;
const NB_TAGS = 3;
const NB_VISITS = 7;

export async function randScript(): Promise<boolean> {

  try {
    const db = await connectToDatabase();

    if (!db) {
      return false;
    }

    console.log('\n\x1b[1m\x1b[32m%s\x1b[0m', 'Script started\n');

    // Clean database
    const spinClean = ora('Cleaning database').start();
    await db.query('DELETE FROM Blocked');
    await db.query('DELETE FROM Reported');
    await db.query('DELETE FROM History');
    await db.query('DELETE FROM Tags');
    await db.query('DELETE FROM UserLike');
    await db.query('DELETE FROM Notification');
    await db.query('DELETE FROM Chat');
    await db.query('DELETE FROM Matchs');
    await db.query('DELETE FROM User');
    spinClean.succeed('Database cleaned');

    // Generate users
    const spinUser = ora('Adding random users').start();
    for (let i = 0; i < NB_USERS; i++) {
      await addRandom(db);
    }
    spinUser.succeed('Random users added');

    // Generate likes
    const spinLikes = ora('Adding random likes').start();
    await randLikes(NB_LIKES, db);
    spinLikes.succeed('Random likes added');

    // Generate tags
    const spinTags = ora('Adding random tags').start();
    await randTags(NB_TAGS, db);
    spinTags.succeed('Random tags added');

    // Generate visits
    const spinVisits = ora('Adding random visits').start();
    await randVisits(NB_VISITS, db);
    spinVisits.succeed('Random visits added');

    console.log('\n\x1b[1m\x1b[32m%s\x1b[0m', 'Script finished\n');

    // Close the connection
    await db.end();
    return true;
  } catch (error) {
    return false;
  }
}
