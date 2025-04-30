import styles from "./css/ReviewItem.module.css";

interface ReviewItemProps {
  name: string;
  visitDate: string;
  content: string;
  mediaList?: { imageUrl: string }[];
}

export default function ReviewItem({ name, visitDate, content, mediaList = [] }: ReviewItemProps) {
  const hasImage = mediaList.length > 0;
  const imageUrl = hasImage ? mediaList[0].imageUrl : null;
  
  console.log("imageUrl",imageUrl);
  return (
    <div className={styles.item}>
      {/* 작성자 정보는 위쪽 한 줄 */}
      <div className={styles.topInfo}>
        <span className={styles.name}>{name}</span>
        <span className={styles.meta}>{visitDate}</span>
      </div>

      {/* 아래는 이미지 + 내용 좌우 정렬 */}
      <div className={styles.row}>
        {imageUrl && (
          <img src={imageUrl} alt="리뷰 이미지" className={styles.profileImg} />
        )}
        <p className={styles.content}>{content}</p>
      </div>

      <div className={styles.divider} />
    </div>
  );
}
