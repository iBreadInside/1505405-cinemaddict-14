import { DATES} from '../const';
import { getRandomFromArray } from '../utils';

const EMOTIONS = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

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

export const generateComments = () => {
  return {
    id: 0,
    author: getRandomFromArray(COMMENT_AUTHORS),
    comment: getRandomFromArray(COMMENT_TEXTS),
    date: getRandomFromArray(DATES),
    emotion: `./images/emoji/${getRandomFromArray(EMOTIONS)}.png`,
  };
};
