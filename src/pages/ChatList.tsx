import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './css/ChatList.module.css';
import ChatItem from '../components/ChatItem';
import BottomNav from '../components/BottomNav';
import GroupChatItem from '../components/GroupChatItem';
import { useNavigate } from "react-router-dom";

interface ChatData {
  id: number;
  name: string;
  message: string;
  age: number;
  gender: '남' | '여';
  time: string;
  hasNotification: boolean;
  mode: 'my' | 'unread' | 'group';
}
const groupChatMockData = [
  {
    category: '문화/예술',
    title: '클래식 음악 소모임',
    description: '클래식 좋아하는 분들 모두모두 모여라! 안녕하세요~',
    participants: 120,
    lastMessageTime: '1분 전',
  },
  {
    category: '국악',
    title: '[20대] 국악 봄은 온다',
    description: '[20대만!!] 요즘 국악이 가장 힙하다고면서요?',
    participants: 32,
    lastMessageTime: '3분 전',
  },
  {
    category: '영화',
    title: '독립영화 만세',
    description: '독립영화를 사랑하신다면!',
    participants: 4,
    lastMessageTime: '30분 전',
  },
  {
    category: '전시/미술',
    title: '일요일 미술관 번개모임',
    description: '서울 시립미술관 같이 가실 분~',
    participants: 17,
    lastMessageTime: '5분 전',
  },
  {
    category: '교육/체험',
    title: 'DIY 원데이 클래스 모임',
    description: '도예, 캘리그라피 등 함께 체험해요!',
    participants: 58,
    lastMessageTime: '8분 전',
  },
  {
    category: '연극',
    title: '소극장 연극 탐방 모임',
    description: '좋은 연극 같이 보러가요 :)',
    participants: 23,
    lastMessageTime: '12분 전',
  },
  {
    category: '무용',
    title: '현대무용 초보모임',
    description: '기초부터 배워봐요! 몸치도 환영',
    participants: 9,
    lastMessageTime: '15분 전',
  },
  {
    category: '콘서트',
    title: '홍대 밴드 공연 가실 분~',
    description: '혼콘 말고 우리 같이 가요 🤟',
    participants: 46,
    lastMessageTime: '20분 전',
  },
  {
    category: '자연/경관',
    title: '벚꽃 보고 산책하기',
    description: '봄바람 맞으며 천천히 걸어요',
    participants: 81,
    lastMessageTime: '25분 전',
  },
  {
    category: '전통/역사',
    title: '경복궁 야간개장 같이 가요',
    description: '한복입고 사진도 찍어요 📷',
    participants: 61,
    lastMessageTime: '28분 전',
  },
];

const categories = [
  '전시/미술', '문화/예술', '교육/체험', '시민화합', '연극', '클래식', '무용',
  '콘서트', '뮤지컬', '영화', '국악', '전통/역사', '독창회', '자연/경관', '그 외'
];
const chatData: ChatData[] = [
  { id: 1, name: "겨울이오길", age: 22, gender: '여', message: "이번엔 맘 좀 열어보아요~", time: "3일 전", hasNotification: true, mode: 'my' },
  { id: 2, name: "나야들키쿤", age: 20, gender: '남', message: "근데 되돌릴 수 있을까", time: "1일 전", hasNotification: false, mode: 'unread' },
  { id: 3, name: "고도둑기다리며", age: 23, gender: '여', message: "고도둑 기다리는 그거 해요", time: "3시간 전", hasNotification: true, mode: 'unread' },
  { id: 4, name: "정원영", age: 20, gender: '남', message: "단체 참여하려구요", time: "2일 전", hasNotification: false, mode: 'group' },
  { id: 5, name: "카리나", age: 23, gender: '여', message: "내내 고마워요", time: "3일 전", hasNotification: true, mode: 'my' },
];

const Chat: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<'my' | 'unread' | 'group'>('my');
  const [visibleCount, setVisibleCount] = useState(4);
  const filteredChats = chatData.filter(chat => chat.mode === selectedMode);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  
  const filteredGroupChats = groupChatMockData.filter(item => {
    const matchCategory = selectedCategory === '전체' || item.category === selectedCategory;
    const matchKeyword = item.title.toLowerCase().includes(searchKeyword.toLowerCase());
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

            {visibleCount < groupChatMockData.filter(item =>
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
