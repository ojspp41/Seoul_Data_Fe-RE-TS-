// ../components/EventCard.tsx

import React from 'react';
import styled from 'styled-components';

interface EventCardProps {
    category: string;
    title: string;
    location: string;
    dateRange: string;
}

const EventCard: React.FC<EventCardProps> = (
    {category, title, location, dateRange}
) => {
    return (<CardWrapper> < Thumbnail /> <EventInfo><Category> {
        category
    }</Category><TitleText> {
        title
    }</TitleText><SubInfo> 📍 {
        location
    }</SubInfo><SubInfo> 📅 {
        dateRange
    }</SubInfo></EventInfo></CardWrapper>);
};

export default EventCard;

// 스타일
const CardWrapper = styled.div `
  display: flex;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
`;

const Thumbnail = styled.div `
  width: 80px;
  height: 80px;
  background-color: #d9d9d9;
  flex-shrink: 0;
  border-radius: 10px;
`;

const EventInfo = styled.div `
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Category = styled.div `
  font-size: 12px;
  color: #999;
  font-weight: 500;
`;

const TitleText = styled.div `
  font-size: 14px;
  font-weight: 600;
  margin: 4px 0;
  color: #000;
`;

const SubInfo = styled.div `
  font-size: 12px;
  margin-top: 5px;
  color: #777;
`;
