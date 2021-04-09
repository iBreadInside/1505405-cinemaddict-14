import { COMMENT_AUTHORS, COMMENT_TEXTS, DATES, EMOTIONS} from '../const';
import { getRandomFromArray } from '../utils';

export const generateComments = () => {
  return {
    id: 0,
    author: getRandomFromArray(COMMENT_AUTHORS),
    comment: getRandomFromArray(COMMENT_TEXTS),
    date: getRandomFromArray(DATES),
    emotion: `./images/emoji/${getRandomFromArray(EMOTIONS)}.png`,
  };
};
