import React from 'react';
import BirthSelect from '../components/BirthSelect';
import GenderSelect from '../components/GenderSelect';
import EmailInput from '../components/EmailInput';
import NicknameInput from '../components/NicknameInput';
import useUserStore from '../store/userStore';
import styles from './css/RegisterPage.module.css';

const RegisterPage: React.FC = () => {
    const {nickname, email, gender, birth} = useUserStore();

    const isBirthFilled = birth.year !== '' && birth.month !== '' && birth.day !== '';
    const isGenderFilled = gender !== '';
    const isEmailFilled = email.trim() !== '';
    const isNicknameFilled = nickname.trim() !== '';

    const isFormValid = isBirthFilled && isGenderFilled && isEmailFilled && isNicknameFilled;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>입력한 정보를 확인해주세요.</h1>


            {/* 이메일 입력 후 닉네임 입력 */}
            {isBirthFilled && isGenderFilled && isEmailFilled && <NicknameInput/>}

            {/* 성별 선택 후 이메일 입력 */}
            {isBirthFilled && isGenderFilled && <EmailInput/>}

            {isBirthFilled && <GenderSelect/>}

            {/* 항상 보여지는 생년월일 */}
            <BirthSelect/> {/* 생년월일 입력 후 성별 선택 */}


            

            <button className={styles.submitButton} disabled={!isFormValid}>
                확인
            </button>
        </div>
    );
};

export default RegisterPage;
