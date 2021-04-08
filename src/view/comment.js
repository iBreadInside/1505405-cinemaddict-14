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

  // const biggestUnit = [];
  const getBiggestUnits = (obj) => {
    for (const key in obj) {
      if (obj[key] !== 0) {
        return {
          unit: key,
          value: -obj[key],
        };
      }
    }
  };

  return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="${emotion}" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${dayjs.duration(getBiggestUnits(difference.$d).value, `${getBiggestUnits(difference.$d).unit}`).humanize(true)}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
};
