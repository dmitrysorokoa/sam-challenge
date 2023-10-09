import React, { useState, FC } from 'react';
import classNames from 'classnames';
import { ReactComponent as LikeFilled } from '../../assets/likeFilled.svg';
import { ReactComponent as Like } from '../../assets/like.svg';
import { ReactComponent as DislikeFilled } from '../../assets/dislikeFilled.svg';
import { ReactComponent as Dislike } from '../../assets/dislike.svg';
import { socket } from '../../socket';
import styles from './Element.module.scss';

interface ElementProps {
  id: string;
  title: string;
  type: string;
  likes: number;
  dislikes: number;
  voteStatus: boolean | null;
}

export const Element: FC<ElementProps> = ({ id, title, type, likes, dislikes, voteStatus}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  function onLike() {
    if (isLoading || !voteStatus) return;
    setIsLoading(true);

    socket.timeout(1000).emit('like', { type, id }, () => {
      setIsLoading(false);
    });
    setIsLiked(true);
  }

  function onDislike() {
    if (isLoading || !voteStatus) return;
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
