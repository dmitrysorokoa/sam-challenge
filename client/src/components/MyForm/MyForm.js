import React, { useState } from 'react';
import styles from './MyForm.module.scss';
import { socket } from '../../socket';

export function MyForm({ voteStatus }) {
  const [value, setValue] = useState('');
  const [type, setType] = useState('pro');
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    socket.timeout(1000).emit('add pro or con', { type, text: value }, () => {
      setIsLoading(false);
    });

    setValue('');
  }

  return (
    <form className={styles.container} onSubmit={ onSubmit }>
      con
      <label className={styles.switch}>
        <input type="checkbox" checked={type === 'pro'} onChange={ e => setType(e.target.checked ? 'pro' : 'con') }/>
        <span className={styles.slider}></span>
      </label>
      pro
      <input value={value} onChange={ e => setValue(e.target.value) } />

      <button type="submit" disabled={ isLoading || !voteStatus }>Submit</button>
    </form>
  );
}