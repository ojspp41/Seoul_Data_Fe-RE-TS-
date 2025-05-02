import React, { useState } from 'react';
import BirthSelect from '../components/BirthSelect';
import GenderSelect from '../components/GenderSelect';
import EmailInput from '../components/EmailInput';
import NicknameInput from '../components/NicknameInput';
import useUserStore from '../store/userStore';
import styles from './css/RegisterPage.module.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import PageHeader from '../components/PageHeader';

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { nickname, email, gender, birth } = useUserStore();

  const [emailChecked, setEmailChecked] = useState(false);
  const [emailCheckMessage, setEmailCheckMessage] = useState('');

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const isBirthFilled = birth.year !== '' && birth.month !== '' && birth.day !== '';
  const isGenderFilled = gender !== '';
  const isEmailValid = isValidEmail(email);
  const isNicknameFilled = nickname.trim() !== '';

  const isFormValid = isBirthFilled && isGenderFilled && isEmailValid && isNicknameFilled && emailChecked;

  const handleEmailCheck = async () => {
    try {
      await axiosInstance.get(`/api/auth/all-user/email/${email}`);
      setEmailCheckMessage('사용 가능한 이메일입니다.');
      setEmailChecked(true);
    } catch (err: any) {
      if (err.response?.status === 400) {
        setEmailCheckMessage('이미 사용 중인 이메일이 있습니다.');
      } else {
        setEmailCheckMessage('이메일 확인 중 오류가 발생했습니다.');
      }
      setEmailChecked(false);
      console.error('이메일 중복 확인 실패:', err);
    }
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

      const response = await axiosInstance.patch('/api/auth/user/feature', requestBody);

      if (response.status === 200) {
        alert('프로필이 성공적으로 수정되었습니다.');
        navigate('/mainpage');
      } else {
        alert('수정에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      alert('프로필 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <PageHeader title="프로필 수정" />
      <h1 className={styles.title}>프로필 수정</h1>

      <NicknameInput />

      <div className={styles.emailSection}>
        <EmailInput />
        <button className={styles.emailCheckButton} onClick={handleEmailCheck}>
          중복확인
        </button>
      </div>
      {emailCheckMessage && <p className={styles.emailCheckMessage}>{emailCheckMessage}</p>}

      <GenderSelect />
      <BirthSelect />

      <button className={styles.submitButton} disabled={!isFormValid} onClick={handleSubmit}>
        수정 완료
      </button>
    </div>
  );
};

export default EditProfilePage;
