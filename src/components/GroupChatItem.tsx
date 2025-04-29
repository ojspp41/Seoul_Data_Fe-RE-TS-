import React from 'react';
import styles from './css/GroupChatItem.module.css';

interface GroupChatItemProps {
  chatRoomId: number;
  name: string;
  information: string;
  participation: number;
  category: string;
}

const GroupChatItem: React.FC<GroupChatItemProps> = ({
  chatRoomId,
  name,
  information,
  participation,
  category,
}) => {
  return (
    <div className={styles.container}>
        <div className={styles.header}>
            <span className={styles.category}>{category}</span>
            <span className={styles.title}>{name}</span>
        </div>

        <div className={styles.bottomRow}>
            <div className={styles.description}>{information}</div>
            <div className={styles.meta}>
            <div className={styles.participants}>
                <img src="/assets/person.svg" alt="참가자" />
                {participation}명
            </div>
            </div>
        </div>
    </div>


  );
};

export default GroupChatItem;
