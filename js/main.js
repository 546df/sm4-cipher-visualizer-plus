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
let currentVisualizationStep = 0;
let isAutoPlay = false;

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
    stepsContainer: document.getElementById('steps-container'),
    visualizationControls: document.getElementById('visualization-controls'),
    stepInfo: document.getElementById('step-info'),
    stepProgress: document.getElementById('step-progress'),
    prevStepBtn: document.getElementById('prev-step'),
    nextStepBtn: document.getElementById('next-step'),
    autoPlayBtn: document.getElementById('auto-play'),
    resetVisualizationBtn: document.getElementById('reset-visualization')
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('SM4 Cipher Visualizer initialized');
    setupEventListeners();
    updateUIForOperation();
    setDefaultValues();
    setupVisualizationControls();
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

// Setup visualization controls
function setupVisualizationControls() {
    if (elements.prevStepBtn) {
        elements.prevStepBtn.addEventListener('click', previousStep);
    }
    if (elements.nextStepBtn) {
        elements.nextStepBtn.addEventListener('click', nextStep);
    }
    if (elements.autoPlayBtn) {
        elements.autoPlayBtn.addEventListener('click', toggleAutoPlay);
    }
    if (elements.resetVisualizationBtn) {
        elements.resetVisualizationBtn.addEventListener('click', resetVisualization);
    }
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
    if (!container) return;
    
    container.innerHTML = '';
    
    if (result.state && result.state.rounds && result.state.rounds.length > 0) {
        createVisualizationInterface(result.state);
        updateVisualizationStep(0);
    } else {
        container.innerHTML = '<p class="placeholder">暂无可视化数据</p>';
    }
}

function createVisualizationInterface(state) {
    const container = elements.stepsContainer;
    
    // Create visualization header
    const header = document.createElement('div');
    header.className = 'visualization-header';
    header.innerHTML = `
        <h3>SM4 算法可视化 - ${state.mode} 模式</h3>
        <div class="progress-info">
            <span>总共 ${state.rounds.length} 轮</span>
            <div class="progress-bar">
                <div class="progress-fill" id="progress-fill"></div>
            </div>
        </div>
    `;
    container.appendChild(header);
    
    // Create controls
    const controls = document.createElement('div');
    controls.className = 'visualization-controls';
    controls.innerHTML = `
        <button id="prev-step" class="control-btn">⏮ 上一步</button>
        <button id="auto-play" class="control-btn">▶ 自动播放</button>
        <button id="next-step" class="control-btn">下一步 ⏭</button>
        <button id="reset-visualization" class="control-btn">🔄 重置</button>
        <div class="speed-control">
            <label>速度:</label>
            <select id="play-speed">
                <option value="2000">慢</option>
                <option value="1000" selected>正常</option>
                <option value="500">快</option>
            </select>
        </div>
    `;
    container.appendChild(controls);
    
    // Create step display area
    const stepDisplay = document.createElement('div');
    stepDisplay.id = 'step-display';
    stepDisplay.className = 'step-display';
    container.appendChild(stepDisplay);
    
    // Re-setup event listeners for new buttons
    setupVisualizationControls();
    
    // Store state for visualization
    window.visualizationState = state;
    currentVisualizationStep = 0;
}

function updateVisualizationStep(stepIndex) {
    const state = window.visualizationState;
    if (!state || !state.rounds) return;
    
    const round = state.rounds[stepIndex];
    if (!round) return;
    
    currentVisualizationStep = stepIndex;
    
    // Update progress
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        const progress = ((stepIndex + 1) / state.rounds.length) * 100;
        progressFill.style.width = `${progress}%`;
    }
    
    // Update step display
    const stepDisplay = document.getElementById('step-display');
    if (stepDisplay) {
        stepDisplay.innerHTML = createRoundVisualization(round, stepIndex + 1);
    }
    
    // Update controls
    updateVisualizationControls();
}

function createRoundVisualization(round, roundNumber) {
    return `
        <div class="round-visualization">
            <div class="round-header">
                <h4>第 ${roundNumber} 轮加密</h4>
                <span class="round-description">${round.description}</span>
            </div>
            
            <div class="round-content">
                <div class="input-state">
                    <h5>输入状态</h5>
                    <div class="state-words">
                        ${round.input.map((word, i) => 
                            `<div class="word-box">
                                <label>X${i}</label>
                                <div class="hex-value">${word.toString(16).padStart(8, '0')}</div>
                            </div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="transformation">
                    <h5>轮密钥与变换</h5>
                    <div class="transform-steps">
                        <div class="round-key">
                            <label>轮密钥 RK${roundNumber - 1}</label>
                            <div class="hex-value key-value">${round.roundKey.toString(16).padStart(8, '0')}</div>
                        </div>
                        <div class="sbox-output">
                            <label>S盒输出</label>
                            <div class="hex-value sbox-value">${round.sboxOutput.toString(16).padStart(8, '0')}</div>
                        </div>
                        <div class="linear-output">
                            <label>线性变换输出</label>
                            <div class="hex-value linear-value">${round.linearOutput.toString(16).padStart(8, '0')}</div>
                        </div>
                    </div>
                </div>
                
                <div class="output-state">
                    <h5>输出状态</h5>
                    <div class="state-words">
                        ${round.output.map((word, i) => 
                            `<div class="word-box output">
                                <label>X${i}</label>
                                <div class="hex-value">${word.toString(16).padStart(8, '0')}</div>
                            </div>`
                        ).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function updateVisualizationControls() {
    const state = window.visualizationState;
    if (!state) return;
    
    const prevBtn = document.getElementById('prev-step');
    const nextBtn = document.getElementById('next-step');
    const autoPlayBtn = document.getElementById('auto-play');
    
    if (prevBtn) {
        prevBtn.disabled = currentVisualizationStep === 0;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentVisualizationStep >= state.rounds.length - 1;
    }
    
    if (autoPlayBtn) {
        autoPlayBtn.textContent = isAutoPlay ? '⏸ 暂停' : '▶ 自动播放';
        autoPlayBtn.disabled = currentVisualizationStep >= state.rounds.length - 1;
    }
}

function previousStep() {
    if (currentVisualizationStep > 0) {
        updateVisualizationStep(currentVisualizationStep - 1);
    }
}

function nextStep() {
    const state = window.visualizationState;
    if (state && currentVisualizationStep < state.rounds.length - 1) {
        updateVisualizationStep(currentVisualizationStep + 1);
    }
}

function toggleAutoPlay() {
    isAutoPlay = !isAutoPlay;
    updateVisualizationControls();
    
    if (isAutoPlay) {
        autoPlayVisualization();
    }
}

function autoPlayVisualization() {
    if (!isAutoPlay) return;
    
    const state = window.visualizationState;
    if (!state || currentVisualizationStep >= state.rounds.length - 1) {
        isAutoPlay = false;
        updateVisualizationControls();
        return;
    }
    
    const speedSelect = document.getElementById('play-speed');
    const speed = speedSelect ? parseInt(speedSelect.value) : 1000;
    
    setTimeout(() => {
        nextStep();
        if (isAutoPlay) {
            autoPlayVisualization();
        }
    }, speed);
}

function resetVisualization() {
    currentVisualizationStep = 0;
    isAutoPlay = false;
    updateVisualizationStep(0);
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
    if (elements.stepsContainer) {
        elements.stepsContainer.innerHTML = '<p class="placeholder">执行算法后，这里将显示详细的步骤可视化</p>';
    }
    processingResults = null;
    currentVisualizationStep = 0;
    isAutoPlay = false;
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
