import axios from 'axios'
import qs from 'qs'

const api = axios.create({
    baseURL: 'http://localhost:8083/api',
    timeout: 60 * 1000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true // 允许跨域请求携带凭证
})

// 请求拦截器
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        // 处理 POST 请求的数据
        // if (config.method === 'post' || config.method === 'put') {
        //     config.data = qs.stringify(config.data)
        //     config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        // }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器
api.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export const userApi = {
    // 登录
    login: (data) => api.post('/auth/login', data),

    // 获取用户列表
    getUsers: (params) => api.get('/users', {params}),

    // 获取单个用户
    getUser: (id) => api.get(`/users/${id}`),

    // 创建用户
    createUser: (data) => api.post('/users', data),

    // 更新用户
    updateUser: (id, data) => api.put(`/users/${id}`, data),

    // 删除用户
    deleteUser: (id) => api.delete(`/users/${id}`),

    // 修改密码
    changePassword: (id, data) => api.put(`/users/${id}/password`, data),

    // 获取用户统计信息
    getUserStats: () => api.get('/users/stats')
} 