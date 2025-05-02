import React from 'react';
import styles from './css/GroupChatItem.module.css';
import { useNavigate } from 'react-router-dom';
import { connectStomp, sendEnterMessage } from '../utils/socket';
import axiosInstance from '../api/axiosInstance';

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
  const navigate = useNavigate();

  const handleClick = async () => {
    const confirmed = window.confirm(`"${name}" 채팅방에 참가하시겠습니까?`);
    if (!confirmed) return;

    try {
      // ✅ 참가 요청 먼저
      const response = await axiosInstance.post(
        `/api/auth/user/chatrooms/${chatRoomId}/join`
      );
      console.log('✅ 참가 성공:', response.data);

      // ✅ 참가 성공 후 소켓 연결 및 입장
      await connectStomp();
      sendEnterMessage(chatRoomId);

      // ✅ 채팅방으로 이동
      navigate(`/chat/room/${chatRoomId}`, {
        state: {
          roomTitle: name,
          participantCount: participation,
        },
      });
    } catch (error) {
      console.error('❌ 참가 실패:', error);
      alert('채팅방 참가에 실패했습니다. 이미 참가 중이거나 오류가 발생했습니다.');
    }
  };

  return (
    <div onClick={handleClick} className={styles.container}>
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
