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
        contentLabel="Personal Information Collection"
        className={styles.Modal_TERM}
        overlayClassName={styles.Overlay_TERM}
      >
        <div className={styles.agreement_box_TERM}>
          <p style={{ textAlign: 'left' }}>
            개인정보 수집 안내
            <br />
            <br /> 1. 개인정보 수집 목적
            <br />
            - 가톨릭대학교 중앙동아리 COMA는 다음 목적을 위해 개인정보를 수집합니다:
            <br />
            &nbsp; - 가톨릭대학교 총학생회 주관 아우름제 COMA 노점 이벤트인 COMAtching의 참여
            <br />
            <br />
            2. 수집하는 개인정보 항목 * 수집하는 개인정보 항목은 다음과 같습니다:{' '}
            <br />
            &nbsp;* 인적사항 <br />
            &nbsp; &nbsp;* 성명, 학번, 연락처 <br />
            <br />
            3. 개인정보 제 3자 제공 <br />
            &nbsp;* 수집한 개인정보는 다음 3자에게 정보가 제공됩니다: <br />
            &nbsp; &nbsp;* COMAtching 참여자 <br />
            4. 개인정보 보유 및 이용기간 <br />
            <br />
            &nbsp;2024년 5월 24일 23시 59분까지
            <br />
            <br /> * 개인정보는 수집 및 이용목적이 달성되면 지체 없이 파기됩니다. 다만, 관련 법규에 따라 보존할 필요가 있는 경우에는 해당 기간 동안
            안전하게 보관됩니다. <br />
            <br /> 5. 개인정보 수집 거부권 * 개인정보의 수집은 자발적으로 제공하실 수 있으며, 수집에 동의하지 않을 권리가 있습니다. 다만, 일부 정보를
            제공하지 않을 경우 가톨릭대 중앙동아리 COMA의 일부 서비스를 이용할 수 없을 수 있습니다. <br />
            <br /> 6. 개인정보 관련 문의 및 민원처리 <br />* 개인정보 수집과 관련한 문의사항이나 민원은 다음으로 문의해 주시기 바랍니다: <br />
            &nbsp;* 최고 정보 관리 책임자 : 가톨릭대학교 중앙동아리 COMA
            <br /> &nbsp;* 개인정보보호책임자 : 가톨릭대학교 정보통신전자공학부 19학번 박승원 <br />
            &nbsp;* 개인정보 수집 및 이용 주체 : 가톨릭대학교 중앙 IT동아리 COMA{' '}
            <br />
            <br />
            7. 개인정보 수집 및 이용 동의 * 본인은 개인정보 수집 및 이용에 대해 동의합니다.
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
