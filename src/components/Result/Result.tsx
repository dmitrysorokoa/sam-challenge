import React, { FC, useMemo } from 'react';
import { Element } from '../Element/Element';
import styles from './Result.module.scss';

interface ResultProps {
  createdProAndCons: any[];
  voteStatus: boolean | null;
}

export const Result: FC<ResultProps> = ({ createdProAndCons, voteStatus }) => {
  const createdPro = useMemo(() => {
    return createdProAndCons.filter((el) => el.type === 'pro');
  }, [createdProAndCons]);

  const createdCon = useMemo(() => {
    return createdProAndCons.filter((el) => el.type === 'con');
  }, [createdProAndCons]);

  return (
    <div className={styles.container}>
      <div>
        {createdPro.map((pro: any) => (
          <Element key={pro.id} {...pro} voteStatus={voteStatus} />
        ))}
      </div>
      <div>
        {createdCon.map((con: any) => (
          <Element key={con.id} {...con} voteStatus={voteStatus} />
        ))}
      </div>
    </div>
  );
};
