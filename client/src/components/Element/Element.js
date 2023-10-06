import React, { useState } from 'react';
import classNames from 'classnames';
import { ReactComponent as LikeFilled } from '../../assets/likeFilled.svg';
import { ReactComponent as Like } from '../../assets/like.svg';
import { ReactComponent as DislikeFilled } from '../../assets/dislikeFilled.svg';
import { ReactComponent as Dislike } from '../../assets/dislike.svg';
import { socket } from '../../socket';
import styles from './Element.module.scss';

export function Element({ id, title, type, likes, dislikes, voteStatus}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  function onLike(event) {
    if (isLoading || !voteStatus) return;
    event.preventDefault();
    setIsLoading(true);

    socket.timeout(1000).emit('like', { type, id }, () => {
      setIsLoading(false);
    });
    setIsLiked(true);
  }

  function onDislike(event) {
    if (isLoading || !voteStatus) return;
    event.preventDefault();
    setIsLoading(true);

    socket.timeout(1000).emit('dislike', { type, id }, () => {
      setIsLoading(false);
    });
    setIsDisliked(true);
  }

  return (
    <li className={classNames(styles.container, styles[type])} key={title}>
      <span>{title}</span>
        {isLiked ? <LikeFilled /> : <Like onClick={onLike} /> } {likes}
        <div className={styles.delimiter}/>
        {isDisliked ? <DislikeFilled /> : <Dislike onClick={onDislike} /> } {dislikes}
    </li>
  );
}