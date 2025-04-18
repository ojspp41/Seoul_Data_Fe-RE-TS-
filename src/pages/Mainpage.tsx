
import styles from './css/Mainpage.module.css';

const MainPage = () => {
  const handleKakaoLogin = () => {
    window.location.href = "http://13.125.224.67:8080/oauth2/authorization/kakao";
  };

  return (
    <div className={styles.container}>
      <div className={styles.circle}></div>

      <div className={styles.titleContainer}>
        <p className={styles.mainTitle}>축제정보가 내 손 안에,</p>
        <p className={styles.mainTitle}>Festi-Seoul</p>
      </div>

      <p className={styles.joinText}>⚡ 3초만에 빠른 가입 ⚡</p>

      <button className={styles.kakaoButton} onClick={handleKakaoLogin}>
        <img src="/assets/kakao.svg" alt="카카오 아이콘" className={styles.kakaoIcon} />
          <p className={styles.kakoText}>카카오로 빠르게 시작하기</p>
      </button>
    </div>
  );
};

export default MainPage;
