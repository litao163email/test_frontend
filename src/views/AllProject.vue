<template>
	<div class="pros_box">
		<div class="title">
			<span>项目列表</span>
			<el-button type="danger" icon="el-icon-user" size="mini" style="float: right;margin-left: 10px;" @click="logout">退出登录</el-button>
			<el-button type="primary" icon="el-icon-plus" size="mini" style="float: right;" @click="clickAdd">添加项目</el-button>
		</div>

		<!-- 显示项目列表 -->
		<el-card style="width: 200px;height: 250px; float: left;margin: 20px;" v-for="item in pro_list">
			<div @click="clickView(item)" style="cursor: pointer;">
				<span class="el-icon-s-platform pro_icon"></span>
				<div class="pro_name">{{ item.name }}</div>
				<div class="pro_leadr">负责人&nbsp;:&nbsp;{{ item.leader }}</div>
			</div>
			<div class="pro_edit">
				<el-tag @click.stop="clickEdit(item)" class="ml-2" type="primary" style="float: left;cursor: pointer;"><span class="el-icon-edit-outline">&nbsp;编辑</span></el-tag>
				<el-tag @click.stop="clickDelete(item.id)" class="ml-2" type="danger" style="float: right;cursor: pointer;background: none;">
					<span class="el-icon-delete">&nbsp;删除</span>
				</el-tag>
			</div>
		</el-card>
		<!-- 添加按钮 -->
		<el-card style="width: 200px;height: 250px; float: left;margin: 20px;" @click="clickAdd">
			<span class="el-icon-plus" style=" color: #c2c2c2;font: normal 60px/200px 'microsoft yahei';display: block;text-align: center;"></span>
		</el-card>

		<!-- 表格展示 -->
		<!-- <el-table :data="pro_list" stripe style="width: 100%" size="mini" border>
			<el-table-column prop="name" label="项目名" min-width="180" />
			<el-table-column prop="leader" label="创建者" min-width="100" />
			<el-table-column label="创建日期" min-width="180">
				<template #default="scope">
					{{ $tools.rDate(scope.row.create_time) }}
				</template>
			</el-table-column>
			<el-table-column label="操作" width="280">
				<template #default="scope">
					<el-button size="small" type="success" icon="el-icon-view" plain @click="clickView(scope.row)">查看</el-button>
					<el-button size="small" type="success" icon="el-icon-edit-outline" plain @click="clickEdit(scope.row)">编辑</el-button>
					<el-button size="small" type="danger" icon="el-icon-delete" plain @click="clickDelete(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table> -->
	</div>
	<!-- 添加项目的弹框 -->
	<el-dialog v-model="addDlg" title="添加项目" width="40%">
		<el-form :model="addForm">
			<el-form-item label="项目名"><el-input v-model="addForm.name" autocomplete="off" /></el-form-item>
			<el-form-item label="负责人"><el-input v-model="addForm.leader" autocomplete="off" /></el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="addDlg = false" size="mini">取消</el-button>
				<el-button type="primary" @click="addPro" size="mini">确定</el-button>
			</span>
		</template>
	</el-dialog>
	<!-- 修改项目 -->
	<el-dialog v-model="updateDlg" title="修改项目" width="40%">
		<el-form :model="updateForm">
			<el-form-item label="项目名"><el-input v-model="updateForm.name" autocomplete="off" /></el-form-item>
			<el-form-item label="负责人"><el-input v-model="updateForm.leader" autocomplete="off" /></el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="updateDlg = false" size="mini">取消</el-button>
				<el-button type="primary" @click="updatePro" size="mini">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus';
import { mapMutations } from 'vuex';

export default {
	data() {
		return {
			pro_list: [],
			// 添加项目
			addDlg: false,
			addForm: {
				name: '',
				leader: ''
			},
			// 修改项目
			updateDlg: false,
			updateForm: {
				name: '',
				leader: ''
			}
		};
	},
	methods: {
		...mapMutations(['selectPro']),
		async getAllPro() {
			const response = await this.$api.getProjects();
			if (response.status === 200) {
				this.pro_list = response.data;
			}
		},
		// 点击进入项目
		clickView(pro) {
			// 将选中的项目信息保存的vuex
			this.selectPro(pro);
			// 路由跳转
			this.$router.push({ name: 'home' });
		},
		// 点击添加项目按钮
		clickAdd() {
			// 将添加表单置空
			this.addForm = {
				name: '',
				leader: ''
			};
			// 显示模态框
			this.addDlg = true;
		},
		// 点击编辑项目按钮
		clickEdit(info) {
			this.updateForm = { ...info };
			this.updateDlg = true;
		},
		// 点击删除按钮
		clickDelete(id) {
			ElMessageBox.confirm('确定要删除该项目吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.deletePro(id);
				})
				.catch(() => {
					ElMessage({
						type: 'info',
						message: '取消删除'
					});
				});
		},
		// 添加项目
		async addPro() {
			const response = await this.$api.createProjects(this.addForm);
			if (response.status === 201) {
				this.$message({
					message: '添加成功!',
					type: 'success',
					duration: 1000
				});
				// 刷新页面数据
				this.getAllPro();
				this.addDlg = false;
			}
		},
		// 修改项目
		async updatePro() {
			const response = await this.$api.updateProjects(this.updateForm.id, this.updateForm);
			if (response.status === 200) {
				this.$message({
					message: '修改成功!',
					type: 'success',
					duration: 1000
				});
				// 刷新页面数据
				this.getAllPro();
				this.updateDlg = false;
			}
		},
		// 删除项目
		async deletePro(id) {
			const response = await this.$api.delProject(id);
			if (response.status === 204) {
				this.$message({
					message: '删除成功',
					type: 'success',
					duration: 1000
				});
				this.getAllPro();
			}
		},
		// 退出登录
		logout() {
			window.sessionStorage.removeItem('token');
			this.$message({
				message: '已注销登录状态',
				type: 'warning',
				duration: 1000
			});
			this.$router.push({ name: 'login' });
		}
	},
	created() {
		this.getAllPro();
	}
};
</script>

<style scoped>
.title {
	height: 30px;
	color: #0044aa;
	font: bold 20px/30px 'microsoft yahei';
	border-bottom: #0044aa 5px solid;
	margin: 30px 0px;
}

.pros_box {
	margin: 50px auto;
	max-width: 1480px;
}
/* ======================项目盒子样式================= */
/* 项目图表 */
.pro_icon {
	font: bold 28px/60px 'microsoft yahei';
	color: #0044aa;
	display: block;
	background: #e1ffed;
	width: 60px;
	height: 60px;
	text-align: center;
	border-radius: 30px;
	margin: 0 auto;
}
/* 项目名称 */
.pro_name {
	margin-top: 20px;
	text-align: center;
	font: bold 18px/30px '粗体';
}
/* 负责人 */
/* 项目名称 */
.pro_leadr {
	text-align: center;
	font: normal 12px/20px 'microsoft yahei';
	color: #a5a5a5;
}

/* 按钮 */
.pro_edit {
	margin-top: 60px;
}
.pro_title span {
	font-size: 12px !important;
}
</style>
