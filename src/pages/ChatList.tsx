import React, { useState , useEffect} from 'react';
import { Link } from 'react-router-dom';
import styles from './css/ChatList.module.css';
import ChatItem from '../components/ChatItem';
import BottomNav from '../components/BottomNav';
import GroupChatItem from '../components/GroupChatItem';
import { useNavigate } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
interface ChatData {
  id: number;
  name: string;
  message: string;
  participation: number;
  time: string;
  hasNotification: boolean;
  mode: 'my' | 'unread' | 'group';
}
interface ApiChatData {
  chatRoomId: number;
  name: string;
  participation: number;
  type: 'DIRECT' | 'GROUP';
  createdFrom: string | null;
  createdFromId: number | null;
  notReadMessageCount: number;
  lastMessageTime: string;
  lastMessageText: string;
}


interface GroupChatData {
  chatRoomId: number;
  name: string;
  information: string;
  participation: number;
  category: string;
}


const categories = [
  '전시/미술', '문화/예술', '교육/체험', '시민화합', '연극', '클래식', '무용',
  '콘서트', '뮤지컬', '영화', '국악', '전통/역사', '독창회', '자연/경관', '그 외'
];

const Chat: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<'my' | 'unread' | 'group'>('my');
  const [visibleCount, setVisibleCount] = useState(4);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [showSearch, setShowSearch] = useState(false);
  const [apiChatList, setApiChatList] = useState<ApiChatData[]>([]);
  const [groupChatList, setGroupChatList] = useState<GroupChatData[]>([]);
  
  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/user/my-chatrooms');
        setApiChatList(response.data.data.content); 
        console.log("response",response);
        // ❗ 서버 응답 구조에 따라 .data.data 조정 필요 (ex. 바로 배열이면 .data)
      } catch (error) {
        console.error('채팅방 리스트 가져오기 실패:', error);
      }
    };
  
    fetchChatList();
  }, []);

  useEffect(() => {
    const fetchGroupChatList = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/user/chatrooms');
        const content = response.data.data?.content;
        if (Array.isArray(content)) {
          setGroupChatList(content);
        } else {
          console.error('그룹 채팅방 데이터가 배열이 아닙니다:', content);
          setGroupChatList([]);
        }
      } catch (error) {
        console.error('그룹 채팅방 리스트 가져오기 실패:', error);
      }
    };
  
    fetchGroupChatList();
  }, []);
  
  const chatData: ChatData[] = Array.isArray(apiChatList)
  ? apiChatList.map(chat => {
      let mode: 'my' | 'unread' | 'group';

      if (chat.type === "GROUP") {
        mode = 'group';
      } else if (chat.notReadMessageCount > 0) {
        mode = 'unread';
      } else {
        mode = 'my';
      }

      return {
        id: chat.chatRoomId,
        name: chat.name,
        participation: chat.participation,
        message: chat.lastMessageText || "메시지 없음",
        time: chat.lastMessageTime,
        hasNotification: chat.notReadMessageCount > 0,
        mode,
      };
    })
  : [];

  const myGroupRoomIds = apiChatList
  .filter((chat) => chat.type === 'GROUP')
  .map((chat) => chat.chatRoomId);
  

  
  const filteredChats = chatData.filter(chat => chat.mode === selectedMode);
  const navigate = useNavigate();
  
  const filteredGroupChats = groupChatList.filter(item => {
    const matchCategory = selectedCategory === '전체' || item.category === selectedCategory;
    const matchKeyword = item.name.toLowerCase().includes(searchKeyword.toLowerCase());
    const notJoined = !myGroupRoomIds.includes(item.chatRoomId);
    return matchCategory && matchKeyword && notJoined;
  });
  

  return (
    <div className={styles["chat-container"]}>
      <div className={styles["chat-header"]}>
        <h2 className={styles["chat-tit"]}>채팅</h2>
        <img src="/assets/setting.svg" alt="설정" className={styles["chat-icon"]} />
      </div>

      <div className={styles["chat-filter-buttons"]}>
        {['my', 'unread', 'group'].map(mode => (
          <button
            key={mode}
            className={`${styles["filter-button"]} ${selectedMode === mode ? styles["selected"] : ''}`}
            onClick={() => setSelectedMode(mode as 'my' | 'unread' | 'group')}
          >
            {{
              my: '내 채팅방',
              unread: '안 읽은 채팅방',
              group: '단체 채팅방',
            }[mode]}
          </button>
        ))}
      </div>

      <div className={styles["chat-list"]}>
        {filteredChats.map(chat => (
          <Link
            key={chat.id}
            to={`/chat/room/${chat.id}`}
            state={{ roomTitle: chat.name, participantCount: chat.participation }}
            style={{ textDecoration: 'none' }}
          >
            <ChatItem {...chat} />
          </Link>
        
        ))}
      </div>
      {/* ✅ 회색 박스 구분선 */}
      {selectedMode === 'group' && (
        <div className={styles["divider"]}></div>
      )}
      {selectedMode === 'group' && (
        <div className={styles["group-chat-section"]}>
          <div className={styles["group-chat-header"]}>
            <h3 className={styles["group-chat-title"]}>전체 채팅방</h3>
            {/* 검색 영역 */}
            <div className={styles["search-area"]}>
              <button
                onClick={() => {
                  if (showSearch) setSearchKeyword('');
                  setShowSearch(prev => !prev);
                }}
                className={styles["search-toggle"]}
              >
                {showSearch ? '취소' : <img src="/assets/search.svg" alt="검색" />}
              </button>
              

              
            </div>
            
          </div>
          {showSearch && (
                
                <input
                  type="text"
                  placeholder="관심사 혹은 키워드를 입력하세요"
                  className={styles["search-input"]}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              )}
          <div className={styles["group-category-list"]}>
            {['전체', ...categories].map((cat) => (
              <button
                key={cat}
                className={`${styles["category-button"]} ${selectedCategory === cat ? styles["selected"] : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className={styles["group-chat-list"]} 
            
          >
            {filteredGroupChats
              .slice(0, visibleCount)
              .map((chat, index) => (
                <GroupChatItem key={index} {...chat} />
            ))}

            {visibleCount < groupChatList.filter(item =>
              selectedCategory === '전체' || item.category === selectedCategory
            ).length && (
              <button
                className={styles["load-more-button"]}
                onClick={() => setVisibleCount(prev => prev + 4)}
              >
                더보기
              </button>

            )}
          </div>
        </div>
      )}


      {selectedMode === 'group' && (
        <div className={styles["floating-plus-button"]} onClick={() => navigate("/chat/create-group")}>
          <img src="/assets/plus.svg" alt="그룹채팅 추가" />
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Chat;
