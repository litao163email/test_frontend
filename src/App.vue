<template>
	<router-view></router-view>
</template>

<script>
export default {
	created() {
		//在页面刷新时将vuex里的信息保存到 sessionStorage里
		window.addEventListener('beforeunload', () => {
			sessionStorage.setItem('messageStore', JSON.stringify(this.$store.state));
		});
		//在页面加载时读取sessionStorage里的状态信息
		sessionStorage.getItem('messageStore') && this.$store.replaceState(Object.assign(this.$store.state, JSON.parse(sessionStorage.getItem('messageStore'))));
	}
};
</script>

<style></style>
