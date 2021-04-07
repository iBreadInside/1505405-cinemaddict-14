import dayjs from 'dayjs';

export const createComments = (filmComment) => {
  const {author, comment, date, emotion} = filmComment;

  return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="${emotion}" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${dayjs(date).format('YYYY/MM/DD HH:mm')}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
};
