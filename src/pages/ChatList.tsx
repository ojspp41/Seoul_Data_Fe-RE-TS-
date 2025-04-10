// src/pages/ChatList.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './css/ChatList.module.css';
import ChatItem from '../components/ChatItem';
import BottomNav from '../components/BottomNav';
interface ChatData {
  id: number;
  name: string;
  message: string;
  age: number;
  gender: '남' | '여'; // or string if more open
  time: string;
  hasNotification: boolean;
}

const chatData: ChatData[] = [
    { id: 1, name: "겨울이오길", age: 22, gender: '여', message: "이번엔 맘 좀 열어보아요~", time: "3일 전", hasNotification: true },
    { id: 2, name: "나야들키쿤", age: 20, gender: '남', message: "근데 되돌릴 수 있을까", time: "1일 전", hasNotification: false },
    { id: 3, name: "고도둑기다리며", age: 23, gender: '여', message: "고도둑 기다리는 그거 해요", time: "3시간 전", hasNotification: true },
    { id: 4, name: "정원영", age: 20, gender: '남', message: "단체 참여하려구요", time: "2일 전", hasNotification: false },
    { id: 5, name: "카리나", age: 23, gender: '여', message: "내내 고마워요", time: "3일 전", hasNotification: true },
  ];
  

const Chat: React.FC = () => {
  return (
    <div className={styles["chat-container"]}>
      <h2 className={styles["chat-title"]}>채팅하기</h2>
      <p className={styles["chat-subtitle"]}>
        매칭된 분들과 채팅을 해보세요!<br />가볍게 인사는 어떠신가요?
      </p>

      <div className={styles["chat-list"]}>
        {chatData.map((chat) => (
          <Link key={chat.id} to={`/chat/room/${chat.id}`} style={{ textDecoration: 'none' }}>
            <ChatItem
                name={chat.name}
                age={chat.age}
                gender={chat.gender}
                message={chat.message}
                time={chat.time}
                hasNotification={chat.hasNotification}
                />

          </Link>
        ))}
      </div>
      
      <div style={{ height: '100px' }}></div>
      <BottomNav/>
    </div>
  );
};

export default Chat;
