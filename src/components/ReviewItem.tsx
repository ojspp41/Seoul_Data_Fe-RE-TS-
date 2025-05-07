import styles from "./css/ReviewItem.module.css";
import axiosInstance from "../api/axiosInstance";


interface ReviewItemProps {
  reviewId: number; // ✅ reviewId 추가
  name: string;
  visitDate: string;
  content: string;
  mediaList?: { imageUrl: string }[];
  onDelete?: () => void; // ✅ 삭제 후 목록 갱신 등 외부 처리
}

export default function ReviewItem({ reviewId, name, visitDate, content, mediaList = [], onDelete }: ReviewItemProps) {
  const hasImage = mediaList.length > 0;
  const imageUrl = hasImage ? mediaList[0].imageUrl : null;
  

  

  return (
    <div className={styles.item}>
      <div className={styles.topInfo}>
        <span className={styles.name}>{name}</span>
        <span className={styles.meta}>{visitDate}</span>
        <button
            className={styles.deleteBtn}
            onClick={async (e) => {
              e.stopPropagation(); // ❗ 이 줄이 핵심입니다
              if (window.confirm('정말 삭제하시겠습니까?')) {
                try {
                  await axiosInstance.delete(`/api/auth/user/reviews/${reviewId}`);
                  alert('리뷰가 삭제되었습니다.');
                  onDelete?.();
                } catch (err) {
                  alert('삭제 실패');
                  console.error(err);
                }
              }
            }}
          >
            삭제
          </button>

      </div>

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
