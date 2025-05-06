import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/TermsPage.module.css';

const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img
          src="/assets/slash.svg"
          alt="뒤로가기"
          className={styles.icon}
          onClick={() => navigate(-1)}
        />
        <h2 className={styles.title}>이용약관</h2>
      </div>

      <div className={styles.content}>
        <h3 className={styles.sectionTitle}>제1조 (목적)</h3>
        <p>본 약관은 본 축제 추천 서비스(이하 "서비스")의 이용과 관련하여 회원과 운영자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>

        <h3 className={styles.sectionTitle}>제2조 (개인정보 보호)</h3>
        <p>본 서비스는 카카오 로그인을 통해 최소한의 개인정보(닉네임, 이메일 등)를 수집하며, 그 외 개인정보는 저장하지 않습니다. 수집된 정보는 서비스 개선 및 이벤트 추천 목적에 한하여 사용됩니다.</p>

        <h3 className={styles.sectionTitle}>제3조 (서비스 제공)</h3>
        <p>본 서비스는 축제 정보, AI 맞춤 추천, 스크랩 및 리뷰 기능 등을 포함하며, 필요에 따라 추가/변경될 수 있습니다.</p>

        <h3 className={styles.sectionTitle}>제4조 (회원의 의무)</h3>
        <p>회원은 서비스 이용 시 타인의 권리를 침해하거나 부정한 목적을 위한 이용을 해서는 안 됩니다.</p>

        <h3 className={styles.sectionTitle}>제5조 (면책 조항)</h3>
        <p>운영자는 천재지변, 시스템 오류 등 불가항력적인 사유로 인해 서비스 제공에 문제가 발생할 경우 책임을 지지 않습니다.</p>

        <p className={styles.updateNote}>* 본 약관은 2025년 5월 1일부터 적용됩니다.</p>
      </div>
    </div>
  );
};

export default TermsPage;
