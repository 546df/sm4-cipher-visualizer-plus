
/**
 * Main application logic for SM4 Cipher Visualizer
 */

// Application state
let currentConfig = {
    mode: 'ECB',
    padding: 'PKCS7',
    outputFormat: 'hex',
    encoding: 'utf8'
};

let currentOperation = 'encrypt';
let processingResults = null;

// DOM Elements
const elements = {
    // Navigation
    navButtons: document.querySelectorAll('.nav-btn'),
    views: document.querySelectorAll('.view'),
    
    // Configuration
    operationRadios: document.querySelectorAll('input[name="operation"]'),
    modeSelect: document.getElementById('mode-select'),
    paddingSelect: document.getElementById('padding-select'),
    encodingSelect: document.getElementById('encoding-select'),
    outputFormatSelect: document.getElementById('output-format-select'),
    
    // Input
    inputText: document.getElementById('input-text'),
    keyInput: document.getElementById('key-input'),
    ivInput: document.getElementById('iv-input'),
    ivGroup: document.querySelector('.iv-group'),
    generateKeyBtn: document.getElementById('generate-key'),
    generateIvBtn: document.getElementById('generate-iv'),
    processBtn: document.getElementById('process-btn'),
    
    // Output
    outputText: document.getElementById('output-text'),
    copyResultBtn: document.getElementById('copy-result'),
    stats: document.getElementById('stats'),
    executionTime: document.getElementById('execution-time'),
    dataLength: document.getElementById('data-length'),
    blockCount: document.getElementById('block-count'),
    
    // Visualization
    stepsContainer: document.getElementById('steps-container')
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('SM4 Cipher Visualizer initialized');
    setupEventListeners();
    updateUIForOperation();
    setDefaultValues();
});

// Event listeners setup
function setupEventListeners() {
    // Navigation
    elements.navButtons.forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.view));
    });
    
    // Configuration
    elements.operationRadios.forEach(radio => {
        radio.addEventListener('change', handleOperationChange);
    });
    
    elements.modeSelect.addEventListener('change', handleConfigChange);
    elements.paddingSelect.addEventListener('change', handleConfigChange);
    elements.encodingSelect.addEventListener('change', handleConfigChange);
    elements.outputFormatSelect.addEventListener('change', handleConfigChange);
    
    // Input
    elements.generateKeyBtn.addEventListener('click', generateRandomKey);
    elements.generateIvBtn.addEventListener('click', generateRandomIV);
    elements.processBtn.addEventListener('click', processData);
    
    // Output
    elements.copyResultBtn.addEventListener('click', copyResult);
    
    // Real-time updates
    elements.inputText.addEventListener('input', updateProcessButton);
    elements.keyInput.addEventListener('input', updateProcessButton);
    elements.ivInput.addEventListener('input', updateProcessButton);
}

// Navigation
function switchView(viewName) {
    // Update navigation buttons
    elements.navButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewName);
    });
    
    // Update views
    elements.views.forEach(view => {
        view.classList.toggle('active', view.id === `${viewName}-view`);
    });
}

// Configuration handling
function handleOperationChange(event) {
    currentOperation = event.target.value;
    updateUIForOperation();
}

function handleConfigChange() {
    currentConfig.mode = elements.modeSelect.value;
    currentConfig.padding = elements.paddingSelect.value;
    currentConfig.encoding = elements.encodingSelect.value;
    currentConfig.outputFormat = elements.outputFormatSelect.value;
    
    updateUIForMode();
    updateProcessButton();
    console.log('Configuration updated:', currentConfig);
}

function updateUIForOperation() {
    const isEncrypt = currentOperation === 'encrypt';
    
    // Update button text
    elements.processBtn.textContent = isEncrypt ? '开始加密' : '开始解密';
    
    // Update input label
    const inputLabel = document.querySelector('label[for="input-text"]');
    inputLabel.textContent = isEncrypt ? '明文' : '密文';
    
    // Update placeholder
    elements.inputText.placeholder = isEncrypt ? '请输入要加密的文本...' : '请输入要解密的密文...';
    
    // Clear previous results
    clearResults();
    updateProcessButton();
}

function updateUIForMode() {
    const isCBC = currentConfig.mode === 'CBC';
    
    // Show/hide IV input for CBC mode
    if (isCBC) {
        elements.ivGroup.style.display = 'block';
        elements.ivGroup.classList.add('show');
    } else {
        elements.ivGroup.style.display = 'none';
        elements.ivGroup.classList.remove('show');
    }
    
    updateProcessButton();
}

function setDefaultValues() {
    // Set default key
    elements.keyInput.value = '0123456789abcdeffedcba9876543210';
    
    // Set default IV for CBC mode
    elements.ivInput.value = '0123456789abcdeffedcba9876543210';
    
    // Set default configuration
    handleConfigChange();
}

// Random generation
function generateRandomKey() {
    const randomBytes = new Array(16);
    for (let i = 0; i < 16; i++) {
        randomBytes[i] = Math.floor(Math.random() * 256);
    }
    elements.keyInput.value = bytesToHex(randomBytes);
    updateProcessButton();
}

function generateRandomIV() {
    const randomBytes = new Array(16);
    for (let i = 0; i < 16; i++) {
        randomBytes[i] = Math.floor(Math.random() * 256);
    }
    elements.ivInput.value = bytesToHex(randomBytes);
    updateProcessButton();
}

// Input validation and button state
function updateProcessButton() {
    const hasInput = elements.inputText.value.trim().length > 0;
    const hasValidKey = isValidHexString(elements.keyInput.value, 32);
    const hasValidIV = currentConfig.mode !== 'CBC' || isValidHexString(elements.ivInput.value, 32);
    
    const isValid = hasInput && hasValidKey && hasValidIV;
    
    elements.processBtn.disabled = !isValid;
    
    // Update visual feedback
    updateInputValidation();
}

function updateInputValidation() {
    // Key validation
    const keyValid = isValidHexString(elements.keyInput.value, 32);
    elements.keyInput.style.borderColor = keyValid ? '' : 'var(--error-color)';
    
    // IV validation (only for CBC mode)
    if (currentConfig.mode === 'CBC') {
        const ivValid = isValidHexString(elements.ivInput.value, 32);
        elements.ivInput.style.borderColor = ivValid ? '' : 'var(--error-color)';
    }
}

function isValidHexString(str, expectedLength) {
    const cleanStr = str.replace(/[^0-9a-fA-F]/g, '');
    return cleanStr.length === expectedLength && /^[0-9a-fA-F]+$/.test(cleanStr);
}

// Main processing function
async function processData() {
    const inputText = elements.inputText.value.trim();
    const keyHex = elements.keyInput.value.trim();
    const ivHex = elements.ivInput.value.trim();
    
    if (!inputText || !isValidHexString(keyHex, 32)) {
        showError('请检查输入数据和密钥格式');
        return;
    }
    
    if (currentConfig.mode === 'CBC' && !isValidHexString(ivHex, 32)) {
        showError('CBC模式需要有效的初始向量');
        return;
    }
    
    try {
        // Show loading state
        showLoading();
        
        const startTime = performance.now();
        
        let result;
        if (currentOperation === 'encrypt') {
            result = await encryptSM4(inputText, keyHex, currentConfig, currentConfig.mode === 'CBC' ? ivHex : undefined);
        } else {
            result = await decryptSM4(inputText, keyHex, currentConfig, currentConfig.mode === 'CBC' ? ivHex : undefined);
        }
        
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        // Store results
        processingResults = result;
        
        // Display results
        displayResults(result, executionTime);
        displayVisualization(result);
        
        hideLoading();
        
    } catch (error) {
        console.error('Processing error:', error);
        showError(error.message || '处理过程中发生错误');
        hideLoading();
    }
}

// Results display
function displayResults(result, executionTime) {
    const outputValue = currentOperation === 'encrypt' ? result.ciphertext : result.plaintext;
    elements.outputText.value = outputValue;
    
    // Update stats
    const inputLength = elements.inputText.value.length;
    const blockCount = Math.ceil(inputLength / 16);
    
    elements.executionTime.textContent = `${executionTime.toFixed(2)} ms`;
    elements.dataLength.textContent = `${inputLength} 字符`;
    elements.blockCount.textContent = `${blockCount} 个`;
    
    elements.stats.style.display = 'block';
}

function displayVisualization(result) {
    const container = elements.stepsContainer;
    container.innerHTML = '';
    
    if (result.steps && result.steps.length > 0) {
        result.steps.forEach(step => {
            const stepElement = createStepElement(step);
            container.appendChild(stepElement);
        });
    } else {
        container.innerHTML = '<p class="placeholder">暂无可视化数据</p>';
    }
}

function createStepElement(step) {
    const stepDiv = document.createElement('div');
    stepDiv.className = 'step-item';
    
    stepDiv.innerHTML = `
        <div class="step-header">
            <div class="step-number">${step.id}</div>
            <div class="step-title">${step.title}</div>
        </div>
        <div class="step-description">${step.description}</div>
        ${step.data ? createStepData(step.data) : ''}
    `;
    
    return stepDiv;
}

function createStepData(data) {
    let html = '<div class="step-data">';
    
    for (const [key, value] of Object.entries(data)) {
        if (value !== undefined && value !== null) {
            html += `
                <div class="data-item">
                    <span class="data-label">${key}:</span>
                    <span class="data-value">${formatDataValue(value)}</span>
                </div>
            `;
        }
    }
    
    html += '</div>';
    return html;
}

function formatDataValue(value) {
    if (Array.isArray(value)) {
        return bytesToHex(value);
    }
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return String(value);
}

// Utility functions
function copyResult() {
    elements.outputText.select();
    document.execCommand('copy');
    showSuccess('结果已复制到剪贴板');
}

function clearResults() {
    elements.outputText.value = '';
    elements.stats.style.display = 'none';
    elements.stepsContainer.innerHTML = '<p class="placeholder">执行算法后，这里将显示详细的步骤可视化</p>';
    processingResults = null;
}

function showLoading() {
    elements.processBtn.disabled = true;
    elements.processBtn.innerHTML = '<span class="loading"></span>处理中...';
}

function hideLoading() {
    elements.processBtn.disabled = false;
    elements.processBtn.textContent = currentOperation === 'encrypt' ? '开始加密' : '开始解密';
    updateProcessButton();
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    
    // Remove existing messages
    document.querySelectorAll('.error, .success').forEach(el => el.remove());
    
    // Add to results area
    elements.outputText.parentNode.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => errorDiv.remove(), 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    
    // Remove existing messages
    document.querySelectorAll('.error, .success').forEach(el => el.remove());
    
    // Add to results area
    elements.outputText.parentNode.appendChild(successDiv);
    
    // Auto-remove after 3 seconds
    setTimeout(() => successDiv.remove(), 3000);
}

// Simple SM4 encrypt/decrypt functions for demo
async function encryptSM4(plaintext, keyHex, config, ivHex) {
    // This is a simplified implementation for demo
    // In a real application, you would implement the full SM4 algorithm
    
    const steps = [
        {
            id: 1,
            title: '输入处理',
            description: `将${config.encoding}编码的明文转换为字节数组`,
            data: { plaintext, encoding: config.encoding }
        },
        {
            id: 2,
            title: '密钥扩展',
            description: '从主密钥生成32个轮密钥',
            data: { masterKey: keyHex }
        },
        {
            id: 3,
            title: '分组加密',
            description: `使用${config.mode}模式加密数据`,
            data: { mode: config.mode, padding: config.padding }
        },
        {
            id: 4,
            title: '输出格式化',
            description: `将加密结果转换为${config.outputFormat}格式`,
            data: { outputFormat: config.outputFormat }
        }
    ];
    
    // Simple demo encryption (not real SM4)
    const inputBytes = stringToBytes(plaintext, config.encoding);
    const paddedBytes = getPaddingFunction(config.padding)(inputBytes);
    const encryptedBytes = paddedBytes.map(b => b ^ 0x42); // Simple XOR for demo
    
    const ciphertext = config.outputFormat === 'hex' 
        ? bytesToHex(encryptedBytes)
        : bytesToBase64(encryptedBytes);
    
    return {
        ciphertext,
        steps,
        blocks: []
    };
}

async function decryptSM4(ciphertext, keyHex, config, ivHex) {
    const steps = [
        {
            id: 1,
            title: '密文处理',
            description: `将${config.outputFormat}格式的密文转换为字节数组`,
            data: { ciphertext, format: config.outputFormat }
        },
        {
            id: 2,
            title: '密钥扩展',
            description: '从主密钥生成32个轮密钥（与加密相同）',
            data: { masterKey: keyHex }
        },
        {
            id: 3,
            title: '分组解密',
            description: `使用${config.mode}模式解密数据`,
            data: { mode: config.mode }
        },
        {
            id: 4,
            title: '输出格式化',
            description: `将字节数组转换为${config.encoding}编码的文本`,
            data: { encoding: config.encoding }
        }
    ];
    
    // Simple demo decryption (not real SM4)
    const ciphertextBytes = config.outputFormat === 'hex' 
        ? hexToBytes(ciphertext)
        : base64ToBytes(ciphertext);
    
    const decryptedBytes = ciphertextBytes.map(b => b ^ 0x42); // Simple XOR for demo
    const unpaddedBytes = getUnpaddingFunction(config.padding)(decryptedBytes);
    const plaintext = bytesToString(unpaddedBytes, config.encoding);
    
    return {
        plaintext,
        steps,
        blocks: []
    };
}
