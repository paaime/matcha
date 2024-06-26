-- Table User
CREATE TABLE User (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lastName VARCHAR(255) NOT NULL COLLATE utf8mb3_general_ci,
  firstName VARCHAR(255) NOT NULL COLLATE utf8mb3_general_ci,
  username VARCHAR(255) UNIQUE DEFAULT NULL,
  age INT,
  passwordHashed VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  emailToken VARCHAR(255) DEFAULT NULL,
  loc VARCHAR(255) DEFAULT '45.780967712402344,4.750461101531982',
  city VARCHAR(255) DEFAULT 'Charbonnieres-les-Bains' COLLATE utf8mb3_general_ci,
  consentLocation BOOLEAN DEFAULT 0,
  gender ENUM('female', 'male', 'other') DEFAULT 'other' NOT NULL,
  sexualPreferences ENUM('female', 'male', 'other') DEFAULT 'other' NOT NULL,
  biography TEXT DEFAULT NULL COLLATE utf8mb3_general_ci,
  pictures TEXT DEFAULT NULL,
  fameRating FLOAT DEFAULT 150,
  isVerified BOOLEAN DEFAULT 0,
  isOnline BOOLEAN DEFAULT 0,
  isComplete BOOLEAN DEFAULT 0,
  isGoogle BOOLEAN DEFAULT 0,
  lastConnection TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table `Like`
CREATE TABLE UserLike (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  liked_user_id INT NOT NULL,
  isSuperLike BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
  FOREIGN KEY (liked_user_id) REFERENCES User(id) ON DELETE CASCADE,
  UNIQUE (user_id, liked_user_id),
  CHECK (user_id != liked_user_id)
);

-- Table Matchs
CREATE TABLE Matchs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  other_user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
  FOREIGN KEY (other_user_id) REFERENCES User(id) ON DELETE CASCADE,
  UNIQUE (user_id, other_user_id),
  CHECK (user_id != other_user_id)
);

-- Table Blocked
CREATE TABLE Blocked (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  blocked_user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
  FOREIGN KEY (blocked_user_id) REFERENCES User(id) ON DELETE CASCADE,
  UNIQUE (user_id, blocked_user_id),
  CHECK (user_id != blocked_user_id)
);

-- Table Reported
CREATE TABLE Reported (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  reported_user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
  FOREIGN KEY (reported_user_id) REFERENCES User(id) ON DELETE CASCADE,
  UNIQUE (user_id, reported_user_id),
  CHECK (user_id != reported_user_id)
);

-- Table Chat
CREATE TABLE Chat (
  id INT AUTO_INCREMENT PRIMARY KEY,
  match_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL COLLATE utf8mb3_general_ci,
  type ENUM('text', 'image', 'video', 'audio') DEFAULT 'text' NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (match_id) REFERENCES Matchs(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
);

-- Table Tags
CREATE TABLE Tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tagName VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
  UNIQUE (user_id, tagName)
);

-- SQL command to update Tags table and add unique constraint
ALTER TABLE Tags ADD UNIQUE (user_id, tagName);

-- Table History
CREATE TABLE History (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  visited_user_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
  FOREIGN KEY (visited_user_id) REFERENCES User(id) ON DELETE CASCADE
);

-- Update History table, add on delete cascade
ALTER TABLE History ADD FOREIGN KEY (visited_user_id) REFERENCES User(id) ON DELETE CASCADE;

-- Table Notification
CREATE TABLE Notification (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  content TEXT NOT NULL COLLATE utf8mb4_general_ci,
  redirect VARCHAR(255) DEFAULT NULL,
  related_user_id INT DEFAULT NULL,
  isRead BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
  FOREIGN KEY (related_user_id) REFERENCES User(id) ON DELETE CASCADE
);

-- Créer le déclencheur AFTER INSERT pour UserLike
DELIMITER //
CREATE TRIGGER after_user_like_insert
AFTER INSERT ON UserLike
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT * FROM UserLike ul2 WHERE ul2.user_id = NEW.liked_user_id AND ul2.liked_user_id = NEW.user_id) THEN
      INSERT INTO Matchs (user_id, other_user_id) VALUES (NEW.user_id, NEW.liked_user_id);
    END IF;
END;
//
DELIMITER ;

-- Créer le déclencheur AFTER DELETE pour UserLike
DELIMITER //
CREATE TRIGGER after_user_like_delete
AFTER DELETE ON UserLike
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT * FROM Matchs WHERE user_id = OLD.user_id AND other_user_id = OLD.liked_user_id) THEN
      DELETE FROM Matchs WHERE user_id = OLD.user_id AND other_user_id = OLD.liked_user_id;
    END IF;
END;
//
DELIMITER ;
