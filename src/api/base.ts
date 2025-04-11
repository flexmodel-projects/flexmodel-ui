export const BASE_URI = '/fm-api'

export async function getFileAsBlob(url: string) {
  try {
    // 发送请求获取文件
    const response = await fetch(url);

    // 检查请求是否成功
    if (!response.ok) {
      throw new Error(`网络响应不正常: ${response.status}`);
    }

    // 将响应内容转换为 Blob 对象
    const blob = await response.blob();

    // 返回 Blob 对象
    return blob;
  } catch (error) {
    console.error('获取文件失败:', error);
    throw error; // 重新抛出错误供上层调用处理
  }
}
