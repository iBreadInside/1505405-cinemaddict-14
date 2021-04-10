import dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import * as relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(duration);
dayjs.extend(relativeTime);

export const createComments = (filmComment) => {
  const {author, comment, date, emotion} = filmComment;

  const today = dayjs();
  const commentDate = dayjs(date);
  const difference = dayjs.duration(today.diff(commentDate));

  const getBiggestUnit = (obj) => {
    for (const key in obj) {
      if (obj[key] !== 0) {
        return {
          unit: key,
          value: -obj[key],
        };
      }
    }
  };
  const unitvalue = getBiggestUnit(difference.$d).value;
  const biggestUnit = getBiggestUnit(difference.$d).unit;
  const humanizeTime = (value, unit) => {
    return dayjs.duration(value, `${unit}`).humanize(true);
  };

  return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="${emotion}" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${humanizeTime(unitvalue, biggestUnit)}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
};
