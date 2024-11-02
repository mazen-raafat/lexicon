import { AxiosInstance } from 'axios';

import {
  PROSE_DISCOURSE_API_KEY,
  PROSE_DISCOURSE_API_USERNAME,
} from '../constants';

type GetSiteDataLexiconParams = {
  client: AxiosInstance;
  cookies: string;
};
export async function getSiteDataLexiconPlugin(
  params: GetSiteDataLexiconParams,
) {
  const { client, cookies } = params;
  let headers = {
    ...(PROSE_DISCOURSE_API_KEY && { 'Api-Key': PROSE_DISCOURSE_API_KEY }),
    ...(PROSE_DISCOURSE_API_USERNAME && {
      'Api-Username': PROSE_DISCOURSE_API_USERNAME,
    }),
  };
  let config = {
    withCredentials: true,
    Cookie: cookies,
    headers,
  };

  let siteUrl = `/site.json`;

  let { data } = await client.get(siteUrl, config);

  return {
    enableLexiconPushNotifications:
      data?.lexicon?.settings.lexicon_push_notifications_enabled || false,
  };
}
