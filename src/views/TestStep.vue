<template>
	<el-row>
		<!-- 左边内容 -->
		<el-col :span="4">
			<div class="data_box">
				<el-tabs type="border-card" stretch>
					<el-tab-pane label="项目接口">
						<el-button @click="$router.push({ name: 'interface' })" type="primary" plain size="mini" style="width: 100%;" icon="el-icon-paperclip">接口管理</el-button>
						<el-scrollbar height="calc(100vh - 130px);">
							<el-menu class="el-menu-vertical-demo" active-text-color="#0044aa" text-color="#000000" style="background: none;border: none;">
								<el-submenu :index="item.id.toString()" v-for="item in interfaces1">
									<template #title>
										<span class="el-icon-paperclip"></span>
										<span>{{ item.name }}</span>
									</template>
									<el-menu-item :index="step.id.toString()" v-for="step in item.steps" @click="stepId = step.id">
										<span class="el-icon-link"></span>
										<span>{{ step.title }}</span>
									</el-menu-item>
									<el-menu-item @click="clickAdd(item.id)">
										<div style="color: #ffaa00;">
											<span class="el-icon-circle-plus-outline"></span>
											<span>添加用例</span>
										</div>
									</el-menu-item>
								</el-submenu>
							</el-menu>
						</el-scrollbar>
					</el-tab-pane>


					<el-tab-pane label="外部接口">
						<el-button @click="$router.push({ name: 'interface' })" type="primary" plain size="mini" style="width: 100%;" icon="el-icon-paperclip">接口管理</el-button>
						<el-scrollbar height="calc(100vh - 130px);">
							<el-menu class="el-menu-vertical-demo" active-text-color="#0044aa" text-color="#000000" style="background: none;border: none;">
								<el-submenu :index="item.id.toString()" v-for="item in interfaces2">
									<template #title>
										<span class="el-icon-paperclip"></span>
										<span>{{ item.name }}</span>
									</template>
									<el-menu-item :index="step.id.toString()" v-for="step in item.steps" @click="stepId = step.id">
										<span class="el-icon-link"></span>
										<span>{{ step.title }}</span>
									</el-menu-item>
									<el-menu-item @click="clickAdd(item.id)">
										<div style="color: #ffaa00;">
											<span class="el-icon-circle-plus-outline"></span>
											<span>添加请求</span>
										</div>
									</el-menu-item>
								</el-submenu>
							</el-menu>
						</el-scrollbar>
					</el-tab-pane>
				</el-tabs>
			</div>
		</el-col>


		<!-- 右边内容 -->
		<el-col :span="20" style="padding: 0 20px">
			<!-- 用例编辑页面 -->
			<editCase :step="stepId"></editCase>
		</el-col>
		
	</el-row>
	<!-- 添加用例的弹框 -->
	<el-dialog v-model="addDlg" title="添加接口" width="40%">
		<el-form :model="addCaseForm">
			<el-form-item label="用例名称"><el-input v-model="addCaseForm.title" autocomplete="off" /></el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="addDlg = false" size="mini">取消</el-button>
				<el-button type="primary" @click="addCase" size="mini">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import editCase from '../components/common/editCase.vue';
import DataList from '../components/common/DataList.vue';
export default {
	components: {
		DataList,
		editCase
	},
	data() {
		return {
			// 选中的测试用例
			stepId: null,
			// 选中的测试环境
			env: null,
			addDlg: false,
			addCaseForm: {
				title: ''
			}
		};
	},
	computed: {
		...mapState(['interfaces', 'testEnvs']),
		...mapGetters(['interfaces1', 'interfaces2'])
	},
	methods: {
		...mapActions(['getAllInter']),
		// 点击添加用例
		clickAdd(interId) {
			this.addDlg = true;
			this.addCaseForm.interface = interId;
		},
		async addCase() {
			const response = await this.$api.createTeststep(this.addCaseForm);
			if (response.status === 201) {
				this.addDlg = false;
				this.$message({
					type: 'success',
					message: '添加成功',
					duration: 1000
				});
				this.getAllInter();
			}
		}
	}
};
</script>

<style scoped>
.data_box {
  box-shadow: 0 0 5px #0044aa;
}
</style>
