import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import axiosInstance from '../api/axiosInstance';
import ParkingModal from '../components/ParkingModal';
import styles from './css/ParkingHeader.module.css';
import { useNavigate } from 'react-router-dom';

interface ParkingListItem {
  parkingId: string;
  parkingName: string;
  address: string;
}

interface ParkingDetail {
  parkingId: string;
  parkingName: string;
  address: string;
  tel: string;
  totalSpace: number;
  currentParked: number;
  weekdayOperatingHours: string;
  weekendOperatingHours: string;
  holidayOperatingHours: string;
  baseRate: number;
  baseTime: number;
  additionalRate: number;
  additionalTime: number;
  dailyMaxRate: number;
  paid: boolean;
  nightPaid: boolean;
}

interface Coords {
  lat: number;
  lng: number;
  data: ParkingListItem;
}

export default function ParkingMap() {
  const [searchParams] = useSearchParams();
  const gu = searchParams.get('gu') || '강남구';
  const navigate = useNavigate();

  const [coordsList, setCoordsList] = useState<Coords[]>([]);
  const [selected, setSelected] = useState<ParkingDetail | null>(null);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 37.4979, lng: 127.0276 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`/api/auth/user/parking/map/${gu}`);
        const items: ParkingListItem[] = res.data.data;

        const geocoder = new window.kakao.maps.services.Geocoder();

        const coordsWithLatLng: Coords[] = [];

        for (const item of items) {
          await new Promise<void>((resolve) => {
            geocoder.addressSearch(item.address, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                coordsWithLatLng.push({
                  lat: parseFloat(result[0].y),
                  lng: parseFloat(result[0].x),
                  data: item,
                });
              }
              resolve();
            });
          });
        }

        setCoordsList(coordsWithLatLng);
        if (coordsWithLatLng.length > 0) {
          setCenter({ lat: coordsWithLatLng[0].lat, lng: coordsWithLatLng[0].lng });
        }
      } catch (error) {
        console.error('주차장 목록 불러오기 실패', error);
      }
    };

    fetchData();
  }, [gu]);

  const handleMarkerClick = async (parkingId: string) => {
    try {
      const res = await axiosInstance.get(`/api/auth/user/parking/detail/${gu}/${parkingId}`);
      setSelected(res.data.data);
    } catch (error) {
      console.error('상세 정보 불러오기 실패', error);
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <img 
          src="/assets/slash.svg" 
          alt="뒤로가기" 
          className={styles.icon} 
          onClick={() => navigate(-1)}
        />
        <div className={styles.title}>주차 시설 안내</div>
        <div className={styles.placeholder} />
      </div>

      <Map center={center} style={{ width: '100%', height: 'calc(100vh - 56px)', marginTop: '56px' }} level={6}>
        {coordsList.map((coord) => (
          <MapMarker
            key={coord.data.parkingId}
            position={{ lat: coord.lat, lng: coord.lng }}
            onClick={() => handleMarkerClick(coord.data.parkingId)}
          >
            <div style={{ fontWeight: 600 }} onClick={() => handleMarkerClick(coord.data.parkingId)} >{coord.data.parkingName}</div>
          </MapMarker>
        ))}
      </Map>

      {selected && (
        <ParkingModal
          data={selected} // detail 전체 응답
          onClose={() => setSelected(null)}
        />
      
      )}
    </div>
  );
}

