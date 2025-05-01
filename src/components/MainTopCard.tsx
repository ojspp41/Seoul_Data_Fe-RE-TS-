// components/MainTopCard.tsx
import Slider from 'react-slick';
import  { useEffect, useState } from 'react';
import styles from './css/MainTopCard.module.css';
import '../index.css'
// index.tsx 또는 App.tsx에 추가
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axiosInstance from '../api/axiosInstance';

interface CardItem {
  mainText: string;     // = title
  subText: string;      // = category
  imageUrl: string;     // = background image
}



const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
};

const MainTopCard = () => {
  const [topCardData, setTopCardData] = useState<CardItem[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/user/event/recommend');
        const data = response.data;
        const mappedData: CardItem[] = data.map((item: any) => ({
          mainText: item.title,
          subText: item.category,
          imageUrl: item.imageUrl, // 백엔드에서 제공한다고 가정
        }));

        setTopCardData(mappedData);
      } catch (error) {
        console.error('추천 카드 데이터를 불러오는 데 실패했습니다.', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.cardWrapper}>
      {topCardData.length > 0 ? (
        <Slider {...sliderSettings} className={styles.slider}>
          {topCardData.map((item, index) => (
            <div key={index}>
              <div
                className={styles.card}
                style={{
                  backgroundImage: `url(${item.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <p className={styles.mainText}>{item.mainText}</p>
                <p className={styles.subText}>{item.subText}</p>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <div className={styles.emptyMessage}>
          활동이 없어 <strong>추천할 수 없습니다.</strong>
        </div>
      )}


        {/* dots는 react-slick이 자동 삽입하므로 CSS만 따로 컨트롤 */}

        <div className={styles.buttonGroup}>
            <button>실시간 인기</button>
            <button>AI 추천</button>
            <button>요즘뜨는</button>
        </div>
    </div>
  );
};

export default MainTopCard;
