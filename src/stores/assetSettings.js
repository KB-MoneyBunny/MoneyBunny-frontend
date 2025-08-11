// stores/accountSettings.js
import { defineStore } from 'pinia';

export const useAccountSettingsStore = defineStore('accountSettings', {
  state: () => ({
    // 계좌 숨김 상태 관리 (계좌 ID별)
    hiddenBalances: {},
    // 계좌 별명 관리 (계좌 ID별)
    nicknames: {},
    // 대표 계좌 ID
    mainAccountId: null,
  }),

  getters: {
    /**
     * 특정 계좌의 잔액 숨김 상태 확인
     * @param {string} accountId - 계좌 ID
     * @returns {boolean} - 숨김 여부
     */
    isBalanceHidden: (state) => (accountId) => {
      return state.hiddenBalances[accountId] || false;
    },

    /**
     * 특정 계좌의 별명 가져오기
     * @param {string} accountId - 계좌 ID
     * @returns {string|null} - 설정된 별명 또는 null
     */
    getAccountNickname: (state) => (accountId) => {
      return state.nicknames[accountId] || null;
    },

    /**
     * 대표 계좌 여부 확인
     * @param {string} accountId - 계좌 ID
     * @returns {boolean} - 대표 계좌 여부
     */
    isMainAccount: (state) => (accountId) => {
      return state.mainAccountId === accountId;
    },
  },

  actions: {
    /**
     * 잔액 숨김 상태 토글
     * @param {string} accountId - 계좌 ID
     * @param {boolean} isHidden - 숨김 여부 (선택적)
     */
    toggleBalanceVisibility(accountId, isHidden = null) {
      if (isHidden === null) {
        this.hiddenBalances[accountId] = !this.hiddenBalances[accountId];
      } else {
        this.hiddenBalances[accountId] = isHidden;
      }
      this.saveToLocalStorage();
    },

    /**
     * 계좌 별명 설정
     * @param {string} accountId - 계좌 ID
     * @param {string} nickname - 설정할 별명
     */
    setAccountNickname(accountId, nickname) {
      if (nickname && nickname.trim()) {
        this.nicknames[accountId] = nickname.trim();
      } else {
        delete this.nicknames[accountId];
      }
      this.saveToLocalStorage();
    },

    /**
     * 대표 계좌 설정
     * @param {string} accountId - 계좌 ID
     */
    setMainAccount(accountId) {
      this.mainAccountId = accountId;
      this.saveToLocalStorage();
    },

    /**
     * 계좌 삭제 시 관련 설정 정리
     * @param {string} accountId - 삭제할 계좌 ID
     */
    removeAccountSettings(accountId) {
      delete this.hiddenBalances[accountId];
      delete this.nicknames[accountId];

      // 대표 계좌였다면 해제
      if (this.mainAccountId === accountId) {
        this.mainAccountId = null;
      }

      this.saveToLocalStorage();
    },

    /**
     * 계좌 목록에 설정 적용
     * @param {Array} accounts - 원본 계좌 목록
     * @returns {Array} - 설정이 적용된 계좌 목록
     */
    applySettingsToAccounts(accounts) {
      return accounts.map((account) => ({
        ...account,
        accountName: this.getAccountNickname(account.id) || account.accountName,
        isMain: this.isMainAccount(account.id),
        hideBalance: this.isBalanceHidden(account.id),
      }));
    },

    /**
     * 로컬스토리지에 설정 저장
     */
    saveToLocalStorage() {
      try {
        const settings = {
          hiddenBalances: this.hiddenBalances,
          nicknames: this.nicknames,
          mainAccountId: this.mainAccountId,
        };
        localStorage.setItem('accountSettings', JSON.stringify(settings));
      } catch (error) {
        console.error('계좌 설정 저장 실패:', error);
      }
    },

    /**
     * 로컬스토리지에서 설정 불러오기
     */
    loadFromLocalStorage() {
      try {
        const saved = localStorage.getItem('accountSettings');
        if (saved) {
          const settings = JSON.parse(saved);
          this.hiddenBalances = settings.hiddenBalances || {};
          this.nicknames = settings.nicknames || {};
          this.mainAccountId = settings.mainAccountId || null;
        }
      } catch (error) {
        console.error('계좌 설정 불러오기 실패:', error);
      }
    },

    /**
     * 모든 설정 초기화
     */
    resetAllSettings() {
      this.hiddenBalances = {};
      this.nicknames = {};
      this.mainAccountId = null;
      localStorage.removeItem('accountSettings');
    },
  },
});
