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
// const apiChatList: ApiChatData[] = [
//   {
//     chatRoomId: 12,
//     name: "겨울이오길",
//     participation: 22,
//     type: "DIRECT",
//     createdFrom: "event",
//     createdFromId: 39924,
//     notReadMessageCount: 0,
//     lastMessageTime: "3일 전",
//     lastMessageText: "이번엔 맘 좀 열어보아요~"
//   },
//   {
//     chatRoomId: 13,
//     name: "나야들키쿤",
//     participation: 20,
//     type: "DIRECT",
//     createdFrom: null,
//     createdFromId: null,
//     notReadMessageCount: 2,
//     lastMessageTime: "1일 전",
//     lastMessageText: "근데 되돌릴 수 있을까"
//   },
//   {
//     chatRoomId: 14,
//     name: "고도둑기다리며",
//     participation: 23,
//     type: "DIRECT",
//     createdFrom: null,
//     createdFromId: null,
//     notReadMessageCount: 5,
//     lastMessageTime: "3시간 전",
//     lastMessageText: "고도둑 기다리는 그거 해요"
//   },
//   {
//     chatRoomId: 15,
//     name: "정원영",
//     participation: 20,
//     type: "GROUP",
//     createdFrom: null,
//     createdFromId: null,
//     notReadMessageCount: 0,
//     lastMessageTime: "2일 전",
//     lastMessageText: "단체 참여하려구요"
//   },
//   {
//     chatRoomId: 16,
//     name: "카리나",
//     participation: 23,
//     type: "DIRECT",
//     createdFrom: null,
//     createdFromId: null,
//     notReadMessageCount: 3,
//     lastMessageTime: "3일 전",
//     lastMessageText: "내내 고마워요"
//   },
// ];


// const groupChatMockData = [
//   {
//     chatRoomId: 11,
//     name: '클래식 음악 소모임',
//     information: '클래식 좋아하는 분들 모두모두 모여라! 안녕하세요~',
//     participation: 120,
//     category: '문화/예술',
//   },
//   {
//     chatRoomId: 12,
//     name: '[20대] 국악 봄은 온다',
//     information: '[20대만!!] 요즘 국악이 가장 힙하다고면서요?',
//     participation: 32,
//     category: '국악',
//   },
//   {
//     chatRoomId: 13,
//     name: '독립영화 만세',
//     information: '독립영화를 사랑하신다면!',
//     participation: 4,
//     category: '영화',
//   },
//   {
//     chatRoomId: 14,
//     name: '일요일 미술관 번개모임',
//     information: '서울 시립미술관 같이 가실 분~',
//     participation: 17,
//     category: '전시/미술',
//   },
//   {
//     chatRoomId: 15,
//     name: 'DIY 원데이 클래스 모임',
//     information: '도예, 캘리그라피 등 함께 체험해요!',
//     participation: 58,
//     category: '교육/체험',
//   },
//   {
//     chatRoomId: 16,
//     name: '소극장 연극 탐방 모임',
//     information: '좋은 연극 같이 보러가요 :)',
//     participation: 23,
//     category: '연극',
//   },
//   {
//     chatRoomId: 17,
//     name: '현대무용 초보모임',
//     information: '기초부터 배워봐요! 몸치도 환영',
//     participation: 9,
//     category: '무용',
//   },
//   {
//     chatRoomId: 18,
//     name: '홍대 밴드 공연 가실 분~',
//     information: '혼콘 말고 우리 같이 가요 🤟',
//     participation: 46,
//     category: '콘서트',
//   },
//   {
//     chatRoomId: 19,
//     name: '벚꽃 보고 산책하기',
//     information: '봄바람 맞으며 천천히 걸어요',
//     participation: 81,
//     category: '자연/경관',
//   },
//   {
//     chatRoomId: 20,
//     name: '경복궁 야간개장 같이 가요',
//     information: '한복입고 사진도 찍어요 📷',
//     participation: 61,
//     category: '전통/역사',
//   },
// ];

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
        setApiChatList(response.data.data); 
        console.log(response.data.data);
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
        console.log("content",content);
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

      if (chat.type === 'GROUP') {
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

  
  const filteredChats = chatData.filter(chat => chat.mode === selectedMode);
  const navigate = useNavigate();
  
  const filteredGroupChats = groupChatList.filter(item => {
    const matchCategory = selectedCategory === '전체' || item.category === selectedCategory;
    const matchKeyword = item.name.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchCategory && matchKeyword;
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
          <Link key={chat.id} to={`/chat/room/${chat.id}`} style={{ textDecoration: 'none' }}>
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
          <div className={styles["group-chat-list"]}>
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
