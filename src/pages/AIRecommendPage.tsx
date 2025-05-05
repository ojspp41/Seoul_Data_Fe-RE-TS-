// src/pages/AIRecommendPage.tsx
import React from 'react';
import { useQueries, UseQueryResult } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import styles from './css/AIRecommendPage.module.css';
import axiosInstance from '../api/axiosInstance';
import RankedCard from '../components/RankedCard';
interface CardItem {
  eventId: number;
  title: string;
  category: string;
  guName: string;
  startDate: string;
  endDate: string;
  mainImg: string;
}

const formatDate = (start: string, end: string) => {
  const s = start.split('-');
  const e = end.split('-');
  return `25.${s[1]}.${s[2]} ~ 25.${e[1]}.${e[2]}`;
};

const AIRecommendPage = () => {
  const navigate = useNavigate();

  const [recommendQuery, popularQuery] = useQueries({
    queries: [
      {
        queryKey: ['recommendEvents'],
        queryFn: async (): Promise<CardItem[]> => {
          const res = await axiosInstance.get('/api/auth/user/event/recommend');
          return Array.isArray(res.data.data) ? res.data.data : [];
        },
      },
      {
        queryKey: ['popularEvents', 4],
        queryFn: async (): Promise<CardItem[]> => {
          const res = await axiosInstance.get('/api/auth/user/event', {
            params: { sortByPopularity: 'True', size: 4 },
          });
          const content = Array.isArray(res.data.data?.content)
            ? res.data.data.content
            : [];
          return content;
        },
      },
    ],
  }) as [UseQueryResult<CardItem[]>, UseQueryResult<CardItem[]>];

  if (recommendQuery.isLoading || popularQuery.isLoading) {
    return <div>로딩 중...</div>;
  }

  const recommendData = recommendQuery.data || [];
  const popularData = popularQuery.data || [];

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <img
          src="/assets/slash.svg"
          alt="뒤로가기"
          className={styles.icon}
          onClick={() => navigate('/mainpage')}
        />
        <h2 className={styles.title}>AI 추천</h2>
      </div>

      <p className={styles.subtitle}>고객님을 위한 AI 맞춤 제안</p>
      <div className={styles.list}>
        {recommendData.map((item) => (
          <EventCard
            key={item.eventId}
            category={item.category}
            title={item.title}
            location={item.guName}
            dateRange={formatDate(item.startDate, item.endDate)}
            mainImg={item.mainImg || '/assets/default-card.jpg'}
            eventId={item.eventId}
            onClick={(id) => navigate(`/event/${id}`)}
          />
        ))}
      </div>

      
        <h3 className={styles.sectionTitle}>지금 인기있는 그 장소</h3>
        <div className={styles.listGrid}>
        {popularData.map((item, idx) => (
            <RankedCard
            key={item.eventId}
            rank={idx + 1}
            title={item.title}
            dateRange={formatDate(item.startDate, item.endDate)}
            mainImg={item.mainImg || '/assets/default-card.jpg'}
            onClick={() => navigate(`/event/${item.eventId}`)}
            />
        ))}
        </div>

    </div>
  );
};

export default AIRecommendPage;
