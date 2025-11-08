<template>
	<div class="dify-chat-container">
		<el-card class="chat-card">
			<template #header>
				<div class="card-header">
					<span class="title">用例生成(AI)</span>
					<el-button v-if="isStreaming" @click="stopStream" type="danger" size="small" plain>
						停止
					</el-button>
				</div>
			</template>

			<!-- 聊天消息区域 -->
			<div class="chat-messages" ref="messagesContainer">
				<div v-for="(message, index) in messages" :key="index" class="message-item" :class="message.role">
					<div class="message-content">
						<div class="message-role">
							<span v-if="message.role === 'user'">👤 您</span>
							<span v-else>🤖 AI Agent</span>
						</div>
						<div class="message-text" v-html="formatMessage(message.content)"></div>
					</div>
				</div>
				<div v-if="isStreaming" class="message-item assistant">
					<div class="message-content">
						<div class="message-role">🤖 AI Agent</div>
						<div class="message-text streaming">
							<span v-html="formatMessage(currentStreamContent)"></span>
							<span class="cursor">|</span>
						</div>
					</div>
				</div>
			</div>

			<!-- 输入区域 -->
			<div class="chat-input-area">
				<el-input
					v-model="inputMessage"
					type="textarea"
					:rows="3"
					placeholder="请输入您的问题..."
					@keydown.enter="handleEnterKey"
					@keydown.ctrl.enter="sendMessage"
					:disabled="isStreaming"
					class="input-box"
				></el-input>
				<div class="input-actions">
					<!-- 快捷语句按钮 -->
					<el-button
						@click="toggleQuickPhrases"
						type="info"
						plain
						size="small"
						class="quick-phrases-btn"
					>
						快捷语句 <span class="toggle-icon">{{ showQuickPhrases ? '▲' : '▼' }}</span>
					</el-button>
					<div style="flex: 1;"></div>
					<el-button
						@click="sendMessage"
						type="primary"
						:loading="isStreaming"
						:disabled="!inputMessage.trim() || isStreaming"
					>
						发送 (Enter)
					</el-button>
					<el-button @click="clearMessages" :disabled="isStreaming">清空对话</el-button>
				</div>
				<!-- 快捷语句列表 -->
				<div v-if="showQuickPhrases" class="quick-phrases">
					<div class="quick-phrases-list">
						<el-tag
							v-for="(phrase, index) in quickPhrases"
							:key="index"
							@click="selectQuickPhrase(phrase)"
							class="quick-phrase-tag"
							effect="plain"
							size="small"
						>
							{{ phrase }}
						</el-tag>
					</div>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
import { API_CONFIG } from '../../config.js'

export default {
	name: 'DifyChat3',
	data() {
		return {
			messages: [],
			inputMessage: '',
			isStreaming: false,
			currentStreamContent: '',
			abortController: null,
			// Dify API 配置（从 config.js 读取）
			apiBaseUrl: API_CONFIG.DIFY_CHAT3.BASE_URL,
			apiKey: API_CONFIG.DIFY_CHAT3.API_KEY,
			// 快捷语句
			showQuickPhrases: false,
			quickPhrases: [
				'帮我生成测试用例',
				'如何编写接口测试用例？',
				'生成边界值测试用例',
				'如何设计测试场景？',
				'生成异常测试用例',
				'如何优化测试用例？'
			]
		}
	},
	mounted() {
		// 组件挂载后滚动到底部
		this.$nextTick(() => {
			this.scrollToBottom()
		})
	},
	methods: {
		async sendMessage() {
			if (!this.inputMessage.trim() || this.isStreaming) {
				return
			}

			const userMessage = this.inputMessage.trim()
			this.inputMessage = ''

			// 添加用户消息
			this.messages.push({
				role: 'user',
				content: userMessage
			})

			this.scrollToBottom()

			// 开始流式调用
			this.isStreaming = true
			this.currentStreamContent = ''
			this.abortController = new AbortController()

			try {
				await this.streamChat(userMessage)
			} catch (error) {
				console.error('流式调用错误:', error)
				if (error.name !== 'AbortError') {
					this.$message.error('请求失败: ' + (error.message || '未知错误'))
					this.messages.push({
						role: 'assistant',
						content: '抱歉，发生了错误：' + (error.message || '未知错误')
					})
				}
			} finally {
				this.isStreaming = false
				this.currentStreamContent = ''
				this.abortController = null
			}
		},

		async streamChat(userMessage) {
			const response = await fetch(`${this.apiBaseUrl}/chat-messages`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${this.apiKey}`
				},
				body: JSON.stringify({
					inputs: {},
					query: userMessage,
					response_mode: 'streaming',
					conversation_id: '',
					user: 'user-' + Date.now()
				}),
				signal: this.abortController.signal
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const reader = response.body.getReader()
			const decoder = new TextDecoder()
			let buffer = ''

			while (true) {
				const { done, value } = await reader.read()
				
				if (done) {
					break
				}

				buffer += decoder.decode(value, { stream: true })
				const lines = buffer.split('\n')
				buffer = lines.pop() || ''

				for (const line of lines) {
					if (line.trim() === '') continue
					
					try {
						// Dify 流式响应格式通常是 data: {...}
						if (line.startsWith('data: ')) {
							const data = JSON.parse(line.slice(6))
							this.handleStreamData(data)
						} else if (line.startsWith('{')) {
							// 直接是 JSON 格式
							const data = JSON.parse(line)
							this.handleStreamData(data)
						}
					} catch (e) {
						// 忽略解析错误，继续处理下一行
						console.warn('解析流数据错误:', e, line)
					}
				}
			}

			// 处理剩余的 buffer
			if (buffer.trim()) {
				try {
					if (buffer.startsWith('data: ')) {
						const data = JSON.parse(buffer.slice(6))
						this.handleStreamData(data)
					} else if (buffer.startsWith('{')) {
						const data = JSON.parse(buffer)
						this.handleStreamData(data)
					}
				} catch (e) {
					console.warn('解析剩余 buffer 错误:', e)
				}
			}

			// 流式响应完成后，将内容添加到消息列表
			if (this.currentStreamContent) {
				this.messages.push({
					role: 'assistant',
					content: this.currentStreamContent
				})
				this.currentStreamContent = ''
			}

			this.scrollToBottom()
		},

		handleStreamData(data) {
			// 处理 Dify 流式响应数据
			// Dify 的响应格式可能包含 event、answer、conversation_id 等字段
			
			// 处理消息事件
			if (data.event === 'message') {
				// message 事件包含增量答案
				if (data.answer !== undefined) {
					this.currentStreamContent += data.answer
					this.scrollToBottom()
				}
			} else if (data.event === 'message_end') {
				// 消息结束事件，可能包含最终答案
				if (data.answer !== undefined) {
					this.currentStreamContent += data.answer
					this.scrollToBottom()
				}
				// 保存 conversation_id 以便后续使用
				if (data.conversation_id) {
					// 可以保存对话ID用于后续对话
					console.log('对话ID:', data.conversation_id)
				}
			} else if (data.event === 'message_file') {
				// 处理文件消息
				console.log('收到文件:', data)
			} else if (data.event === 'error') {
				// 处理错误事件
				console.error('Dify API 错误:', data)
				this.$message.error(data.message || '发生错误')
			} else if (data.answer !== undefined) {
				// 直接包含 answer 字段（兼容不同格式）
				this.currentStreamContent += data.answer
				this.scrollToBottom()
			} else if (data.message) {
				// 包含 message 字段（兼容不同格式）
				this.currentStreamContent += data.message
				this.scrollToBottom()
			}
		},

		stopStream() {
			if (this.abortController) {
				this.abortController.abort()
			}
			// 如果已经有部分内容，保存到消息列表
			if (this.currentStreamContent) {
				this.messages.push({
					role: 'assistant',
					content: this.currentStreamContent
				})
				this.currentStreamContent = ''
			}
			this.isStreaming = false
		},

		clearMessages() {
			this.messages = []
			this.currentStreamContent = ''
		},

		toggleQuickPhrases() {
			this.showQuickPhrases = !this.showQuickPhrases
		},

		selectQuickPhrase(phrase) {
			this.inputMessage = phrase
			// 可选：选择后自动聚焦到输入框
			this.$nextTick(() => {
				const input = this.$el.querySelector('.input-box textarea')
				if (input) {
					input.focus()
				}
			})
		},

		handleEnterKey(event) {
			// 如果按了 Ctrl 或 Cmd（Mac），让 @keydown.ctrl.enter 处理
			if (event.ctrlKey || event.metaKey) {
				return
			}
			// 如果按了 Shift，允许换行（不发送消息）
			if (event.shiftKey) {
				return
			}
			// 否则阻止默认换行行为，发送消息
			event.preventDefault()
			this.sendMessage()
		},

		formatMessage(content) {
			if (!content) return ''
			// 将换行符转换为 <br>
			return content.replace(/\n/g, '<br>')
		},

		scrollToBottom() {
			this.$nextTick(() => {
				const container = this.$refs.messagesContainer
				if (container) {
					container.scrollTop = container.scrollHeight
				}
			})
		}
	}
}
</script>

<style scoped>
.dify-chat-container {
	padding: 20px;
	height: calc(100vh - 60px);
	display: flex;
	flex-direction: column;
	background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
	position: relative;
	overflow: hidden;
}

/* 科技感动画背景 - 数据库风格 */
.dify-chat-container::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: 
		radial-gradient(circle at 15% 30%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
		radial-gradient(circle at 85% 70%, rgba(0, 191, 255, 0.1) 0%, transparent 50%),
		radial-gradient(circle at 50% 50%, rgba(64, 224, 208, 0.05) 0%, transparent 70%);
	animation: backgroundShift 20s ease infinite;
	z-index: 0;
}

@keyframes backgroundShift {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.8; }
}

.chat-card {
	flex: 1;
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
	background: rgba(15, 32, 39, 0.6);
	backdrop-filter: blur(20px);
	border: 1px solid rgba(0, 255, 255, 0.2);
	border-radius: 20px;
	box-shadow: 
		0 8px 32px rgba(0, 0, 0, 0.5),
		inset 0 1px 0 rgba(0, 255, 255, 0.1),
		0 0 30px rgba(0, 255, 255, 0.1);
	position: relative;
	z-index: 1;
}

/* 确保 el-card 的 body 使用 flex 布局 */
.chat-card :deep(.el-card__body) {
	display: flex;
	flex-direction: column;
	flex: 1;
	overflow: hidden;
	padding: 0;
	background: transparent;
}

.chat-card :deep(.el-card__header) {
	background: rgba(15, 32, 39, 0.6);
	border-bottom: 1px solid rgba(0, 255, 255, 0.2);
	padding: 20px;
	border-radius: 20px 20px 0 0;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.title {
	font-size: 20px;
	font-weight: 700;
	background: linear-gradient(135deg, #00d4ff 0%, #00ffea 50%, #00ffaa 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	text-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
	letter-spacing: 0.5px;
	position: relative;
	font-family: 'Courier New', monospace;
}

.title::after {
	content: '';
	position: absolute;
	bottom: -4px;
	left: 0;
	width: 100%;
	height: 2px;
	background: linear-gradient(90deg, #00d4ff, #00ffea, #00ffaa);
	border-radius: 2px;
	animation: titleGlow 2s ease-in-out infinite;
	box-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
}

@keyframes titleGlow {
	0%, 100% { opacity: 0.6; box-shadow: 0 0 10px rgba(0, 255, 255, 0.5); }
	50% { opacity: 1; box-shadow: 0 0 20px rgba(0, 255, 255, 1); }
}

.chat-messages {
	flex: 1;
	overflow-y: auto;
	overflow-x: hidden;
	padding: 20px;
	background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(15, 32, 39, 0.2) 100%);
	background-image: 
		linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
		linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
	background-size: 20px 20px;
	min-height: 0;
	scrollbar-width: thin;
	scrollbar-color: rgba(0, 255, 255, 0.5) rgba(0, 0, 0, 0.3);
	position: relative;
}

.message-item {
	margin-bottom: 20px;
	animation: fadeIn 0.3s;
}

.message-item.user {
	display: flex;
	justify-content: flex-end;
}

.message-item.assistant {
	display: flex;
	justify-content: flex-start;
}

.message-content {
	max-width: 70%;
	padding: 12px 16px;
	border-radius: 8px;
}

.message-item.user .message-content {
	background: linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%);
	color: #0f2027;
	border-bottom-right-radius: 4px;
	box-shadow: 
		0 4px 15px rgba(0, 212, 255, 0.4),
		inset 0 1px 0 rgba(255, 255, 255, 0.3);
	border: 1px solid rgba(0, 255, 255, 0.3);
	position: relative;
	overflow: hidden;
	font-weight: 500;
}

.message-item.user .message-content::before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
	animation: shimmer 3s infinite;
}

@keyframes shimmer {
	0% { left: -100%; }
	100% { left: 100%; }
}

.message-item.assistant .message-content {
	background: rgba(0, 255, 255, 0.1);
	backdrop-filter: blur(10px);
	color: #e0f7fa;
	border: 1px solid rgba(0, 255, 255, 0.3);
	border-bottom-left-radius: 4px;
	box-shadow: 
		0 4px 15px rgba(0, 0, 0, 0.3),
		inset 0 1px 0 rgba(0, 255, 255, 0.2);
}

.message-role {
	font-size: 12px;
	font-weight: bold;
	margin-bottom: 8px;
	opacity: 0.8;
}

.message-text {
	line-height: 1.6;
	word-wrap: break-word;
	white-space: pre-wrap;
}

.message-text.streaming {
	position: relative;
}

.cursor {
	display: inline-block;
	animation: blink 1s infinite;
	color: #00ffea;
	font-weight: bold;
	text-shadow: 0 0 10px rgba(0, 255, 234, 0.8);
}

@keyframes blink {
	0%, 50% {
		opacity: 1;
	}
	51%, 100% {
		opacity: 0;
	}
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.chat-input-area {
	flex-shrink: 0;
	padding: 20px;
	border-top: 1px solid rgba(0, 255, 255, 0.2);
	background: rgba(15, 32, 39, 0.6);
	backdrop-filter: blur(10px);
}

.input-box {
	margin-bottom: 10px;
}

.input-box :deep(.el-textarea__inner) {
	background: rgba(0, 255, 255, 0.1);
	backdrop-filter: blur(10px);
	border: 1px solid rgba(0, 255, 255, 0.3);
	border-radius: 12px;
	color: #e0f7fa;
	transition: all 0.3s ease;
}

.input-box :deep(.el-textarea__inner):focus {
	background: rgba(0, 255, 255, 0.15);
	border-color: rgba(0, 255, 234, 0.6);
	box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
}

.input-box :deep(.el-textarea__inner)::placeholder {
	color: rgba(224, 247, 250, 0.5);
}

.input-actions {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 10px;
}

.quick-phrases-btn {
	margin-right: auto;
}

.quick-phrases-btn .toggle-icon {
	margin-left: 4px;
	font-size: 12px;
}

.quick-phrases {
	margin-top: 10px;
	padding-top: 10px;
	border-top: 1px dashed #e0e0e0;
}

.quick-phrases-list {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.toggle-icon {
	font-size: 12px;
	transition: transform 0.3s;
}

.quick-phrase-tag {
	cursor: pointer;
	transition: all 0.3s;
	padding: 6px 12px;
}

.quick-phrase-tag {
	background: rgba(0, 255, 255, 0.1);
	border: 1px solid rgba(0, 255, 255, 0.3);
	color: rgba(224, 247, 250, 0.9);
	backdrop-filter: blur(10px);
}

.quick-phrase-tag:hover {
	background: linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%);
	color: #0f2027;
	transform: translateY(-2px);
	box-shadow: 0 4px 15px rgba(0, 212, 255, 0.4);
	border-color: rgba(0, 255, 255, 0.5);
	font-weight: 500;
}

/* 滚动条样式 - Webkit 浏览器 (Chrome, Safari, Edge) */
.chat-messages::-webkit-scrollbar {
	width: 12px;
}

.chat-messages::-webkit-scrollbar-track {
	background: rgba(0, 0, 0, 0.3);
	border-radius: 10px;
	margin: 5px 0;
}

.chat-messages::-webkit-scrollbar-thumb {
	background: linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%);
	border-radius: 10px;
	border: 2px solid rgba(0, 0, 0, 0.3);
	transition: all 0.3s ease;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
	background: linear-gradient(135deg, #00ffea 0%, #00d4ff 100%);
	box-shadow: 0 0 10px rgba(0, 255, 255, 0.6);
	cursor: pointer;
}

.chat-messages::-webkit-scrollbar-thumb:active {
	background: linear-gradient(135deg, #00a8cc 0%, #00d4ff 100%);
}
</style>

