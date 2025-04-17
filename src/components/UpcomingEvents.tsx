// ../components/UpcomingEvents.tsx

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import arrowIcon from '/assets/arrow.svg';
import { DAYS_KR, getWeekDays, isDateInRange } from '../utils/dateUtils';
import EventCard from './EventCard';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom'; // 상단에 추가

interface EventType {
  eventId: number;
  category: string;
  title: string;
  guName: string;
  startDate: string;
  endDate: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'ENDED';
  mainImg:string;
}
// const dummyEvents: EventType[] = [
//   {
//     id: 1,
//     category: "전시/미술",
//     title: "K-핸드메이드페어 2025",
//     location: "서울 삼성동 코엑스 1층 B홀",
//     startDate: "2025-04-18",
//     endDate: "2025-04-21",
//     status: "NOT_STARTED"
//   },
//   {
//     id: 2,
//     category: "콘서트",
//     title: "봄밤 클래식 콘서트",
//     location: "예술의전당 콘서트홀",
//     startDate: "2025-04-19",
//     endDate: "2025-04-19",
//     status: "NOT_STARTED"
//   },
//   {
//     id: 3,
//     category: "축제",
//     title: "서울 벚꽃 축제",
//     location: "여의도 윤중로",
//     startDate: "2025-04-15",
//     endDate: "2025-04-20",
//     status: "IN_PROGRESS"
//   },
//   {
//     id: 4,
//     category: "전시/미술",
//     title: "디지털 아트 전시: 빛의 미로",
//     location: "DDP 전시장",
//     startDate: "2025-04-25",
//     endDate: "2025-04-30",
//     status: "NOT_STARTED"
//   }
// ];

const UpcomingEvents: React.FC = () => {
  const today = new Date();
  const navigate = useNavigate(); // ✅ 라우터 이동 함수
  const handleEventClick = (eventId: number) => {
    navigate(`/fest/detail?eventId=${eventId}`); // ✅ 파라미터 전달 방식
  };
  const [selectedDate, setSelectedDate] = useState(today);
  const [events, setEvents] = useState<EventType[]>([]);
  const weekDates = getWeekDays(today);
  const [visibleCount, setVisibleCount] = useState(3);
  // 날짜 포맷 유틸
  const filteredEvents = events.filter((event) =>
    isDateInRange(selectedDate, event.startDate, event.endDate)
  );
  
  const visibleEvents = filteredEvents.slice(0, visibleCount);
  
  const formatDate = (date: Date): string =>
  date.toISOString().split('T')[0]; // "YYYY-MM-DD"

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const weekDates = getWeekDays(today); // ✅ useEffect 내부에서 직접 계산
        const weekStart = weekDates[0];
        const weekEnd = weekDates[weekDates.length - 1];
  
        const response = await axiosInstance.get('/api/auth/user/event', {
          params: {
            startDate: formatDate(weekStart),
            endDate: formatDate(weekEnd),
            page: 1,
            size: 1280,
          }
        });
        console.log( response.data.data.content)
        const allEvents: EventType[] = response.data.data.content;
        setEvents(allEvents);
      } catch (error) {
        console.error('행사 데이터를 불러오지 못했습니다:', error);
      }
    };
  
    fetchEvents();
  }, []); // ✅ 페이지 로딩 시 딱 한 번만 실행
  
  

  return (
    <Container>
      <Header>
        <Title>다가오는 행사 일정</Title>
        <SeeAll>
          <SeeAllText>전체보기</SeeAllText>
          <ArrowIcon src={arrowIcon} alt="arrow" />
        </SeeAll>
      </Header>

      <DateSelector>
        {weekDates.map((date) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          return (
            <DateButton
              key={date.toDateString()}
              onClick={() => {
                setSelectedDate(date);
                setVisibleCount(3); // ✅ 날짜 버튼 누를 때마다 visibleCount 초기화
              }}
              selected={isSelected}
              
            >
              <DayLabel>{DAYS_KR[date.getDay()]}</DayLabel>
              <DateLabel>{date.getDate()}</DateLabel>
            </DateButton>
          );
        })}
      </DateSelector>

      <EventsWrapper>
        {events
          .filter((event) => isDateInRange(selectedDate, event.startDate, event.endDate))
          .slice(0, visibleCount) // ✅ 최대 visibleCount만큼 보여줌
          .map((event) => (
            <EventCard
              key={event.eventId}
              category={event.category}
              title={event.title}
              location={event.guName}
              dateRange={`${event.startDate} ~ ${event.endDate}`}
              mainImg={event.mainImg}
              eventId={event.eventId}
              onClick={handleEventClick}
            />
          ))}
          

      </EventsWrapper>
      {visibleEvents.length < filteredEvents.length && (
        <LoadMoreButton onClick={() => setVisibleCount((prev) => prev + 3)}>
          더보기
        </LoadMoreButton>
      )}

    </Container>
  );
};

export default UpcomingEvents;

// styled-components 생략 없이 그대로 유지
const Container = styled.div`
  width: calc(100% - 40px);
  margin: 0 auto;
  background: white;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  margin-bottom: 50px
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #000;
`;

const SeeAll = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SeeAllText = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: #777;
`;

const ArrowIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const DateSelector = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

const DateButton = styled.button<{ selected: boolean }>`
  background-color: ${(props) => (props.selected ? '#000' : 'transparent')};
  color: ${(props) => (props.selected ? '#fff' : '#000')};
  border-radius: 50%;
  width: 36px;
  height: 36px;
  text-align: center;
  font-weight: 500;
  border: none;
  cursor: pointer;
`;

const DayLabel = styled.div`
  font-size: 8px;
  font-weight: 500;
`;

const DateLabel = styled.div`
  font-size: 18px;
  font-weight: 600;
`;

const EventsWrapper = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const LoadMoreButton = styled.button`
  margin: 3px auto 0;
  display: block;
  font-size: 12px;
  font-weight: 500;
  padding: 5px 10px;
  border: none;
  background-color: #f8f8f8;
  border-radius: 99px;
  color: #999;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  margin-top: 10px;
`;
