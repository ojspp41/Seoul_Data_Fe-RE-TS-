import React, { useState } from 'react';
import Modal from 'react-modal';
import styles from './css/TermsAgreementModal.module.css';

Modal.setAppElement('#root');

interface TermsAgreementModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  handleSubmit: () => void;
  registerCheck: {
    terms1: boolean;
    terms2: boolean;
  };
  setRegisterCheck: React.Dispatch<React.SetStateAction<{ terms1: boolean; terms2: boolean }>>;
}

const TermsAgreementModal: React.FC<TermsAgreementModalProps> = ({
  isOpen,
  onRequestClose,
  handleSubmit,
  registerCheck,
  setRegisterCheck,
}) => {
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setRegisterCheck(prevState => ({ ...prevState, [id]: checked }));
  };

  const handleSubmitClick = async () => {
    if (isSubmitting) return;
  
    if (!registerCheck.terms1 || !registerCheck.terms2) {
      alert('필수 항목을 모두 선택해주세요.');
      return;
    }
  
    setIsSubmitting(true);
    try {
      onRequestClose();
      await handleSubmit(); // 혹시 비동기라면
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleOpenAgreement = () => {
    setIsAgreementOpen(true);
  };

  const handleCloseAgreement = () => {
    setIsAgreementOpen(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Terms Agreement Modal"
        className={styles.Modal}
        overlayClassName={styles.Overlay}
      >
        <div className={styles["modal-contents"]}>
          <div className={styles["agreement-section"]}>
            <h3 className={styles.agreement_title}>약관에 동의해주세요</h3>
            <p className={styles.agreement_sub}>여러분의 소중한 개인정보를 잘 지켜 드릴게요</p>
            <ul className={styles.agreement_desc}>
              <li>
                <input
                  type="checkbox"
                  id="terms1"
                  checked={registerCheck.terms1}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="terms1">이용약관 동의 </label>
                <img
                  className={styles.agreement_right}
                  src="/assets/Term.svg"
                  alt=""
                  onClick={handleOpenAgreement}
                />
              </li>
              <li>
                <input
                  type="checkbox"
                  id="terms2"
                  checked={registerCheck.terms2}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="terms2">개인정보 수집 이용 동의 </label>
                <img
                  className={styles.agreement_right}
                  src="/assets/Term.svg"
                  alt=""
                  onClick={handleOpenAgreement}
                />
              </li>
            </ul>
          </div>
          <button
            className={`${styles["agree-button"]} ${registerCheck.terms1 && registerCheck.terms2 ? '' : styles.disabled}`}
            onClick={handleSubmitClick}
            disabled={!registerCheck.terms1 || !registerCheck.terms2}
          >
            모두 동의하고 가입하기
          </button>
        </div>
      </Modal>

      <Modal
      isOpen={isAgreementOpen}
      onRequestClose={handleCloseAgreement}
      contentLabel="개인정보 처리방침"
      className={styles.Modal_TERM}
      overlayClassName={styles.Overlay_TERM}
    >
      <div className={styles.agreement_box_TERM}>
        <p style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>
          오늘, 서울 개인정보 처리방침

          - 서비스명 ‘오늘, 서울’은 아래의 목적으로 개인정보를 수집∙이용합니다.
          - 회원의 소중한 개인정보를 보호하고, 안전하게 서비스를 제공하기 위해 최선을 다하겠습니다.
          - 아래 내용을 충분히 읽으신 후 동의 여부를 결정해 주세요.

          ▶ 개인정보 수집∙이용 내역

          1. ‘오늘, 서울’ 회원가입 및 로그인
            - 수집 항목: 카카오톡 ID, 생년월일, 성별, 닉네임, 이메일
            - 보관 기간: 회원 탈퇴 시 즉시 삭제

          2. 맞춤형 행사 추천(AI 기반)
            - 수집 항목: 검색 이력, 스크랩, 카테고리 관심사
            - 보관 기간: 회원 탈퇴 시 즉시 삭제

          3. 축제 동행인 채팅 서비스
            - 수집 항목: 채팅 메시지 내용, 채팅방 참여 기록
            - 보관 기간: 회원 탈퇴 시 즉시 삭제

          4. 고객 문의 및 지원 응대
            - 수집 항목: 문의 내용, 이메일, 닉네임
            - 보관 기간: 3년간 보관 후 삭제

          5. 유료 서비스 환불 처리 (해당 시)
            - 수집 항목: 은행명, 계좌번호
            - 보관 기간: 5년간 보관 후 삭제 (전자상거래법 준수)

          ※ 귀하는 위 개인정보 수집 및 이용에 대해 동의를 거부할 권리가 있습니다.
            단, 동의하지 않을 경우 ‘오늘, 서울’의 회원가입, AI 추천, 동행 채팅 등 서비스 이용이 제한될 수 있습니다.

          개인정보 처리 책임자: 오준석
          문의 오픈 채팅: https://open.kakao.com/o/sXpLyXuh
        </p>
        <div className={styles.cancel_button_TERM} onClick={handleCloseAgreement}>
          닫기
        </div>
      </div>
    </Modal>

    </>
  );
};

export default TermsAgreementModal;
