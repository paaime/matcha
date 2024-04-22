import { ThrownError } from "../types/type";
import { connectToDatabase } from "./db";
import { logger } from "./logger";

type Fame = {
  name: string;
  value: number;
}

type FameName = 'newLike' | 'newSuperLike' | 'dislike' | 'newMatch' | 'newMessage' | 'newVisit' | 'newBlock' | 'newReport';

// Define array of fame modifiers
export const fameUpdaters: Fame[] = [
  {
    name: 'newLike',
    value: 3,
  },
  {
    name: 'newSuperLike',
    value: 5,
  },
  {
    name: 'dislike',
    value: -5,
  },
  {
    name: 'newMatch',
    value: 10,
  },
  {
    name: 'newMessage',
    value: 1,
  },
  {
    name: 'newVisit',
    value: 1,
  },
  {
    name: 'newBlock',
    value: -15,
  },
  {
    name: 'newReport',
    value: -30,
  }
];

// Function to update fame
export const updateFame = async (userId: number, fameName: FameName): Promise<boolean> => {
  try {
    // Check userId
    if (!userId || !Number.isInteger(userId) || userId < 1) {
      return false;
    }

    // Get the fame value
    const fameValue = fameUpdaters.find((fame) => fame.name === fameName)?.value;

    // Check if fameValue is valid
    if (!fameValue) {
      return false;
    }

    const db = await connectToDatabase();

    if (!db) {
      return false;
    }

    // Update the user's fame
    const updateQuery = 'UPDATE User SET fameRating = fameRating + ? WHERE id = ?';
    await db.query(updateQuery, [fameValue, userId]);

    // Close the connection
    db.end();

    return true;
  } catch (error) {
    const e = error as ThrownError;

    logger(e);

    return false;
  }
}
