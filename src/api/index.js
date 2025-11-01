import axios from 'axios'
import router from '../router/index.js'
import {
	ElMessage
} from 'element-plus';
// 设置后台域名
axios.defaults.baseURL = 'http://127.0.0.1:8000/'
axios.defaults.validateStatus = function(status) {
	return true
}
// 自动携带cookies
// axios.defaults.withCredentials = true;

// 通过requests拦截器，获取sessionStirage中的token，添加到请求头中
axios.interceptors.request.use(config => {
	if (config.url != '/users/login/') {
		config.headers.Authorization = 'Bearer ' + window.sessionStorage.getItem('token')
	}
	return config
})

// 添加响应拦截器
axios.interceptors.response.use(function(response) {
	//响应状态码正常不做处理
	if (response.status === 200) return response
	if (response.status === 201) return response
	if (response.status === 204) return response
	// 异常响应状态码的处理
	// 判断响应状态码是否为401,并且不是登录接口
	if (response.status === 401 && response.config.url !== '/users/login/') {
		window.localStorage.removeItem('token')
		// 路由跳转到登录页面
		router.push({
			name: 'login'
		})
		ElMessage({
			message: '您未登录,请先进行登录!',
			type: 'warning',
			duration: 1000
		});
	} else if (response.status === 400) {
		ElMessage({
			message: response.data,
			type: 'warning',
			duration: 1000
		});
	} else if (response.status === 500) {
		ElMessage({
			message: '【code:5000】服务端异常！',
			type: 'warning',
			duration: 1000
		});
	} else {
		// 其他的响应状态码提示
		ElMessage({
			message: response.data.detail,
			type: 'warning',
			duration: 1000
		});
	}
	return response;
});

export default {
	// 上传文件接口信息
	uploadApi: {
		url: axios.defaults.baseURL + 'upload/',

	},

	//--------------------用户登录----------------------------------
	// 登录接口
	login(params) {
		return axios.post('/users/login/', params)
	},
	// -------------------项目增删查改-------------------------------
	// 获取所有项目
	getProjects() {
		return axios.get('/projects/')
	},
	// 获取单个项目详情
	getProject(id) {
		return axios.get(`/projects/${id}/`)
	},
	// 删除项目
	delProject(id) {
		return axios.delete(`/projects/${id}/`)
	},
	// 添加项目
	createProjects(params) {
		return axios.post('/projects/', params)
	},
	// 编辑项目项目
	updateProjects(id, params) {
		return axios.patch(`/projects/${id}/`, params)
	},
	// ================接口增删查改===================
	// 获取所有接口
	getInterfaces(project_id, type) {
		return axios.get(`/interfaces/`, {
			params: {
				project: project_id,
				type: type
			}
		})
	},
	// 删除接口
	delInterface(id) {
		return axios.delete(`/interfaces/${id}/`)
	},
	// 添加接口
	createInterface(params) {
		return axios.post('/interfaces/', params)
	},
	// 修改接口
	updateInterface(id, params) {
		return axios.patch(`/interfaces/${id}/`, params)
	},
	// ============测试场景相关的接口====================
	// 获取项目所有测试场景
	getTestScent(params) {
		return axios.get(`/test_scenes/`, {
			params: params
		})
	},
	// 获取单个测试场景下的详细数据
	getScentInfo(scren_id) {
		return axios.get(`/test_scenes/${scren_id}/`)
	},
	// 删除测试场景
	delTestScent(id) {
		return axios.delete(`/test_scenes/${id}/`)
	},
	// 添加测试场景
	createTestScent(params) {
		return axios.post('/test_scenes/', params)
	},
	// 修改测试场景
	updateTestScent(id, params) {
		return axios.patch(`/test_scenes/${id}/`, params)
	},
	// ==============测试场景中的数据==================
	// 修改测试场景中的执行步骤顺序
	updateScentDataOrder(params) {
		return axios.put('/test_scene_steps/order/', params)
	},
	// 获取测试场景数据
	getScentDatas(scentId) {
		return axios.get(`/test_scene_steps/`, {
			params: {
				scene: scentId
			}
		})
	},

	// 添加步骤到测试场景中
	addScentData(params) {
		return axios.post('/test_scene_steps/', params)
	},
	// 删除测试场景中的步骤
	delScentData(id) {
		return axios.delete(`/test_scene_steps/${id}/`)
	},

	// ==============测试步骤相关的接口================
	getTeststep(params) {
		return axios.get(`/test_steps/`, {
			params: params
		})
	},
	// 获取单个测试步骤
	getTestStepInfo(id) {
		return axios.get(`/test_steps/${id}/`)
	},
	// 删除测试步骤
	delTeststep(id) {
		return axios.delete(`/test_steps/${id}/`)
	},
	// 创建测试步骤
	createTeststep(params) {
		return axios.post('/test_steps/', params)
	},
	// 修改测试步骤
	updateTeststep(id, params) {
		return axios.patch(`/test_steps/${id}/`, params)
	},


	// ============测试计划相关的接口====================
	// 获取项目所有测试计划
	getTestPlan(project_id) {
		return axios.get(`/test_plans/`, {
			params: {
				project: project_id
			}
		})
	},
	// 删除测试计划
	delTestPlan(id) {
		return axios.delete(`/test_plans/${id}/`)
	},
	// 添加测试计划
	createTestPlan(params) {
		return axios.post('/test_plans/', params)
	},
	// 修改测试计划
	updateTestPlan(id, params) {
		return axios.patch(`/test_plans/${id}/`, params)
	},
	// ============测试环境相关的接口====================
	// 获取项目所有测试环境
	getTestEnvs(project_id) {
		return axios.get(`/test_envs/`, {
			params: {
				project: project_id
			}
		})
	},
	getEnvInfo(id) {
		return axios.get(`/test_envs/${id}/`)
	},
	// 删除测试环境
	delTestEnvs(id) {
		return axios.delete(`/test_envs/${id}/`)
	},
	// 添加测试环境
	createTestEnvs(params) {
		return axios.post('/test_envs/', params)
	},
	// 修改测试环境
	updateTestEnvs(id, params) {
		return axios.patch(`/test_envs/${id}/`, params)
	},
	// ==========================定时任务接口================
	// 获取所有定时任务
	getCrons(project_id) {
		return axios.get(`/crontab_tasks/`, {
			params: {
				project: project_id
			}
		})
	},
	// 删除定时任务
	delCron(id) {
		return axios.delete(`/crontab_tasks/${id}/`)
	},
	// 添加定时任务
	createCron(params) {
		return axios.post('/crontab_tasks/', params)
	},
	// 修改定时任务
	updateCron(id, params) {
		return axios.patch(`/crontab_tasks/${id}/`, params)
	},


	// ===================测试记录==========================
	// 获取所有的测试记录
	getTestRecord(params) {
		return axios.get(`/records/`, {
			params: params
		})
	},
	getRecordInfo(id) {
		return axios.get(`/records/${id}/`)
	},
	// 获取测试报告信息
	getTestReport(id) {
		return axios.get(`/records/${id}/report/`)
	},
	//=====================bug管理======================
	// 获取所有bug
	getBugs(params) {
		return axios.get('/bugs/', {
			params: params
		})
	},
	// 添加bug记录
	createBugs(params) {
		return axios.post('/bugs/', params)
	},
	// 修改bug记录
	updateBug(id, params) {
		return axios.patch(`/bugs/${id}/`, params)
	},
	// 删除bug
	deleteBug(id) {
		return axios.delete(`/bugs/${id}/`)
	},
	//=====================获取bug处理记录列表======================
	getBugLogs(params) {
		return axios.get('/blogs/', {
			params: params
		})
	},


	// =================用例运行===========================
	// 运行测试的接口
	runTest(params) {
		return axios.post('/runTest/', params)
	},
	// 运行单用例的接口
	runCase(params) {
		return axios.post('/test_steps/run/', params)
	},
	// 运行单个场景的接口
	runScene(id, params) {
		return axios.post(`/test_scenes/${id}/run/`, params)
	},
	// 运行测试计划的接口
	runPlan(id, params) {
		return axios.post(`/test_plans/${id}/run/`, params)
	},

	// ================文件上传操作========================
	// 上传文件
	uploadFile(params) {
		// 功能待完善
		return axios.post('/upload/', params)
	},
	// 获取文件列表
	getFiles() {
		return axios.get('/upload/')
	},
	// 删除文件
	deleteFile(id) {
		return axios.delete(`/upload/${id}/`)
	}


}
