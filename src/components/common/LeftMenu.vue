<template>
	<!-- 用户信息 -->
	<div class="user_box">
		<img src="../../assets/logo.png" class="u_head" />
		<el-dropdown :hide-on-click="false" @command="handleCommand" style="color: #fff;flex: 1;text-align: center;">
			<span class="el-dropdown-link">
				<i class="el-icon-user-solid"></i>
				{{ username }}
				<el-icon class="el-icon--right"><CaretBottom /></el-icon>
			</span>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item command="select">选择项目</el-dropdown-item>
					<el-dropdown-item command="logout">注销登录</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>
	<!-- 左侧菜单 -->
	<div class="left_menu">
		<el-scrollbar height="calc(100vh - 54px);">
			<el-menu :default-active="$route.path" router class="el-menu-vertical-demo" active-text-color="#ffd04b" text-color="#fff" style="background: none;border: none;">
				<el-menu-item :index="item.path" v-for="item in menus">
					<span :class="item.icon"></span>
					<span>{{ item.name }}</span>
				</el-menu-item>
			</el-menu>
		</el-scrollbar>
	</div>
</template>

<script>
const menuList = [
	{
		name: '项目首页',
		path: '/project',
		icon: 'el-icon-s-home'
	},
	{
		name: '接口管理',
		path: '/interface',
		icon: 'el-icon-paperclip'
	},
	{
		name: '接口用例',
		path: '/teststep',
		icon: 'el-icon-connection'
	},
	{
		name: '测试场景',
		path: '/testscent',
		icon: 'el-icon-s-help'
	},
	{
		name: '测试计划',
		path: '/testplan',
		icon: 'el-icon-collection-tag'
	},
	{
		name: '环境信息',
		path: '/testenv',
		icon: 'el-icon-coin'
	},
	{
		name: '定时任务',
		path: '/crontab',
		icon: 'el-icon-time'
	},
	{
		name: 'bug管理',
		path: '/bugs',
		icon: 'el-icon-lightning'
	},
	{
		name: '测试报表',
		path: '/records',
		icon: 'el-icon-s-data'
	},
	{
		name: '压测分析AI',
		path: '/difychat',
		icon: 'el-icon-chat-dot-round'
	},
	{
		name: '数据库AI(MCP)',
		path: '/difychat2',
		icon: 'el-icon-chat-line-round'
	}
];

export default {
	data() {
		return {
			menus: menuList
		};
	},
	computed: {
		username() {
			return window.sessionStorage.getItem('username');
		}
	},
	methods: {
		handleCommand(cmd) {
			if (cmd === 'select') {
				this.$router.push({ name: 'allProject' });
			} else {
				window.sessionStorage.removeItem('token');
				this.$router.push({ name: 'login' });
			}
		}
	}
};
</script>

<style scoped="">
.el-menu-item:hover {
	background: #556daa;
}
.user_box {
	height: 53px;
	line-height: 53px;
	border-bottom: solid 1px #fff;
	display: flex;
	align-items: center;
}
.u_head {
	height: 40px;
	border-radius: 50%;
	margin: 0 15px;
}
</style>
