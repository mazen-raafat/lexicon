import camelcaseKey from 'camelcase-keys';
import { FieldResolver, queryField } from 'nexus';

import { errorHandler } from '../../helpers';
import { Context } from '../../types';
import {
  PROSE_DISCOURSE_HOST,
  PROSE_DISCOURSE_API_KEY,
  PROSE_DISCOURSE_API_USERNAME,
  UNCATEGORIZED_CATEGORY_ID,
} from '../../constants';

let siteResolver: FieldResolver<'Query', 'site'> = async (
  _,
  __,
  context: Context,
) => {
  try {
    let siteUrl = `/site.json`;
    let headers = {
      ...(PROSE_DISCOURSE_API_KEY && { 'Api-Key': PROSE_DISCOURSE_API_KEY }),
      ...(PROSE_DISCOURSE_API_USERNAME && {
        'Api-Username': PROSE_DISCOURSE_API_USERNAME,
      }),
    };
    let {
      data: {
        can_create_tag: canCreateTag,
        can_tag_topics: canTagTopics,
        topic_flag_types: topicFlagTypes,
        post_action_types: postActionTypes,
        uncategorized_category_id:
          uncategorizedCategoryId = UNCATEGORIZED_CATEGORY_ID,
        lexicon,
        ...siteData
      },
    } = await context.client.get(siteUrl, { headers });

    topicFlagTypes = camelcaseKey(topicFlagTypes, { deep: true });

    topicFlagTypes = topicFlagTypes.filter(
      (flag: { id: string; nameKey: string }) =>
        flag.id != null && flag.nameKey != null,
    );

    postActionTypes = camelcaseKey(postActionTypes, { deep: true });

    postActionTypes = postActionTypes.filter(
      (flag: { id: string; nameKey: string }) =>
        flag.id != null && flag.nameKey != null,
    );

    let siteSettingsUrl = '/site/settings.json';
    let {
      data: {
        invite_only: inviteOnly = false,
        allow_new_registrations: allowNewRegistrations = true,
        enable_sso: enableSso = false,
        authorized_extensions: authorizedExtensions = '',
        min_search_term_length: minSearchLength = 0,
        tagging_enabled: taggingEnabled = false,
        max_tags_per_topic: maxTagsPerTopic = 0,
        max_tag_length: maxTagLength = 0,
        max_username_length: maxUsernameLength = 0,
        min_username_length: minUsernameLength = 0,
        min_password_length: minPasswordLength = 0,
        full_name_required: fullNameRequired = false,
        default_composer_category: defaultComposerCategory = '',
        allow_uncategorized_topics: allowUncategorizedTopics = false,
        enable_user_status: allowUserStatus = false,
        external_emoji_url: externalEmojiUrl = '',
        emoji_set: emojiSet = '',
        poll_enabled: allowPoll = true,
        poll_minimum_trust_level_to_create: pollCreateMinimumTrustLevel = 1,
        login_required: loginRequired = false,
        chat_enabled: chatEnabled = true,
      },
    } = await context.client.get(siteSettingsUrl, { headers });

    return {
      canCreateTag: canCreateTag || false,
      canTagTopics: canTagTopics || false,
      canSignUp: !inviteOnly && allowNewRegistrations && !enableSso,
      authorizedExtensions,
      minSearchLength,
      taggingEnabled,
      maxTagsPerTopic,
      maxTagLength,
      maxUsernameLength,
      minUsernameLength,
      minPasswordLength,
      fullNameRequired,
      topicFlagTypes,
      postActionTypes,
      defaultComposerCategory,
      allowUncategorizedTopics,
      uncategorizedCategoryId,
      allowUserStatus,
      externalEmojiUrl,
      emojiSet,
      discourseBaseUrl: PROSE_DISCOURSE_HOST || '',
      allowPoll,
      pollCreateMinimumTrustLevel,
      loginRequired,
      chatEnabled,
      enableLexiconPushNotifications:
        lexicon?.settings.lexicon_push_notifications_enabled || false,
      ...camelcaseKey(siteData, { deep: true }),
    };
  } catch (error) {
    throw errorHandler(error);
  }
};

let siteQuery = queryField('site', {
  type: 'SiteSetting',
  resolve: siteResolver,
});

export { siteQuery };
