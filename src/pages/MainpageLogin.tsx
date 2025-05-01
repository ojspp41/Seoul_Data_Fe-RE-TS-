import { useEffect, useRef, useState, useCallback } from 'react';
import UpcomingEvents from '../components/UpcomingEvents';
import FestivalCard from '../components/FestivalCard';
import MainTopCard from '../components/MainTopCard';
import BottomNav from '../components/BottomNav';
import axiosInstance from '../api/axiosInstance';
import styled from 'styled-components';
const formatDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const MainpageLogin = () => {
  const [festivals, setFestivals] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadFestivals = useCallback(async () => {
    try {
      const today = formatDate(new Date());
      const response = await axiosInstance.get('/api/auth/user/event', {
        params: {
          startDate: today,
          endDate: today,
          page,
          size: 5,
        },
      });
      const newEvents = response.data.data.content;
      setFestivals(prev => [...prev, ...newEvents]);
      // 더 이상 로드할 게 없으면 중단
      if (newEvents.length < 5) setHasMore(false);
    } catch (error) {
      console.error('행사 불러오기 실패:', error);
    }
  }, [page]);

  useEffect(() => {
    loadFestivals();
  }, [loadFestivals]);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1 }
    );

    const current = observerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore]);

  return (
    <div style={{ paddingBottom: '120px' }}>
      <MainTopCard />
      <UpcomingEvents />

      {festivals.map((festival, index) => (
        <FestivalCardWrapper key={festival.eventId || index}>
            <FestivalCard
            eventId={festival.eventId}
            commentCount={festival.comments}
            mainText={festival.title}
            subText={festival.category}
            festivalName={festival.title}
            dateRange={`${festival.startDate} ~ ${festival.endDate}`}
            price={festival.isFree === '무료' ? '무료' : '유료'}
            location={festival.guName}
            likedDefault={festival.likes}
            mainImg={festival.mainImg}
            />
        </FestivalCardWrapper>
        ))}


      {hasMore && <div ref={observerRef} style={{ height: '1px' }} />}
      <BottomNav />
    </div>
  );
};

export default MainpageLogin;


const FestivalCardWrapper = styled.div`
  padding-bottom: 50px;
  background-color: #f0f0f0; // 연한 회색 (#f5f5f5, #eeeeee도 대안)

`;

