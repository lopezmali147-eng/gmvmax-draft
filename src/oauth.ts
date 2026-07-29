/**
 * TikTok OAuth 演示流程：配置常量与本地状态读写工具。
 *
 * 说明：本文件仅服务于「项 9：Screen Recordings」所需的 OAuth 授权流程演示。
 * 站点是纯 mock 静态站，没有真实 TikTok App、client_id 或后端，因此所有状态均保存在
 * localStorage 中，仅用于本地录屏演示，不代表任何真实授权凭证。
 */

/** 仿真浏览器地址栏展示的授权 URL（含 DEMO client_id，非真实凭证，按需求固定字面量，不做 i18n）。 */
export const TIKTOK_OAUTH_DEMO_URL =
  'https://www.tiktok.com/v2/auth/authorize?client_id=DEMO_gmvmax_center_2026&scope=user.info.basic,ad.account.read&response_type=code&redirect_uri=https://gmvmax.tkbigboom.top/oauth/callback&state=demo123';

/** localStorage 键：TikTok 账号是否已连接。 */
export const STORAGE_KEY_CONNECTED = 'gmvmax-tiktok-connected';

/** localStorage 键：演示用户名。 */
export const STORAGE_KEY_USERNAME = 'gmvmax-tiktok-username';

/** 演示用户名（与授权页写入的值保持一致）。 */
export const DEMO_USERNAME = 'demo_advertiser';

/**
 * 读取是否已连接状态（客户端）。
 *
 * @returns 是否已连接 TikTok 账号。
 */
export function readTikTokConnected(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(STORAGE_KEY_CONNECTED) === 'true';
}

/**
 * 读取演示用户名（客户端）。
 *
 * @returns 已连接的演示用户名，未连接时返回默认演示用户名。
 */
export function readTikTokUsername(): string {
  if (typeof window === 'undefined') return DEMO_USERNAME;
  return window.localStorage.getItem(STORAGE_KEY_USERNAME) || DEMO_USERNAME;
}

/**
 * 标记为已连接（授权成功时调用）。
 *
 * @param username 演示用户名，默认使用 DEMO_USERNAME。
 */
export function setTikTokConnected(username: string = DEMO_USERNAME): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY_CONNECTED, 'true');
  window.localStorage.setItem(STORAGE_KEY_USERNAME, username);
}

/** 断开连接（清除标记，恢复初始未连接状态）。 */
export function clearTikTokConnected(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY_CONNECTED);
  window.localStorage.removeItem(STORAGE_KEY_USERNAME);
}
