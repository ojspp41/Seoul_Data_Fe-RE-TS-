import UpcomingEvents from '../components/UpcomingEvents';
import FestivalCard from '../components/FestivalCard';
import MainTopCard from '../components/MainTopCard';
// import BottomNav from '../components/BottomNav';
const festivalMock = {
    commentCount: 22,
    mainText: "소개 문구 작성",
    subText: "부가 설명 작성",
    festivalName: "어쩌구저쩌구중언부언 페스티벌",
    dateRange: "04.01 ~ 04.14",
    price: "성인 40,000원, 청소년 무료",
    location: "노들섬",
    likedDefault: true,
  };
  
const MainpageLogin = () => {
    return (<div>
        <MainTopCard />
        <UpcomingEvents/>
        <FestivalCard {...festivalMock} />
        <div style={{ marginBottom: '100px' }}></div>
        
    </div>);
};

export default MainpageLogin;
