import { DATE, EMOTIONS } from '../const';
import { getRandomFromArray } from '../utils';

export const generateComments = () => {
  return {
    id: 0,
    author: 'Ilya O Reilly',
    comment: 'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
    date: DATE,
    emotion: getRandomFromArray(EMOTIONS),
  };
};
