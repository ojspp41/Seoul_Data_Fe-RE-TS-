// src/pages/ChatRoom.tsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './css/ChatRoom.module.css';
import ChatMessage from '../components/ChatMessage';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
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
  
  const subscribedRef = useRef(false);
  const location = useLocation();
  const [myVerifyId, setMyVerifyId] = useState<string | null>(null);

  const { roomTitle, participantCount } = location.state || {};
  const [isOwner, setIsOwner] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // 햄버거 메뉴 열림 상태
  // ✅ 경로에 따라 수정 필요
  
  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const response = await axiosInstance.get(`/api/auth/user/chatrooms/${roomId}/memberInfo`);
        const memberInfo = response.data.data?.[0];
        setIsOwner(memberInfo.role === 'OWNER');
        setMyVerifyId(memberInfo.verifyId); // ✅ 여기서 저장
      } catch (error) {
        console.error('방장 여부 확인 실패:', error);
      }
    };
    
  
    if (roomId) {
      fetchMemberInfo();
    }
  }, [roomId]);

useEffect(() => {
  if (!roomId || !myVerifyId) return; // ✅ 둘 다 있어야 연결

  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/auth/user/chat/rooms/${roomId}/messages`
      );
      
      const sortedMessages = response.data.data.content
        .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        
        .map((msg: any) => {
          
          return {
            id: msg.messageId,
            sender: msg.senderVerifyId === myVerifyId ? 'me' : 'other',
            message: msg.content,
            time: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
        });
        

      setMessages(sortedMessages);
      
    } catch (error) {
      console.error('💥 메시지 불러오기 실패:', error);
    }
  };

  fetchMessages();
}, [roomId,myVerifyId]);


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
            
            const body = JSON.parse(message.body);
            console.log('🧾 body.senderVerifyId:', body.senderVerifyId);
            console.log('🙋‍♀️ myVerifyId:', myVerifyId);
            setMessages((prev) => [
              ...prev,
              {
                id: body.messageId, // ✅ 서버에서 제공하는 고유 ID 사용
                sender: body.senderVerifyId == myVerifyId ? 'me' : 'other',

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
        <div className={styles['room-name']}>
          {roomTitle}
          {isOwner && (
            <img
              src="/assets/edit.svg"
              alt="이름 수정"
              className={styles['edit-icon']}
              onClick={async () => {
                const newName = prompt('새 채팅방 이름을 입력하세요', roomTitle);
                if (!newName || newName === roomTitle) return;

                try {
                  await axiosInstance.patch('/api/auth/user/chatrooms/name', {
                    chatRoomId: Number(roomId),
                    name: newName,
                  });
                  alert('채팅방 이름이 수정되었습니다.');
                  // 화면에 즉시 반영
                  location.state.roomTitle = newName; // 기존 state 수정
                  navigate('.', { replace: true, state: { ...location.state, roomTitle: newName } });
                } catch (err) {
                  console.error('이름 수정 실패:', err);
                  alert('이름 수정에 실패했습니다.');
                }
              }}
            />
          )}
        </div>

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
          onClick={() => setMenuOpen(prev => !prev)}
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
      {menuOpen && (
  <div className={styles['menu-popup']}>
    {isOwner ? (
          <button
            onClick={async () => {
              try {
                await axiosInstance.delete(`/api/auth/user/chatrooms/${roomId}`);
                alert('채팅방이 삭제되었습니다.');
                navigate('/chat');
              } catch (err) {
                console.error('채팅방 삭제 실패:', err);
              }
            }}
          >
            채팅방 삭제
          </button>
        ) : (
          <button
            onClick={async () => {
              try {
                await axiosInstance.delete(`/api/auth/user/chatrooms/${roomId}/exit`);
                alert('채팅방에서 나갔습니다.');
                navigate('/chat');
              } catch (err) {
                console.error('채팅방 나가기 실패:', err);
              }
            }}
          >
            채팅방 나가기
          </button>
        )}
      </div>
    )}
    </div>
    
  );
};

export default ChatRoom;
