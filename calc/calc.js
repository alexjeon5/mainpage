// 계산기 상태 변수
const display = document.getElementById('display');
let currentExpression = '';
let shouldResetDisplay = false;
let isCalculating = false;
let calculationCount = 0; 

function updateDisplay(value) { display.value = value; }

function appendNumber(number) {
    if (isCalculating) return;
    if (display.value === '0' || shouldResetDisplay || display.value === 'Error') {
        currentExpression = number;
        updateDisplay(currentExpression);
        shouldResetDisplay = false;
    } else {
        currentExpression += number;
        updateDisplay(currentExpression);
    }
}

function appendOperator(operator) {
    if (isCalculating) return;
    if (currentExpression === '' && display.value !== '0') { currentExpression = display.value; }
    const lastChar = currentExpression.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
        currentExpression = currentExpression.slice(0, -1) + operator;
    } else { currentExpression += operator; }
    updateDisplay(currentExpression);
    shouldResetDisplay = false;
}

function calculate() {
    if (currentExpression === '' || isCalculating) return;
    
    // 무료 이용 1회 제한 모달 띄우기
    if (calculationCount >= 1) {
        document.getElementById('payment-overlay').classList.add('active');
        document.getElementById('payment-modal').classList.add('active');
        
        clearErrorStyles(); // 모달 오픈 시 기존 에러 스타일 초기화

        // Apple Pay 지원 기기 체크
        const isApplePaySupported = window.ApplePaySession && ApplePaySession.canMakePayments();
        const applePayBtn = document.getElementById('apple-pay-btn');
        const applePayDivider = document.getElementById('apple-pay-divider');

        if (isApplePaySupported) {
            applePayBtn.style.display = 'flex';
            applePayDivider.style.display = 'flex';
        } else {
            applePayBtn.style.display = 'none';
            applePayDivider.style.display = 'none';
        }
        return; 
    }
    executeCalculation();
}

function executeCalculation() {
    isCalculating = true;
    document.getElementById('thinking-overlay').classList.add('active');
    document.getElementById('thinking-modal').classList.add('active');
    
    setTimeout(() => {
        try {
            let result = new Function('return ' + currentExpression)();
            result = Math.round(result * 10000000000) / 10000000000;
            updateDisplay(result);
            currentExpression = result.toString();
            shouldResetDisplay = true;
            calculationCount++; 
        } catch (error) {
            updateDisplay('Error');
            currentExpression = '';
            shouldResetDisplay = true;
        } finally {
            document.getElementById('thinking-overlay').classList.remove('active');
            document.getElementById('thinking-modal').classList.remove('active');
            isCalculating = false;
        }
    }, 2000);
}

function clearDisplay() {
    if (isCalculating) return;
    currentExpression = '';
    updateDisplay('0');
    shouldResetDisplay = false;
}

// ==========================================
// 🌟 카드 폼 검증 알고리즘 (BIN, Luhn, Date)
// ==========================================
function isValidLuhn(cardNumber) {
    let sum = 0;
    let isEven = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i), 10);
        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        isEven = !isEven;
    }
    return (sum % 10) === 0;
}

function isExpiryValid(expiry) {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    const [month, year] = expiry.split('/').map(Number);
    if (month < 1 || month > 12) return false;

    // 현재 기준 (26년 6월)
    const currentYear = 26; 
    const currentMonth = 6; 

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
}

function isValidBin(cardNumber) {
    const customBinRegex = /^(4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|35[0-9]{14})$/;
    return customBinRegex.test(cardNumber);
}

// ==========================================
// 실시간 입력 피드백 및 에러 처리 이벤트
// ==========================================
document.getElementById('card-number').addEventListener('input', function (e) {
    let val = e.target.value.replace(/\D/g, ''); 
    
    // 브랜드 로고 변환
    const logoIcon = document.getElementById('card-brand-icon');
    if (logoIcon) {
        logoIcon.className = 'fa-solid fa-credit-card card-logo-icon';
        if (val.startsWith('4')) {
            logoIcon.className = 'fa-brands fa-cc-visa card-logo-icon';
        } else if (/^(5[1-5]|2[2-7])/.test(val)) {
            logoIcon.className = 'fa-brands fa-cc-mastercard card-logo-icon';
        } else if (/^(34|37)/.test(val)) {
            logoIcon.className = 'fa-brands fa-cc-amex card-logo-icon';
        } else if (/^(6011|65|64[4-9]|622)/.test(val)) {
            logoIcon.className = 'fa-brands fa-cc-discover card-logo-icon';
        } else if (/^(352[89]|35[3-8][0-9])/.test(val)) {
            logoIcon.className = 'fa-brands fa-cc-jcb card-logo-icon';
        }
    }

    // 실시간 검증
    if (val.length >= 15) {
        if (!isValidBin(val) || !isValidLuhn(val)) {
            this.classList.add('input-error');
        } else {
            this.classList.remove('input-error');
        }
    } else {
        this.classList.remove('input-error');
    }

    // 포맷팅
    val = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = val;
});

document.getElementById('card-expiry').addEventListener('input', function (e) {
    let val = e.target.value.replace(/\D/g, ''); 
    if (val.length > 2) { val = val.substring(0, 2) + '/' + val.substring(2, 4); }
    e.target.value = val;

    if (val.length === 5) { 
        if (!isExpiryValid(val)) {
            this.classList.add('input-error');
        } else {
            this.classList.remove('input-error');
        }
    } else {
        this.classList.remove('input-error');
    }
});

document.getElementById('card-cvc').addEventListener('input', function (e) {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
    if (e.target.value.length === 3) this.classList.remove('input-error');
});

document.getElementById('card-pwd').addEventListener('input', function (e) {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 2);
    if (e.target.value.length === 2) this.classList.remove('input-error');
});

function clearErrorStyles() {
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}

// ==========================================
// 결제 프로세스 모의 구동
// ==========================================
function closePaymentModal() {
    document.getElementById('payment-overlay').classList.remove('active');
    document.getElementById('payment-modal').classList.remove('active');
}

function processApplePay() {
    const appleBtn = document.getElementById('apple-pay-btn');
    const originalHTML = appleBtn.innerHTML;
    
    appleBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="font-size: 1.25rem;"></i> <span style="font-size: 1rem; font-weight: 500; margin-left: 5px;">Face ID / Touch ID...</span>';
    appleBtn.disabled = true;

    setTimeout(() => {
        alert(' Apple Pay 결제가 성공적으로 완료되었습니다!\n1회 계산이 진행됩니다.');
        closePaymentModal();
        appleBtn.innerHTML = originalHTML; 
        appleBtn.disabled = false;
        executeCalculation(); 
    }, 2000);
}

function processCardPayment() {
    const numInput = document.getElementById('card-number');
    const expiryInput = document.getElementById('card-expiry');
    const cvcInput = document.getElementById('card-cvc');
    const pwdInput = document.getElementById('card-pwd');

    const num = numInput.value.replace(/\D/g, ''); 
    const expiry = expiryInput.value;
    const cvc = cvcInput.value;
    const pwd = pwdInput.value;

    clearErrorStyles();

    if (num.length < 13) {
        numInput.classList.add('input-error');
        alert('카드 번호를 정확히 입력해주세요.');
        return;
    }
    if (expiry.length < 5) {
        expiryInput.classList.add('input-error');
        alert('유효기간을 정확히 입력해주세요.');
        return;
    }
    if (cvc.length < 3) {
        cvcInput.classList.add('input-error');
        alert('CVC 코드를 정확히 입력해주세요.');
        return;
    }
    if (pwd.length < 2) {
        pwdInput.classList.add('input-error');
        alert('비밀번호 앞 2자리를 정확히 입력해주세요.');
        return;
    }

    if (!isValidBin(num)) {
        numInput.classList.add('input-error');
        alert('지원하지 않거나 유효하지 않은 카드사 규격(BIN)입니다.');
        return;
    }
    if (!isValidLuhn(num)) {
        numInput.classList.add('input-error');
        alert('카드 번호 규칙(Luhn 알고리즘)에 맞지 않습니다. 번호를 다시 확인해주세요.');
        return;
    }

    if (!isExpiryValid(expiry)) {
        expiryInput.classList.add('input-error');
        alert('유효기간이 이미 만료되었거나 형식이 올바르지 않습니다.');
        return;
    }

    // 모의 결제 성공 처리
    const btn = document.getElementById('pay-submit-btn');
    const cancelBtn = document.querySelector('.btn-secondary');
    const originalHTML = btn.innerHTML;
    
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 처리중...';
    btn.disabled = true;
    cancelBtn.disabled = true;

    setTimeout(() => {
        alert('✅ 카드 결제가 승인되었습니다!\n1회 계산이 진행됩니다.');
        closePaymentModal();
        
        numInput.value = '';
        const logoIcon = document.getElementById('card-brand-icon');
        if (logoIcon) logoIcon.className = 'fa-solid fa-credit-card card-logo-icon';
        
        expiryInput.value = '';
        cvcInput.value = '';
        pwdInput.value = '';
        
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        cancelBtn.disabled = false;
        
        executeCalculation(); 
    }, 1500); 
}