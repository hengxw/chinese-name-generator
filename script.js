// 中文取名神器主逻辑

// 获取汉字笔画数（简化算法）
function getStrokeCount(char) {
    const strokeMap = {
        '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
        '文': 4, '武': 8, '博': 12, '学': 8, '才': 3, '智': 12, '慧': 15, '聪': 17, '明': 8,
        '志': 7, '鸿': 17, '远': 17, '达': 16, '成': 6, '功': 5, '建': 8, '立': 5,
        '美': 9, '丽': 7, '雅': 12, '静': 16, '洁': 9, '纯': 7, '真': 10, '善': 12,
        '诗': 13, '书': 10, '画': 8, '琴': 12, '婷': 12, '娜': 10, '柔': 5, '花': 7,
        '月': 4, '星': 9, '云': 4, '雪': 11, '玉': 5, '莲': 13, '兰': 5, '菊': 11
    };
    return strokeMap[char] || Math.floor(Math.random() * 15) + 3; // 默认随机3-17画
}

// 计算姓名总笔画
function getTotalStrokes(fullName) {
    return fullName.split('').reduce((total, char) => total + getStrokeCount(char), 0);
}

// 评估发音好听度
function evaluatePronunciation(surname, firstName) {
    const fullName = surname + firstName;
    let score = 80; // 基础分

    // 检查是否有重复字
    const chars = fullName.split('');
    const uniqueChars = [...new Set(chars)];
    if (uniqueChars.length < chars.length) {
        score -= 15;
    }

    // 检查音调组合（简化处理）
    const lastChar = fullName[fullName.length - 1];
    const toneEndings = ['安', '宁', '康', '乐', '福', '寿', '喜', '财'];
    if (toneEndings.includes(lastChar)) {
        score += 10;
    }

    return Math.min(100, Math.max(60, score));
}

// 评估寓意得分
function evaluateMeaning(firstName) {
    let score = 70; // 基础分

    const chars = firstName.split('');
    chars.forEach(char => {
        if (meanings[char]) {
            score += 15;
        }
    });

    return Math.min(100, Math.max(60, score));
}

// 评估字形结构
function evaluateStructure(fullName) {
    let score = 75; // 基础分

    // 检查笔画数是否合理
    const totalStrokes = getTotalStrokes(fullName);
    if (totalStrokes >= 20 && totalStrokes <= 35) {
        score += 15;
    } else if (totalStrokes < 15 || totalStrokes > 40) {
        score -= 10;
    }

    return Math.min(100, Math.max(60, score));
}

// 评估独特性
function evaluateUniqueness(firstName) {
    let score = 75; // 基础分

    // 简单的独特性评估
    const commonNames = ['小明', '小红', '小李', '小王', '小张'];
    if (commonNames.includes(firstName)) {
        score -= 20;
    }

    // 如果包含现代流行字，稍微加分
    const modernChars = ['轩', '宇', '涵', '萱', '琪', '瑶'];
    const chars = firstName.split('');
    chars.forEach(char => {
        if (modernChars.includes(char)) {
            score += 5;
        }
    });

    return Math.min(100, Math.max(60, score));
}

// 评估传统文化得分
function evaluateTradition(firstName) {
    let score = 70; // 基础分

    const traditionalChars = ['德', '仁', '义', '礼', '智', '信', '忠', '孝', '廉', '洁'];
    const chars = firstName.split('');

    chars.forEach(char => {
        if (traditionalChars.includes(char)) {
            score += 10;
        }
    });

    return Math.min(100, Math.max(60, score));
}

// 计算综合评分
function calculateScore(surname, firstName) {
    const pronunciation = evaluatePronunciation(surname, firstName);
    const meaning = evaluateMeaning(firstName);
    const structure = evaluateStructure(surname + firstName);
    const uniqueness = evaluateUniqueness(firstName);
    const tradition = evaluateTradition(firstName);

    const totalScore =
        pronunciation * scoreWeights.pronunciation +
        meaning * scoreWeights.meaning +
        structure * scoreWeights.structure +
        uniqueness * scoreWeights.uniqueness +
        tradition * scoreWeights.tradition;

    return Math.round(totalScore);
}

// 随机选择字符
function getRandomChar(charArray) {
    return charArray[Math.floor(Math.random() * charArray.length)];
}

// 根据偏好生成候选字符
function getCandidateChars(gender, preferences) {
    const baseChars = gender === 'male' ? maleChars : femaleChars;
    let candidates = [];

    // 如果有偏好，优先从偏好类别选择
    if (preferences.length > 0) {
        preferences.forEach(pref => {
            switch(pref) {
                case 'traditional':
                    candidates.push(...(baseChars.virtue || []));
                    break;
                case 'modern':
                    candidates.push(...(baseChars.talent || []));
                    break;
                case 'literary':
                    candidates.push(...(baseChars.nature || []));
                    break;
                case 'lucky':
                    candidates.push(...(baseChars.character || []));
                    break;
            }
        });
    }

    // 如果没有偏好或候选字符不够，从所有类别补充
    if (candidates.length < 10) {
        Object.values(baseChars).forEach(charArray => {
            candidates.push(...charArray);
        });
    }

    return [...new Set(candidates)]; // 去重
}

// 生成单字名
function generateSingleCharName(surname, gender, preferences) {
    const candidates = getCandidateChars(gender, preferences);
    const char = getRandomChar(candidates);
    const meaning = meanings[char] || '寓意吉祥，前程似锦';
    const score = calculateScore(surname, char);

    return {
        name: char,
        fullName: surname + char,
        meaning: meaning,
        score: score
    };
}

// 生成双字名
function generateDoubleCharName(surname, gender, preferences) {
    const combinations = goodCombinations[gender];

    // 30% 概率使用预设的好组合
    if (Math.random() < 0.3 && combinations.length > 0) {
        const combination = combinations[Math.floor(Math.random() * combinations.length)];
        const score = calculateScore(surname, combination.name);
        return {
            name: combination.name,
            fullName: surname + combination.name,
            meaning: combination.meaning,
            score: score
        };
    }

    // 70% 概率随机组合
    const candidates = getCandidateChars(gender, preferences);
    const char1 = getRandomChar(candidates);
    const char2 = getRandomChar(candidates.filter(c => c !== char1));
    const firstName = char1 + char2;

    const meaning1 = meanings[char1] || '';
    const meaning2 = meanings[char2] || '';
    const combinedMeaning = meaning1 && meaning2 ?
        `${meaning1.split('，')[0]}，${meaning2.split('，')[0]}` :
        '寓意吉祥，前程美好';

    const score = calculateScore(surname, firstName);

    return {
        name: firstName,
        fullName: surname + firstName,
        meaning: combinedMeaning,
        score: score
    };
}

// 主要的取名生成函数
function generateNames() {
    const surname = document.getElementById('surname').value.trim();
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const birthDate = document.getElementById('birthDate').value;

    // 获取选中的偏好
    const preferenceCheckboxes = document.querySelectorAll('.preference-options input[type="checkbox"]:checked');
    const preferences = Array.from(preferenceCheckboxes).map(cb => cb.value);

    // 验证输入
    if (!surname) {
        alert('请输入姓氏！');
        return;
    }

    if (surname.length > 2) {
        alert('姓氏最多支持2个字！');
        return;
    }

    // 显示加载状态
    const generateBtn = document.querySelector('.generate-btn');
    const originalText = generateBtn.innerHTML;
    generateBtn.innerHTML = '<span class="loading"></span> 正在生成...';
    generateBtn.disabled = true;

    // 模拟生成延迟，提升用户体验
    setTimeout(() => {
        const nameList = [];

        // 生成6个名字（3个单字，3个双字）
        for (let i = 0; i < 3; i++) {
            nameList.push(generateSingleCharName(surname, gender, preferences));
        }

        for (let i = 0; i < 3; i++) {
            nameList.push(generateDoubleCharName(surname, gender, preferences));
        }

        // 按评分排序
        nameList.sort((a, b) => b.score - a.score);

        // 显示结果
        displayResults(nameList);

        // 恢复按钮状态
        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;

    }, 1500);
}

// 显示取名结果
function displayResults(nameList) {
    const resultsContainer = document.getElementById('resultsContainer');
    const namesGrid = document.getElementById('namesGrid');

    // 清空之前的结果
    namesGrid.innerHTML = '';

    // 创建名字卡片
    nameList.forEach((nameInfo, index) => {
        const nameCard = document.createElement('div');
        nameCard.className = 'name-card';
        nameCard.style.animationDelay = `${index * 0.1}s`;

        let scoreColor = '#4CAF50'; // 绿色
        if (nameInfo.score < 80) scoreColor = '#FF9800'; // 橙色
        if (nameInfo.score < 70) scoreColor = '#F44336'; // 红色

        nameCard.innerHTML = `
            <div class="name">${nameInfo.fullName}</div>
            <div class="meaning">${nameInfo.meaning}</div>
            <div class="score" style="background-color: ${scoreColor}">
                综合评分: ${nameInfo.score}分
            </div>
        `;

        // 添加点击复制功能
        nameCard.addEventListener('click', function() {
            copyToClipboard(nameInfo.fullName);
            showToast(`已复制"${nameInfo.fullName}"到剪贴板`);
        });

        namesGrid.appendChild(nameCard);
    });

    // 显示结果区域
    resultsContainer.style.display = 'block';
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

// 复制到剪贴板
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        // 降级方案
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

// 显示提示消息
function showToast(message) {
    // 创建提示元素
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 20px;
        border-radius: 20px;
        font-size: 14px;
        z-index: 10000;
        animation: fadeInOut 2s ease-in-out;
    `;
    toast.textContent = message;

    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            10%, 90% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(toast);

    // 2秒后移除
    setTimeout(() => {
        document.body.removeChild(toast);
        document.head.removeChild(style);
    }, 2000);
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 设置当前日期为默认值
    const birthDateInput = document.getElementById('birthDate');
    const today = new Date();
    const maxDate = today.toISOString().split('T')[0];
    birthDateInput.max = maxDate;

    // 姓氏输入框事件
    const surnameInput = document.getElementById('surname');

    // 输入法状态跟踪
    let isComposing = false;

    // 输入法开始事件
    surnameInput.addEventListener('compositionstart', function() {
        isComposing = true;
        console.log('拼音输入开始');
    });

    // 输入法结束事件
    surnameInput.addEventListener('compositionend', function() {
        isComposing = false;
        console.log('拼音输入结束，当前值:', this.value);
        // 输入法结束后进行验证和限制
        validateAndLimitInput.call(this);
    });

    // 输入事件处理
    surnameInput.addEventListener('input', function() {
        console.log('Input event triggered, value:', this.value, 'isComposing:', isComposing);
        // 只有在非输入法状态下才进行长度限制
        if (!isComposing) {
            validateAndLimitInput.call(this);
        }
    });

    // 验证和限制输入的函数
    function validateAndLimitInput() {
        let value = this.value;

        // 移除非中文字符（包含更广泛的中文字符范围）
        value = value.replace(/[^\u4e00-\u9fff\u3400-\u4dbf]/g, '');

        // 限制最大长度为2个字符
        if (value.length > 2) {
            value = value.substring(0, 2);
        }

        // 只有当值发生变化时才更新
        if (this.value !== value) {
            this.value = value;
            console.log('输入已清理和限制，最终值:', value);
        }
    }

    // 当失去焦点时再次验证
    surnameInput.addEventListener('blur', function() {
        console.log('失去焦点时验证，当前值:', this.value);
        validateAndLimitInput.call(this);
    });

    // 回车键触发生成
    surnameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateNames();
        }
    });

    console.log('中文取名神器初始化完成！');
});