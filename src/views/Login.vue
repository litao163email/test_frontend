<template>
	<LoginBack>
		<div class="login_box">
			 <div class="title" style="text-align: center;">接口自动化测试平台</div>
			<!-- log -->
<!--			<div style="text-align: center;"><img src="../assets/images/log.png" /></div>-->

			<!-- label-width是用占位的 -->
			<el-form ref="loginRef" class="login_from" :model="loginForm" :rules="rulesLogin">
				<!-- 账号密码输入框 -->
				<el-form-item prop="username">
					<el-input size="default" v-model="loginForm.username" prefix-icon="el-icon-user" placeholder="体验账号:test"></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input type="password" size="default" v-model="loginForm.password" placeholder="密码:test123456" prefix-icon="el-icon-lock"></el-input>
				</el-form-item>
				<el-form-item size="mini" label="记住用户" style="margin-top: 10px;"><el-switch v-model="status" size="default" active-color="#00557f"></el-switch></el-form-item>
				<!-- 按钮 -->
				<el-form-item class="btns">
					<el-button size="default" style="color:#fff;width: 100%;background: #00557f;border: 0;" @click="login">登录 Login</el-button>
				</el-form-item>
			</el-form>
			<div style="color: #fff;">
				没有账号?&nbsp;&nbsp;&nbsp;
				<span @click="clickRegister" style="color:#00557f;cursor:pointer;">开通账号</span>
			</div>
		</div>
	</LoginBack>
</template>

<script type="text/javascript">
import LoginBack from '../components/common/LoginBack.vue';

export default {
	components: {
		LoginBack
	},
	data() {
		return {
			// 登录的数据对象
			loginForm: {
				username: '',
				password: ''
			},
			status: false,
			rulesLogin: {
				// 验证用户名是否合法
				username: [
					{
						required: true,
						message: '请输入登录账户',
						trigger: 'blur'
					}
				],
				// 验证密码是否合法
				password: [
					{
						required: true,
						message: '请输入登录密码',
						trigger: 'blur'
					}
				]
			}
		};
	},
	methods: {
		clickRegister() {
			this.$message({
				type: 'warning',
				message: '请联系管理员开通账号！',
				duration: 1000
			});
		},
		// 登录的方法
		login() {
			// 通过表单的validate方法来验证表单，验证的结果会传递到validate的回调函数中
			this.$refs.loginRef.validate(async vaild => {
				// 判断是否验证通过，不通过则直接retrue
				if (!vaild) return;
				// 发送请求
				const response = await this.$api.login(this.loginForm);
				// 判断是否登录失败
				if (response.status != 200) return;
				const result = response.data;
				// 1、弹出登录成功
				this.$message({
					type: 'success',
					message: '登录成功',
					duration: 1000
				});
				// 2、获取token,保存到客户端的sessionStorage中
				window.sessionStorage.setItem('token', result.token);
				window.sessionStorage.setItem('username', this.loginForm.username);
				if (this.status) {
					window.localStorage.setItem('userinfo', JSON.stringify(this.loginForm));
				} else {
					window.localStorage.removeItem('userinfo');
				}
				// 3、通过编程式导航跳转到登录之后的页面中
				this.$router.push({ name: 'allProject' });
			});
		}
	},
	mounted() {
		const userinfo = window.localStorage.getItem('userinfo');
		if (userinfo) {
			this.loginForm = JSON.parse(userinfo);
			this.status = true;
		}
	}
};
</script>

<style scoped>
.title {
	font: bold 35px/100px 'microsoft yahei';
	text-align: center;
	font-weight: bold;
	color: #ffffff;
}

.login_box {
	position: absolute;
	top: calc((100vh - 400px) / 2.6);
	left: calc((100vw - 500px) / 2);
	z-index: 999;
	width: 500px;
	height: 400px;
	border-radius: 20px;
}
</style>
