import React, { FC } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Chip from '@mui/material/Chip';
import { Typography } from '@mui/material';
import styles from './Message.module.scss';

enum EventType {
  CreatePro = 'CreatePro',
  CreateCon = 'CreateCon',
  Like = 'Like',
  Dislike = 'Dislike',
}

export interface MessageProps {
  id: string;
  title: string;
  elementType: 'con' | 'pro';
  event: EventType;
  time: string;
}

const capitalizeFLetter = (text: string) =>
  `${text[0].toUpperCase()}${text.slice(1)}`;

const getEventElement = (event: EventType, elementType: 'con' | 'pro') => {
  switch (event) {
    case EventType.CreateCon: {
      return <Chip color="error" label="Added" icon={<RemoveIcon />} />;
    }
    case EventType.CreatePro: {
      return <Chip color="success" label="Added" icon={<AddIcon />} />;
    }
    case EventType.Like: {
      return (
        <Chip
          color="success"
          label={capitalizeFLetter(elementType)}
          icon={<FavoriteIcon />}
        />
      );
    }
    case EventType.Dislike: {
      return (
        <Chip
          color="error"
          label={capitalizeFLetter(elementType)}
          icon={<ThumbDownAltIcon />}
        />
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
    <div className={styles.container}>
      <Typography variant="caption">{time}</Typography>
      {getEventElement(event, elementType)}
      <Typography variant="body1">{title}</Typography>
    </div>
  );
};
