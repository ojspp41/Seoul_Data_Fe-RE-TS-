import styles from "./css/ReviewBigItem.module.css";

interface ReviewItemProps {
  name: string;
  ageGender: string;
  visitDate: string;
  content: string;
  profileImg?: string | null;
}

export default function ReviewBigItem({ name, ageGender, visitDate, content, profileImg }: ReviewItemProps) {
  return (
    <div className={styles.item}>
        <div className={styles.headerRow}>
            <span className={styles.name}>{name}</span>
            <span className={styles.meta}>{ageGender} · {visitDate} 방문</span>
        </div>

        {profileImg && (
          <img src={profileImg} className={styles.contentImg} alt="리뷰 이미지"/>
        )}

        <p className={styles.description}>{content}</p>
    </div>
  );
}
