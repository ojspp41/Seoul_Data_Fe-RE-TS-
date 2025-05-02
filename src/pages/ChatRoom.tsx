// src/pages/ChatRoom.tsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './css/ChatRoom.module.css';
import ChatMessage from '../components/ChatMessage';
import { useParams, useNavigate } from 'react-router-dom';
import {
  connectStomp,
  sendChatMessage,
  disconnectStomp,
  subscribeToRoom,
  sendEnterMessage,
  sendLeaveMessage,
} from '../utils/socket';
import { StompSubscription } from '@stomp/stompjs';
import axiosInstance from '../api/axiosInstance';
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
  const navigate = useNavigate();
  const roomTitle = '오버클락도 락'; // TODO: 서버에서 받아오도록 변경
  const participantCount = 23;
  const subscribedRef = useRef(false);
  // ✅ 경로에 따라 수정 필요

useEffect(() => {
  if (!roomId) return;

  const fetchMessages = async () => {
    try {
      console.log(roomId);
      const response = await axiosInstance.get(
        `/api/auth/user/chat/rooms/${roomId}/messages`
      );
      
      const sortedMessages = response.data.data.content
        .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map((msg: any) => ({
          id: msg.messageId,
          sender: msg.senderId === 7 ? 'me' : 'other',
          message: msg.content,
          time: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }));
        console.log(sortedMessages);

      setMessages(sortedMessages);
    } catch (error) {
      console.error('💥 메시지 불러오기 실패:', error);
    }
  };

  fetchMessages();
}, [roomId]);


  useEffect(() => {
    if (!roomId) return;
  
    let subscription: StompSubscription | null | undefined;
    
  
    const connect = async () => {
      try {
        await connectStomp();
        if (subscribedRef.current) return; // ✅ 이미 구독한 경우 무시
        subscribedRef.current = true; // ✅ 최초 구독만 허용
        
        // 입장 메시지
        sendEnterMessage(Number(roomId));
  
        // 구독
        subscription = subscribeToRoom(Number(roomId), (message) => {
            console.log('📩 수신 메시지 원본:', message.body);
            const body = JSON.parse(message.body);
            console.log("body",body);
            setMessages((prev) => [
              ...prev,
              {
                id: body.messageId, // ✅ 서버에서 제공하는 고유 ID 사용
                sender: body.senderId === 7 ? 'me' : 'other',
                message: body.content,
                time: new Date(body.createdAt).toLocaleTimeString([], {
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
      if (roomId) sendLeaveMessage(Number(roomId));
      subscription?.unsubscribe(); // 구독 해제
      disconnectStomp();
    };
  }, [roomId]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    console.log('💬 메시지 전송 시도:', inputValue,roomId);
    if (!inputValue.trim() || !roomId) return;
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
          onClick={() => {
            if (roomId) sendLeaveMessage(Number(roomId));
            disconnectStomp();
            navigate('/chat'); // TODO: 채팅 목록 경로로
          }}
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
