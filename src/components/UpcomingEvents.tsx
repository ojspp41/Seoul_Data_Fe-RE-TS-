// ../components/UpcomingEvents.tsx

import React, {useState} from 'react';
import styled from 'styled-components';
import arrowIcon from '/assets/arrow.svg';
import {DAYS_KR, getWeekDays, isDateInRange} from '../utils/dateUtils';
import EventCard from './EventCard'; // 컴포넌트와 같은 디렉토리라면

// 더미 행사 데이터
const dummyEvents = [
    {
        id: 1,
        category: "전시/미술",
        title: "K-핸드메이드페어 2025",
        location: "서울 삼성동 코엑스 1층 B홀",
        dateRange: "2025-04-03~2025-04-21"
    }, {
        id: 2,
        category: "전시/미술",
        title: "2025 핸드아티코리아",
        location: "코엑스전시장 C홀",
        dateRange: "2025-04-05~2025-04-10"
    }
];

const UpcomingEvents: React.FC = () => {
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(today);
    const weekDates = getWeekDays(today);

    return (
        <Container>
            <Header>
                <Title>다가오는 행사 일정</Title>
                <SeeAll>
                    <SeeAllText>전체보기</SeeAllText>
                    <ArrowIcon src={arrowIcon} alt="arrow"/>
                </SeeAll>
            </Header>

            <DateSelector>
                {
                    weekDates.map((date) => {
                        const isSelected = date.toDateString() === selectedDate.toDateString();
                        return (
                            <DateButton
                                key={date.toDateString()}
                                onClick={() => setSelectedDate(date)}
                                selected={isSelected}>
                                <DayLabel>{DAYS_KR[date.getDay()]}</DayLabel>
                                <DateLabel>{date.getDate()}</DateLabel>
                            </DateButton>
                        );
                    })
                }
            </DateSelector>
            {/* 행사 리스트 */}
            <EventsWrapper>
                {
                    dummyEvents
                        .filter((event) => isDateInRange(selectedDate, event.dateRange))
                        .map((event) => (
                            <EventCard
                                key={event.id}
                                category={event.category}
                                title={event.title}
                                location={event.location}
                                dateRange={event.dateRange}/>

                        ))
                }
            </EventsWrapper>

        </Container>
    );
};

export default UpcomingEvents;

// styled-components

const Container = styled.div `
  width: calc(100% - 40px);   // 전체에서 좌우 여백 합친 만큼 빼기
  margin: 0 auto;             // 가운데 정렬
  background: white;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);  // 👉 약한 그림자
  border-radius: 8px;         // (선택) 부드러운 둥근 모서리
`;

const Header = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.span `
  font-size: 18px;
  font-weight: 700;
  color: #000;
`;

const SeeAll = styled.div `
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SeeAllText = styled.span `
  font-size: 15px;
  font-weight: 500;
  color: #777;
`;

const ArrowIcon = styled.img `
  width: 16px;
  height: 16px;
`;

const DateSelector = styled.div `
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

const DateButton = styled.button < {
    selected: boolean
} > `
  background-color: ${ (props) => (
    props.selected
        ? '#000'
        : 'transparent'
)};
  color: ${ (props) => (
    props.selected
        ? '#fff'
        : '#000'
)};
  border-radius: 50%;
  width: 36px;
  height: 36px;
  text-align: center;
  font-weight: 500;
  border: none;
  cursor: pointer;
`;

const DayLabel = styled.div `
  font-size: 8px;
  font-weight: 500;
`;

const DateLabel = styled.div `
    font-size: 18px;
    font-weight: 600;
`;

const EventsWrapper = styled.div `
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  
`;
