import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import styles from './css/DeleteAccountPage.module.css';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
const DeleteAccountPage: React.FC = () => {
  const [reason, setReason] = useState('');
  const navigate = useNavigate();
  const handleDelete = async () => {
    if (!window.confirm("정말로 계정을 삭제하시겠습니까?\n삭제 후 복구가 불가능합니다.")) return;
  
    try {
      const response = await axiosInstance.delete('/api/auth/user/exit');
      if (response.status === 200) {
        alert('계정이 성공적으로 삭제되었습니다.');
        navigate('/'); // 홈 또는 로그인 페이지 등으로 이동
      } else {
        alert('탈퇴 처리에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('탈퇴 요청 실패:', error);
      alert('서버 오류로 탈퇴에 실패했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <PageHeader title="탈퇴하기" />

      <div className="margin">
        <p className={styles.sorry}>
        서비스에 만족을 드리지 못해<br />
        대단히 죄송합니다.
      </p>

      <p className={styles.request}>
        탈퇴 사유를 남겨 주시면 서비스 개선에<br />
        더욱 힘쓰겠습니다.
      </p>

      <p className={styles.noticeTitle}>탈퇴 전 꼭 읽어주세요.</p>
      <ul className={styles.noticeList}>
        <li>탈퇴 후 7일간 재가입이 불가능합니다.</li>
        <li>탈퇴 시 계정의 모든 정보는 삭제되며 재가입 시에도 복구되지 않습니다.</li>
      </ul>

      <textarea
        className={styles.reasonInput}
        placeholder="탈퇴 사유를 입력해주세요 (선택)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <button className={styles.deleteButton} onClick={handleDelete}>
        계정 삭제하기
      </button>
      </div>
    </div>
  );
};

export default DeleteAccountPage;
