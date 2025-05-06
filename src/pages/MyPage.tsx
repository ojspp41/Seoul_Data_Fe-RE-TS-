// src/pages/MyPage.tsx
import styles from './css/MyPage.module.css';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/userStore';
import { useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
const MyPage = () => {
    const navigate = useNavigate();
    const { nickname } = useUserStore();
    const handleEditClick = () => {
        navigate('/profile');
      };
      const setUserInfo = useUserStore((state) => state.setUserInfo);

      useEffect(() => {
        const fetchUserInfo = async () => {
          try {
            const res = await axiosInstance.get('/api/auth/user/info');
            const { username, email, gender, birthday } = res.data.data;
            const [year, month, day] = birthday.split('-');
    
            setUserInfo({
              nickname: username,
              email,
              gender,
              birth: { year, month, day },
            });
          } catch (err) {
            console.error('유저 정보 불러오기 실패', err);
          }
        };
    
        fetchUserInfo();
      }, []);
      
    return (
        
        <div className={styles.container}>
            <p className={styles.welcome}>
                {nickname}님,
                <br/>반갑습니다.
            </p>
            <button className={styles.editBtn}  onClick={handleEditClick}>프로필 수정</button>

            <div className={styles.section}>
                <p className={styles.sectionTitle}>활동</p>

                <div className={styles.item} onClick={() => navigate('/ai')}>
                    <span>AI 맞춤 추천</span>
                    <img src="/assets/detail/slash.svg" alt="arrow"/>
                </div>

                <div className={styles.item} onClick={() => navigate('/scrap')}>
                    <span>스크랩한 행사</span>
                    <img src="/assets/detail/slash.svg" alt="arrow"/>
                </div>

                <div className={styles.item} onClick={() => navigate('/myreview')}>
                    <span>내가 쓴 리뷰</span>
                    <img src="/assets/detail/slash.svg" alt="arrow"/>
                </div>
            </div>


            <div className={styles.section}>
                <p className={styles.sectionTitle}>기타</p>
                <div className={styles.item} onClick={() => navigate('/term')}>
                    <span>이용약관</span>
                    <img src="/assets/detail/slash.svg" alt="arrow"/>
                </div>
                <div className={styles.item} onClick={() => navigate('/support')}>
                    <span>고객지원</span>
                    <img src="/assets/detail/slash.svg" alt="arrow"/>
                </div>
            </div>

            <button className={styles.logout}>로그아웃</button>
            <BottomNav/>
        </div>
    );
};

export default MyPage;
