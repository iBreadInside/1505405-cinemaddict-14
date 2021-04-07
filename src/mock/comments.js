import { COMMENT_AUTHORS, COMMENT_TEXTS, DATE, EMOTIONS} from '../const';
import { getRandomFromArray } from '../utils';

export const generateComments = () => {
  return {
    id: 0,
    author: getRandomFromArray(COMMENT_AUTHORS),
    comment: getRandomFromArray(COMMENT_TEXTS),
    date: DATE,
    emotion: `./images/emoji/${getRandomFromArray(EMOTIONS)}.png`,
  };
};
