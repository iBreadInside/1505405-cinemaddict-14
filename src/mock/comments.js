import { DATES, EMOJI } from '../const';
import { getRandomFromArray } from '../utils/common';

const COMMENT_AUTHORS = [
  'Ilya O Reilly',
  'Grzegorz Brzęczyszczykiewicz',
  'Bruce Wayne',
  'July Cesar',
];

const COMMENT_TEXTS = [
  'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  'Interesting setting and a good cast',
  'Booooooooooring',
  'Very very old. Meh',
];

export const generateComments = (id) => {
  return {
    id,
    author: getRandomFromArray(COMMENT_AUTHORS),
    comment: getRandomFromArray(COMMENT_TEXTS),
    date: getRandomFromArray(DATES),
    emotion: getRandomFromArray(EMOJI),
  };
};
