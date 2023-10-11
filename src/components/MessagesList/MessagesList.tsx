import React, { FC, useRef, useCallback, useState, useEffect } from 'react';
import { Message, MessageProps } from '../Message/Message';
import styles from './MessagesList.module.scss';

interface MessagesListProps {
  messages: MessageProps[];
}

export const MessagesList: FC<MessagesListProps> = ({ messages }) => {
  const [isMessagesBottom, setIsMessagesBottom] = useState<boolean>(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const Scroll = useCallback(() => {
    const { scrollHeight } = messagesContainerRef.current as HTMLDivElement;
    if (isMessagesBottom) {
      messagesContainerRef.current?.scrollTo(0, scrollHeight);
    }
  }, [isMessagesBottom]);

  const onListScroll = useCallback(() => {
    const { scrollHeight, scrollTop, clientHeight } =
      messagesContainerRef.current as HTMLDivElement;

    if (scrollTop >= scrollHeight - clientHeight - 600) {
      setIsMessagesBottom(true);
    } else {
      setIsMessagesBottom(false);
    }
  }, []);

  useEffect(() => {
    Scroll();
  }, [messages]);

  return (
    <div
      ref={messagesContainerRef}
      className={styles.list}
      onScroll={onListScroll}
    >
      {messages.map((message) => (
        <Message key={message.id} {...message} />
      ))}
    </div>
  );
};
