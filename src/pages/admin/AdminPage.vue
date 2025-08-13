<template>
  <div class="admin-page">
    <!-- 💪(상일) 관리자 페이지 헤더 -->
    <div class="admin-header">
      <h1>관리자 페이지</h1>
    </div>

    <!-- 💪(상일) 탭 메뉴 -->
    <div class="admin-tabs">
      <button
        class="tab-button"
        :class="{ active: activeTab === 'sync' }"
        @click="activeTab = 'sync'"
      >
        데이터
      </button>
      <button
        class="tab-button"
        :class="{ active: activeTab === 'prompt' }"
        @click="activeTab = 'prompt'"
      >
        GPT
      </button>
      <button
        class="tab-button"
        :class="{ active: activeTab === 'review' }"
        @click="activeTab = 'review'"
      >
        리뷰
      </button>
      <button
        class="tab-button"
        :class="{ active: activeTab === 'notification' }"
        @click="activeTab = 'notification'"
      >
        알림
      </button>
    </div>

    <!-- 💪(상일) 탭 콘텐츠 -->
    <div class="tab-content">
      <!-- 데이터 동기화 탭 -->
      <div v-if="activeTab === 'sync'" class="admin-cards">
        <!-- 정책 동기화 카드 -->
        <div class="admin-card">
          <div class="card-header-vertical">
            <h3>정책 데이터 동기화</h3>
            <p>
              외부 API에서 최신 정책 정보를 가져와 데이터베이스를
              업데이트합니다.
            </p>
          </div>
          <div class="card-actions">
            <button
              class="btn-sync"
              @click="syncPolicyData"
              :disabled="loading.policy"
            >
              {{ loading.policy ? "동기화 중..." : "정책 데이터 동기화" }}
            </button>
            <div v-if="results.policy" class="result">
              {{ results.policy }}
            </div>
          </div>
        </div>

        <!-- CODEF 동기화 카드 -->
        <div class="admin-card">
          <div class="card-header-vertical">
            <h3>CODEF 데이터 동기화</h3>
            <p>사용자 계좌 및 카드 거래내역을 동기화합니다.</p>
          </div>
          <div class="card-actions">
            <div class="codef-buttons">
              <button
                class="btn-secondary"
                @click="syncAccountData"
                :disabled="loading.account"
              >
                {{ loading.account ? "동기화 중..." : "계좌 동기화" }}
              </button>
              <button
                class="btn-secondary"
                @click="syncCardData"
                :disabled="loading.card"
              >
                {{ loading.card ? "동기화 중..." : "카드 동기화" }}
              </button>
            </div>
            <div v-if="results.codef" class="result">
              {{ results.codef }}
            </div>
          </div>
        </div>
      </div>

      <!-- GPT 프롬프트 관리 탭 -->
      <div v-if="activeTab === 'prompt'" class="prompt-management">
        <!-- 프롬프트 미리보기 섹션 -->
        <div class="admin-card">
          <div class="card-header-vertical">
            <h3>프롬프트 미리보기</h3>
            <p>샘플 콘텐츠로 완성된 프롬프트를 확인합니다.</p>
          </div>
          <div class="card-actions">
            <div class="preview-section">
              <textarea
                v-model="previewSample"
                placeholder="Enter sample content..."
                class="sample-input"
              ></textarea>
              <button
                class="btn-preview"
                @click="previewPrompt"
                :disabled="loading.preview || !previewSample"
              >
                {{ loading.preview ? "생성 중..." : "프롬프트 미리보기" }}
              </button>
            </div>
            <div v-if="previewResult" class="preview-result">
              <h4>생성된 프롬프트:</h4>
              <pre>{{ previewResult }}</pre>
            </div>
          </div>
        </div>

        <!-- 조건 관리 섹션 -->
        <div class="admin-card">
          <div class="card-header-vertical">
            <h3>프롬프트 조건 관리</h3>
            <p>GPT 프롬프트에 사용될 조건들을 관리합니다.</p>
            <div class="header-actions" style="margin-top: 12px">
              <button class="btn-add" @click="openAddConditionModal">
                새 조건 추가
              </button>
              <button
                class="btn-refresh"
                @click="fetchPromptConditions"
                :disabled="loading.promptConditions"
              >
                {{ loading.promptConditions ? "로딩 중..." : "새로고침" }}
              </button>
            </div>
          </div>

          <!-- 💪(상일) 조건 필터 버튼 -->
          <div class="filter-buttons" v-if="promptConditions.length > 0">
            <button
              @click="conditionFilter = 'POSITIVE'"
              :class="[
                'filter-button',
                { active: conditionFilter === 'POSITIVE' },
              ]"
            >
              긍정적
            </button>
            <button
              @click="conditionFilter = 'NEGATIVE'"
              :class="[
                'filter-button',
                { active: conditionFilter === 'NEGATIVE' },
              ]"
            >
              부정적
            </button>
          </div>

          <!-- 조건 목록 테이블 -->
          <div class="conditions-table" v-if="filteredConditions.length > 0">
            <div
              class="condition-item"
              v-for="condition in filteredConditions"
              :key="condition.id"
            >
              <div class="condition-content">
                <h4>
                  {{
                    condition.conditionName ||
                    condition.conditionText ||
                    "조건 " + condition.id
                  }}
                </h4>
                <div class="condition-meta">
                  <span
                    :class="[
                      'condition-type',
                      condition.type === 'POSITIVE' ? 'positive' : 'negative',
                    ]"
                    v-if="condition.type"
                    >{{ getExampleTypeLabel(condition.type) }}</span
                  >
                  <span
                    :class="[
                      'status-badge',
                      condition.isActive ? 'active' : 'inactive',
                    ]"
                    v-if="condition.hasOwnProperty('isActive')"
                  >
                    {{ condition.isActive ? "활성" : "비활성" }}
                  </span>
                </div>
              </div>
              <div class="condition-divider"></div>
              <div class="condition-actions">
                <button
                  class="btn-edit-small"
                  @click="editCondition(condition)"
                >
                  수정
                </button>
                <button
                  class="btn-delete-small"
                  @click="deleteCondition(condition.id)"
                >
                  삭제
                </button>
              </div>
              <div class="condition-details">
                <div class="detail-row" v-if="condition.createdAt">
                  <span class="detail-label">생성일:</span>
                  <span class="detail-value">{{
                    formatDate(condition.createdAt)
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            v-else-if="
              !loading.promptConditions && filteredConditions.length === 0
            "
            class="no-data"
          >
            <p>
              {{ conditionFilter === "POSITIVE" ? "긍정적" : "부정적" }} 조건이
              없습니다.
            </p>
          </div>

          <div v-else class="loading-state">조건 목록을 불러오는 중...</div>
        </div>

        <!-- 예시 관리 섹션 -->
        <div class="admin-card">
          <div class="card-header-vertical">
            <h3>프롬프트 예시 관리</h3>
            <p>GPT 프롬프트 생성 시 사용될 예시들을 관리합니다.</p>
            <div class="header-actions" style="margin-top: 12px">
              <button class="btn-add" @click="openAddExampleModal">
                새 예시 추가
              </button>
              <button
                class="btn-refresh"
                @click="fetchPromptExamples"
                :disabled="loading.promptExamples"
              >
                {{ loading.promptExamples ? "로딩 중..." : "새로고침" }}
              </button>
            </div>
          </div>

          <!-- 💪(상일) 예시 필터 버튼 -->
          <div class="filter-buttons" v-if="promptExamples.length > 0">
            <button
              @click="exampleFilter = 'POSITIVE'"
              :class="[
                'filter-button',
                { active: exampleFilter === 'POSITIVE' },
              ]"
            >
              긍정적
            </button>
            <button
              @click="exampleFilter = 'NEGATIVE'"
              :class="[
                'filter-button',
                { active: exampleFilter === 'NEGATIVE' },
              ]"
            >
              부정적
            </button>
          </div>

          <!-- 예시 목록 -->
          <div class="examples-table" v-if="filteredExamples.length > 0">
            <div
              class="example-item"
              v-for="example in filteredExamples"
              :key="example.id"
            >
              <div class="example-content">
                <h4>{{ example.exampleText || "예시 " + example.id }}</h4>
                <div class="example-meta">
                  <span
                    :class="[
                      'example-type',
                      example.type === 'POSITIVE' ? 'positive' : 'negative',
                    ]"
                    v-if="example.type"
                    >{{ getExampleTypeLabel(example.type) }}</span
                  >
                  <span
                    :class="[
                      'status-badge',
                      example.isActive ? 'active' : 'inactive',
                    ]"
                    v-if="example.hasOwnProperty('isActive')"
                  >
                    {{ example.isActive ? "활성" : "비활성" }}
                  </span>
                </div>
              </div>
              <div class="example-divider"></div>
              <div class="example-actions">
                <button class="btn-edit-small" @click="editExample(example)">
                  수정
                </button>
                <button
                  class="btn-delete-small"
                  @click="deleteExample(example.id)"
                >
                  삭제
                </button>
              </div>
              <div class="example-details">
                <div class="detail-row" v-if="example.inputExample">
                  <span class="detail-label">입력:</span>
                  <span class="detail-value">{{ example.inputExample }}</span>
                </div>
                <div class="detail-row" v-if="example.outputExample">
                  <span class="detail-label">출력:</span>
                  <span class="detail-value">{{ example.outputExample }}</span>
                </div>
                <div class="detail-row" v-if="example.description">
                  <span class="detail-label">설명:</span>
                  <span class="detail-value">{{ example.description }}</span>
                </div>
                <div class="detail-row" v-if="example.createdAt">
                  <span class="detail-label">생성일:</span>
                  <span class="detail-value">{{
                    formatDate(example.createdAt)
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            v-else-if="!loading.promptExamples && filteredExamples.length === 0"
            class="no-data"
          >
            <p>
              {{ exampleFilter === "POSITIVE" ? "긍정적" : "부정적" }} 예시가
              없습니다.
            </p>
          </div>

          <div v-else class="loading-state">예시 목록을 불러오는 중...</div>
        </div>

        <!-- 계산 규칙 관리 섹션 -->
        <div class="admin-card">
          <div class="card-header-vertical">
            <h3>계산 규칙 관리</h3>
            <p>프롬프트에서 사용할 계산 공식과 규칙들을 관리합니다.</p>
            <div class="header-actions" style="margin-top: 12px">
              <button class="btn-add" @click="openAddRuleModal">
                새 규칙 추가
              </button>
              <button
                class="btn-refresh"
                @click="fetchCalculationRules"
                :disabled="loading.calculationRules"
              >
                {{ loading.calculationRules ? "로딩 중..." : "새로고침" }}
              </button>
            </div>
          </div>

          <!-- 계산 규칙 목록 -->
          <div class="rules-table" v-if="calculationRules.length > 0">
            <div
              class="rule-item"
              v-for="rule in calculationRules"
              :key="rule.id"
            >
              <div class="rule-content">
                <h4>
                  {{ rule.ruleName || rule.ruleText || "규칙 " + rule.id }}
                </h4>
                <div class="rule-meta">
                  <span
                    :class="[
                      'status-badge',
                      rule.isActive ? 'active' : 'inactive',
                    ]"
                    v-if="rule.hasOwnProperty('isActive')"
                  >
                    {{ rule.isActive ? "활성" : "비활성" }}
                  </span>
                </div>
              </div>
              <div class="rule-divider"></div>
              <div class="rule-actions">
                <button class="btn-edit-small" @click="editRule(rule)">
                  수정
                </button>
                <button class="btn-delete-small" @click="deleteRule(rule.id)">
                  삭제
                </button>
              </div>
              <div class="rule-details">
                <div class="detail-row" v-if="rule.formula">
                  <span class="detail-label">공식:</span>
                  <span class="detail-value formula-text">{{
                    rule.formula
                  }}</span>
                </div>
                <div class="detail-row" v-if="rule.description">
                  <span class="detail-label">설명:</span>
                  <span class="detail-value">{{ rule.description }}</span>
                </div>
                <div class="detail-row" v-if="rule.createdAt">
                  <span class="detail-label">생성일:</span>
                  <span class="detail-value">{{
                    formatDate(rule.createdAt)
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="!loading.calculationRules" class="no-data">
            <p>등록된 계산 규칙이 없습니다.</p>
            <button class="btn-add" @click="openAddRuleModal">
              첫 규칙 추가하기
            </button>
          </div>

          <div v-else class="loading-state">
            계산 규칙 목록을 불러오는 중...
          </div>
        </div>
      </div>

      <!-- 💪(상일) 리뷰 관리 탭 -->
      <div v-if="activeTab === 'review'" class="review-management">
        <div class="admin-card">
          <div class="card-header-vertical">
            <h3>리뷰 관리</h3>
            <p>모든 사용자 리뷰를 조회하고 관리합니다.</p>
            <div class="header-actions" style="margin-top: 12px">
              <button
                class="btn-refresh"
                @click="fetchAllReviews"
                :disabled="loading.reviews"
              >
                {{ loading.reviews ? "로딩 중..." : "새로고침" }}
              </button>
            </div>
          </div>

          <!-- 리뷰 목록 -->
          <div class="reviews-table" v-if="allReviews.length > 0">
            <div
              class="review-item"
              v-for="review in allReviews"
              :key="review.reviewId"
            >
              <div class="review-content">
                <div class="review-header">
                  <h4>{{ review.content || "리뷰 내용 없음" }}</h4>
                  <div class="review-meta">
                    <span class="review-user">{{ review.userName }}</span>
                    <span :class="['benefit-status', getBenefitStatusClass(review.benefitStatus)]">
                      {{ getBenefitStatusLabel(review.benefitStatus) }}
                    </span>
                    <span class="like-count">👍 {{ review.likeCount || 0 }}</span>
                  </div>
                </div>
                <div class="review-details">
                  <div class="detail-row">
                    <span class="detail-label">작성일:</span>
                    <span class="detail-value">{{ formatDate(review.createdAt) }}</span>
                  </div>
                  <div class="detail-row" v-if="review.updatedAt !== review.createdAt">
                    <span class="detail-label">수정일:</span>
                    <span class="detail-value">{{ formatDate(review.updatedAt) }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">사용자 ID:</span>
                    <span class="detail-value">{{ review.userId }}</span>
                  </div>
                  <div class="detail-row" v-if="review.policyId">
                    <span class="detail-label">정책 ID:</span>
                    <span class="detail-value">{{ review.policyId }}</span>
                  </div>
                </div>
              </div>
              <div class="review-divider"></div>
              <div class="review-actions">
                <button
                  class="btn-delete-small"
                  @click="deleteReviewAdmin(review)"
                  :disabled="loading.reviewDelete"
                >
                  {{ loading.reviewDelete ? "삭제 중..." : "삭제" }}
                </button>
              </div>
            </div>
          </div>

          <div v-else-if="!loading.reviews" class="no-data">
            <p>등록된 리뷰가 없습니다.</p>
          </div>

          <div v-else class="loading-state">리뷰 목록을 불러오는 중...</div>
        </div>
      </div>

      <!-- 알림 발송 탭 -->
      <div v-if="activeTab === 'notification'" class="notification-management">
        <div class="admin-cards">
          <!-- 테스트 알림 -->
          <div class="admin-card">
            <div class="card-header-vertical">
              <h3>테스트 알림</h3>
              <p>전체 사용자에게 테스트 알림을 발송합니다.</p>
            </div>
            <div class="card-actions">
              <button
                class="btn-test"
                @click="sendTestNotification"
                :disabled="loading.testNotification"
              >
                {{
                  loading.testNotification ? "노송 중..." : "테스트 알림 발송"
                }}
              </button>
            </div>
          </div>

          <!-- 북마크 정책 알림 -->
          <div class="admin-card">
            <div class="card-header-vertical">
              <h3>북마크 정책 알림</h3>
              <p>사용자들의 북마크된 정책 신청일/마감일 알림을 발송합니다.</p>
            </div>
            <div class="card-actions">
              <button
                class="btn-notification"
                @click="sendBookmarkNotification"
                :disabled="loading.bookmarkNotification"
              >
                {{
                  loading.bookmarkNotification
                    ? "발솤 중..."
                    : "북마크 알림 발송"
                }}
              </button>
            </div>
          </div>

          <!-- 신규 정책 알림 -->
          <div class="admin-card">
            <div class="card-header-vertical">
              <h3>신규 정책 알림</h3>
              <p>
                오늘 생성된 정책 중 사용자 조건에 맞는 정책 알림을 발송합니다.
              </p>
            </div>
            <div class="card-actions">
              <button
                class="btn-notification"
                @click="sendNewPolicyNotification"
                :disabled="loading.newPolicyNotification"
              >
                {{
                  loading.newPolicyNotification
                    ? "발솤 중..."
                    : "신규 정책 알림 발송"
                }}
              </button>
            </div>
          </div>

          <!-- TOP3 추천 알림 -->
          <div class="admin-card">
            <div class="card-header-vertical">
              <h3>TOP3 추천 알림</h3>
              <p>개인화된 TOP3 정책 추천 알림을 발송합니다.</p>
            </div>
            <div class="card-actions">
              <button
                class="btn-notification"
                @click="sendTop3Notification"
                :disabled="loading.top3Notification"
              >
                {{ loading.top3Notification ? "발솤 중..." : "TOP3 알림 발송" }}
              </button>
            </div>
          </div>

          <!-- 피드백 알림 -->
          <div class="admin-card">
            <div class="card-header-vertical">
              <h3>피드백 알림</h3>
              <p>주간 소비 리포트 피드백 알림을 발송합니다.</p>
            </div>
            <div class="card-actions">
              <button
                class="btn-notification"
                @click="sendFeedbackNotification"
                :disabled="loading.feedbackNotification"
              >
                {{
                  loading.feedbackNotification
                    ? "발솤 중..."
                    : "피드백 알림 발송"
                }}
              </button>
            </div>
          </div>

          <!-- 토큰 정리 -->
          <div class="admin-card">
            <div class="card-header-vertical">
              <h3>FCM 토큰 정리</h3>
              <p>만료된 FCM 토큰을 정리합니다.</p>
            </div>
            <div class="card-actions">
              <button
                class="btn-cleanup"
                @click="cleanupTokens"
                :disabled="loading.tokenCleanup"
              >
                {{ loading.tokenCleanup ? "정리 중..." : "토큰 정리" }}
              </button>
            </div>
          </div>
        </div>

        <!-- 발송 결과 -->
        <div v-if="results.notification" class="notification-result">
          <h3>알림 발송 결과</h3>
          <div class="result-content">{{ results.notification }}</div>
        </div>
      </div>
    </div>

    <!-- 💪(상일) 모달들 -->
    <!-- 조건 추가/수정 모달 (모바일 최적화) -->
    <div
      v-if="showConditionModal"
      class="modal-overlay"
      @click="closeConditionModal"
    >
      <div class="modal-content mobile-optimized" @click.stop>
        <div class="modal-header">
          <h3>{{ editingCondition ? "조건 수정" : "새 조건 추가" }}</h3>
          <button class="modal-close" @click="closeConditionModal">×</button>
        </div>

        <form @submit.prevent="saveCondition">
          <div class="form-group">
            <label>조건 텍스트</label>
            <textarea
              v-model="conditionForm.conditionText"
              placeholder="예: 중위소득 150% 이하 조건"
              rows="3"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label>조건 타입</label>
            <div class="select-wrapper">
              <select v-model="conditionForm.type" required>
                <option value="" disabled>조건 타입 선택</option>
                <option value="POSITIVE">긍정적</option>
                <option value="NEGATIVE">부정적</option>
                <option value="NEUTRAL">중립적</option>
              </select>
            </div>
          </div>

          <div class="modal-actions-mobile">
            <button
              type="button"
              class="btn-cancel-mobile"
              @click="closeConditionModal"
            >
              취소
            </button>
            <button
              type="submit"
              class="btn-save-mobile"
              :disabled="loading.conditionSave"
            >
              {{ loading.conditionSave ? "저장 중..." : "저장" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 예시 추가/수정 모달 -->
    <div
      v-if="showExampleModal"
      class="modal-overlay"
      @click="closeExampleModal"
    >
      <div class="modal-content mobile-optimized" @click.stop>
        <div class="modal-header">
          <h3>{{ editingExample ? "예시 수정" : "새 예시 추가" }}</h3>
          <button class="modal-close" @click="closeExampleModal">×</button>
        </div>

        <form @submit.prevent="saveExample">
          <div class="form-group">
            <label>예시 텍스트</label>
            <input
              type="text"
              v-model="exampleForm.exampleText"
              placeholder="예: 교통비 30% 환급"
              required
            />
          </div>

          <div class="form-group">
            <label>예시 타입</label>
            <div class="select-wrapper">
              <select v-model="exampleForm.type" required>
                <option value="" disabled>예시 타입 선택</option>
                <option value="POSITIVE">긍정적</option>
                <option value="NEGATIVE">부정적</option>
                <option value="NEUTRAL">중립적</option>
              </select>
            </div>
          </div>

          <div class="modal-actions-mobile">
            <button
              type="button"
              class="btn-cancel-mobile"
              @click="closeExampleModal"
            >
              취소
            </button>
            <button
              type="submit"
              class="btn-save-mobile"
              :disabled="loading.exampleSave"
            >
              {{ loading.exampleSave ? "저장 중..." : "저장" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 계산 규칙 추가/수정 모달 -->
    <div v-if="showRuleModal" class="modal-overlay" @click="closeRuleModal">
      <div class="modal-content mobile-optimized" @click.stop>
        <div class="modal-header">
          <h3>{{ editingRule ? "규칙 수정" : "새 규칙 추가" }}</h3>
          <button class="modal-close" @click="closeRuleModal">×</button>
        </div>

        <form @submit.prevent="saveRule">
          <div class="form-group">
            <label>규칙 명</label>
            <input
              type="text"
              v-model="ruleForm.ruleName"
              placeholder="예: 중위소득 계산 공식"
              required
            />
          </div>

          <div class="form-group">
            <label>계산 공식</label>
            <textarea
              v-model="ruleForm.formula"
              placeholder="예: (income / median_income) * 100"
              rows="3"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label>설명</label>
            <textarea
              v-model="ruleForm.description"
              placeholder="이 규칙에 대한 설명을 입력하세요"
              rows="2"
            ></textarea>
          </div>

          <div class="form-group-toggle">
            <label class="toggle-label">
              <span>활성 상태</span>
              <div class="toggle-switch">
                <input type="checkbox" v-model="ruleForm.isActive" />
                <span class="toggle-slider"></span>
              </div>
            </label>
          </div>

          <div class="modal-actions-mobile">
            <button
              type="button"
              class="btn-cancel-mobile"
              @click="closeRuleModal"
            >
              취소
            </button>
            <button
              type="submit"
              class="btn-save-mobile"
              :disabled="loading.ruleSave"
            >
              {{ loading.ruleSave ? "저장 중..." : "저장" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { adminAPI } from "@/api/admin";

// 💪(상일) 탭 관리
const activeTab = ref("sync");

// 💪(상일) 로딩 상태 관리
const loading = reactive({
  policy: false,
  account: false,
  card: false,
  promptConditions: false,
  promptExamples: false,
  calculationRules: false,
  preview: false,
  conditionSave: false,
  exampleSave: false,
  ruleSave: false,
  testNotification: false,
  bookmarkNotification: false,
  newPolicyNotification: false,
  top3Notification: false,
  feedbackNotification: false,
  tokenCleanup: false,
  reviews: false,
  reviewDelete: false,
});

// 💪(상일) 결과 메시지 상태 관리
const results = reactive({
  policy: "",
  codef: "",
  notification: "",
});

// 💪(상일) 프롬프트 관련 데이터
const promptConditions = ref([]);
const promptExamples = ref([]);
const calculationRules = ref([]);
const previewSample = ref("");
const previewResult = ref("");

// 💪(상일) 리뷰 관련 데이터
const allReviews = ref([]);

// 💪(상일) 필터 상태 관리
const conditionFilter = ref("POSITIVE"); // POSITIVE, NEGATIVE
const exampleFilter = ref("POSITIVE"); // POSITIVE, NEGATIVE

// 💪(상일) 모달 관리
const showConditionModal = ref(false);
const showExampleModal = ref(false);
const showRuleModal = ref(false);

const editingCondition = ref(null);
const editingExample = ref(null);
const editingRule = ref(null);

const conditionForm = reactive({
  conditionText: "",
  type: "",
});

const exampleForm = reactive({
  exampleText: "",
  type: "",
});

const ruleForm = reactive({
  ruleName: "",
  formula: "",
  description: "",
  isActive: true,
});

// 💪(상일) 기존 동기화 함수들
const syncPolicyData = async () => {
  loading.policy = true;
  results.policy = "";

  try {
    const response = await adminAPI.syncPolicyData();
    results.policy = response.data || "정책 데이터 동기화가 완료되었습니다.";
  } catch (error) {
    console.error("정책 동기화 오류:", error);
    results.policy = "정책 동기화 중 오류가 발생했습니다.";
  } finally {
    loading.policy = false;
  }
};

const syncAccountData = async () => {
  loading.account = true;
  results.codef = "";

  try {
    await adminAPI.syncAccountData();
    results.codef = "계좌 데이터 동기화가 시작되었습니다. (비동기 처리)";
  } catch (error) {
    console.error("계좌 동기화 오류:", error);
    results.codef = "계좌 동기화 중 오류가 발생했습니다.";
  } finally {
    loading.account = false;
  }
};

const syncCardData = async () => {
  loading.card = true;
  results.codef = "";

  try {
    await adminAPI.syncCardData();
    results.codef = "카드 데이터 동기화가 시작되었습니다. (비동기 처리)";
  } catch (error) {
    console.error("카드 동기화 오류:", error);
    results.codef = "카드 동기화 중 오류가 발생했습니다.";
  } finally {
    loading.card = false;
  }
};

// 💪(상일) 프롬프트 관련 함수들
const fetchPromptConditions = async () => {
  loading.promptConditions = true;

  try {
    const response = await adminAPI.getPromptConditions();
    promptConditions.value = response.data;
  } catch (error) {
    console.error("프롬프트 조건 조회 오류:", error);
  } finally {
    loading.promptConditions = false;
  }
};

const fetchPromptExamples = async () => {
  loading.promptExamples = true;

  try {
    const response = await adminAPI.getPromptExamples();
    promptExamples.value = response.data;
  } catch (error) {
    console.error("프롬프트 예시 조회 오류:", error);
  } finally {
    loading.promptExamples = false;
  }
};

const fetchCalculationRules = async () => {
  loading.calculationRules = true;

  try {
    const response = await adminAPI.getCalculationRules();
    calculationRules.value = response.data;
  } catch (error) {
    console.error("계산 규칙 조회 오류:", error);
  } finally {
    loading.calculationRules = false;
  }
};

const previewPrompt = async () => {
  loading.preview = true;
  previewResult.value = "";

  try {
    const response = await adminAPI.previewPrompt(previewSample.value);
    previewResult.value = response.data;
  } catch (error) {
    console.error("프롬프트 미리보기 오류:", error);
    previewResult.value = "미리보기 생성 중 오류가 발생했습니다.";
  } finally {
    loading.preview = false;
  }
};

// 💪(상일) CRUD 함수들
const openAddConditionModal = () => {
  editingCondition.value = null;
  resetConditionForm();
  showConditionModal.value = true;
};

const editCondition = (condition) => {
  editingCondition.value = condition;
  Object.assign(conditionForm, condition);
  showConditionModal.value = true;
};

const closeConditionModal = () => {
  showConditionModal.value = false;
  resetConditionForm();
};

const resetConditionForm = () => {
  Object.assign(conditionForm, {
    conditionText: "",
    type: "",
  });
};

const saveCondition = async () => {
  loading.conditionSave = true;

  try {
    if (editingCondition.value) {
      await adminAPI.updatePromptCondition(
        editingCondition.value.id,
        conditionForm
      );
    } else {
      await adminAPI.createPromptCondition(conditionForm);
    }

    closeConditionModal();
    await fetchPromptConditions();
  } catch (error) {
    console.error("조건 저장 오류:", error);
  } finally {
    loading.conditionSave = false;
  }
};

const deleteCondition = async (id) => {
  if (!confirm("정말 삭제하시겠습니까?")) return;

  try {
    await adminAPI.deletePromptCondition(id);
    await fetchPromptConditions();
  } catch (error) {
    console.error("조건 삭제 오류:", error);
  }
};

const deleteExample = async (id) => {
  if (!confirm("정말 삭제하시겠습니까?")) return;

  try {
    await adminAPI.deletePromptExample(id);
    await fetchPromptExamples();
  } catch (error) {
    console.error("예시 삭제 오류:", error);
  }
};

const deleteRule = async (id) => {
  if (!confirm("정말 삭제하시겠습니까?")) return;

  try {
    await adminAPI.deleteCalculationRule(id);
    await fetchCalculationRules();
  } catch (error) {
    console.error("규칙 삭제 오류:", error);
  }
};

// 💪(상일) 알림 발송 함수들
const sendTestNotification = async () => {
  loading.testNotification = true;
  results.notification = "";

  try {
    const response = await adminAPI.sendTestNotification();
    results.notification = response.data;
  } catch (error) {
    console.error("테스트 알림 발송 오류:", error);
    results.notification = "테스트 알림 발송 중 오류가 발생했습니다.";
  } finally {
    loading.testNotification = false;
  }
};

const sendBookmarkNotification = async () => {
  loading.bookmarkNotification = true;
  results.notification = "";

  try {
    const response = await adminAPI.sendBookmarkNotification();
    results.notification = response.data;
  } catch (error) {
    console.error("북마크 알림 발송 오류:", error);
    results.notification = "북마크 알림 발송 중 오류가 발생했습니다.";
  } finally {
    loading.bookmarkNotification = false;
  }
};

const sendNewPolicyNotification = async () => {
  loading.newPolicyNotification = true;
  results.notification = "";

  try {
    const response = await adminAPI.sendNewPolicyNotification();
    results.notification = response.data;
  } catch (error) {
    console.error("신규 정책 알림 발송 오류:", error);
    results.notification = "신규 정책 알림 발송 중 오류가 발생했습니다.";
  } finally {
    loading.newPolicyNotification = false;
  }
};

const sendTop3Notification = async () => {
  loading.top3Notification = true;
  results.notification = "";

  try {
    const response = await adminAPI.sendTop3Notification();
    results.notification = response.data;
  } catch (error) {
    console.error("TOP3 알림 발송 오류:", error);
    results.notification = "TOP3 알림 발송 중 오류가 발생했습니다.";
  } finally {
    loading.top3Notification = false;
  }
};

const sendFeedbackNotification = async () => {
  loading.feedbackNotification = true;
  results.notification = "";

  try {
    const response = await adminAPI.sendFeedbackNotification();
    results.notification = response.data;
  } catch (error) {
    console.error("피드백 알림 발송 오류:", error);
    results.notification = "피드백 알림 발송 중 오류가 발생했습니다.";
  } finally {
    loading.feedbackNotification = false;
  }
};

const cleanupTokens = async () => {
  loading.tokenCleanup = true;
  results.notification = "";

  try {
    const response = await adminAPI.cleanupTokens();
    results.notification = response.data;
  } catch (error) {
    console.error("토큰 정리 오류:", error);
    results.notification = "토큰 정리 중 오류가 발생했습니다.";
  } finally {
    loading.tokenCleanup = false;
  }
};

// 💪(상일) 유틸리티 함수들
const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

// 💪(상일) 조건 타입 라벨 변환
const getTypeLabel = (type) => {
  const labels = {
    INCOME: "소득",
    AGE: "연령",
    REGION: "지역",
    EMPLOYMENT: "취업상태",
  };
  return labels[type] || type;
};

// 💪(상일) 예시 타입 라벨 변환
const getExampleTypeLabel = (type) => {
  const labels = {
    POSITIVE: "긍정적",
    NEGATIVE: "부정적",
    NEUTRAL: "중립적",
  };
  return labels[type] || type;
};

// 💪(상일) 날짜 포맷팅
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 💪(상일) 예시 관리 함수들
const openAddExampleModal = () => {
  editingExample.value = null;
  resetExampleForm();
  showExampleModal.value = true;
};

const editExample = (example) => {
  editingExample.value = example;
  Object.assign(exampleForm, example);
  showExampleModal.value = true;
};

const closeExampleModal = () => {
  showExampleModal.value = false;
  resetExampleForm();
};

const resetExampleForm = () => {
  Object.assign(exampleForm, {
    exampleText: "",
    type: "",
  });
};

const saveExample = async () => {
  loading.exampleSave = true;

  try {
    if (editingExample.value) {
      await adminAPI.updatePromptExample(editingExample.value.id, exampleForm);
    } else {
      await adminAPI.createPromptExample(exampleForm);
    }

    closeExampleModal();
    await fetchPromptExamples();
  } catch (error) {
    console.error("예시 저장 오류:", error);
  } finally {
    loading.exampleSave = false;
  }
};

// 💪(상일) 계산 규칙 관리 함수들
const openAddRuleModal = () => {
  editingRule.value = null;
  resetRuleForm();
  showRuleModal.value = true;
};

const editRule = (rule) => {
  editingRule.value = rule;
  Object.assign(ruleForm, rule);
  showRuleModal.value = true;
};

const closeRuleModal = () => {
  showRuleModal.value = false;
  resetRuleForm();
};

const resetRuleForm = () => {
  Object.assign(ruleForm, {
    ruleName: "",
    formula: "",
    description: "",
    isActive: true,
  });
};

const saveRule = async () => {
  loading.ruleSave = true;

  try {
    if (editingRule.value) {
      await adminAPI.updateCalculationRule(editingRule.value.id, ruleForm);
    } else {
      await adminAPI.createCalculationRule(ruleForm);
    }

    closeRuleModal();
    await fetchCalculationRules();
  } catch (error) {
    console.error("규칙 저장 오류:", error);
  } finally {
    loading.ruleSave = false;
  }
};

// 💪(상일) 필터링된 데이터 계산
const filteredConditions = computed(() => {
  return promptConditions.value.filter(
    (condition) => condition.type === conditionFilter.value
  );
});

const filteredExamples = computed(() => {
  return promptExamples.value.filter(
    (example) => example.type === exampleFilter.value
  );
});

// 💪(상일) 리뷰 관리 함수들
const fetchAllReviews = async () => {
  loading.reviews = true;
  allReviews.value = [];
  
  try {
    const response = await adminAPI.getAllReviews();
    allReviews.value = response.data;
  } catch (error) {
    console.error("리뷰 조회 오류:", error);
  } finally {
    loading.reviews = false;
  }
};

const deleteReviewAdmin = async (review) => {
  if (!confirm(`정책 ID ${review.policyId}의 모든 리뷰를 삭제하시겠습니까?\n(해당 정책의 모든 리뷰가 삭제됩니다)`)) return;
  
  if (!review.policyId) {
    alert("정책 ID가 없어서 삭제할 수 없습니다.");
    return;
  }
  
  loading.reviewDelete = true;
  
  try {
    await adminAPI.deleteReviewsByPolicyId(review.policyId);
    await fetchAllReviews(); // 목록 새로고침
    alert(`정책 ID ${review.policyId}의 모든 리뷰가 삭제되었습니다.`);
  } catch (error) {
    console.error("리뷰 삭제 오류:", error);
    alert("리뷰 삭제 중 오류가 발생했습니다.");
  } finally {
    loading.reviewDelete = false;
  }
};

// 💪(상일) 혜택 상태 라벨 변환
const getBenefitStatusLabel = (status) => {
  const labels = {
    RECEIVED: "수령 완료",
    PENDING: "처리 중",
    NOT_ELIGIBLE: "수령 불가"
  };
  return labels[status] || status;
};

// 💪(상일) 혜택 상태별 CSS 클래스
const getBenefitStatusClass = (status) => {
  const classes = {
    RECEIVED: "received",
    PENDING: "pending", 
    NOT_ELIGIBLE: "not-eligible"
  };
  return classes[status] || "default";
};

onMounted(() => {
  fetchPromptConditions();
  fetchPromptExamples();
  fetchCalculationRules();
});
</script>

<style scoped>
.admin-page {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.admin-header {
  text-align: center;
  margin-bottom: 32px;
  padding: 24px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
}

.admin-header h1 {
  margin: 0 0 8px 0;
  color: #212529;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.admin-header p {
  margin: 0;
  color: #6c757d;
  font-size: 14px;
  font-weight: 500;
}

.admin-tabs {
  display: flex;
  gap: 2px;
  margin-bottom: 24px;
  background: #e9ecef;
  padding: 4px;
  border-radius: 4px;
}

.tab-button {
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: transparent;
  border-radius: 2px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s;
  color: #6c757d;
  text-transform: uppercase;
}

.tab-button.active {
  background: white;
  color: #212529;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tab-button:hover:not(.active) {
  background: rgba(255, 255, 255, 0.5);
}

.tab-content {
  max-width: 1200px;
  margin: 0 auto;
}

.admin-cards {
  display: grid;
  gap: 16px;
}

.prompt-management,
.review-management,
.notification-management {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.admin-card {
  background: white;
  border-radius: 4px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

/* 💪(상일) 세로형 카드 헤더 스타일 */
.card-header-vertical {
  margin-bottom: 20px;
}

.card-header-vertical h3 {
  margin: 0 0 8px 0;
  color: #212529;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.3px;
  line-height: 1.3;
}

.card-header-vertical p {
  margin: 0;
  color: #6c757d;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 400;
}

.card-header h3 {
  margin: 0 0 8px 0;
  color: #212529;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.card-header p {
  margin: 0;
  color: #6c757d;
  font-size: 13px;
  line-height: 1.5;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.btn-add,
.btn-refresh {
  padding: 6px 12px;
  border: 1px solid #6c757d;
  border-radius: 2px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  color: #6c757d;
  text-transform: uppercase;
}

.btn-add {
  border-color: #28a745;
  color: #28a745;
}

.btn-add:hover {
  background: #28a745;
  color: white;
}

.btn-refresh:hover:not(:disabled) {
  background: #6c757d;
  color: white;
}

.btn-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.data-table {
  overflow-x: auto;
}

.data-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.data-table th,
.data-table td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.data-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 10px;
}

.status {
  padding: 2px 6px;
  border-radius: 2px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.5px;
  border: 1px solid;
}

.status.active {
  background: #fff;
  color: #28a745;
  border-color: #28a745;
}

.status.inactive {
  background: #fff;
  color: #dc3545;
  border-color: #dc3545;
}

.btn-edit,
.btn-delete {
  padding: 4px 8px;
  border: 1px solid;
  border-radius: 2px;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  margin-right: 4px;
  text-transform: uppercase;
}

.btn-edit {
  background: white;
  color: #007bff;
  border-color: #007bff;
}

.btn-edit:hover {
  background: #007bff;
  color: white;
}

.btn-delete {
  background: white;
  color: #dc3545;
  border-color: #dc3545;
}

.btn-delete:hover {
  background: #dc3545;
  color: white;
}

.example-text,
.formula-text {
  max-width: 200px;
  word-break: break-word;
  font-family: monospace;
  font-size: 11px;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #6c757d;
  font-style: italic;
  font-size: 13px;
}

.preview-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sample-input {
  width: 100%;
  min-height: 80px;
  padding: 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 13px;
  resize: vertical;
  font-family: monospace;
}

.btn-preview {
  align-self: flex-start;
  padding: 10px 20px;
  background: white;
  color: #17a2b8;
  border: 1px solid #17a2b8;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  text-transform: uppercase;
}

.btn-preview:hover:not(:disabled) {
  background: #17a2b8;
  color: white;
}

.btn-preview:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.preview-result {
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.preview-result h4 {
  margin: 0 0 12px 0;
  color: #495057;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.preview-result pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 12px;
  line-height: 1.5;
  font-family: monospace;
}

.btn-sync,
.btn-test,
.btn-notification,
.btn-cleanup {
  width: 100%;
  padding: 12px 24px;
  border: 1px solid;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
}

.btn-sync {
  background: white;
  color: #007bff;
  border-color: #007bff;
}

.btn-sync:hover:not(:disabled) {
  background: #007bff;
  color: white;
}

.btn-test {
  background: white;
  color: #ffc107;
  border-color: #ffc107;
}

.btn-test:hover:not(:disabled) {
  background: #ffc107;
  color: #212529;
}

.btn-notification {
  background: white;
  color: #28a745;
  border-color: #28a745;
}

.btn-notification:hover:not(:disabled) {
  background: #28a745;
  color: white;
}

.btn-cleanup {
  background: white;
  color: #6c757d;
  border-color: #6c757d;
}

.btn-cleanup:hover:not(:disabled) {
  background: #6c757d;
  color: white;
}

.btn-sync:disabled,
.btn-test:disabled,
.btn-notification:disabled,
.btn-cleanup:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #6c757d;
  border: 1px solid #6c757d;
  padding: 10px 16px;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  text-transform: uppercase;
}

.btn-secondary:hover:not(:disabled) {
  background: #6c757d;
  color: white;
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.codef-buttons {
  display: flex;
  gap: 8px;
}

.result {
  padding: 12px;
  background: #d4edda;
  color: #155724;
  border-radius: 4px;
  font-size: 12px;
  border: 1px solid #c3e6cb;
  margin-top: 12px;
}

.notification-result {
  background: white;
  border-radius: 4px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
}

.notification-result h3 {
  margin: 0 0 16px 0;
  color: #212529;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.result-content {
  padding: 16px;
  background: #d4edda;
  color: #155724;
  border-radius: 4px;
  border: 1px solid #c3e6cb;
  font-size: 13px;
}

/* 💪(상일) 모바일 전용 스타일 */
.card-header-mobile {
  margin-bottom: 20px;
}

.header-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.header-title-row h3 {
  margin: 0;
  color: #212529;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.btn-refresh-icon {
  padding: 6px 12px;
  border: 1px solid #6c757d;
  background: white;
  border-radius: 2px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s;
  color: #6c757d;
  text-transform: uppercase;
}

.btn-refresh-icon:hover:not(:disabled) {
  background: #6c757d;
  color: white;
}

.btn-refresh-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-add-full {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: white;
  color: #28a745;
  border: 1px solid #28a745;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
}

.btn-add-full:hover {
  background: #28a745;
  color: white;
}

/* 💪(상일) 필터 버튼 스타일 */
.filter-buttons {
  display: flex;
  gap: 2px;
  margin: 16px 0 12px 0;
  background: #f8f9fa;
  padding: 4px;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.filter-button {
  flex: 1;
  padding: 8px 12px;
  border: none;
  background: transparent;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: all 0.2s;
  color: #6c757d;
  text-transform: uppercase;
}

.filter-button.active {
  background: white;
  color: #212529;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border: 1px solid #dee2e6;
}

.filter-button:hover:not(.active) {
  background: rgba(255, 255, 255, 0.5);
  color: #495057;
}

/* 💪(상일) 새로운 조건 아이템 스타일 */
.conditions-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.condition-item {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 16px;
  transition: all 0.2s;
}

.condition-item:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

.condition-content {
  margin-bottom: 12px;
}

.condition-content h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  line-height: 1.3;
}

.condition-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.condition-type {
  display: inline-block;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

/* 💪(상일) 조건 타입별 색상 구분 */
.condition-type.positive {
  background: #28a745;
}

.condition-type.negative {
  background: #dc3545;
}

.condition-divider {
  height: 1px;
  background: #e9ecef;
  margin: 12px 0;
}

.condition-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  align-items: center;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
  border-color: #c3e6cb;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
  border-color: #f5c6cb;
}

.btn-edit-small,
.btn-delete-small {
  padding: 4px 8px;
  border: 1px solid;
  border-radius: 2px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit-small {
  background: white;
  color: #007bff;
  border-color: #007bff;
}

.btn-edit-small:hover {
  background: #007bff;
  color: white;
}

.btn-delete-small {
  background: white;
  color: #dc3545;
  border-color: #dc3545;
}

.btn-delete-small:hover {
  background: #dc3545;
  color: white;
}

.condition-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-row {
  display: flex;
  gap: 8px;
  font-size: 13px;
}

.detail-label {
  font-weight: 500;
  color: #6c757d;
  min-width: 40px;
}

.detail-value {
  color: #212529;
  font-family: monospace;
}

.loading-state {
  text-align: center;
  padding: 40px;
  color: #6c757d;
  font-style: italic;
}

/* 💪(상일) 예시 테이블 스타일 */
.examples-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.example-item {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 16px;
  transition: all 0.2s;
}

.example-item:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

.example-content {
  margin-bottom: 12px;
}

.example-content h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  line-height: 1.3;
}

.example-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.example-type {
  display: inline-block;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

/* 💪(상일) 예시 타입별 색상 구분 */
.example-type.positive {
  background: #28a745;
}

.example-type.negative {
  background: #dc3545;
}

.example-divider {
  height: 1px;
  background: #e9ecef;
  margin: 12px 0;
}

.example-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  align-items: center;
}

.example-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 💪(상일) 계산 규칙 테이블 스타일 */
.rules-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.rule-item {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 16px;
  transition: all 0.2s;
}

.rule-item:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

.rule-content {
  margin-bottom: 12px;
}

.rule-content h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  line-height: 1.3;
}

.rule-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.rule-divider {
  height: 1px;
  background: #e9ecef;
  margin: 12px 0;
}

.rule-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  align-items: center;
}

.rule-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.formula-text {
  font-family: "Consolas", "Monaco", "Courier New", monospace;
  background: #e9ecef;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 12px;
  word-break: break-all;
}

/* 💪(상일) 리뷰 테이블 스타일 */
.reviews-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.review-item {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 16px;
  transition: all 0.2s;
}

.review-item:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

.review-content {
  margin-bottom: 12px;
}

.review-header {
  margin-bottom: 8px;
}

.review-header h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  line-height: 1.4;
  word-break: break-word;
}

.review-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.review-user {
  display: inline-block;
  background: #6c757d;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.benefit-status {
  display: inline-block;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.benefit-status.received {
  background: #28a745;
}

.benefit-status.pending {
  background: #ffc107;
  color: #212529;
}

.benefit-status.not-eligible {
  background: #dc3545;
}

.benefit-status.default {
  background: #6c757d;
}

.like-count {
  display: inline-block;
  background: #e9ecef;
  color: #495057;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.review-divider {
  height: 1px;
  background: #e9ecef;
  margin: 12px 0;
}

.review-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  align-items: center;
}

.review-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
}

.condition-cards-container {
  margin-top: 16px;
}

/* 💪(상일) 모바일 최적화 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content.mobile-optimized {
  width: 95%;
  max-width: 500px;
  height: auto;
  max-height: 90vh;
  margin: 20px;
  border-radius: 4px;
  overflow: hidden;
  background: white;
  padding: 24px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 16px 0;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 20px;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.modal-close {
  padding: 4px 8px;
  border: none;
  background: transparent;
  font-size: 18px;
  color: #6c757d;
  cursor: pointer;
  border-radius: 2px;
}

.modal-close:hover {
  background: #f8f9fa;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.select-wrapper {
  position: relative;
}

.form-group select,
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dee2e6;
  border-radius: 2px;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s;
}

.form-group select:focus,
.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
}

.form-group-toggle {
  margin-bottom: 24px;
}

.toggle-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  color: #495057;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.toggle-switch {
  position: relative;
  width: 44px;
  height: 20px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 20px;
  transition: 0.3s;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  transition: 0.3s;
}

input:checked + .toggle-slider {
  background-color: #28a745;
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

.modal-actions-mobile {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.btn-cancel-mobile,
.btn-save-mobile {
  flex: 1;
  padding: 12px;
  border: 1px solid;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
}

.btn-cancel-mobile {
  background: white;
  color: #6c757d;
  border-color: #6c757d;
}

.btn-cancel-mobile:hover {
  background: #6c757d;
  color: white;
}

.btn-save-mobile {
  background: white;
  color: #28a745;
  border-color: #28a745;
}

.btn-save-mobile:hover:not(:disabled) {
  background: #28a745;
  color: white;
}

.btn-save-mobile:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 💪(상일) 반응형 디스플레이 제어 */
.desktop-only {
  display: block;
}

@media (max-width: 768px) {
  .admin-page {
    padding: 16px;
  }

  .admin-tabs {
    flex-direction: column;
    gap: 1px;
  }

  .admin-card {
    padding: 20px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    margin-top: 12px;
  }

  .codef-buttons {
    flex-direction: column;
  }

  /* 💪(상일) 모바일에서 테이블 숨기기 */
  .desktop-only {
    display: none !important;
  }
}
</style>
