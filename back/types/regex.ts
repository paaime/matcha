// Emoji, space, and 1-20 letters. Example: "🍔 Burger" or "📸 Photographe"
export const interestRegex = /^\p{Emoji}\s[a-zA-Z]{1,20}$/u;

// Email regex
export const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// Password regex : 6-20 characters, at least one uppercase, one lowercase, one number and one special character :;.,!?@#$%^&*()_+-=
export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[:;.,!?@#$%^&*()_+-=]).{6,20}$/;

// Firstname and Lastname regex : 1-40 letters, space, hyphen, apostrophe
export const nameRegex = /^[a-zA-Z\s'-]{1,40}$/;

// Biography regex : 1-500 characters, digits, letters, space, hyphen, apostrophe, comma, dot, exclamation mark, question mark, colon, semicolon, slash, parenthesis, quotes
export const biographyRegex = /^[a-zA-Z0-9\s'-,.!?;:/()"]{1,500}$/;

// Age regex : 18-99
export const ageRegex = /^(1[8-9]|[2-9][0-9])$/;

// Location regex : array of 2 floats
export const locationRegex = /^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$/;

// Pictures regex : url separated by a comma
export const picturesRegex = /^(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)$/;
export const urlRegex = /^(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)$/;

/* === ENUM === */
export const genderEnum = ['male', 'female', 'other'];
export const preferenceEnum = ['male', 'female', 'other'];
