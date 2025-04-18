import styles from "./css/ReviewItem.module.css";

interface ReviewItemProps {
  name: string;
  ageGender: string;
  visitDate: string;
  content: string;
  profileImg?: string | null;
}

export default function ReviewItem({ name, ageGender, visitDate, content, profileImg }: ReviewItemProps) {
  return (
    <div className={styles.item}>
      {/* 작성자 정보는 위쪽 한 줄 */}
      <div className={styles.topInfo}>
        <span className={styles.name}>{name}</span>
        <span className={styles.meta}>{ageGender} · {visitDate} 방문</span>
      </div>

      {/* 아래는 이미지 + 내용 좌우 정렬 */}
      <div className={styles.row}>
        {profileImg && (
          <img src={profileImg} alt="Profile" className={styles.profileImg} />
        )}
        <p className={styles.content}>{content}</p>
      </div>

      <div className={styles.divider} />
    </div>
  );
}
