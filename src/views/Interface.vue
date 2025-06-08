<template>
	<div class="boxs">
		<el-tabs type="border-card" class="demo-tabs" style="height: calc(100vh - 65px);">
			
			<el-tab-pane label="项目接口">
				<el-button @click="clickAdd" size="mini" plain type="primary" icon="el-icon-plus" style="margin-bottom: 5px;">添加接口</el-button>
				<el-table :data="interfaces1" v-if="interfaces1">
					<el-table-column label="接口名称" prop="name" />
					<el-table-column label="请求方法" prop="method" />
					<el-table-column label="接口地址" prop="url" show-overflow-tooltip />
					<el-table-column label="操作" width="180">
						<template #default="scope">
							<el-button @click="clickEdit(scope.row)" size="mini" plain type="primary" icon="el-icon-edit-outline">编辑</el-button>
							<el-button @click="clickDel(scope.row.id)()" size="mini" type="danger" plain icon="el-icon-delete">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="外部接口">
				<el-button @click="clickAdd" size="mini" plain type="primary" icon="el-icon-plus" style="margin-bottom: 5px;">添加接口</el-button>
				<el-table :data="interfaces2" v-if="interfaces2">
					<el-table-column label="接口名称" prop="name" />
					<el-table-column label="请求方法" prop="method" />
					<el-table-column label="接口地址" prop="url" show-overflow-tooltip />
					<el-table-column label="操作" width="180">
						<template #default="scope">
							<el-button @click="clickEdit(scope.row)" size="mini" plain type="primary" icon="el-icon-edit-outline">编辑</el-button>
							<el-button @click="clickDel(scope.row.id)()" size="mini" type="danger" plain icon="el-icon-delete">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
	
		</el-tabs>
	</div>
	<!-- 添加项目的窗口 -->
	<el-dialog v-model="addDlg" title="添加接口" width="40%">
		<el-form :model="addForm">
			<el-form-item label="接口名称"><el-input v-model="addForm.name" autocomplete="off" /></el-form-item>
			<el-form-item label="URL地址"><el-input v-model="addForm.url" autocomplete="off" /></el-form-item>
			<el-form-item label="请求方法">
				<el-select style="width: 100%;" v-model="addForm.method" class="m-2" placeholder="请求选择请求方法" size="large">
					<el-option label="GET" value="GET" />
					<el-option label="POST" value="POST" />
					<el-option label="PUT" value="PUT" />
					<el-option label="PATCH" value="PATCH" />
					<el-option label="DELETE" value="DELETE" />
					<el-option label="DEAD" value="DEAD" />
				</el-select>
			</el-form-item>
			<el-form-item label="接口类型">
				<el-select style="width: 100%;" v-model="addForm.type" class="m-2" placeholder="选择接口" size="large">
					<el-option label="项目接口" value="1" />
					<el-option label="第三方接口" value="2" />
				</el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="addDlg = false" size="mini">取消</el-button>
				<el-button type="primary" @click="addInter" size="mini">确定</el-button>
			</span>
		</template>
	</el-dialog>

	<!-- 修改项目的窗口 -->
	<el-dialog v-model="editDlg" title="修改项接口" width="40%">
		<el-form :model="editForm">
			<el-form-item label="接口名称"><el-input v-model.trim="editForm.name" autocomplete="off" /></el-form-item>
			<el-form-item label="URL地址"><el-input v-model.trim="editForm.url" autocomplete="off" /></el-form-item>
			<el-form-item label="请求方法">
				<el-select style="width: 100%;" v-model="editForm.method" class="m-2" placeholder="请求选择请求方法" size="large">
					<el-option label="GET" value="GET" />
					<el-option label="POST" value="POST" />
					<el-option label="PUT" value="PUT" />
					<el-option label="PATCH" value="PATCH" />
					<el-option label="DELETE" value="DELETE" />
					<el-option label="DEAD" value="DEAD" />
				</el-select>
			</el-form-item>
			<el-form-item label="接口类型">
				<el-select style="width: 100%;" v-model="editForm.type" class="m-2" placeholder="选择接口" size="large">
					<el-option label="项目接口" value="1" />
					<el-option label="第三方接口" value="2" />
				</el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="editDlg = false" size="mini">取消</el-button>
				<el-button type="primary" @click="updateInter" size="mini">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
export default {
	data() {
		return {
			addDlg: false,
			addForm: {
				name: '',
				url: '',
				method: '',
				type: null,
				project: ''
			},
			editDlg: false,
			editForm: {
				name: '',
				url: '',
				method: '',
				type: null,
				project: ''
			}
		};
	},
	computed: {
		...mapState(['pro']),
		...mapGetters(['interfaces1', 'interfaces2'])
	},
	methods: {
		...mapActions(['getAllInter']),
		// 点击添加
		clickAdd() {
			this.addDlg = true;
			this.addForm = {
				name: '',
				url: '',
				method: '',
				type: null,
				project: this.pro.id
			};
		},
		// 点击修改
		clickEdit(info) {
			this.editDlg = true;
			this.editForm = { ...info };
		},
		// 点击删除
		clickDel(id) {
			ElMessageBox.confirm('确定要删除该接口吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.delInter(id);
				})
				.catch(() => {
					ElMessage({
						type: 'info',
						message: '取消删除',
						duration: 1000
					});
				});
		},
		// 添加接口
		async addInter() {
			const response = await this.$api.createInterface(this.addForm);
			if (response.status === 201) {
				ElMessage({
					type: 'success',
					message: '添加成功',
					duration: 1000
				});
				this.addDlg = false;
				this.getAllInter();
			}
		},
		// 修改接口信息
		async updateInter() {
			const response = await this.$api.updateInterface(this.editForm.id, this.editForm);
			if (response.status === 200) {
				ElMessage({
					type: 'success',
					message: '修改成功',
					duration: 1000
				});
				this.editDlg = false;
				this.getAllInter();
			}
		},
		// 删除接口
		async delInter(id) {
			const response = await this.$api.delInterface(id);
			if (response.status === 204) {
				ElMessage({
					type: 'success',
					message: '删除成功',
					duration: 1000
				});
				this.getAllInter();
			}
		}
	}
};
</script>

<style scoped>
.title {
	color: #ffffff;
	font: bold 18px/40px 'microsoft yahei';
}
</style>
