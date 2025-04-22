import {useState} from "react";
import styles from "./css/ReviewSection.module.css";
import ReviewItem from "./ReviewItem";
import { useNavigate } from "react-router-dom";

const dummyReviews = Array.from({
    length: 32
}, (_, i) => ({
    id: i + 1,
    name: `리뷰어${i + 1}`,
    ageGender: `${ 20 + (i % 10)}세 ${i % 2 === 0
        ? "남"
        : "여"}`,
    visitDate: `25.04.${ (i % 28 + 1)
        .toString()
        .padStart(2, "0")}`,
    content: `이건 ${i + 1}번째 리뷰입니다. 행사 정말 좋았어요!`,
    profileImg: i % 3 === 0
        ? `/assets/mock/ac.svg`
        : null
}));

export default function ReviewSection() {
    const [visibleCount, setVisibleCount] = useState(3);
    const navigate = useNavigate();

    const handleShowMore = () => {
        setVisibleCount((prev) => prev + 3);
    };

    const visibleReviews = dummyReviews.slice(0, visibleCount);
    const hasMore = visibleCount < dummyReviews.length;

    return (
        <div className={styles.container}>
            {/* 상단 라벨 */}
            <div className={styles.header}>
                <p className={styles.title}>
                    리뷰
                    <span className={styles.count}>({dummyReviews.length})</span>
                </p>
                <button 
                    className={styles.writeBtn}
                    onClick={() => navigate("/fest/detail/review")}
                >
                    <img src="/assets/pencil.svg" alt="리뷰 작성"/>
                    리뷰 작성하기
                </button>
            </div>

            {/* 리뷰 목록 */}
            <div className={styles.list}>
                {visibleReviews.map((review) => (<ReviewItem key={review.id} {...review}/>))}
            </div>

            {/* 더보기 버튼 */}
            {
                hasMore && (
                    <button className={styles.moreBtn} onClick={handleShowMore}>
                        더보기
                    </button>
                )
            }
        </div>
    );
}
