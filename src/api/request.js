import axios from 'axios'
import { BASE_URL } from './config'
import router from '../router'
import { ElMessage } from 'element-plus'
import store from '../store'

axios.defaults.timeout = 5000
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 根据环境设置基础URL
if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = BASE_URL
} else {
  axios.defaults.baseURL = BASE_URL
}

// 请求拦截器 - 添加token
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  response => {
    // 直接返回response，让get/post函数自己处理response.data
    return Promise.resolve(response)
  },
  error => {
    if (error.response?.status) {
      switch (error.response.status) {
        case 401: {
          // 排除登录和注册接口，这些接口的401是正常的业务逻辑（用户名密码错误）
          const url = error.config?.url || ''
          const method = error.config?.method?.toLowerCase() || 'get'
          const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register')
          
          // 公开接口（不需要认证的接口）不应该触发登出
          // 根据后端路由配置，以下接口不需要认证：
          // - GET /course/:courseId/comments (获取评论)
          // - POST /course/:courseId/view (增加浏览量)
          // - GET /course/:courseId (获取课程详情)
          // - GET /course/:courseId/resources (获取资源)
          // - GET /course (获取课程列表)
          // - GET /tools (获取工具列表)
          // - GET /projects (获取项目列表)
          const isPublicGetEndpoint = method === 'get' && (
            (url.includes('/course') && !url.includes('/collections') && !url.includes('/like') && !url.includes('/submit')) ||
            (url.includes('/tools') && !url.includes('/collections') && !url.includes('/like') && !url.includes('/submit')) ||
            (url.includes('/projects') && !url.includes('/collections') && !url.includes('/like') && !url.includes('/upload'))
          )
          const isPublicPostEndpoint = method === 'post' && url.includes('/view') && url.includes('/course')
          
          if (!isAuthEndpoint && !isPublicGetEndpoint && !isPublicPostEndpoint) {
            // 只有在需要认证的接口返回401时，才清除登录状态
            // 公开接口的401可能是服务器错误，不应该触发登出
            localStorage.removeItem('token')
            // 清除store中的登录状态
            store.commit('setToken', '')
            store.commit('setLoginIn', false)
            store.commit('setToolsIsAuthenticated', false)
            // 使用 fullPath 字符串，而不是 currentRoute 对象
            const currentPath = router.currentRoute.value?.fullPath || '/home'
            // 避免在登录页时重复重定向
            if (router.currentRoute.value?.path !== '/') {
              router.replace({
                path: '/',
                query: {
                  redirect: currentPath
                }
              })
            }
          }
          // 登录/注册接口和公开接口的401，不处理，让业务代码自己处理
          break
        }
        case 403:
          ElMessage.error('权限不足')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器错误')
          break
        default:
          ElMessage.error('网络错误')
      }
    }
    return Promise.reject(error)
  }
)

export function get (url, params = {}, config = {}) {
  return new Promise((resolve, reject) => {
    // 如果config是字符串（旧版本的responseType），则转换为配置对象
    if (typeof config === 'string') {
      config = { responseType: config }
    }
    
    // 合并配置，确保params和responseType正确设置
    const axiosConfig = {
      params: params,
      responseType: config.responseType || 'json',
      ...config
    }
    
    axios.get(url, axiosConfig)
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function post (url, data = {}) {
  return new Promise((resolve, reject) => {
    // 如果已经是 URLSearchParams 或 FormData，直接使用
    let params = data
    if (data instanceof URLSearchParams || data instanceof FormData) {
      params = data
    } else {
      // 将对象数据转换为URLSearchParams
      const urlParams = new URLSearchParams()
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== undefined && data[key] !== null) {
          if (Array.isArray(data[key])) {
            data[key].forEach(item => {
              urlParams.append(key, item)
            })
          } else {
            urlParams.append(key, data[key])
          }
        }
      }
      params = urlParams
    }

    axios.post(url, params)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

export function deletes (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(url, { data })
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

export function put (url, data = {}) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams()
    for (const key in data) {
      if (Array.isArray(data[key])) {
        data[key].forEach(item => {
          params.append(key, item)
        })
      } else {
        params.append(key, data[key])
      }
    }

    axios.put(url, params)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}
