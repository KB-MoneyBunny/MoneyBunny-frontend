import axios from './index';

// 💪(상일) 정책 상호작용 API (북마크, 신청)
export const policyInteractionAPI = {
  // ────────────────────────────────────────
  // 📌 북마크 관련 API
  // ────────────────────────────────────────
  
  // 사용자 북마크 목록 조회
  getBookmarks: () => axios.get('/api/policy-interaction/bookmark/list'),
  
  // 북마크 추가
  addBookmark: (policyId) => axios.post(`/api/policy-interaction/bookmark/${policyId}`),
  
  // 북마크 삭제
  removeBookmark: (policyId) => axios.delete(`/api/policy-interaction/bookmark/${policyId}`),

  // ────────────────────────────────────────
  // 📌 신청 관련 API  
  // ────────────────────────────────────────
  
  // 정책 신청 등록
  addApplication: (policyId) => axios.post(`/api/policy-interaction/application/${policyId}`),
  
  // 사용자 신청 목록 조회
  getApplications: () => axios.get('/api/policy-interaction/application/list'),
  
  // 정책 신청 완료 처리
  completeApplication: (policyId) => axios.put(`/api/policy-interaction/application/${policyId}/complete`),
  
  // 정책 신청 기록 삭제
  removeApplication: (policyId) => axios.delete(`/api/policy-interaction/application/${policyId}`),
  
  // 미완료 신청 정책 조회
  getIncompleteApplication: () => axios.get('/api/policy-interaction/application/incomplete'),
  
  // 혜택 수령 상태 업데이트
  updateBenefitStatus: (policyId, benefitStatus) => 
    axios.put(`/api/policy-interaction/application/${policyId}/benefit-status`, null, {
      params: { benefitStatus }
    }),

  // ────────────────────────────────────────
  // 📌 리뷰 관련 API
  // ────────────────────────────────────────
  
  // 정책 리뷰 작성
  addReview: (policyId, reviewData) => 
    axios.post(`/api/policy-interaction/review/${policyId}`, reviewData),
  
  // 정책 리뷰 수정
  updateReview: (policyId, reviewData) => 
    axios.put(`/api/policy-interaction/review/${policyId}`, reviewData),
  
  // 정책 리뷰 삭제
  deleteReview: (policyId, benefitStatus) => 
    axios.delete(`/api/policy-interaction/review/${policyId}`, {
      params: { benefitStatus }
    }),
  
  // 내 리뷰 조회
  getMyReview: (policyId, benefitStatus) => 
    axios.get(`/api/policy-interaction/review/${policyId}/my`, {
      params: { benefitStatus }
    }),
  
  // 정책별 리뷰 목록 조회
  getPolicyReviews: (policyId) => 
    axios.get(`/api/policy-interaction/review/${policyId}/list`),
  
  // 내가 작성한 모든 리뷰 조회
  getMyReviews: () => axios.get('/api/policy-interaction/review/my-list')
};

// 💪(상일) 기존 bookmarkAPI 호환성 유지를 위한 export
export const bookmarkAPI = {
  getBookmarks: policyInteractionAPI.getBookmarks,
  addBookmark: policyInteractionAPI.addBookmark,
  removeBookmark: policyInteractionAPI.removeBookmark
};