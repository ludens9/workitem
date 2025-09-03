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
    
    console.log('현재 URL:', window.location.href); // 디버깅용
    console.log('URL 파라미터:', window.location.search); // 디버깅용
    console.log('userName:', userName); // 디버깅용
    console.log('isOwner:', isOwner); // 디버깅용
    
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
    
    // 두번째 섹션 타이틀 개인화
    console.log('updateDescriptionTitle 호출 전, userName:', userName); // 디버깅용
    updateDescriptionTitle(userName);
    
    // 동료영역 문구 변경
    updateColleagueTexts();
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
        // 친구 결과를 보는 경우 - 나도 획득하기만
        buttonArea.innerHTML = `
            <button class="result-share-button btn_a h2w" onclick="goToMainTest()">나도 획득하기</button>
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

// 공유카드 메타태그 업데이트 (더 이상 사용하지 않음 - 정적 메타태그로 통일)
function updateShareCardMeta(userName, isOwner) {
    // 정적 메타태그로 통일했으므로 이 함수는 더 이상 사용하지 않음
    return;
}

// 두번째 섹션 타이틀 개인화 함수
function updateDescriptionTitle(userName) {
    console.log('updateDescriptionTitle 함수 실행됨, userName:', userName); // 디버깅용
    const descriptionTitleElement = document.querySelector('.description-title h3');
    console.log('descriptionTitleElement 찾음:', descriptionTitleElement); // 디버깅용
    if (descriptionTitleElement && userName) {
        const originalText = descriptionTitleElement.innerHTML;
        console.log('원본 텍스트:', originalText); // 디버깅용
        
        // 기존 텍스트에서 아이템 이름 추출 (간단한 방법)
        let itemName = '';
        
        // 첫 번째 줄에서 "아이템명을" 패턴 추출
        const lines = originalText.split('<br>');
        if (lines.length > 0) {
            const firstLine = lines[0];
            console.log('첫 번째 줄:', firstLine); // 디버깅용
            // "을" 또는 "를" 패턴으로 수정
            const itemNameMatch = firstLine.match(/([^을를]+)[을를]/);
            if (itemNameMatch) {
                itemName = itemNameMatch[1].trim();
            }
        }
        
        console.log('추출된 아이템 이름:', itemName); // 디버깅용
        
        if (itemName) {
            const newText = `${decodeURIComponent(userName)}님이 ${itemName}를<br>획득하였습니다.<br>아래의 업무능력이 '증폭'됩니다.`;
            descriptionTitleElement.innerHTML = newText;
            console.log('수정된 텍스트:', newText); // 디버깅용
        } else {
            console.log('아이템 이름을 찾을 수 없습니다. 원본:', originalText); // 디버깅용
        }
    } else {
        console.log('요소를 찾을 수 없거나 사용자 이름이 없습니다.'); // 디버깅용
    }
}

// 동료영역 문구 변경 함수
function updateColleagueTexts() {
    // "이런 사람을 찾으세요" → "good friend"
    const goodFriendElements = document.querySelectorAll('.colleague-info p.h2b');
    goodFriendElements.forEach(element => {
        if (element.textContent.includes('이런 사람을 찾으세요')) {
            element.textContent = 'good friend';
        }
    });
    
    // "이런 사람을 멀리하세요" → "bad friend"
    const badFriendElements = document.querySelectorAll('.colleague-info p.h2b');
    badFriendElements.forEach(element => {
        if (element.textContent.includes('이런 사람을 멀리하세요')) {
            element.textContent = 'bad friend';
        }
    });
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
    
    // 현재 페이지의 결과 정보 가져오기
    const resultTitleElement = document.querySelector('.result-title-text');
    let itemName = '';
    if (resultTitleElement) {
        const titleText = resultTitleElement.textContent;
        // 강화된 전설템인 경우도 처리
        if (titleText.includes('더욱 강화된 전설템!')) {
            itemName = titleText.split('더욱 강화된 전설템!')[1]?.trim() || '';
        } else if (titleText.includes('강화된 전설템!')) {
            itemName = titleText.split('강화된 전설템!')[1]?.trim() || '';
        } else {
            itemName = titleText.split('님의 전설템!')[1]?.trim() || '';
        }
    }
    
    // 개인화된 공유 메시지 생성
    const shareMessage = `${decodeURIComponent(userName)}님의 전설템은 <${itemName}>입니다.`;
    
    // 모바일에서만 네이티브 공유 사용, 데스크탑에서는 바로 클립보드 복사
    if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        navigator.share({
            title: shareMessage,
            url: shareUrl
        }).catch(err => {
            console.log('공유 실패:', err);
            // 사용자가 취소한 경우가 아닌 경우에만 클립보드 복사
            if (err.name !== 'AbortError') {
                fallbackShare(shareUrl, shareMessage);
            }
        });
    } else {
        // 데스크탑에서는 시스템 팝업으로 "복사되었습니다" 메시지 표시
        fallbackShareWithSystemPopup(shareUrl, shareMessage);
    }
}

// 데스크탑용 공유 기능 (시스템 팝업으로 "복사되었습니다" 표시)
function fallbackShareWithSystemPopup(shareUrl, shareMessage) {
    // 개인화 메시지 + URL을 함께 복사
    const fullShareText = `${shareMessage}\n\n${shareUrl}`;
    
    // 포커스를 문서에 주고 클립보드 복사 시도
    document.body.focus();
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullShareText).then(() => {
            alert('복사되었습니다');
        }).catch(err => {
            console.log('클립보드 복사 실패:', err);
            promptManualCopy(fullShareText);
        });
    } else {
        promptManualCopy(fullShareText);
    }
}

// 공유 대체 기능 (클립보드 복사)
function fallbackShare(shareUrl, shareMessage) {
    // 포커스를 문서에 주고 클립보드 복사 시도
    document.body.focus();
    
    // 개인화된 메시지만 복사 (링크 제거)
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareMessage).then(() => {
            // 복사 성공 토스트 표시
            showCopyToast('개인화된 메시지가 복사되었습니다!');
        }).catch(err => {
            console.log('클립보드 복사 실패:', err);
            // 클립보드 API 실패 시 수동 복사 안내
            promptManualCopy(shareMessage);
        });
    } else {
        // 클립보드 API 미지원 시 수동 복사 안내
        promptManualCopy(shareMessage);
    }
}

// 수동 복사 안내
function promptManualCopy(shareMessage) {
    const textArea = document.createElement('textarea');
    textArea.value = shareMessage;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        // 복사 성공 토스트 표시
        showCopyToast('개인화된 메시지가 복사되었습니다!');
    } catch (err) {
        // 복사 실패 시에만 알림 표시
        alert(`메시지를 수동으로 복사해주세요:\n\n${shareMessage}`);
    }
    
    document.body.removeChild(textArea);
}

// 복사 토스트 표시 함수
function showCopyToast(message) {
    // 기존 토스트가 있으면 제거
    const existingToast = document.querySelector('.copy-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 토스트 요소 생성
    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.textContent = message;
    
    // 토스트 스타일 적용
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    `;
    
    // 토스트를 body에 추가
    document.body.appendChild(toast);
    
    // 페이드 인 효과
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);
    
    // 2초 후 페이드 아웃 및 제거
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 300);
    }, 2000);
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
