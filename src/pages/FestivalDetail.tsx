
import styles from "./css/FestivalDetail.module.css";
import FestivalInfo from "../components/FestivalInfo";
import FestivalMap from "../components/FestivalMap";
import FestivalDescription from "../components/FestivalDescription";
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
    place: "서울특별시 강남구 삼성동 159",
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
      
      {/* 추가: 위치 정보 (날짜 위) */}
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
            <a href={data.orgLink} className={styles.websiteLink}>
              {data.orgLink}
            </a>
          </div>
        </div>
        <img src="/assets/detail/slash.svg" alt="Slash Icon" />
      </div>

      {/* 상세 정보 */}
      <FestivalInfo values={detailInfo} />
      <FestivalMap address={data.place} />
      {/* <FestivalDescription content={data.introduce || "등록된 설명이 없습니다."} /> */}
      <FestivalDescription
        content={`1부 프로그램 <오픈마이크> &<커먼그라운드> (15:00-16:50)  시민들이 직접 참여하는 재즈 잼 세션과 즉흥연주가 펼쳐지는 무대. 사전 신청자뿐만 아니라 현장에 있는 누구나 자유롭게 무대에 올라 함께 연주하고 즐길 수 있는 열린 공연이다. 

        다년간 시민들의 뜨거운 호응과 사랑을 받아온 ‘오픈마이크’는 재즈의 즉흥성과 소통의 가치를 온전히 경험할 수 있는 잊지 못할 특별한 순간을 선사한다. SNL코리아 하우스 밴드 ‘커먼드라운드’의 파워풀한 에너지가 돋보이는 무대. 국악과 재즈가 만나 신명나는 협연을 펼치며, 전통음악을 재즈의 감성으로 재해석해 국악 특유의 풍자와 해학을 담아낸다. 흥겨운 선율과 다채로운 퍼포먼스가 어우러지는 이 공연은 노들섬을 국악과 재즈가 조화를 이루는 특별한 공간으로 변화시킬 것이다.

        2부 프로그램 <서울재즈프렌즈>&<난장프로젝트> (18:00-21:00)  친환경 축제를 지향하는 서울재즈페스타의 취지에 맞춰 기획된 무대로, 재즈를 통해 기후 위기, 생태계 변화, 전쟁과 난민, 기아 문제 등 인류의 공통 과제를 조명한다. 음악을 통해 지속 가능한 미래에 대한 메시지를 전하며, 재즈가 가진 사랑과 공감의 힘을 강조하는 뜻깊은 무대가 될 것이다.

        한국 전통 장터의 흥과 역동성을 현대적으로 재해석한 총체예술 무대. 국악, 재즈, 힙합, 현대무용이 어우러지는 창의적 융합 공연을 선보인다. 재즈 디바 웅산, 판소리 명창 이봉근, 래퍼 MC 스나이퍼, 현대무용가 이루다가 함께하며 독창적 퍼포먼스를 연출한다.

        전통음악과 재즈의 감성이 조화를 이루며 장르를 초월한 유연한 상생을 만들어 내는 ‘난장프로젝트’. 전통과 현재가 공존하는 이 무대는 한국을 넘어 세계로 확장되는 새로운 글로벌 음악 트렌드를 제시한다.`}
      />
      

    </div>
  );
}
