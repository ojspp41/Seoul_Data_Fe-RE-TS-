import  { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

interface Coords {
  lat: number;
  lng: number;
  label: string;
  address: string;
  info: {
    now: number;
    total: number;
    pay: string;
    nightPay: string;
    weekdayTime: { start: string; end: string };
    weekendTime: { start: string; end: string };
    holidayTime: { start: string; end: string };
    basicFee: number;
    basicTime: number;
    addFee: number;
    addTime: number;
    maxFeePerDay: number;
  };
}
interface KakaoMaps {
    maps: {
      services: {
        Geocoder: new () => {
          addressSearch: (
            address: string,
            callback: (result: any[], status: string) => void
          ) => void;
        };
        Status: {
          OK: string;
        };
      };
    };
  }
  
  declare global {
    interface Window {
      kakao: KakaoMaps;
    }
  }
  

const rawData = [
  {
    name: "보라매상업 공영주차장(시)",
    address: "동작구 신대방동 431-3",
    now: 48,
    total: 64,
    pay: "유료",
    nightPay: "야간 미개방",
    weekdayTime: { start: "09:00", end: "21:00" },
    weekendTime: { start: "09:00", end: "21:00" },
    holidayTime: { start: "09:00", end: "21:00" },
    basicFee: 220,
    basicTime: 5,
    addFee: 220,
    addTime: 5,
    maxFeePerDay: 15800,
  },
  {
    name: "동작대교(위) 공영주차장(시)",
    address: "동작구 동작동 316-3",
    now: 10,
    total: 100,
    pay: "유료",
    nightPay: "야간 미개방",
    weekdayTime: { start: "13:00", end: "22:00" },
    weekendTime: { start: "13:00", end: "22:00" },
    holidayTime: { start: "13:00", end: "22:00" },
    basicFee: 260,
    basicTime: 5,
    addFee: 260,
    addTime: 5,
    maxFeePerDay: 0,
  },
];

const ParkingMap = () => {
  const [coordsList, setCoordsList] = useState<Coords[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selected, setSelected] = useState<Coords | null>(null);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      setIsLoaded(true);
    } else {
      const interval = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(interval);
          setIsLoaded(true);
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const geocoder = new window.kakao.maps.services.Geocoder();
    rawData.forEach((item) => {
      geocoder.addressSearch(item.address, (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const { x, y } = result[0];
          setCoordsList((prev) => [
            ...prev,
            {
              lat: parseFloat(y),
              lng: parseFloat(x),
              label: item.name,
              address: item.address,
              info: {
                now: item.now,
                total: item.total,
                pay: item.pay,
                nightPay: item.nightPay,
                weekdayTime: item.weekdayTime,
                weekendTime: item.weekendTime,
                holidayTime: item.holidayTime,
                basicFee: item.basicFee,
                basicTime: item.basicTime,
                addFee: item.addFee,
                addTime: item.addTime,
                maxFeePerDay: item.maxFeePerDay,
              },
            },
          ]);
        } else {
          console.error(`❌ ${item.name} 변환 실패`);
        }
      });
    });
  }, [isLoaded]);

  return (
    <div>
      {coordsList.length > 0 ? (
        <Map center={coordsList[0]} style={{ width: "100%", height: "300px" }} level={8}>
          {coordsList.map((coord, index) => (
            <MapMarker
              key={index}
              position={{ lat: coord.lat, lng: coord.lng }}
              onClick={() => setSelected(coord)}
            >
              <div
                style={{
                  position: "relative",
                  transform: "translate(0, 0)",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  padding: "6px 10px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "black",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                  whiteSpace: "nowrap",
                  zIndex: 10,
                }}
                onClick={() => setSelected(coord)}
              >
                {coord.label}
              </div>
            </MapMarker>
          ))}
        </Map>
      ) : (
        <div>지도를 불러오는 중...</div>
      )}

      {/* 모달 */}
      {selected && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "50%",
            backgroundColor: "white",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.2)",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            padding: "20px",
            zIndex: 1000,
            animation: "slideUp 0.3s ease-out",
          }}
        >
          <h2>{selected.label}</h2>
          <p>📍 주소: {selected.address}</p>
          <p>🚗 현재 주차 가능: {selected.info.now} / {selected.info.total}대</p>
          <p>💰 요금: 기본 {selected.info.basicFee}원 / {selected.info.basicTime}분</p>
          <p>➕ 추가 {selected.info.addFee}원 / {selected.info.addTime}분</p>
          <p>💸 1일 최대 요금: {selected.info.maxFeePerDay > 0 ? `${selected.info.maxFeePerDay.toLocaleString()}원` : "제한 없음"}</p>
          <p>🕒 평일 운영: {selected.info.weekdayTime.start} ~ {selected.info.weekdayTime.end}</p>
          <p>🕒 주말 운영: {selected.info.weekendTime.start} ~ {selected.info.weekendTime.end}</p>
          <p>🕒 공휴일 운영: {selected.info.holidayTime.start} ~ {selected.info.holidayTime.end}</p>
          <p>🌙 야간 운영: {selected.info.nightPay}</p>
          <button onClick={() => setSelected(null)} style={{ marginTop: "20px" }}>닫기</button>
        </div>
      )}

      <style>
        {`
          @keyframes slideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ParkingMap;