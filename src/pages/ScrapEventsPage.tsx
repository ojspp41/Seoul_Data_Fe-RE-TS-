import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import EventCard from '../components/EventCard';
import styles from './css/ScrapEventsPage.module.css';

interface ScrapEvent {
  eventId: number;
  title: string;
  category: string;
  guName: string;
  startDate?: string;
  endDate?: string;
  mainImg?: string;
}

const formatDate = (start?: string, end?: string) => {
  if (!start || !end) return '';
  const s = start.split('-');
  const e = end.split('-');
  return `25.${s[1]}.${s[2]} ~ 25.${e[1]}.${e[2]}`;
};

const ScrapEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<ScrapEvent[]>([]);

  useEffect(() => {
    const fetchScrapEvents = async () => {
      try {
        const res = await axiosInstance.get('/api/auth/user/event/favorite');
        const content = res.data.data?.content ?? [];
        setEvents(content);
        console.log(content)
      } catch (error) {
        console.error('스크랩한 행사 불러오기 실패:', error);
      }
    };
    fetchScrapEvents();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img
          src="/assets/slash.svg"
          alt="뒤로가기"
          className={styles.icon}
          onClick={() => navigate('/mypage')}
        />
        <h2 className={styles.title}>스크랩한 행사</h2>
      </div>

      <p className={styles.sectionLabel}>스크랩한 행사 모음</p>

      <div className={styles.list}>
        {events.map((item) => (
          <div key={item.eventId} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '12px' }}>
            <EventCard
                category={item.category}
                title={item.title}
                location={item.guName}
                dateRange={formatDate(item.startDate, item.endDate)}
                mainImg={item.mainImg || '/assets/default-card.jpg'}
                eventId={item.eventId}
                onClick={(id) => navigate(`/event/${id}`)}
            />
            </div>
        ))}
      </div>
    </div>
  );
};

export default ScrapEventsPage;
