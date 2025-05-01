import  { useEffect, useState } from "react";
import styles from "./css/FestivalDetail.module.css";
import FestivalInfo from "../components/FestivalInfo";
import FestivalMap from "../components/FestivalMap";
import FestivalDescription from "../components/FestivalDescription";
import { useNavigate, useSearchParams } from 'react-router-dom'; // ✅ 상단에 추가
import axiosInstance from "../api/axiosInstance";
import ReviewSection from "../components/ReviewSection";
import useFestivalStore from "../store/useFestivalStore";
import CommentSection from "../components/CommentSection";
// 🔸 상태 계산 함수
const getStatus = (start: string, end: string) => {
  const today = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (today < startDate) return { text: "예정", color: "#00A859" };
  if (today > endDate) return { text: "마감", color: "#888888" };
  return { text: "진행중", color: "#0900FF" };
};


export default function FestivalDetail() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");
  const { setEventId, setEventData } = useFestivalStore();
  const [data, setData] = useState<any>();
  const navigate = useNavigate(); // ✅ 컴포넌트 내부에서

  
  useEffect(() => {
    if (!eventId) return;
    setEventId(eventId); // ✅ 전역 저장

    const fetchFestivalDetail = async () => {
      try {
        const response = await axiosInstance.get(`/api/auth/user/event/${eventId}`);
        const eventData = response.data.data;
        setData(eventData);
        setEventData(eventData); // ✅ 전역 저장
      } catch (error) {
        console.error("행사 상세 정보를 불러오지 못했습니다:", error);
      }
    };

    fetchFestivalDetail();
  }, [eventId, setEventId, setEventData]);

  if (!data) return <div>로딩 중...</div>;

  const status = getStatus(data.startDate, data.endDate);

  const detailInfo = {
    location: data.place,
    date: `${data.startDate.replace(/-/g, ".")} ~ ${data.endDate.replace(/-/g, ".")}`,
    fee: data.useFee || data.isFree,
    people: data.useTarget || "정보 없음",
    mask: data.player || "출연자 정보 없음",
    buliding: data.orgName || "기관 정보 없음",
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <img
          src="/assets/back.svg"
          alt="Back"
          onClick={() => navigate(-1)} // ✅ 이전 페이지로 이동
          className={styles.backIcon}
        />
        <img src="/assets/more.svg" alt="More" />
      </div>

      <p className={styles.subtitle}>{data.category}</p>
      <h1 className={styles.title}>{data.title}</h1>

      {/* 위치 */}
      <div className={styles.locationInfoRow}>
        <img src="/assets/detail/map.svg" alt="Map Icon" className={styles.mapIcon} />
        <span className={styles.locationText}>{data.guName || "어디구 있지도 있어"}</span>
      </div>

      {/* 날짜 및 상태 */}
      <div className={styles.dateRow}>
        <span className={styles.date}>
          {data.startDate.replace(/-/g, ".")} ~ {data.endDate.replace(/-/g, ".")}
        </span>
        <span
          className={styles.status}
          style={{
            color: status.color,
            border: `1px solid ${status.color}`,
            fontWeight: "bold",
            borderRadius: "99px",
            padding: "4px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {status.text}
        </span>
      </div>

      {/* 하트/별/공유 아이콘 */}
      <div className={styles.iconContainer}>
        <img src="/assets/hart.svg" alt="Heart Icon" />
        <img src="/assets/star.svg" alt="Star Icon" />
        <img src="/assets/send.svg" alt="Send Icon" />
      </div>

      {/* 이미지 */}
      <div className={styles.websiteImage}>
        <img src={data.mainImg} alt="Festival Cover" />
      </div>

      {/* 웹사이트 */}
      <div className={styles.websiteBox}>
        <div className={styles.websiteLeft}>
          <img src="/assets/earth.svg" alt="Earth Icon" />
          <div className={styles.websiteTextBox}>
            <p className={styles.websiteLabel}>웹사이트 방문</p>
            <a 
              href={data.orgLink}
              className={styles.websiteLink}
              target="_blank"
              rel="noopener noreferrer"
              title={data.orgLink} // 마우스 오버 시 전체 URL 표시
            >
            </a>
          </div>
        </div>
        <img
          src="/assets/detail/slash.svg"
          alt="Slash Icon"
          onClick={() => window.open(data.orgLink, "_blank")}
          className={styles.slashIcon}
        />

      </div>

      {/* 상세 정보 섹션 */}
      <FestivalInfo values={detailInfo} />
      <FestivalMap lat={parseFloat(data.lot)} lng={parseFloat(data.lat)} guName={data.guName} />

      <FestivalDescription content={data.introduce || "등록된 설명이 없습니다."} />
      <CommentSection eventId={eventId!}/>
      <ReviewSection eventId={eventId!} />
    </div>
  );
}
