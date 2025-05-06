import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import ReviewItem from '../components/ReviewItem';
import styles from './css/MyReviewPage.module.css';

interface Review {
  id: number;
  eventId: number;
  eventTitle: string;
  memberName: string;
  content: string;
  createdAt: string;
  rating: number;
  mediaList?: { imageUrl: string }[];
}

const MyReviewPage = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const res = await axiosInstance.get('/api/auth/user/my-reviews');
        setReviews(res.data.data.content);
      } catch (err) {
        console.error('리뷰 가져오기 실패:', err);
      }
    };

    fetchMyReviews();
  }, []);

  return (
    <div className={styles.wrapper}>
      {/* 헤더 */}
      <div className={styles.header}>
        <img
          src="/assets/slash.svg"
          alt="뒤로가기"
          className={styles.icon}
          onClick={() => navigate("/mypage")}
        />
        <p className={styles.title}>내가 쓴 리뷰</p>
      </div>

      {/* 섹션 타이틀 */}
      <p className={styles.sectionTitle}>작성한 리뷰 모음</p>

      {/* 리뷰 목록 */}
      <div className={styles.reviewList}>
        {/* 리뷰 목록 */}
{reviews.length > 0 ? (
  <div className={styles.reviewList}>
            {reviews.map((review) => (
                <div
                    key={review.id}
                    onClick={() => navigate(`/fest/detail?eventId=${review.eventId}`)}
                    style={{ cursor: 'pointer' }}
                >
                    <ReviewItem
                    name={review.memberName}
                    visitDate={new Date(review.createdAt).toLocaleDateString('ko-KR')}
                    content={review.content}
                    mediaList={review.mediaList}
                    />
                </div>
                ))}
            </div>
            ) : (
            <p className={styles.emptyMessage}>작성한 리뷰가 없습니다.</p>
            )}
      </div>
    </div>
  );
};

export default MyReviewPage;
