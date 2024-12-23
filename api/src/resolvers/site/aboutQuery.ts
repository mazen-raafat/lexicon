import { FieldResolver, queryField } from 'nexus';

import { errorHandler } from '../../helpers';
import { Context } from '../../types';
import {
  PROSE_DISCOURSE_API_KEY,
  PROSE_DISCOURSE_API_USERNAME,
} from '../../constants';

let aboutResolver: FieldResolver<'Query', 'about'> = async (
  _,
  __,
  context: Context,
) => {
  try {
    let siteUrl = `/about.json`;

    /**
     * In here when use newest version discourse from 3.2.0.beta4-dev the name of field change into topics_count and posts_count
     *
     * And for the previous version discourse it use topic_count and post_count
     */

    let headers = {
      ...(PROSE_DISCOURSE_API_KEY && { 'Api-Key': PROSE_DISCOURSE_API_KEY }),
      ...(PROSE_DISCOURSE_API_USERNAME && {
        'Api-Username': PROSE_DISCOURSE_API_USERNAME,
      }),
    };
    let {
      data: {
        about: {
          stats: {
            topics_count: topicsCount,
            topic_count: topicCount,
            posts_count: postsCount,
            post_count: postCount,
          },
        },
      },
    } = await context.client.get(siteUrl, { headers });

    return {
      topicCount: topicCount || topicsCount,
      postCount: postCount || postsCount,
    };
  } catch (error) {
    throw errorHandler(error);
  }
};

let aboutQuery = queryField('about', {
  type: 'About',
  resolve: aboutResolver,
});

export { aboutQuery };
