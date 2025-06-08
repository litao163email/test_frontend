<template>
	<el-button @click='dialogCron=true;updateBtn=false' style="margin: 10px 5px;" type="primary" icon="el-icon-plus" size="mini">添加定时任务</el-button>

	<el-table :data="cronList" style="width: 100%" size="mini">
		<el-table-column label="创建时间" min-width="180">
			<template #default="scope">
				{{ $tools.rTime(scope.row.create_time) }}
			</template>
		</el-table-column>
		<el-table-column prop="name" label="名称" min-width="140"></el-table-column>
		<el-table-column prop="plan" label="执行任务" min-width="140"></el-table-column>
		<el-table-column prop="env" label="执行环境" min-width="140"></el-table-column>
		<el-table-column prop="rule" label="执行规则" min-width="140"></el-table-column>
		<el-table-column label="是否开启" min-width="120">
			<template #default="scope">
				<el-switch @change='switchCronStatus(scope.row)' v-model="scope.row.status" active-color="#0044aa" inactive-color="#b1b1b1"></el-switch>
			</template>
		</el-table-column>
		<el-table-column label="操作" min-width="100">
			<template #default="scope">
				<el-tooltip class="item" effect="dark" content="编辑" placement="top">
					<el-button @click='showUpdateCronDlg(scope.row)' type="primary" size="mini"  icon="el-icon-edit-outline"></el-button>
				</el-tooltip>
				<el-tooltip class="item" effect="dark" content="删除" placement="top">
					<el-button @click="delCron(scope.row.id)" type="danger" size="mini" icon="el-icon-delete" ></el-button>
				</el-tooltip>
			</template>
		</el-table-column>
	</el-table>

	<!-- 创建or修改定时任务的窗口 -->
	<el-dialog v-model="dialogCron" width="45%">
	    <div style="text-align: center" slot='title'>
	        <span  v-if="updateBtn" style="font-size: 18px; font-weight: bold;">修改定时执行任务</span>
			<span  v-else style="font-size: 18px; font-weight: bold;">创建定时执行任务</span>
	    </div>
	    <el-form :model="cronTabData" ref="cronTabData" label-width="80px">
			<el-form-item label="名称">
			    <el-input v-model="cronTabData.name"></el-input>
			</el-form-item>
	        <el-form-item label="测试环境">
	            <el-select v-model="cronTabData.env" placeholder="请选择环境" style="width: 100%;">
	                <el-option v-for="item in testEnvs" :key="item.id" :label="item.name" :value="item.id">
	                </el-option>
	            </el-select>
	        </el-form-item>
			<el-form-item label="执行计划">
				 <el-select style="width: 100%;" v-model="cronTabData.plan" placeholder="请选择">
				    <el-option
				      v-for="item in testPlans"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				  </el-select>
			</el-form-item>
	        <el-form-item label="是否开启">
				<el-switch
				  v-model="cronTabData.status"
				  active-color="#0044aa"
				  inactive-color="#c3c3c3">
				</el-switch>
	        </el-form-item>

	        <el-form-item label="定时规则">
	            <el-input v-model="cronTabData.rule" placeholder="* * * * *"></el-input>
	            <el-row :gutter="20">
	                <el-col :span="14">
	                    <h5>规则说明:</h5>
	                    <div style="font-size: 12px; line-height: 16px;">* * * * * <span style="color:#909399">分别表示
								minute hour week day
								month </span></div>
	                    <div style="font-size: 12px; line-height: 16px">minute： <span
	                            style="color:#909399">表示分钟，可以是从0到59之间的任何整数。</span></div>
	                    <div style="font-size: 12px; line-height: 16px">hour：<span
	                            style="color:#909399">表示小时，可以是从0到23之间的任何整数。</span>
	                    </div>
	                    <div style="font-size: 12px; line-height: 16px">week：<span
	                            style="color:#909399">表示星期几，可以是从0到7之间的任何整数，这里的0或7代表星期日。</span>
	                    </div>
	                    <div style="font-size: 12px; line-height: 16px">day：<span
	                            style="color:#909399">表示日期，可以是从1到31之间的任何整数。</span>
	                    </div>
	                    <div style="font-size: 12px; line-height: 16px">month：<span
	                            style="color:#909399">表示月份，可以是从1到12之间的任何整数。</span>
	                    </div>

	                </el-col>
	                <el-col :span="10">
	                    <h5>配置案例：</h5>
	                    <div style="font-size: 12px;line-height: 16px">5 * * * * : <span
	                            style="color:#909399">每小时的第5分钟执行一次任务</span>
	                    </div>
	                    <div style="font-size: 12px;line-height: 16px">30 9 * * * : <span
	                            style="color:#909399">每天上午的 9:30
								执行一次任务</span></div>
	                    <div style="font-size: 12px;line-height: 16px">30 9 * 8 * : <span
	                            style="color:#909399">每月8号上午的9:30执行一次任务
							</span></div>
	                    <div style="font-size: 12px;line-height: 16px">30 9 * 5 3 : <span style="color:#909399">
								每年的3月5日9:30执行一次任务</span></div>
	                    <div style="font-size: 12px;line-height: 16px">30 9 0 * * : <span
	                            style="color:#909399">每星期日的上午9:30执行一次任务</span></div>
	                </el-col>
	            </el-row>
	        </el-form-item>
	    </el-form>
	    <div slot="footer" class="dialog-footer" style="text-align: center;">
	        <el-button @click="dialogCron=false" size="mini">取 消</el-button>
			<el-button v-if="updateBtn" type="primary" @click="UpdateCron()" size="mini">提交修改</el-button>
	        <el-button v-else type="primary" @click="createCron()" size="mini">创 建</el-button>
	    </div>
	</el-dialog>

</template>

<script>
import { mapState,mapActions } from 'vuex';
export default{

	data(){
		return{
			// 定时任务列表
			cronList:null,
			dialogCron:false,
			updateBtn:true,
			// 添加定时任务
			cronTabData:{
				name: "冒烟测试定期执行",
				rule: "* * * * *",
				status: true,
				plan: null,
				env:null
			},
		}
	},
	computed:{
		...mapState(['pro','testEnvs','testPlans'])
	},
	methods:{
		async getAllCron(){
			const response =await  this.$api.getCrons(this.pro.id)
			if (response.status ===200){
				this.cronList = response.data
			}
		},
		delCron(id) {
			this.$confirm('此操作将永久删除该定时任务, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(async () => {
					// 删除定时任务
					const response = await this.$api.delCron(id)
					if(response.status ===204){
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						// 刷新页面定时任务
						this.getAllCron()
					}
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
		},
		// 任务开启和关闭
		async switchCronStatus(cron){
			const response = await this.$api.updateCron(cron.id, cron)
			if (response.status === 200) {
				if (cron.status == true) {
					this.$message({
						type: 'success',
						message: '定时运行已开启',
						duration: 1000
					})
				} else {
					this.$message({
						type: 'warning',
						message: '定时运行已关闭',
						duration: 1000
					})
				}
			} else {
				this.$message({
					type: 'error',
					message: '修改状态失败',
					duration: 1000
				})
			}
		},

		// 添加定时任务
		async createCron(){
			const params = {
				project:this.pro.id,
				...this.cronTabData
			}
			const response = await this.$api.createCron(params)
			if (response.status ===201){
				this.$message({
					type: 'success',
					message: '定时任务添加成功',
					duration: 1000
				})
				this.dialogCron = false
				this.getAllCron()
			}
		},
		//显示修改定时任务的窗口
		showUpdateCronDlg(cron){
			this.cronTabData = {...cron}
			this.dialogCron = true
			// 显示修改按钮
			this.updateBtn = true
		},
		// 修改定时任务
		async UpdateCron(){
			const response = await this.$api.updateCron(this.cronTabData.id,this.cronTabData)
			if (response.status ===200){
				this.$message({
					type: 'success',
					message: '修改成功',
					duration: 1000
				})
				this.dialogCron = false
				this.getAllCron()
			}
		},
	},
	created() {
		this.getAllCron()
	}
}

</script>

<style>
</style>
