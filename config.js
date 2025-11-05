// Dify API 配置 ;该api key 为 litao测试本地部署不可用,自行更换
export const API_CONFIG = {
  // 压测分析AI 聊天页面配置
  DIFY_CHAT: {
    BASE_URL: 'http://localhost/v1',
    API_KEY: 'app-UnYZL7dwFaWx9oTsf0G8ct16'
  },
  // 数据库AI(MCP) 聊天页面配置
  DIFY_CHAT2: {
    BASE_URL: 'http://localhost/v1',
    API_KEY: 'app-Jdr5SrHdNHzXoAu532KODOZf'
  }
}

// 为了向后兼容，保留默认导出
export const API_CONFIG_DEFAULT = API_CONFIG.DIFY_CHAT

