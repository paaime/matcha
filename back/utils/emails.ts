type EmailData = {
  subject: string;
  text: string;
  html: string;
};

type Item = {
  name: string;
  data: EmailData;
};

const emailsData: Item[] = [
  {
    name: 'verifyEmail',
    data: {
      subject: 'Matcha - Verify your email',
      text: 'Please verify your email',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Confirm your email</h2>
        <p>
          Hello [FIRST_NAME],
        </p>
        <p>
          Please confirm your email address by clicking on the link below :
        </p>
        <p>
          <a href="[CONFIRM_LINK]" style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">
            Confirm my email
          </a>
        </p>
        <p>
          If you did not create an account, no further action is required.
        </p>
        <p>
        [CONFIRM_LINK]
        </p>
        <p>
          Best regards,<br>
          paime - dvergobb
        </p>
      </div>`,
    },
  },
  {
    name: 'resetPassword',
    data: {
      subject: 'Matcha - Reset your password',
      text: 'Please reset your password',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset your password</h2>
        <p>
          Hello [FIRST_NAME],
        </p>
        <p>
          Please reset your password by clicking on the link below :
        </p>
        <p>
          <a href="[RESET_LINK]" style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">
            Reset my password
          </a>
        </p>
        <p>
          If you did not request a password reset, no further action is required.
        </p>
        <p>
        [RESET_LINK]
        </p>
        <p>
          Best regards,<br>
          paime - dvergobb
        </p>
      </div>`,
    },
  },
  {
    name: 'reportUser',
    data: {
      subject: 'Matcha - Reported by a user',
      text: 'You have been reported by a user, please be careful with your behavior.',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reported by a user</h2>
        <p>
          Hello [FIRST_NAME],
        </p>
        <p>
          You have been reported by a user, please be careful with your behavior.
        </p>
        <p>
          Best regards,<br>
          paime - dvergobb
        </p>
      </div>`,
    }
  }
];

const getEmailData = (name: string): EmailData | null => {
  const emailData = emailsData.find((item) => item.name === name);
  if (!emailData) {
    return null;
  }
  return emailData.data;
}

export { getEmailData };
