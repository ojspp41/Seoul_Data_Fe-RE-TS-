// src/pages/FestivalAllPage.tsx
import { useState, useMemo  } from 'react';
import { useQuery } from '@tanstack/react-query';
import CalendarModal from '../components/CalendarModal';
import EventCard from '../components/EventCard';
import axiosInstance from '../api/axiosInstance';
import styles from './css/FestivalAllPage.module.css';
import { DAYS_KR, getWeekDays } from '../utils/alldateUtils';
import BottomNav from '../components/BottomNav';
interface EventType {
    eventId: number;
    category: string;
    title: string;
    guName: string;
    startDate: string;
    endDate: string;
    mainImg: string;
  }
const categories = [
  '전체', '전시/미술', '교육/체험',  '연극', '클래식', '무용',
  '콘서트', '국악', '영화', '뮤지컬', '전통/역사', '독창회', '자연/경관', '문화/예술', '시민화합', '그 외'
];
const formatDate = (date: Date) => date.toISOString().split('T')[0];

export default function FestivalAllPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [showSearch, setShowSearch] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const weekDates = useMemo(() => getWeekDays(selectedDate), [selectedDate]);
  const startDate = formatDate(selectedDate);
  const endDate = formatDate(selectedDate);

  const fetchEvents = async (): Promise<EventType[]> => {
    const res = await axiosInstance.get('/api/auth/user/event', {
      params: {
        startDate,
        endDate,
        page: 1,
        size: 2000,
      },
    });
    return res.data.data.content;
  };

  const { data: events = [], isLoading, isError } = useQuery<EventType[], Error>({
    queryKey: ['events-by-date', startDate, endDate],
    queryFn: fetchEvents,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  const filteredEvents = useMemo(() => {
    return events.filter(
      (event) =>
        (selectedCategory === '전체' || event.category === selectedCategory) &&
        (searchKeyword === '' || event.title.includes(searchKeyword) || event.guName.includes(searchKeyword))
    );
  }, [events, selectedCategory, searchKeyword]);

  if (isLoading) return <div className={styles.page}>로딩 중...</div>;
  if (isError) return <div className={styles.page}>행사 데이터를 불러오는 데 실패했습니다.</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <img src="/assets/slash.svg" alt="뒤로가기" onClick={() => window.history.back()} />
        <span className={styles.monthText}>
          {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
          <img src="/assets/below.svg" alt="날짜 선택" onClick={() => setCalendarOpen(true)} />
        </span>

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

      <div className={styles.dateSelector}>
        {weekDates.map((date) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          return (
            <button
              key={date.toDateString()}
              className={`${styles.dateButton} ${isSelected ? styles.selected : ''}`}
              onClick={() => setSelectedDate(date)}
            >
              <div className={styles.dayLabel}>{DAYS_KR[date.getDay()]}</div>
              <div className={styles.dateLabel}>{date.getDate()}</div>
            </button>
          );
        })}
      </div>

      <div className={styles.categorySection}>
        <div className={styles.categoryTitle}>카테고리</div>
        <div className={styles.categoryTabs}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.categoryTab} ${selectedCategory === cat ? styles.activeTab : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.cardList}>
        {filteredEvents.map((event) => (
          <EventCard
            key={event.eventId}
            category={event.category}
            title={event.title}
            location={event.guName}
            dateRange={`${event.startDate} ~ ${event.endDate}`}
            mainImg={event.mainImg}
            eventId={event.eventId}
            onClick={() => {
              window.location.href = `/fest/detail?eventId=${event.eventId}`;
            }}
          />
        ))}
      </div>

      {calendarOpen && (
        <CalendarModal
          onClose={() => setCalendarOpen(false)}
          onSelectDate={(date) => {
            setSelectedDate(date);
            setCalendarOpen(false);
          }}
        />
      )}

      <BottomNav />
    </div>
  );
}