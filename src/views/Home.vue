<template>
	<div class="home">
		<div class="left_box"><LeftMenu></LeftMenu></div>
		<div class="right_box">
			<!-- 顶部标签项 -->
			<Tags></Tags>
			<!-- 主体内容展示 -->
			<el-card class="main" body-style="padding:0"><router-view></router-view></el-card>
		</div>
	</div>
</template>

<script>
import LeftMenu from '../components/common/LeftMenu.vue';
import Tags from '../components/common/Tags.vue';
import { mapActions } from 'vuex';
export default {
	name: 'Home',
	components: {
		LeftMenu,
		Tags
	},
	methods: {
		...mapActions(['getAllInter', 'getAllScent', 'getAllEnvs', 'getAllPlan'])
	},
	created() {
		this.getAllInter();
		this.getAllScent();
		this.getAllEnvs();
		this.getAllPlan();
	}
};
</script>

<style type="text/css" scoped>
/* 背景颜色设置 */
.home {
	/* background-image: linear-gradient(#55aa7f, #6bd6e1) !important; */
	background-image: linear-gradient(#0044aa, #0044aa) !important;
	/* background: #00AA7F; */
}
/* 左侧盒子样式 */
.left_box {
	width: 200px;
	height: 100vh;
	border-right: solid 1px #fff;
}

/* 右侧盒子样式 */
.right_box {
	position: absolute;
	left: 200px;
	top: 0px;
	width: calc(100vw - 200px);
	height: 100vh;
}
.main {
	background: #fff;
	height: calc(100vh - 60px);
	margin: 0 3px;
}
</style>
