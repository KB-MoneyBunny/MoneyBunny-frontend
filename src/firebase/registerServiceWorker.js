// src/firebase/registerServiceWorker.js
export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      // 💪(상일) 알림 권한 상태 확인 후 FCM 토큰 정리
      if ('Notification' in window) {
        const permission = Notification.permission;
        
        // 알림이 거부되었거나 아직 요청하지 않은 상태면 FCM 토큰 제거
        if (permission === 'denied' || permission === 'default') {
          const fcmToken = localStorage.getItem('fcm_token');
          if (fcmToken) {
            localStorage.removeItem('fcm_token');
            console.log('🧹 알림 권한 없음 - FCM 토큰 제거됨');
          }
        }
      }
      
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("✅ SW 등록됨:", registration.scope);
        })
        .catch((err) => {
          console.error("❌ SW 등록 실패:", err);
        });
    });
  }
}
