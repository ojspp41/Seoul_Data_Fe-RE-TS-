import React, { useState } from 'react';
import BirthSelectNone from '../components/BirthSelectNone';
import GenderSelectNone from '../components/GendeSelectNone';
import EmailInputNone from '../components/EmailInputNone';
import NicknameInput from '../components/NicknameInput';
import useUserStore from '../store/userStore';
import styles from './css/RegisterPage.module.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import PageHeader from '../components/PageHeader';

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { nickname, email, gender, birth } = useUserStore();

  

  const isBirthFilled = birth.year !== '' && birth.month !== '' && birth.day !== '';
  const isGenderFilled = gender !== '';
  const isNicknameFilled = nickname.trim() !== '';

  const isFormValid = isBirthFilled && isGenderFilled  && isNicknameFilled  ;

  
  

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

      
        <EmailInputNone />
      
      
      <GenderSelectNone />
      <BirthSelectNone />

      <button className={styles.submitButton} disabled={!isFormValid} onClick={handleSubmit}>
        수정 완료
      </button>
    </div>
  );
};

export default EditProfilePage;
