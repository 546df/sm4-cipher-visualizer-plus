
/**
 * SM4 测试用随机数据生成器
 * 提供生成随机密钥、明文和测试数据的函数
 */

/**
 * 生成 SM4 的随机十六进制密钥（128 位 = 32 个十六进制字符）
 * @returns 随机的 32 字符十六进制字符串
 */
export const generateRandomKey = (): string => {
  const chars = '0123456789abcdef';
  let result = '';
  
  // 为 128 位密钥生成 32 个随机十六进制字符
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  console.log('生成的随机密钥:', result);
  return result;
};

/**
 * 生成用于测试的随机明文
 * @param length 明文的期望长度（默认：8-32 字符之间的随机值）
 * @returns 随机明文字符串
 */
export const generateRandomPlaintext = (length?: number): string => {
  const words = [
    '你好', '世界', 'SM4', '密码', '安全', '算法', '加密',
    '解密', '分组', '密码', '密钥', '数据', '消息', '秘密',
    '数字', '隐私', '信息', '技术', '计算机', '网络'
  ];
  
  const targetLength = length || Math.floor(Math.random() * 25) + 8; // 8-32 字符
  let result = '';
  
  while (result.length < targetLength) {
    const word = words[Math.floor(Math.random() * words.length)];
    if (result.length === 0) {
      result = word;
    } else if (result.length + word.length + 1 <= targetLength) {
      result += ' ' + word;
    } else {
      break;
    }
  }
  
  // 如果需要，填充到确切长度
  if (result.length < targetLength) {
    const remaining = targetLength - result.length;
    result += '!'.repeat(remaining);
  }
  
  console.log('生成的随机明文:', result);
  return result;
};

/**
 * 生成指定长度的随机十六进制字符串
 * @param length 要生成的十六进制字符数
 * @returns 随机十六进制字符串
 */
export const generateRandomHex = (length: number): string => {
  const chars = '0123456789abcdef';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * 生成随机字节作为数字数组
 * @param count 要生成的字节数
 * @returns 随机字节数组 (0-255)
 */
export const generateRandomBytes = (count: number): number[] => {
  const bytes: number[] = [];
  
  for (let i = 0; i < count; i++) {
    bytes.push(Math.floor(Math.random() * 256));
  }
  
  return bytes;
};

/**
 * 为 SM4 算法生成测试用例
 * @param count 要生成的测试用例数量
 * @returns 测试用例对象数组
 */
export const generateTestCases = (count: number = 5) => {
  const testCases = [];
  
  for (let i = 0; i < count; i++) {
    testCases.push({
      id: i + 1,
      name: `测试用例 ${i + 1}`,
      plaintext: generateRandomPlaintext(),
      key: generateRandomKey(),
      iv: generateRandomKey(), // 用于 CBC 模式
      description: `随机生成的测试用例，明文长度为 ${generateRandomPlaintext().length} 字符`
    });
  }
  
  console.log('生成的测试用例:', testCases);
  return testCases;
};
