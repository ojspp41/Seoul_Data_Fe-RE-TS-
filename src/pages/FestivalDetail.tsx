import React from "react";
import styles from "./css/FestivalDetail.module.css";
import FestivalInfo from "../components/FestivalInfo";

// 🔸 실제 API 응답 데이터 (목데이터)
const apiData = {
  code: "GEN-000",
  status: 200,
  data: {
    eventId: 39924,
    status: "NOT_STARTED",
    category: "전시/미술",
    guName: "강남구",
    title: "K-핸드메이드페어 2025",
    place: "서울 삼성동 코엑스 1층  B홀",
    orgName: "기타",
    useTarget: "누구나",
    useFee: "사전 예매가: 8,000원, 현장 구매가: 10,000원",
    player: "",
    introduce: "",
    etcDesc: "",
    orgLink: "https://k-handmade.com/",
    mainImg:
      "https://culture.seoul.go.kr/cmmn/file/getImage.do?atchFileId=42afe00583eb4b0983dba37a04a41222&thumb=Y",
    startDate: "2025-12-18",
    endDate: "2025-12-21",
    isFree: "유료",
    likes: 0,
    favorites: 0,
    comments: 0,
  },
};

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
  const data = apiData.data;
  const status = getStatus(data.startDate, data.endDate);

  // 🔸 상세 정보 props용 데이터
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
        <img src="/assets/back.svg" alt="Back" />
        <img src="/assets/more.svg" alt="More" />
      </div>

      <p className={styles.subtitle}>{data.category}</p>
      <h1 className={styles.title}>{data.title}</h1>

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
            <a href={data.orgLink} className={styles.websiteLink}>
              {data.orgLink}
            </a>
          </div>
        </div>
        <img src="/assets/detail/slash.svg" alt="Slash Icon" />
      </div>

      {/* 상세 정보 */}
      <FestivalInfo values={detailInfo} />
    </div>
  );
}
