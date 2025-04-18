// src/components/BottomNav.tsx
import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import styles from './css/BottomNav.module.css';

const navItems = [
    {
        label: '메인',
        icon: '/assets/home.svg',
        path: '/mainpage'
    }, {
        label: '채팅',
        icon: '/assets/chat.svg',
        path: '/chat'
    }, {
        label: '커뮤니티',
        icon: '/assets/community.svg',
        path: '/community'
    }, {
        label: '마이페이지',
        icon: '/assets/mypage.svg',
        path: '/mypage'
    }
];

const BottomNav: React.FC = () => {
    const location = useLocation();

    return (
        <div className={styles.container}>
            {
                navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link key={item.path} to={item.path} className={styles.link}>
                            <img
                                src={item.icon}
                                alt={item.label}
                                className={styles.icon}
                                style={{
                                    filter: isActive
                                        ? 'none'
                                        : 'grayscale(100%) opacity(0.5)'
                                }}/>
                            <span
                                className={styles.label}
                                style={{
                                    color: isActive
                                        ? '#393939'
                                        : '#CFCFCF'
                                }}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })
            }
        </div>
    );
};

export default BottomNav;
