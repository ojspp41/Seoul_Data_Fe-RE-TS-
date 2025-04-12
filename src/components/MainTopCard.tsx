// components/MainTopCard.tsx
import Slider from 'react-slick';
import styles from './css/MainTopCard.module.css';
import '../index.css'
// index.tsx 또는 App.tsx에 추가
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
const topCardData = [
  { mainText: '핵심 소개 문구 1', subText: '부가 설명 1' },
  { mainText: '핵심 소개 문구 2', subText: '부가 설명 2' },
  { mainText: '핵심 소개 문구 3', subText: '부가 설명 3' },
  { mainText: '핵심 소개 문구 4', subText: '부가 설명 4' },
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
};

const MainTopCard = () => {
  return (
    <div className={styles.cardWrapper}>
        <Slider {...sliderSettings} className={styles.slider}>
            {topCardData.map((item, index) => (
            <div key={index}>
                <div className={styles.card}>
                <p className={styles.mainText}>{item.mainText}</p>
                <p className={styles.subText}>{item.subText}</p>
                </div>
            </div>
            ))}
        </Slider>

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
