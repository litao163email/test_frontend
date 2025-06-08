<template>
	<el-scrollbar height="calc(100vh - 70px)" v-if="proInfo">
		<div class="pro_title">{{ proInfo.name }}</div>

		<div class="title">【基本信息】</div>

		<el-card body-style="padding:0px">
			<el-descriptions :column="4" border>
				<el-descriptions-item label="负责人">{{ proInfo.leader }}</el-descriptions-item>
				<el-descriptions-item label="创建时间">{{ $tools.rTime(proInfo.create_time) }}</el-descriptions-item>
				<el-descriptions-item v-for="item in proInfo.info" :label="item.name">{{ item.value }}</el-descriptions-item>
			</el-descriptions>

			<el-row :gutter="20">
				<el-col :span="4" v-for="item in proInfo.info">
					<div class="info">
						<el-progress type="dashboard" :width="90" :percentage="100" :stroke-width="4" color="#0044aa">
							<template #default="{ percentage }">
								<div class="percentage-value">
									<b style="color:#0044aa">{{ item.value }}</b>
									<span v-if="item.name === '执行记录'">条</span>
									<span v-else>个</span>
								</div>
								<span class="percentage-label">{{ item.name }}</span>
							</template>
						</el-progress>
					</div>
				</el-col>
			</el-row>
		</el-card>

		<div class="title">【bug统计】</div>

		<el-card body-style="padding:0px">
			<el-descriptions :column="4" border>
				<el-descriptions-item v-for="item in proInfo.bugs" :label="item.name">{{ item.value }}</el-descriptions-item>
			</el-descriptions>
			<el-row>
				<el-col :span="6" v-for="item in proInfo.bugs">
					<div class="info">
						<el-progress type="circle" :width="90" :percentage="100" :stroke-width="4" color="#0044aa">
							<template #default="{ percentage }">
								<div class="percentage-value">
									<b style="color:#0044aa">{{ item.value }}</b>
									<span>个</span>
								</div>
								<span class="percentage-label">{{ item.name }}</span>
							</template>
						</el-progress>
					</div>
				</el-col>
			</el-row>
		</el-card>

		<div class="title">【执行记录】</div>

		<Record></Record>
	</el-scrollbar>
</template>

<script>
import { mapState } from 'vuex';
import Record from './Records.vue'
export default {
	data() {
		return {
			proInfo: null,
		};
	},
	components:{
		Record
	},
	methods: {
		// 获取项目信息
		async getProInfo() {
			const response = await this.$api.getProject(this.pro.id);
			if (response.status === 200) {
				this.proInfo = response.data;
			}
		},

	},
	computed: {
		...mapState(['pro']),
	},
	created() {
		this.getProInfo();
	}
};
</script>

<style scoped>
.pro_title {
	height: 50px;
	color: #0e0e0e;
	text-align: center;
	font: bold 24px/50px 'microsoft yahei';
	background: #f7f7f7;
}
.title {
	font-weight: bold;
	line-height: 40px;
	color: #0e0e0e;
}
/* 信息图样式 */
.info {
	margin: 5px;
	padding: 10px;
	text-align: center;
	background: #f8f8f8;
}

.percentage-value {
	display: block;
	margin-top: 10px;
	font-size: 16px;
}
.percentage-label {
	display: block;
	margin-top: 10px;
	font-size: 12px;
}
</style>
