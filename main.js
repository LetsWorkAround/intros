// 키워드 분석 대시보드 애플리케이션
const KeywordAnalysisDashboard = (function() {
    // 프라이빗 변수
    let currentSnapshot = null;
    let isLoggedIn = false;
    let userNickname = "";
    let remainingSearches = 10;

    // DOM 요소
    const DOM = {
        loginStatus: document.getElementById('loginStatus'),
        nickname: document.getElementById('nickname'),
        searchCount: document.getElementById('searchCount'),
        loginButton: document.getElementById('loginButton'),
        keywordInputs: Array.from(document.querySelectorAll('.input-group input')),
        analyzeButton: document.querySelector('button[onclick="KeywordAnalysisDashboard.analyzeKeywords()"]'),
        loadingIndicator: document.querySelector('.loading'),
        resultsContainer: document.getElementById('results'),
        relatedKeywordList: document.getElementById('relatedKeywordList'),
        competitorTable: document.getElementById('competitorTable'),
        keywordAnalysisTable: document.getElementById('keywordAnalysisTable'),
        snapshotSelect: document.getElementById('snapshotSelect')
    };

    // 사용자 정보 업데이트
    function updateHeaderInfo() {
        DOM.loginStatus.textContent = isLoggedIn ? "로그인됨" : "로그인되지 않음";
        DOM.nickname.textContent = isLoggedIn ? `닉네임: ${userNickname}` : "";
        DOM.searchCount.textContent = isLoggedIn ? `남은 검색 횟수: ${remainingSearches}` : "";
        DOM.loginButton.textContent = isLoggedIn ? "로그아웃" : "로그인";
    }

    // 로그인/로그아웃 토글
    function toggleLogin() {
        isLoggedIn = !isLoggedIn;
        if (isLoggedIn) {
            userNickname = "사용자" + Math.floor(Math.random() * 1000);
            remainingSearches = 10;
        } else {
            userNickname = "";
            remainingSearches = 0;
        }
        updateHeaderInfo();
    }

    // 키워드 분석 실행
    function analyzeKeywords() {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            return;
        }
        if (remainingSearches <= 0) {
            alert("검색 횟수를 모두 사용하셨습니다.");
            return;
        }

        const keywords = DOM.keywordInputs.map(input => input.value.trim()).filter(Boolean);
        if (keywords.length === 0) {
            alert("최소 하나의 키워드를 입력해주세요.");
            return;
        }

        remainingSearches--;
        updateHeaderInfo();

        // 로딩 표시
        DOM.loadingIndicator.style.display = 'flex';
        DOM.resultsContainer.style.display = 'none';

        // 분석 시뮬레이션 (실제로는 서버 요청을 할 것입니다)
        setTimeout(() => {
            try {
                currentSnapshot = generateMockData(keywords);
                saveSnapshot(currentSnapshot);
                displayResults(currentSnapshot);
                DOM.loadingIndicator.style.display = 'none';
                DOM.resultsContainer.style.display = 'block';
            } catch (error) {
                console.error("분석 중 오류 발생:", error);
                alert("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
                DOM.loadingIndicator.style.display = 'none';
            }
        }, 1500);
    }

    // 목업 데이터 생성
    function generateMockData(keywords) {
        return {
            timestamp: new Date().toISOString(),
            relatedKeywords: [
                '온라인마케팅', '검색엔진최적화', '키워드광고', '콘텐츠마케팅', '소셜미디어마케팅',
                '이메일마케팅', '퍼포먼스마케팅', '인플루언서마케팅', '브랜드마케팅', '제품마케팅',
                '디지털광고', '리타게팅', '바이럴마케팅', '네이티브광고', '프로그래매틱광고',
                '모바일마케팅', '전환율최적화', '고객생애가치', '마케팅자동화', '데이터기반마케팅'
            ],
            competitors: [
                { url: 'example1.com', impressions: 10000, clicks: 500, cost: 1000000 },
                { url: 'example2.com', impressions: 8000, clicks: 400, cost: 800000 },
                { url: 'example3.com', impressions: 12000, clicks: 600, cost: 1200000 },
                { url: 'example4.com', impressions: 9000, clicks: 450, cost: 900000 },
                { url: 'example5.com', impressions: 11000, clicks: 550, cost: 1100000 }
            ],
            keywordAnalysis: keywords.map(keyword => ({
                keyword,
                pcRank: Math.floor(Math.random() * 10) + 1,
                mobileRank: Math.floor(Math.random() * 10) + 1,
                bidPrice: Math.floor(Math.random() * 5000) + 1000,
                impressions: Math.floor(Math.random() * 30000) + 10000,
                clicks: Math.floor(Math.random() * 1500) + 500,
                cost: Math.floor(Math.random() * 3000000) + 1000000,
                cpc: Math.floor(Math.random() * 3000) + 1000
            }))
        };
    }

    // 결과 표시
    function displayResults(snapshot) {
        // 연관 키워드 표시
        DOM.relatedKeywordList.innerHTML = snapshot.relatedKeywords
            .map(keyword => `<li class="tag">${keyword}</li>`)
            .join('');

        // 경쟁사 분석 표시
        DOM.competitorTable.innerHTML = `
            <tr><th>URL</th><th>월 예상 노출수</th><th>예상 월 클릭수</th><th>예상 월 비용</th></tr>
            ${snapshot.competitors.map(competitor => `
                <tr>
                    <td>${competitor.url}</td>
                    <td>${competitor.impressions.toLocaleString()}</td>
                    <td>${competitor.clicks.toLocaleString()}</td>
                    <td>${competitor.cost.toLocaleString()}원</td>
                </tr>
            `).join('')}
        `;

        // 키워드 상세 분석 표시
        DOM.keywordAnalysisTable.innerHTML = `
            <tr>
                <th>키워드</th><th>PC 노출 순위</th><th>모바일 노출 순위</th><th>예상 입찰가</th>
                <th>예상 월 노출수</th><th>예상 월 클릭수</th><th>예상 월 비용</th><th>예상 CPC</th>
            </tr>
            ${snapshot.keywordAnalysis.map(analysis => `
                <tr>
                    <td>${analysis.keyword}</td>
                    <td>${analysis.pcRank}</td>
                    <td>${analysis.mobileRank}</td>
                    <td>${analysis.bidPrice.toLocaleString()}원</td>
                    <td>${analysis.impressions.toLocaleString()}</td>
                    <td>${analysis.clicks.toLocaleString()}</td>
                    <td>${analysis.cost.toLocaleString()}원</td>
                    <td>${analysis.cpc.toLocaleString()}원</td>
                </tr>
            `).join('')}
        `;
    }

    // 스냅샷 저장
    function saveSnapshot(snapshot) {
        let snapshots = JSON.parse(localStorage.getItem('snapshots') || '[]');
        snapshots.push(snapshot);
        localStorage.setItem('snapshots', JSON.stringify(snapshots));
        updateSnapshotSelect();
    }

    // 스냅샷 선택 옵션 업데이트
    function updateSnapshotSelect() {
        const snapshots = JSON.parse(localStorage.getItem('snapshots') || '[]');
        DOM.snapshotSelect.innerHTML = '<option value="">현재 분석 결과</option>' +
            snapshots.map((snapshot, index) => 
                `<option value="${index}">${new Date(snapshot.timestamp).toLocaleString()}</option>`
            ).join('');
    }

    // 스냅샷 로드
    function loadSnapshot() {
        const selectedIndex = DOM.snapshotSelect.value;
        if (selectedIndex === '') {
            if (currentSnapshot) {
                displayResults(currentSnapshot);
            }
        } else {
            const snapshots = JSON.parse(localStorage.getItem('snapshots') || '[]');
            const selectedSnapshot = snapshots[selectedIndex];
            displayResults(selectedSnapshot);
        }
    }

    // 초기화 함수
    function init() {
        updateHeaderInfo();
        updateSnapshotSelect();
        DOM.loginButton.addEventListener('click', toggleLogin);
        DOM.snapshotSelect.addEventListener('change', loadSnapshot);
    }

    // 공개 메서드
    return {
        init: init,
        toggleLogin: toggleLogin,
        analyzeKeywords: analyzeKeywords,
        loadSnapshot: loadSnapshot
    };
})();

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', KeywordAnalysisDashboard.init);
