import React, { useState } from 'react';
import BirthSelect from '../components/BirthSelect';
import GenderSelect from '../components/GenderSelect';
import EmailInput from '../components/EmailInput';
import NicknameInput from '../components/NicknameInput';
import useUserStore from '../store/userStore';
import TermsAgreementModal from '../components/TermsAgreementModal';
import styles from './css/RegisterPage.module.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
const RegisterPage: React.FC = () => {
    const {nickname, email, gender, birth} = useUserStore();
    const navigate = useNavigate();

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    };

    const isBirthFilled = birth.year !== '' && birth.month !== '' && birth.day !== '';
    const isGenderFilled = gender !== '';
    const isEmailValid = isValidEmail(email);
    const isNicknameFilled = nickname.trim() !== '';

    const isFormValid = isBirthFilled && isGenderFilled && isEmailValid  && isNicknameFilled;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [registerCheck, setRegisterCheck] = useState({ terms1: false, terms2: false });

    const handleModalOpen = () => {
        setIsModalOpen(true);
      };
    
      const handleModalClose = () => {
        setIsModalOpen(false);
      };
      
      
      const handleSubmit = async () => {
        try {
          const birthday = `${birth.year}-${birth.month.padStart(2, '0')}-${birth.day.padStart(2, '0')}`;

      
          const requestBody = {
            username: nickname,
            birthday,
            gender,
            email,
          };
          
          const response = await axiosInstance.post('/api/auth/semi/feature', requestBody);
          console.log(response)
          const { accessToken, refreshToken } = response.data.data;
      
          // 🔐 새 토큰 저장 (role이 반영된 최신 토큰)
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('refresh_token', refreshToken);
      
          // ✅ 메인 페이지로 이동
          navigate('/mainpage');
        } catch (error) {
          console.error('회원가입 실패:', error);
          alert('회원가입 처리 중 오류가 발생했습니다.');
        }
      };
      
      
    
      const handleConfirmClick = () => {
        // 확인 버튼 클릭 시 모달을 연다.
        handleModalOpen();
      };
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>입력한 정보를 확인해주세요.</h1>


            {/* 이메일 입력 후 닉네임 입력 */}
            {isBirthFilled && isGenderFilled && isEmailValid && <NicknameInput/>}

            {/* 성별 선택 후 이메일 입력 */}
            {isBirthFilled && isGenderFilled && <EmailInput/>}

            {isBirthFilled && <GenderSelect/>}

            {/* 항상 보여지는 생년월일 */}
            <BirthSelect/> {/* 생년월일 입력 후 성별 선택 */}


            

            <button 
                className={styles.submitButton} 
                disabled={!isFormValid}
                onClick={handleConfirmClick}
            >
                확인
            </button>
            <TermsAgreementModal
                isOpen={isModalOpen}
                onRequestClose={handleModalClose}
                handleSubmit={handleSubmit}
                registerCheck={registerCheck}
                setRegisterCheck={setRegisterCheck}
            />
        </div>
    );
};

export default RegisterPage;
