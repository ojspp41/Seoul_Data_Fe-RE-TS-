// src/pages/PopularPage.tsx
import { useQuery } from '@tanstack/react-query';
import styles from './css/PopularPage.module.css';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom'; 

interface CardItem {
  eventId: number;
  title: string;
  category: string;
  guName: string;
  startDate: string;
  endDate: string;
  mainImg?: string;
}

const formatDate = (dateStr: string): string => {
  const [yyyy, mm, dd] = dateStr.split('-');
  return `${yyyy}.${mm}.${dd}`;
};

const PopularPage = () => {
    const navigate = useNavigate(); // ✅ 추가

  const handleBack = () => {
    navigate('/mainpage', { replace: true });

  };
  const { data = [] } = useQuery<CardItem[]>({
    queryKey: ['popularEventsFull'],
    queryFn: async () => {
      const res = await axiosInstance.get('/api/auth/user/event', {
        params: { sortByPopularity: 'True', size: 20 },
      });
      const content = Array.isArray(res.data.data?.content)
        ? res.data.data.content
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];
      return content;
    },
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <img src="/assets/slash.svg" alt="slash"  onClick={handleBack} className={styles.icon} />
        <h2 className={styles.title}>실시간 인기</h2>
      </div>

      <div className={styles.grid}>
        {data.map((item, idx) => (
          <div className={styles.card} key={item.eventId} onClick={() => navigate(`/fest/detail?eventId=${item.eventId}`)} >
            <div className={styles.imageWrapper}>
              <img src={item.mainImg || '/assets/default-card.jpg'} alt={item.title} />
              <span className={styles.rank}>{idx + 1}</span>
            </div>
            <div className={styles.info}>
              <p className={styles.titleText}>{item.title}</p>
              <p className={styles.dateText}>
                📅 {formatDate(item.startDate)} ~ {formatDate(item.endDate)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularPage;
