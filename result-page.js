// 결과 페이지용 JavaScript

// 히든 인터렉션 변수
let clickCount = 0;
let maxEffectStages = 2; // 점진적 효과 단계 (2단계)
let currentSpeed = 1;
let currentColor = { r: 1, g: 1, b: 0 }; // 노란색 시작
let maxUpgradeLevel = 2; // 최대 강화 단계 (2단계)
let hasShownPopup = false; // 팝업 표시 여부 추적

// 페이지 로드 시 이름 개인화 처리
document.addEventListener('DOMContentLoaded', function() {
    personalizeResultPage();
    setupHiddenInteraction();
});

// 결과 페이지 개인화 함수
function personalizeResultPage() {
    // URL 파라미터에서 이름과 소유자 여부 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const userName = urlParams.get('name');
    const isOwner = urlParams.get('owner') === 'true';
    
    if (userName) {
        // 결과 타이틀 요소 찾기
        const resultTitleElement = document.querySelector('.result-title-text');
        if (resultTitleElement) {
            const originalTitle = resultTitleElement.textContent;
            // "님의 전설템!" 부분을 제거하고 아이템 이름만 추출
            const itemName = originalTitle.replace('님의 전설템!\n', '').replace('님의 전설템!', '').trim();
            // "임버드님의 전설템! 아이템명" 형식으로 변경 (공백 없이)
            resultTitleElement.innerHTML = `${decodeURIComponent(userName)}님의 전설템!\n${itemName}`;
        }
    }
    
    // 버튼 분기 처리
    updateActionButtons(isOwner);
    
    // 친구가 보는 경우 불필요한 버튼들 숨기기
    if (!isOwner) {
        hideUnnecessaryButtons();
    }
    
    // 공유카드 메타태그 업데이트
    updateShareCardMeta(userName, isOwner);
}

// 버튼 분기 처리 함수
function updateActionButtons(isOwner) {
    const buttonArea = document.querySelector('.result-button-area');
    
    if (isOwner) {
        // 내 결과인 경우 - 공유하기만 (width 100%)
        buttonArea.innerHTML = `
            <button class="result-share-button btn_a h2w" onclick="shareResult()" style="width: 100%;">공유하기</button>
        `;
    } else {
        // 친구 결과를 보는 경우 - 내 전설템 획득하기만
        buttonArea.innerHTML = `
            <button class="result-share-button btn_a h2w" onclick="goToMainTest()">내 전설템 획득하기</button>
        `;
    }
}

// 다시하기 - 메인 페이지로 이동
function restartTest() {
    window.location.href = 'index.html';
}

// 나도 테스트해보기 - 메인 페이지로 이동
function goToMainTest() {
    window.location.href = 'index.html';
}

// 친구가 보는 경우 불필요한 버튼들 숨기기
function hideUnnecessaryButtons() {
    // "친구들에게 공유하기" 버튼 숨기기
    const shareButtons = document.querySelectorAll('.section-button');
    shareButtons.forEach(button => {
        if (button.textContent.includes('친구들에게 공유하기')) {
            button.style.display = 'none';
        }
    });
    
    // "믿을수 없어... 다시시도" 버튼 숨기기
    const restartButtons = document.querySelectorAll('.section-button');
    restartButtons.forEach(button => {
        if (button.textContent.includes('믿을수 없어')) {
            button.style.display = 'none';
        }
    });
}

// 공유카드 메타태그 업데이트
function updateShareCardMeta(userName, isOwner) {
    if (!userName) return;
    
    const decodedName = decodeURIComponent(userName);
    
    // 모든 공유카드는 동일한 형식
    const newTitle = `${decodedName}님이 전설템을 획득했습니다. - 이세계 탑티어 프리랜서`;
    const newDescription = '내 전설템 획득하기';
    
    // 메타태그 업데이트
    updateMetaTag('og:title', newTitle);
    updateMetaTag('twitter:title', newTitle);
    updateMetaTag('og:description', newDescription);
    updateMetaTag('twitter:description', newDescription);
}

// 메타태그 업데이트 헬퍼 함수
function updateMetaTag(property, content) {
    // Open Graph 메타태그
    let metaTag = document.querySelector(`meta[property="${property}"]`);
    if (metaTag) {
        metaTag.setAttribute('content', content);
    }
    
    // Twitter Card 메타태그
    metaTag = document.querySelector(`meta[name="${property}"]`);
    if (metaTag) {
        metaTag.setAttribute('content', content);
    }
}

// 결과 공유하기
function shareResult() {
    const urlParams = new URLSearchParams(window.location.search);
    const isOwner = urlParams.get('owner') === 'true';
    const userName = urlParams.get('name') || '당신';
    
    // 공유할 URL 생성 (이름 포함, owner 파라미터 제거)
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?name=${encodeURIComponent(userName)}`;
    
    // 디버깅용 로그
    console.log('공유 URL:', shareUrl);
    console.log('사용자 이름:', userName);
    
    // 공유할 때 사용할 제목과 설명
    const shareTitle = `${decodeURIComponent(userName)}님이 전설템을 획득했습니다.`;
    const shareText = '내 전설템 획득하기';
    
    if (navigator.share) {
        navigator.share({
            title: shareTitle,
            text: shareText,
            url: shareUrl
        }).catch(err => {
            console.log('공유 실패:', err);
            // 사용자가 취소한 경우가 아닌 경우에만 클립보드 복사
            if (err.name !== 'AbortError') {
                fallbackShare(shareUrl);
            }
        });
    } else {
        fallbackShare(shareUrl);
    }
}

// 공유 대체 기능 (클립보드 복사)
function fallbackShare(shareUrl) {
    // 포커스를 문서에 주고 클립보드 복사 시도
    document.body.focus();
    
    // 링크만 복사
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('링크가 클립보드에 복사되었습니다!');
        }).catch(err => {
            console.log('클립보드 복사 실패:', err);
            // 클립보드 API 실패 시 수동 복사 안내
            promptManualCopy(shareUrl);
        });
    } else {
        // 클립보드 API 미지원 시 수동 복사 안내
        promptManualCopy(shareUrl);
    }
}

// 수동 복사 안내
function promptManualCopy(shareUrl) {
    const textArea = document.createElement('textarea');
    textArea.value = shareUrl;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        alert('링크가 복사되었습니다!');
    } catch (err) {
        alert(`링크를 수동으로 복사해주세요:\n\n${shareUrl}`);
    }
    
    document.body.removeChild(textArea);
}

// 앱 다운로드 - PBLZ 앱스토어로 이동
function downloadApp() {
    window.open('https://apps.apple.com/us/app/pblz-super-simple-work-tracker/id6738460309', '_blank');
}

// PBLZ 웹사이트로 이동
function goToPblzWebsite() {
    window.open('https://pblz.work/', '_blank');
}

// ===== 히든 인터렉션 관련 함수들 =====

// 히든 인터렉션 설정
function setupHiddenInteraction() {
    const resultImage = document.querySelector('.result-image');
    if (resultImage) {
        resultImage.addEventListener('click', handleHiddenInteraction);
        // 커서 변경으로 클릭 가능함을 암시
        resultImage.style.cursor = 'pointer';
    }
}

// 히든 인터랙션 처리
function handleHiddenInteraction() {
    clickCount++;
    
    // 점진적 효과 단계 계산 (2단계로 제한)
    const effectStage = Math.min(clickCount, maxEffectStages);
    const progress = effectStage / maxEffectStages;
    
    // 속도 증가 (1배에서 2배까지)
    currentSpeed = 1 + progress;
    
    // 로띠 애니메이션 속도 변경
    updateLottieSpeed();
    
    // 로띠 애니메이션 색상 변경
    updateLottieColor();
    
    // 이미지 변화 효과 적용
    updateImageEffects();
    
    // 클릭할 때마다 흔들거리는 효과
    triggerShakeEffect();
    
    // 제목 텍스트 변경 (강화된 전설템)
    updateTitleText();
    
    // 클릭 수 표시 (디버깅용, 나중에 제거 가능)
    console.log(`히든 인터랙션: ${clickCount}회 클릭, 효과 단계: ${effectStage}/${maxEffectStages}, 속도: ${currentSpeed.toFixed(2)}x`);
}

// 로띠 애니메이션 속도 업데이트
function updateLottieSpeed() {
    const lottiePlayers = document.querySelectorAll('dotlottie-player');
    lottiePlayers.forEach(player => {
        if (player.src && (player.src.includes('effect.lottie') || player.src.includes('effect2.lottie'))) {
            player.speed = currentSpeed;
        }
    });
}

// 로띠 애니메이션 색상 업데이트
function updateLottieColor() {
    const effectStage = Math.min(clickCount, maxEffectStages);
    const progress = effectStage / maxEffectStages;
    
    // 로띠 플레이어에 직접 색상 적용
    const lottiePlayers = document.querySelectorAll('dotlottie-player');
    lottiePlayers.forEach(player => {
        if (player.src && (player.src.includes('effect.lottie') || player.src.includes('effect2.lottie'))) {
            try {
                // 색상 변경을 위한 필터 적용
                // 노란색(60도)에서 빨간색(0도)으로 점진적 변경
                const hueRotation = 60 - (progress * 60); // 60도 → 0도
                
                player.style.filter = `hue-rotate(${hueRotation}deg)`;
            } catch (e) {
                // 에러 무시 (일부 로띠 플레이어는 색상 변경을 지원하지 않음)
            }
        }
    });
}

// 이미지 변화 효과 적용
function updateImageEffects() {
    const effectStage = Math.min(clickCount, maxEffectStages);
    const progress = effectStage / maxEffectStages;
    const resultImage = document.querySelector('.result-image');
    
    if (resultImage) {
        // 크기 변화: 1.0 → 1.2 (20% 증가)
        const scale = 1 + (progress * 0.2);
        
        // 회전 변화: 0도 → ±15도
        const rotation = (progress * 15) * (clickCount % 2 === 0 ? 1 : -1);
        
        // 밝기 변화: 1.0 → 1.3 (30% 증가)
        const brightness = 1 + (progress * 0.3);
        
        // 대비 변화: 1.0 → 1.2 (20% 증가)
        const contrast = 1 + (progress * 0.2);
        
        // 이미지에 변화 적용
        resultImage.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
        resultImage.style.filter = `brightness(${brightness}) contrast(${contrast})`;
        
        // 부드러운 전환 효과
        resultImage.style.transition = 'all 0.3s ease';
    }
}

// 클릭할 때마다 흔들거리는 효과
function triggerShakeEffect() {
    const resultImage = document.querySelector('.result-image');
    
    if (resultImage) {
        // 현재 적용된 transform과 filter 값 가져오기
        const currentTransform = resultImage.style.transform || '';
        const currentFilter = resultImage.style.filter || '';
        
        // 흔들거리는 애니메이션 적용
        resultImage.style.animation = 'shakeEffect 0.3s ease-in-out';
        
        // 애니메이션 완료 후 제거하고 기존 효과 복원
        setTimeout(() => {
            resultImage.style.animation = '';
            // 기존 transform과 filter 복원
            resultImage.style.transform = currentTransform;
            resultImage.style.filter = currentFilter;
        }, 300);
    }
}

// 제목 텍스트 변경 (강화된 전설템)
function updateTitleText() {
    const resultTitleElement = document.querySelector('.result-title-text');
    
    if (resultTitleElement) {
        const currentText = resultTitleElement.textContent;
        
        // 강화 단계 계산
        const upgradeLevel = Math.min(clickCount, maxUpgradeLevel);
        
        if (upgradeLevel === 0) {
            // 기본 상태 (변경 없음)
            return;
        } else if (upgradeLevel === 1) {
            // 1단계 강화
            if (currentText.includes('님의 전설템!') && !currentText.includes('강화된')) {
                const userName = currentText.split('님의')[0];
                const itemName = currentText.split('님의 전설템!')[1].trim();
                const newText = `${userName}님의 강화된 전설템!\n${itemName}`;
                resultTitleElement.textContent = newText;
            }
        } else if (upgradeLevel === 2) {
            // 2단계 강화
            if (currentText.includes('강화된 전설템!') && !currentText.includes('더욱 강화된')) {
                const userName = currentText.split('님의')[0];
                const itemName = currentText.split('강화된 전설템!')[1].trim();
                const newText = `${userName}님의 더욱 강화된 전설템!\n${itemName}`;
                resultTitleElement.textContent = newText;
            }
        }
        
        // 3번째 클릭부터는 시스템 팝업 표시 (1회만)
        if (clickCount >= 3 && !hasShownPopup) {
            alert('더 이상 강화할 수 없습니다!\n전설템이 이미 최대 강화 상태입니다.');
            hasShownPopup = true; // 팝업 표시 완료 표시
        }
    }
}

// 최대 강화 팝업 표시 (시스템 팝업으로 대체됨)
/*
function showMaxUpgradePopup() {
    // 팝업 요소 생성
    const popup = document.createElement('div');
    popup.className = 'max-upgrade-popup';
    popup.innerHTML = `
        <div class="max-upgrade-content">
            <h3>더 이상 강화할 수 없습니다!</h3>
            <p>전설템이 이미 최대 강화 상태입니다.</p>
            <button onclick="this.parentElement.parentElement.remove()">확인</button>
        </div>
    `;
    
    // 팝업을 body에 추가
    document.body.appendChild(popup);
    
    // 3초 후 자동으로 제거
    setTimeout(() => {
        if (popup.parentElement) {
            popup.remove();
        }
    }, 3000);
}
*/

// 최대 효과 표시
function showMaxEffect() {
    // 특별한 시각적 효과 (예: 깜빡임, 크기 변화 등)
    const resultImage = document.querySelector('.result-image');
    if (resultImage) {
        resultImage.style.animation = 'maxEffect 0.5s ease-in-out';
        
        // 애니메이션 완료 후 제거
        setTimeout(() => {
            resultImage.style.animation = '';
        }, 500);
    }
}
