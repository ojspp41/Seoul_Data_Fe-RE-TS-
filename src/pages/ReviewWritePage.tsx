import {useState} from "react";
import styles from "./css/ReviewWritePage.module.css";

import "react-calendar/dist/Calendar.css"; // 캘린더 기본 스타일 import
import CalendarModal from "../components/CalendarModal";

export default function ReviewWritePage() {
    const [review, setReview] = useState("");
    const [date, setDate] = useState("");
    const [calendarOpen, setCalendarOpen] = useState(false);

    const handleDateChange = (value: Date) => {
        const formatted = value.toISOString().slice(0, 10); // yyyy-mm-dd
        setDate(formatted);
        setCalendarOpen(false);
    };

    return (
        <div className={styles.container}>
            {/* 헤더 */}
            <div className={styles.header}>
                <img src="/assets/slash.svg" alt="뒤로가기" className={styles.backIcon}/>
            </div>

            {/* 행사 정보 */}
            <div className={styles.imageSection}>
                <div className={styles.imagePlaceholder}></div>
                <div className={styles.info}>
                    <img src="/assets/location.svg" alt="위치" className={styles.icon}/>
                    <span className={styles.gu}>용산구</span>
                </div>
                <h1 className={styles.title}>2025 서울재즈페스타</h1>
            </div>

            {/* 방문 날짜 */}
            <div className={styles.dateBox}>
                <label className={styles.label}>방문하신 날짜</label>
                <div className={styles.inputRow} onClick={() => setCalendarOpen(true)}>
                    <input
                        className={styles.dateInput}
                        type="text"
                        placeholder="날짜를 입력하세요"
                        value={date}
                        readOnly/>
                    <img src="/assets/arrow.svg" alt="달력" className={styles.arrow}/>
                </div>
            </div>

            {/* 리뷰 작성 */}
            <div className={styles.reviewBox}>
                <label className={styles.label}>솔직한 리뷰를 작성해 주세요.</label>
                <textarea
                    className={styles.textarea}
                    placeholder={`- 솔직한 후기를 10자 이상 작성해 주세요.\n- 리뷰 작성 시 유의사항을 확인해 주세요.\n- 욕설, 비방, 명예훼손성 표현은 누군가에게 상처가 될 수 있습니다.`}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    maxLength={500}/>
                <div className={styles.charCount}>{review.length}/500</div>
            </div>

            {/* 사진 첨부 */}
            <div className={styles.photoUpload}>
                <button className={styles.uploadBtn}>
                    <img src="/assets/write/plus.svg" alt="사진첨부"/>
                    <span>사진 첨부하기</span>
                    
                    <span className={styles.optional}>(선택)</span>
                </button>
            </div>
            {calendarOpen && (
                <CalendarModal
                onClose={() => setCalendarOpen(false)}
                onSelectDate={handleDateChange}
                />
            )}

        </div>
    );
}
