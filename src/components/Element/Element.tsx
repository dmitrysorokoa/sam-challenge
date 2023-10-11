import React, { useState, FC } from 'react';
import { useTheme } from '@mui/material/styles';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { socket } from '../../socket';
import Typography from '@mui/material/Typography';
import { CardActions, Chip, CardContent, Card } from '@mui/material';

interface ElementProps {
  id: string;
  title: string;
  type: 'pro' | 'con';
  likes: number;
  dislikes: number;
  voteStatus: boolean | null;
}

export const Element: FC<ElementProps> = ({
  id,
  title,
  type,
  likes,
  dislikes,
  voteStatus,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const theme = useTheme();

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
    <Card
      sx={{
        marginBottom: 2,
        userSelect: 'none',
      }}
    >
      <CardContent
        sx={{
          padding: 1,
          width: '300px',
          backgroundColor:
            type === 'pro'
              ? theme.palette.success.light
              : theme.palette.error.light,
        }}
      >
        <Typography variant="body1">{title}</Typography>
      </CardContent>
      <CardActions>
        <Chip
          onClick={onLike}
          clickable={!!(!isLiked && voteStatus)}
          label={likes}
          icon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        />
        <Chip
          onClick={onDislike}
          clickable={!!(!isDisliked && voteStatus)}
          label={dislikes}
          icon={isDisliked ? <ThumbDownAltIcon /> : <ThumbDownOffAltIcon />}
        />
      </CardActions>
    </Card>
  );
};
