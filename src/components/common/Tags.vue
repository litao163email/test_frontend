<template>
	<div class="tags">
		<!-- 标签栏 -->
		<div class="tag_box">
			<el-scrollbar>
				<span v-for="tag in tags" :key="tag.name">
					<el-tag
						:closable="tags.length !== 1"
						@close="deletetag(tag.path)"
						@click="$router.push(tag.path)"
						v-if="tag.path === $route.path"
						type="primary"
						effect="dark"
						style="margin-left: 10px; cursor: pointer;"
					>
						{{ tag.name }}
					</el-tag>
					<el-tag closable v-else @close="deletetag(tag.path)" @click="$router.push(tag.path)" type="primary" style="margin-left: 10px; cursor: pointer;">
						{{ tag.name }}
					</el-tag>
				</span>
			</el-scrollbar>
		</div>

		<!-- 选择环境 -->
		<div class="select_env">
			<el-button @click="closeAllTag" type="primary" plain style="margin-right: 10px;">关闭其他标签</el-button>
			<el-select v-model="env" placeholder="选择环境" style="width: 180px;">
				<el-option v-for="item in testEnvs" :key="item.id" :label="item.name" :value="item.id" />
			</el-select>
			<el-tooltip v-if="env" class="box-item" effect="dark" content="查看环境信息" placement="bottom">
				<el-button @click="clickShowEnv" icon="el-icon-view"></el-button>
			</el-tooltip>
		</div>
	</div>
	<!-- 显示环境详情 -->
	<el-dialog v-model="showEnv" title="环境变量">
		<el-descriptions border :column="1" label-align>
			<el-descriptions-item :label="key" v-for="(value, key) in envInfo.debug_global_variable">
				<template #label>
					<el-tag type="warning">debug</el-tag>
					{{ key }}
				</template>
				{{ value }}
			</el-descriptions-item>
			<el-descriptions-item :label="key" v-for="(value, key) in envInfo.global_variable">
				<template #label>
					<el-tag type="primary">global</el-tag>
					{{ key }}
				</template>
				{{ value }}
			</el-descriptions-item>
		</el-descriptions>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="editEnv" type="primary" plain>编辑</el-button>
				<el-button @click="showEnv = false">关闭</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			showEnv: false,
			env_variable: [],
			envInfo: {}
		};
	},
	computed: {
		...mapState(['tags', 'envId', 'testEnvs']),
		env: {
			get() {
				return this.envId;
			},
			set(val) {
				this.selectEnv(val);
			}
		}
	},
	methods: {
		...mapMutations(['delTags', 'selectEnv']),
		async clickShowEnv() {
			// 获取单个环境信息
			const response = await this.$api.getEnvInfo(this.envId);
			if (response.status === 200) {
				this.envInfo = response.data;
			}
			this.showEnv = true;
		},
		// 删除标签页
		deletetag(path) {
			this.delTags(path);
			// 如果被激活的标签删除了，则跳转路由到前一个标签的路由
			if (this.$route.path === path) {
				this.$router.push(this.tags[this.tags.length - 1].path);
			}
		},
		// 关闭所有标签
		closeAllTag() {
			this.tags.forEach(item => {
				if (this.$route.path !== item.path) {
					this.delTags(item.path);
				}
			});
		},
		// 编辑环境
		editEnv() {
			this.showEnv = false;
			this.$router.push({ name: 'testenv' });
		}
	}
};
</script>

<style>
.tags {
	background: #0044aa;
  border-bottom: solid 1px #ffffff;
  height: 50px;
	margin: 2px 3px;
	line-height: 50px;
	display: flex;
}
.tag_box {
	flex: 1;
}
.select_env {
	width: 400px;
	/* background: #00b887; */
	border-left: solid 2px #0044aa;
	text-align: center;
}
</style>
