<template>
	<div v-if="record">
		<el-row v-if="report">
			<el-col :span="12">
				<el-scrollbar height="calc(100vh - 65px)">
					<el-card>
						<div class="report_title">
							<i class="el-icon-s-marketing"></i>
							测试报告
						</div>
						<el-descriptions :column="5" border title="执行信息" direction="vertical">
							<el-descriptions-item label="执行时间">{{ $tools.rTime(record.create_time) }}</el-descriptions-item>
							<el-descriptions-item label="执行任务">{{ record.plan_name }}</el-descriptions-item>
							<el-descriptions-item label="测试环境">{{ record.env_name }}</el-descriptions-item>
							<el-descriptions-item label="通过率">{{ record.pass_rate + '%' }}</el-descriptions-item>
						</el-descriptions>
					</el-card>
					<el-card body-style="padding:5px">
						<el-row :gutter="5">
							<!-- 用例信息图表 -->
							<el-col :span="13"><div class="chartBox" ref="chart1"></div></el-col>
							<!-- 通过率图表 -->
							<el-col :span="11"><div class="chartBox" ref="chart2"></div></el-col>
						</el-row>
					</el-card>
					<el-card>
						<el-descriptions :column="4" border title="测试场景统计" direction="vertical">
							<el-descriptions-item label="场景总数">{{ report.results.length }}</el-descriptions-item>
							<el-descriptions-item label="通过场景">{{ successscent.length }}</el-descriptions-item>
							<el-descriptions-item label="失败场景">{{ failscent.length }}</el-descriptions-item>
							<el-descriptions-item label="错误场景">{{ errorscent.length }}</el-descriptions-item>
						</el-descriptions>
					</el-card>


					<el-card>
						<b style="line-height: 30px;">未通过场景</b>
						<div>
							<el-button plain size="mini" @click="showScentDatas = [su]" type="danger" v-for="su in errorscent">{{ su.name }}</el-button>
							<el-button plain size="mini" @click="showScentDatas = [su]" type="warning" v-for="su in failscent">{{ su.name }}</el-button>
						</div>
					</el-card>
					<el-card>
						<b style="line-height: 30px;">通过场景</b>
						<div>
							<el-button plain size="mini" @click="showScentDatas = [su]" type="primary" v-for="su in successscent">{{ su.name }}</el-button>
						</div>
					</el-card>
				</el-scrollbar>
			</el-col>

<!--      过滤展示的数据-->
			<el-col :span="12">
				<div>
					<div style="margin: 5px;">
						<el-button size="small" type="primary" plain @click="showScentDatas = { ...report.results }">所有场景</el-button>
						<el-button size="small" type="success" plain @click="showScentDatas = successscent">成功场景</el-button>
						<el-button size="small" type="warning" plain @click="showScentDatas = failscent">失败场景</el-button>
						<el-button size="small" type="danger" plain @click="showScentDatas = errorscent">错误场景</el-button>
					</div>
					<el-scrollbar height="calc(100vh - 117px)">
						<div class="right_box">
							<el-card v-for="(scent, index) in showScentDatas" :key="index">
								<div class="title" v-if="scent.state == 'success'">
									<i class="el-icon-upload"></i>
									{{ '测试场景 : ' + scent.name + '【通过】' }}
								</div>
								<div class="title" v-else-if="scent.state == 'fail'" style="color: coral;">
									<i class="el-icon-upload"></i>
									{{ '测试场景 : ' + scent.name + '【失败】' }}
								</div>
								<div class="title" v-else style="color: red;">
									<i class="el-icon-upload"></i>
									{{ '测试场景 : ' + scent.name + '【错误】' }}
								</div>




								<el-table :data="scent.cases" style="width: 100%;" class="result" :show-header="false">
									<el-table-column type="expand">
										<template #default="scope">
											<caseRes :result="scope.row"></caseRes>
										</template>
									</el-table-column>

									<el-table-column :show-overflow-tooltip="true" label="用例名称" prop="name" min-width="100px"></el-table-column>
									<el-table-column label="请求方法" prop="method" min-width="40px"></el-table-column>
									<el-table-column label="状态码" prop="status_cede" min-width="40px"></el-table-column>
									<el-table-column label="断言结果" prop="state" min-width="40px">
										<template #default="scope">
											<span v-if="scope.row.state == '成功'" style="color: #00AA7F;">成功</span>
											<span v-else-if="scope.row.state == '失败'" style="color: #ffaa00">失败</span>
											<span v-else style="color:#F56C6C">错误</span>
										</template>
									</el-table-column>

								</el-table>
							</el-card>
						</div>
					</el-scrollbar>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import { mapStates } from 'vuex';
import caseRes from '../components/common/caseResult.vue';
export default {
	components: {
		caseRes
	},
	data() {
		return {
			// record 运行记录信息
			record: null,
			// 报告信息
			report: null,
			// 显示的测试场景数据
			showScentDatas: null
		};
	},
	methods: {
		async getReportInfo(id) {
			const response = await this.$api.getTestReport(id);
			// 判断http响应状态码
			if (response.status === 200) {
				this.report = response.data.info;
				this.showScentDatas = { ...this.report.results };
			}
		},
		async getRecordInfo(id) {
			const response = await this.$api.getRecordInfo(id);
			if (response.status === 200) {
				this.record = response.data;
			}
		},
		// 执行信息图表
		chart1() {
			const value = [this.report.all, this.report.success, this.report.fail, this.report.error];
			const label = ['用例总数', '通过用例', '失败用例', '错误用例'];
			this.$chart.chart1(this.$refs.chart1, value, label);
		},
		// 通过率图表
		chart2() {
			const datas = [{ value: this.report.success, name: '通过' }, { value: this.report.fail, name: '失败' }, { value: this.report.error, name: '错误' }];
			this.$chart.chart2(this.$refs.chart2, datas);
		}
	},
	computed: {
		successscent() {
			return this.report.results.filter(function(val, index, array) {
				return val.state === 'success';
			});
		},
		failscent() {
			return this.report.results.filter(function(val, index, array) {
				return val.state === 'fail';
			});
		},
		errorscent() {
			return this.report.results.filter(function(val, index, array) {
				return val.state === 'error';
			});
		}
	},
	async created() {
		const id = this.$route.params.id;
		this.getReportInfo(id);
		this.getRecordInfo(id);
	},
	updated() {
		if (this.$refs.chart1) this.chart1();
		if (this.$refs.chart2) this.chart2();
	}
};
</script>

<style scoped>
.right_box .title {
	font: bold 18px/20px 'microsoft yahei';
	text-indent: 10px;
	color: #55aa7f;
}
.el-card {
	margin: 5px;
}
.report_title {
	font: bold 24px/50px 'microsoft yahei';
	text-align: center;
	color: #00aa7f;
}
/* 图标盒子样式 */
.chartBox {
	height: 200px;
	background: rgba(198, 198, 202, 0.1);
}

/* 场景标签样式 */
.el-tag {
	margin: 5px;
	cursor: pointer;
}
</style>
