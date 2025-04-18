import { useState } from "react";
import styles from "./css/ReviewPage.module.css";
import ReviewBigItem from "./ReviewBigItem";

const dummyReviews = Array.from({ length: 32 }, (_, i) => ({
  id: i + 1,
  name: `리뷰어${i + 1}`,
  ageGender: `${20 + (i % 10)}세 ${i % 2 === 0 ? "남" : "여"}`,
  visitDate: `25.04.${(i % 28 + 1).toString().padStart(2, "0")}`,
  content: `이건 ${i + 1}번째 리뷰입니다. 행사 정말 좋았어요!`,
  profileImg: i % 2 === 0 ? `/assets/mock/ac.svg` : null,
}));

export default function ReviewPage() {
  const [photoOnly, setPhotoOnly] = useState(false);

  const filteredReviews = photoOnly
    ? dummyReviews.filter((r) => r.profileImg)
    : dummyReviews;

  return (
    <div className={styles.page}>
      {/* 헤더 */}
      <div className="">
        <img src="/assets/slash.svg" alt="썸네일" className={styles.thumb} />
      
      </div>
      <div className={styles.header}>
        <p className={styles.title}>
          리뷰 <span className={styles.count}>({dummyReviews.length})</span>
        </p>
        <button className={styles.writeBtn}>
          <img src="/assets/pencil.svg" alt="작성" />
          리뷰 작성하기
        </button>
      </div>

      {/* 필터 */}
      <div className={styles.filter}>
        <span className={styles.sort}>🔻최신순</span>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={photoOnly}
            onChange={(e) => setPhotoOnly(e.target.checked)}
          />
          <span className={styles.customCheckbox} />
          <span className={styles.photoOnlyText}>사진 리뷰만</span>
        </label>
      </div>

      {/* 리뷰 리스트 */}
      <div className={styles.list}>
        {filteredReviews.map((review) => (
          <ReviewBigItem key={review.id} {...review} />
        ))}
      </div>
    </div>
  );
}
