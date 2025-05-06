import React from 'react';
import PageHeader from '../components/PageHeader';
import styles from './css/CustomerSupportPage.module.css';

const supportItems = [
  '오류를 발견했어요.',
  '비정상 이용자를 신고하고 싶어요.',
  '기타 문의사항이 있어요.',
  '회원탈퇴를 하고 싶어요.',
];

const CustomerSupportPage: React.FC = () => {
  const handleItemClick = () => {
    window.open('https://open.kakao.com/o/sXpLyXuh', '_blank');
  };

  return (
    <div className={styles.wrapper}>
      <PageHeader title="고객지원" />

      <p className={styles.subtitle}>원하는 메뉴를 선택하세요</p>

      <ul className={styles.list}>
        {supportItems.map((item, index) => (
          <li
            key={index}
            className={styles.listItem}
            onClick={handleItemClick}
          >
            {item}
            <span className={styles.arrow}>›</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerSupportPage;
