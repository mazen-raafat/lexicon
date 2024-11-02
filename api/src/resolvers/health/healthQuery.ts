import { FieldResolver, queryField } from 'nexus';
import { AxiosError } from 'axios';

import { Context } from '../../types';
import {
  PROSE_DISCOURSE_API_KEY,
  PROSE_DISCOURSE_API_USERNAME,
  PROSE_DISCOURSE_HOST,
} from '../../constants';
import { logger } from '../../logger';

let healthQueryResolver: FieldResolver<'Query', 'health'> = async (
  _,
  __,
  context: Context,
) => {
  let discourseError: Error | undefined;
  let isDiscourseReachable = true;
  try {
    let siteUrl = `/site.json`;
    let headers = {
      ...(PROSE_DISCOURSE_API_KEY && { 'Api-Key': PROSE_DISCOURSE_API_KEY }),
      ...(PROSE_DISCOURSE_API_USERNAME && {
        'Api-Username': PROSE_DISCOURSE_API_USERNAME,
      }),
    };
    await context.client.get(siteUrl, { headers });
  } catch (error) {
    let e = error as AxiosError;
    discourseError = e;
    if (e.response === undefined) {
      isDiscourseReachable = false;
    }
    logger.log(
      'error',
      discourseError?.toString() ?? 'An unknown Discourse error occurred',
    );
  }
  return {
    isDiscourseReachable,
    discourseError: discourseError?.toString(),
    discourseHost: PROSE_DISCOURSE_HOST,
  };
};

let healthQuery = queryField('health', {
  type: 'HealthCheck',
  resolve: healthQueryResolver,
});

export { healthQuery };
