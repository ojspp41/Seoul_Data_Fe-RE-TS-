
import '../index.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// MainTopCard.tsx
import React from 'react';
import Slider from 'react-slick';
import {  UseQueryOptions ,useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import styles from './css/MainTopCard.module.css';
interface CardItem {
  eventId: number;
  mainText: string;
  subText: string;
  imageUrl: string;
}

// 슬라이더 설정은 그대로 재사용
const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  lazyLoad: 'ondemand',
} as const;

const MainTopCard: React.FC = () => {
  // App.tsx 또는 MainTopCard.tsx에서
  

  const navigate = useNavigate();

  // 병렬로 2개의 쿼리를 실행
  const recommendQuery = useQuery({
    queryKey: ['recommendEvents'],
    queryFn: async () => {
      const start = performance.now(); 

      const res = await axiosInstance.get('/api/auth/user/event/recommend');
      const arr = Array.isArray(res.data.data) ? res.data.data : [];

      const duration = performance.now() - start; // ✅ 경과 시간 계산
      console.log(`📦 추천 데이터 불러오는 데 걸린 시간: ${Math.round(duration)}ms`);

      return arr.map((item: any) => ({
        eventId: item.eventId,
        mainText: item.title,
        subText: `${item.category} | ${item.guName}`,
        imageUrl: item.mainImg || '/assets/default-card.jpg',
      }));
    },
    staleTime: 1000 * 60 * 60 * 2,
    cacheTime: 1000 * 60 * 60 * 2,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  }as UseQueryOptions<CardItem[], Error>);


const popularQuery = useQuery<CardItem[]>({
  queryKey: ['popularEvents', 4],
  queryFn: async () => {
    const start = performance.now(); // ✅ 시작 시간 기록
    const res = await axiosInstance.get('/api/auth/user/event', {
      params: { sortByPopularity: 'True', size: 4 },
    });
    const content = Array.isArray(res.data.data?.content)
      ? res.data.data.content
      : Array.isArray(res.data.data)
      ? res.data.data
      : [];
      const duration = performance.now() - start; // ✅ 경과 시간 계산
    console.log(`🔥 인기 축제 데이터 불러오는 데 걸린 시간: ${Math.round(duration)}ms`);
    return content.map((item: any) => ({
      eventId: item.eventId,
      mainText: item.title,
      subText: `${item.category} | ${item.guName}`,
      imageUrl: item.mainImg || '/assets/default-card.jpg',
    }));
  },
  staleTime: 1000 * 60 * 60 * 2,
    cacheTime: 1000 * 60 * 60 * 2,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
}as UseQueryOptions<CardItem[], Error>);


  // 로딩 및 에러 처리
  if (recommendQuery.isLoading || popularQuery.isLoading) {
    return (
      <div className={styles.container}>
        {[1, 2].map((_, i) => (
          <div key={i} className={styles.skeletonCard}></div>
        ))}
      </div>
    );
  }


  const topCardData = recommendQuery.data || [];
  const popularCardData = popularQuery.data || [];

  return (
    <div className={styles.container}>
        {topCardData.length + popularCardData.length > 0 ? (
          <div style={{ position: 'relative' }}>
            <Slider {...sliderSettings} className={styles.slider}>
              {[...topCardData, ...popularCardData].map((item, idx) => (
                <div key={idx}>
                  <div
                    className={styles.cardWrapper}
                    style={{
                      backgroundImage: `url(${item.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                    onClick={() => navigate(`/fest/detail?eventId=${item.eventId}`)}
                  >
                    <div className={styles.cardOverlay}>
                      <p className={styles.mainText}>{item.mainText}</p>
                      <p className={styles.subText}>{item.subText}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>

            
          </div>
        ) : (
          <div className={styles.emptyMessage}>
            활동이 없어 <strong>추천할 수 없습니다.</strong>
          </div>
        )}
      </div>

  );
};

export default MainTopCard;
