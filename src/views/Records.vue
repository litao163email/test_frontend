<template>
	<el-card body-style="padding:0px">
		<div class="chartBox2" ref="chart_box"></div>
		<el-table :data="records" class="table-style" size="mini" height="calc(100vh - 320px)">

			<el-table-column prop="create_time" label="执行时间" min-width="140">
				<template #default="scope">
					{{ $tools.rTime(scope.row.create_time) }}
				</template>
			</el-table-column>

			<el-table-column prop="tester" label="执行人" min-width="110"></el-table-column>
			<el-table-column prop="env_name" label="执行环境" min-width="110"></el-table-column>
			<el-table-column prop="plan_name" label="测试计划" min-width="110"></el-table-column>
			<el-table-column prop="all" label="总用例" min-width="50">
				<template #default="scope">
					<span v-if="scope.row.status !== '执行中'">{{ scope.row.all }}</span>
				</template>
			</el-table-column>

			<el-table-column label="通过数" min-width="50">
				<template #default="scope">
					<span v-if="scope.row.status !== '执行中'">{{ scope.row.success }}</span>
				</template>
			</el-table-column>
			<el-table-column label="通过率" min-width="80">
				<template #default="scope">
					<span v-if="scope.row.status !== '执行中'">{{ scope.row.pass_rate + '%' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="测试报告" width="140">
				<template #default="scope">
					<span v-if="scope.row.status === '执行中'">
						<el-tag>{{ scope.row.status }}...</el-tag>
					</span>
					<el-button v-else type="primary" icon="el-icon-view" plain size="mini" @click="$router.push({ name: 'report', params: { id: scope.row.id } })">
						测试报告
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</el-card>
</template>
<script>
import { mapState } from 'vuex';

export default {
	data() {
		return {
			records: []
		};
	},
	methods: {
		async getAllRecord() {
			const response = await this.$api.getTestRecord({ project: this.pro.id });
			// 判断http状态码
			if (response.status == 200) {
				this.records = response.data;
				this.chartView();
			}
		},
		// 通过率图表
		chartView() {
			this.$chart.chart3(this.$refs.chart_box, this.pateData.value, this.pateData.label);
		}
	},
	computed: {
		...mapState(['pro']),
		//执行记录图表展示数据
		pateData: function() {
			let run_date = [];
			let pass_rate = [];
			for (let item of this.records) {
				run_date.push(this.$tools.rTime(item.create_time));
				pass_rate.push(item.pass_rate);
			}
			return {
				label: run_date.reverse(),
				value: pass_rate.reverse()
			};
		}
	},
	created() {
		this.getAllRecord();
	}
};
</script>

<style scoped>
.pro_title {
	height: 50px;
	color: #0044aa;
	text-align: center;
	font: bold 24px/50px 'microsoft yahei';
	background: #f7f7f7;
}
.title {
	font-weight: bold;
	line-height: 40px;
	color: #545454;
}
/* 第一行图表样式 */
.chartBox1 {
	height: 220px;
	background: rgba(198, 198, 202, 0.1);
	margin-bottom: 10px;
}
.chartBox2 {
	height: 260px;
	background: rgba(198, 198, 202, 0.1);
	/* margin-bottom: 10px; */
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
