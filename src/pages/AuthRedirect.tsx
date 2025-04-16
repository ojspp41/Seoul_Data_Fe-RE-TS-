// src/pages/AuthRedirect.tsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthRedirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      alert('인가 코드가 없습니다.');
      return;
    }

    const exchangeCodeForToken = async () => {
      try {
        const response = await axios.post(
          `http://13.125.224.67:8080/api/token/exchange?code=${code}`,
          
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const { accessToken, refreshToken, role } = response.data.data;
        console.log(role)

        // 토큰 저장
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);

        // 역할에 따라 이동
        if (role === 'ROLE_SEMI_USER') {
          navigate('/register'); // 추가정보 입력 페이지
        } else if (role === 'ROLE_USER') {
          navigate('/mainpage'); // 메인 페이지
        } else {
          alert('알 수 없는 사용자 역할입니다.');
        }
      } catch (error) {
        console.error('토큰 교환 실패:', error);
        alert('로그인 처리 중 오류가 발생했습니다.');
      }
    };

    exchangeCodeForToken();
  }, [searchParams, navigate]);

  return <div>로그인 처리 중입니다. 잠시만 기다려주세요...</div>;
};

export default AuthRedirect;
