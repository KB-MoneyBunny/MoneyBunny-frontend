// src/firebase/notificationPermission.js

import { getToken, deleteToken } from 'firebase/messaging';
import { messaging } from './initFirebase';
import axios from '@/api'; // JWT 토큰 자동 추가를 위한 axios 인터셉터 사용

// 🔔 알림 구독 함수
export const subscribeToPush = async () => {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('알림 권한 거부됨');

  // 1. localStorage에서 기존 토큰 확인
  let token = localStorage.getItem('fcm_token');
  if (!token) {
    // 2. 없으면 새로 발급
    token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });
    // 3. 새 토큰 저장
    localStorage.setItem('fcm_token', token);
  }
  console.log('🪪 내 FCM 토큰: ', token);

  try {
    // 💪(상일) 새로운 백엔드 엔드포인트에 맞춰 수정
    await axios.post('/api/push/subscriptions', { token });
  } catch (error) {
    console.warn('푸시 알림 구독 실패 (백엔드 서버 확인 필요):', error.message);
    // 푸시 알림 구독 실패해도 토큰은 반환 (로그인 진행 가능)
  }
  
  return token;
};

// 🔕 알림 구독 해제 함수
export const unsubscribeFromPush = async () => {
  const token = localStorage.getItem('fcm_token');
  // token이 null이면 서버에 보내봤자 무의미
  if (!token) return false;
  
  try {
    // 💪(상일) 백엔드에 구독 해제 요청
    await axios.delete(`/api/push/subscriptions/${token}`);
  } catch (error) {
    console.warn('푸시 알림 구독 해제 실패 (백엔드 서버 확인 필요):', error.message);
  } finally {
    // 💪(상일) 성공/실패 관계없이 로컬 토큰 삭제
    try {
      await deleteToken(messaging); // Firebase에서 토큰 삭제
    } catch (error) {
      console.warn('Firebase 토큰 삭제 실패:', error);
    }
    localStorage.removeItem('fcm_token'); // localStorage에서 토큰 제거
    console.log('✅ FCM 토큰이 로컬에서 삭제되었습니다.');
  }
  
  return true;
};

// 💪(상일) FCM 토큰 갱신 함수 - 서비스워커 업데이트 시 사용
export const refreshFCMToken = async () => {
  try {
    // 1. 기존 토큰 삭제
    const oldToken = localStorage.getItem('fcm_token');
    if (oldToken) {
      localStorage.removeItem('fcm_token');
      try {
        await deleteToken(messaging);
        console.log('✅ 기존 FCM 토큰 삭제');
      } catch (error) {
        console.warn('Firebase 토큰 삭제 실패:', error);
      }
    }
    
    // 2. 새 토큰 발급 (다음 번 subscribeToPush 호출 시 자동 발급)
    console.log('🔄 다음 알림 구독 시 새 토큰이 발급됩니다.');
    
    return true;
  } catch (error) {
    console.error('❌ FCM 토큰 갱신 실패:', error);
    return false;
  }
};

// 💪(상일) 앱 실행 시 알림 권한 체크 및 토큰 정리
export const checkPermissionOnAppStart = async () => {
  try {
    console.log('🔍 앱 시작 시 FCM 토큰 및 알림 권한 체크');
    
    // 💪(상일) 1단계: 권한과 무관하게 FCM 토큰 유효성 검증
    const savedToken = localStorage.getItem('fcm_token');
    let validToken = null;
    
    if (savedToken) {
      console.log('📱 저장된 FCM 토큰 발견 - 유효성 검증 시작');
      
      try {
        // Firebase에서 현재 유효한 토큰 가져오기
        const currentToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });
        
        if (savedToken !== currentToken) {
          console.log('🔄 FCM 토큰 변경 감지');
          console.log('  이전 토큰:', savedToken.substring(0, 20) + '...');
          console.log('  새 토큰:', currentToken.substring(0, 20) + '...');
          localStorage.setItem('fcm_token', currentToken);
          validToken = currentToken;
        } else {
          console.log('✅ FCM 토큰 유효함');
          validToken = savedToken;
        }
      } catch (error) {
        console.log('❌ FCM 토큰 무효화 감지 - 토큰 삭제');
        console.warn('에러 상세:', error.message);
        localStorage.removeItem('fcm_token');
        
        // Firebase에서도 토큰 삭제 시도
        try {
          await deleteToken(messaging);
          console.log('✅ Firebase에서 무효 토큰 삭제 완료');
        } catch (deleteError) {
          console.warn('Firebase 토큰 삭제 실패:', deleteError);
        }
      }
    }
    
    // 💪(상일) 2단계: 알림 권한 상태 체크
    const permission = Notification.permission;
    console.log('🔔 알림 권한 상태:', permission);
    
    // 💪(상일) 3단계: 권한과 토큰 상태에 따른 처리
    // 권한이 거부되었는데 토큰이 있는 경우
    if (permission === 'denied' && validToken) {
      console.log('🚫 알림 권한 거부됨 - FCM 토큰 제거');
      
      // Firebase에서 토큰 삭제
      try {
        await deleteToken(messaging);
        console.log('✅ Firebase 토큰 삭제 완료');
      } catch (error) {
        console.warn('Firebase 토큰 삭제 실패:', error);
      }
      
      // localStorage에서 토큰 제거
      localStorage.removeItem('fcm_token');
      console.log('✅ localStorage FCM 토큰 제거 완료');
      
      return { status: 'removed', reason: 'permission_denied' };
    }
    
    // 권한이 있고 유효한 토큰도 있는 경우
    if (permission === 'granted' && validToken) {
      console.log('✅ 알림 권한 허용됨 - 유효한 토큰 확인');
      return { status: 'active', reason: 'permission_granted_token_valid', token: validToken };
    }
    
    // 권한은 있지만 토큰이 없는 경우
    if (permission === 'granted' && !validToken) {
      console.log('⚠️ 알림 권한은 있지만 유효한 토큰 없음');
      return { status: 'no_token', reason: 'token_missing' };
    }
    
    // 권한도 없고 토큰도 없는 경우
    if (permission === 'default' && !validToken) {
      console.log('📵 알림 권한 미설정, 토큰 없음');
      return { status: 'default', reason: 'no_permission_no_token' };
    }
    
    return { status: 'unknown', reason: 'unexpected_state' };
    
  } catch (error) {
    console.error('❌ 알림 권한 및 토큰 체크 실패:', error);
    return { status: 'error', reason: error.message };
  }
};
