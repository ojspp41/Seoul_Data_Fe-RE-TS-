import { useEffect, useState } from 'react';
import styles from './css/CommentSection.module.css';
import axiosInstance from '../api/axiosInstance';

import CommentModal from './CommentModal'; // 모달 import

interface Comment {
  commentId: number;
  content: string;
  createdAt: string;
  memberId: number;
  replies: Comment[];
}

interface CommentSectionProps {
  eventId: string;
}


export default function CommentSection({ eventId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [targetCommentId, setTargetCommentId] = useState<number | null>(null);
  const [openReplies, setOpenReplies] = useState<Record<number, boolean>>({});


  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(`/api/auth/user/event/comment`, {
        params: { eventId },
      });
      setComments(response.data.data.content);
    } catch (err) {
      console.error('댓글 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(`/api/auth/user/event/comment`, {
          params: { eventId },
        });
        console.log("commnet",response);
        setComments(response.data.data.content);
      } catch (err) {
        console.error('댓글 불러오기 실패:', err);
      }
    };

    if (eventId) fetchComments();
  }, [eventId]);

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <span className={styles.title}>댓글</span>
        <span className={styles.count}>{comments.length}개</span>
        <button className={styles.writeButton} onClick={() => setIsModalOpen(true)}>
            댓글 작성하기
        </button>
      </div>

      {/* 댓글 목록 (3개만 보여줌) */}
      {comments.slice(0, 3).map((comment) => {
        const isOpen = openReplies[comment.commentId]; // 펼침 여부 상태

        return (
          <div key={comment.commentId} className={styles.commentItem}>
            <div className={styles.commentText}>{comment.content}</div>

            <div
              className={styles.metaRow}
              onClick={() => {
                setTargetCommentId(comment.commentId);
                setReplyModalOpen(true);
              }}
            >
              <div className={styles.metaLeft}>
                <img src="/assets/dislike.svg" alt="싫어요" />
                <span className={styles.dislikeCount}>{comment.replies.length}</span>
              </div>
              <div className={styles.metaRight}>
                <span className={styles.time}>· {formatDate(comment.createdAt)}</span>
                <span className={styles.writer}>· 사용자{comment.memberId}</span>
                <button
                  className={styles.toggleRepliesBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenReplies((prev) => ({
                      ...prev,
                      [comment.commentId]: !prev[comment.commentId],
                    }));
                  }}
                >
                  {isOpen ? "답글 숨기기" : "답글 보기"}
                </button>
              </div>
            </div>

            {/* ✅ 대댓글 목록 펼치기 */}
            {isOpen && comment.replies.length > 0 && (
              <div className={styles.replyList}>
                {comment.replies.map((reply) => (
                  <div key={reply.commentId} className={styles.replyItem}>
                    <div className={styles.replyText}>{reply.content}</div>
                    <div className={styles.metaRight}>
                      <span className={styles.time}>· {formatDate(reply.createdAt)}</span>
                      <span className={styles.writer}>· 사용자{reply.memberId}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}


      <button className={styles.moreButton}>댓글 더보기</button>
      
      {/* 일반 댓글 작성 모달 */}
      {isModalOpen && (
        <CommentModal
          eventId={eventId}
          onClose={() => setIsModalOpen(false)}
          onSubmitSuccess={() => {
            fetchComments();
            setIsModalOpen(false);
          }}
        />
      )}

      {/* 대댓글 작성 모달 */}
      {replyModalOpen && targetCommentId !== null && (
        <CommentModal
          eventId={eventId}
          parentCommentId={targetCommentId} // ✅ 여기 추가
          onClose={() => setReplyModalOpen(false)}
          onSubmitSuccess={() => {
            fetchComments();
            setReplyModalOpen(false);
          }}
        />
      )}

    </div>
  );
}

// 날짜 포맷 (예: '5분 전' 등으로 바꾸고 싶으면 라이브러리 추가 가능)
const formatDate = (datetime: string): string => {
  return datetime.split(' ')[0].replace(/-/g, '.'); // 예: '2025.04.13'
};
