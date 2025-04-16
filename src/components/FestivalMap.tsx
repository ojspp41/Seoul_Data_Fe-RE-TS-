import  {useEffect, useState} from "react";
import {Map, MapMarker} from "react-kakao-maps-sdk";
import styles from "./css/FestivalMap.module.css";

interface FestivalMapProps {
    address: string;
}

export default function FestivalMap({address} : FestivalMapProps) {
    const [position, setPosition] = useState < {
        lat: number;
        lng: number
    } | null > (null);

    useEffect(() => {
        if (!window.kakao || !window.kakao.maps) {
            console.log("카카오맵이 아직 로드되지 않았습니다.");
            return;
        }

        console.log("카카오맵 로딩 완료");
        const geocoder = new window
            .kakao
            .maps
            .services
            .Geocoder();
        console.log("주소 검색 시작:", address);
        geocoder.addressSearch(address, (result, status) => {
            console.log("Geocoder 결과:", result, status);
            if (status === window.kakao.maps.services.Status.OK) {
                const {x, y} = result[0];
                setPosition({lat: parseFloat(y), lng: parseFloat(x)});
            } else {
                console.error("주소 변환 실패:", status);
            }
        });
    }, [address]);

    return (
        <div className={styles.container}>
            <p className={styles.direction}>길찾기</p>
            {
                position && (
                    <Map
                        center={position}
                        style={{
                            width: "100%",
                            height: "160px",
                            borderRadius: "8px",
                            overflow: "hidden"
                        }}
                        level={6}>
                        <MapMarker position={position}/>
                    </Map>

                )
            }
            <div className={styles.parkingBox}>
                <img src="/assets/detail/park.svg" alt="주차 아이콘"/>
                <span>근처 주차시설 조회하기</span>
                <img src="/assets/detail/slash.svg" alt="구분선"/>
            </div>
        </div>
    );
}
