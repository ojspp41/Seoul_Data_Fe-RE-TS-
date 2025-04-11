import React from 'react';
import styles from './css/GroupChatItem.module.css';

interface GroupChatItemProps {
    category: string;
    title: string;
    description: string;
    participants: number;
    lastMessageTime: string;
}

const GroupChatItem: React.FC<GroupChatItemProps> = ({
  category,
  title,
  description,
  participants,
  lastMessageTime,
}) => {
  return (
    <div className={styles.container}>
        <div className={styles.header}>
            <span className={styles.category}>{category}</span>
            <span className={styles.title}>{title}</span>
        </div>

        <div className={styles.bottomRow}>
            <div className={styles.description}>{description}</div>
            <div className={styles.meta}>
            <div className={styles.participants}>
                <img src="/assets/person.svg" alt="참가자" />
                {participants}
            </div>
            <div className={styles.time}>{lastMessageTime}</div>
            </div>
        </div>
    </div>


  );
};

export default GroupChatItem;
