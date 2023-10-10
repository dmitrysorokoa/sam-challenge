import React, { FC } from 'react';
import LikeFilled from '../../assets/likeFilled.svg';
import DislikeFilled from '../../assets/dislikeFilled.svg';
import styles from './Message.module.scss';

enum EventType {
  CreatePro = 'CreatePro',
  CreateCon = 'CreateCon',
  Like = 'Like',
  Dislike = 'Dislike',
}

interface MessageProps {
  id: string;
  title: string;
  elementType: 'con' | 'pro';
  event: EventType;
  time: string;
}

const getEventElement = (event: EventType) => {
  switch (event) {
    case EventType.CreateCon: {
      return <div className={styles.con}>Added</div>;
    }
    case EventType.CreatePro: {
      return <div className={styles.pro}>Added</div>;
    }
    case EventType.Like: {
      return (
        <div className={styles.like}>
          <img src={LikeFilled} />
        </div>
      );
    }
    case EventType.Dislike: {
      return (
        <div className={styles.dislike}>
          <img src={DislikeFilled} />
        </div>
      );
    }
  }
};

export const Message: FC<MessageProps> = ({
  title,
  elementType,
  event,
  time,
}) => {
  return (
    <li className={styles.container}>
      {time}
      {getEventElement(event)}
      <div className={styles[elementType]}>{elementType}</div>
      {title}
    </li>
  );
};
