import axios from 'axios';
import qs from 'qs';

export const getGoogleOAuthTokens = async ({ code }: { code: any }) => {
  const url = 'https://oauth2.googleapis.com/token';

  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
    grant_type: 'authorization_code',
  };

  try {
    const res = await axios.post(url, qs.stringify(values), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return res.data;
  } catch (error) {
    // console.log(error, 'Failed to fetch Google Oauth Tokens');
    return false;
  }
};

export const getGoogleUser = async ({
  id_token,
  access_token,
}: {
  id_token: any;
  access_token: any;
}) => {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    // console.log(error, 'Failed to fetch Google User');
    return false;
  }
};
