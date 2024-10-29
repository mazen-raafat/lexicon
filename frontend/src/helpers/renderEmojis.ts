const emojiMap: { [key: string]: string } = {
    // Smileys
    'grinning': '😀',
    'smiley': '😃',
    'smile': '😄',
    'grin': '😁',
    'laughing': '😆',
    'sweat_smile': '😅',
    'joy': '😂',
    'rofl': '🤣',
    'relaxed': '☺️',
    'blush': '😊',
    'innocent': '😇',
    'wink': '😉',
    'smirk': '😏',
    'heart_eyes': '😍',
    'star_struck': '🤩',
    'kissing_heart': '😘',
    'kissing': '😗',
    'kissing_smiling_eyes': '😙',
    'kissing_closed_eyes': '😚',
    'yum': '😋',
    'stuck_out_tongue': '😛',
    'stuck_out_tongue_winking_eye': '😜',
    'stuck_out_tongue_closed_eyes': '😝',
    'money_mouth_face': '🤑',
    'hugs': '🤗',
    'hand_over_mouth': '🤭',
    'shushing_face': '🤫',
    'thinking_face': '🤔',
    'zipper_mouth_face': '🤐',
    'raised_eyebrow': '🤨',
    'neutral_face': '😐',
    'expressionless': '😑',
    'no_mouth': '😶',
    'face_in_clouds': '😶‍🌫️',
    'smiling_face_with_tear': '🥲',

    // Emotion Faces
    'frowning': '☹️',
    'slightly_frowning_face': '🙁',
    'confused': '😕',
    'worried': '😟',
    'frowning_face_with_open_mouth': '😦',
    'hushed': '😯',
    'astonished': '😲',
    'flushed': '😳',
    'pleading_face': '🥺',
    'anguished': '😧',
    'fearful': '😨',
    'cold_sweat': '😰',
    'disappointed_relieved': '😥',
    'cry': '😢',
    'sob': '😭',
    'scream': '😱',
    'confounded': '😖',
    'persevere': '😣',
    'disappointed': '😞',
    'sweat': '😓',
    'weary': '😩',
    'tired_face': '😫',
    'yawning_face': '🥱',
    'triumph': '😤',
    'rage': '😡',
    'angry': '😠',
    'cursing_face': '🤬',
    'smiling_imp': '😈',
    'imp': '👿',
    'skull': '💀',
    'skull_and_crossbones': '☠️',
    'hankey': '💩',
    'clown_face': '🤡',
    'ogre': '👹',
    'goblin': '👺',
    'ghost': '👻',
    'alien': '👽',
    'space_invader': '👾',
    'robot_face': '🤖',

    // Other Smileys & Gestures
    'wave': '👋',
    'raised_hand': '✋',
    'ok_hand': '👌',
    'thumbs_up': '👍',
    'thumbs_down': '👎',
    'clap': '👏',
    'open_hands': '👐',
    'pray': '🙏',
    'point_up': '☝️',
    'muscle': '💪',
    'mechanical_arm': '🦾',
    'mechanical_leg': '🦿',
    'leg': '🦵',
    'foot': '🦶',
    'writing_hand': '✍️',
    'selfie': '🤳',
    'nail_polish': '💅',
    'lips': '👄',
    'tooth': '🦷',
    'tongue': '👅',
    'nose': '👃',
    'ear': '👂',
    'eyes': '👀',
    'eye': '👁️'
};

function emojiNameToUnicode(emojiName: string): string {
    return emojiMap[emojiName] || '';
}

export function renderEmojis(text: string): string {
    const emojiRegex = /:([a-zA-Z0-9-_+]+):/g;
    const emojis = text.match(emojiRegex);
    if (!emojis) {
        return text;
    }
    let newText = text;
    emojis.forEach((emoji) => {
        const emojiName = emoji.slice(1, -1);
        const emojiUnicode = emojiNameToUnicode(emojiName);
        newText = newText.replace(emoji, emojiUnicode);
    });
    return newText;
}