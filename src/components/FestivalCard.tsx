import styled from 'styled-components';
import { useState } from 'react';

interface FestivalCardProps {
  commentCount: number;
  mainText: string;
  subText: string;
  festivalName: string;
  dateRange: string;
  price: string;
  location: string;
  likedDefault?: boolean;
}

const FestivalCard = ({
  commentCount,
  mainText,
  subText,
  festivalName,
  dateRange,
  price,
  location,
  likedDefault = false,
}: FestivalCardProps) => {
  const [liked, setLiked] = useState(likedDefault);

  return (
    <>
      <CardWrapper>
        <CommentBadge>댓글 {commentCount}개</CommentBadge>

        <ContentWrapper>
          <MainText>{mainText}</MainText>
          <SubText>{subText}</SubText>
        </ContentWrapper>

        <HeartButton onClick={() => setLiked(!liked)}>
          <img
            src={liked ? '/assets/heart.svg' : '/assets/heart.svg'}
            alt="하트 버튼"
          />
        </HeartButton>
      </CardWrapper>

      <InfoWrapper>
        <InfoRow>
            <FestivalName>{festivalName}</FestivalName>
            <DateText>{dateRange}</DateText>
        </InfoRow>
        <ExtraInfoRow>
          <PriceText>{price}</PriceText>
          <LocationText>
            <img src="/assets/location.svg" alt="위치 아이콘" width={14} height={14} />
            {location}
          </LocationText>
        </ExtraInfoRow>
      </InfoWrapper>
    </>
  );
};

export default FestivalCard;


const CardWrapper = styled.div`
  border-radius: 16px;
  padding: 16px;
  width: calc(100% - 40px);
  margin: 0 auto;
  position: relative;
  background-color: #A9A9A9;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 360px;
`;

const CommentBadge = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  background-color: #D9D9D9;
  padding: 7px 30px;
  border-radius: 36px;
  font-size: 16px;
  font-weight: 600;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const MainText = styled.div`
  color: #FFFFFF;
  font-weight: 600;
  font-size: 24px;
`;

const SubText = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  font-size: 16px;
`;

const HeartButton = styled.button`
  position: absolute;
  bottom: 12px;
  right: 16px;
  width: 40px;
  height: 40px;
  padding: 8px;
  border-radius: 50%;
  background: #EFEFEF;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 21px;
    height: 18px;
  }
`;
const FestivalName = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: clamp(12px, 4vw, 14px);
  max-width: 60%;
`;

const InfoWrapper = styled.div`
  background-color: #FFFFFF;
  padding: 16px;
  width: calc(100% - 40px);
  margin: 0 auto;
  border-radius: 0 0 16px 16px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #000000;
`;

const DateText = styled.div`
  white-space: nowrap;
  font-size: clamp(10px, 3vw, 13px);
  color: #929292;
  font-weight: 500;
`;


const ExtraInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  margin-top: 8px;
  gap: 12px; // 텍스트 간 여백 확보
  flex-wrap: nowrap; // 줄바꿈 방지
  color: #929292;
`;

const PriceText = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: clamp(12px, 3.5vw, 14px);
  max-width: 50%;
`;


const LocationText = styled.div`
  color: #929292;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: clamp(12px, 3.5vw, 14px);
`;
