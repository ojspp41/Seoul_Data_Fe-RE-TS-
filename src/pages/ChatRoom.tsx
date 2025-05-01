// src/pages/ChatRoom.tsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './css/ChatRoom.module.css';
import ChatMessage from '../components/ChatMessage';
import { useParams } from 'react-router-dom';
import {
  connectStomp,
  sendChatMessage,
  subscribeToRoom,
  disconnectStomp,
} from '../utils/socket';

interface ChatMessageData {
  id: number;
  sender: 'me' | 'other';
  message: string;
  time: string;
}

const ChatRoom: React.FC = () => {
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const { roomId } = useParams();
  const roomTitle = '오버클락도 락'; // TODO: 서버에서 받아오도록 변경
  const participantCount = 23;

  useEffect(() => {
    let unsubscribe: any;

    const connect = async () => {
      try {
        const stomp = await connectStomp();

        // 1. 채팅방 입장
        stomp.send(
          '/app/chat/room/enter',
          {},
          JSON.stringify({
            chatRoomId: Number(roomId),
          })
        );

        // 2. 채팅 수신 구독
        unsubscribe = subscribeToRoom(roomId!, (message) => {
          const body = JSON.parse(message.body);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(), // TODO: 서버에서 ID 제공 시 변경
              sender: body.sender === 'ME' ? 'me' : 'other',
              message: body.content,
              time:
                body.time ||
                new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
            },
          ]);
        });
      } catch (err) {
        console.error('💥 WebSocket 연결 실패:', err);
      }
    };

    connect();

    return () => {
      unsubscribe?.unsubscribe();
      disconnectStomp();
    };
  }, [roomId]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendChatMessage(Number(roomId), inputValue, 'TEXT');
    setInputValue('');
  };

  return (
    <div>
      <div className={styles['chat-header']}>
        <img
          src="/assets/slash.svg"
          alt="뒤로가기"
          className={styles['header-icon']}
        />
        <div className={styles['header-title']}>
          <div className={styles['room-name']}>{roomTitle}</div>
          <div className={styles['participant-info']}>
            <img
              src="/assets/person.svg"
              alt="인원수"
              className={styles['person-icon']}
            />
            <span className={styles['participant-count']}>
              {participantCount}명
            </span>
          </div>
        </div>
        <img
          src="/assets/hambuger.svg"
          alt="메뉴"
          className={styles['header-icon']}
        />
      </div>

      <div className={styles['chat-body']} ref={chatBodyRef}>
        {messages.map((chat) => (
          <ChatMessage
            key={chat.id}
            sender={chat.sender}
            message={chat.message}
            time={chat.time}
          />
        ))}
      </div>

      <div className={styles['chat-input-container']}>
        <div
          className={`${styles['chat-input-box']} ${
            focused || inputValue.length > 0 ? styles['focused'] : ''
          }`}
          onClick={() => setFocused(true)}
        >
          <textarea
            placeholder="메세지를 입력해주세요.."
            className={styles['chat-input']}
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
          <div
            className={`${styles['send-button']} ${
              focused || inputValue.length > 0 ? styles['active'] : ''
            }`}
            onClick={handleSend}
          >
            <img
              src={
                focused || inputValue.length > 0
                  ? '/assets/send-active.svg'
                  : '/assets/send-icon.svg'
              }
              alt="send"
              className={styles['send-icon']}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
