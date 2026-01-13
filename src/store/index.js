// store/index.js
import { createStore } from 'vuex'
import { HttpManager } from '@/api'
import { mockProjects } from '@/data/project/mockData'
import { mockTools } from '@/data/tool/mockData'
import { predefinedTags } from '@/data/tool/tags'

export default createStore({
  state: {
    // ============ 用户状态 ============
    isLogin: false,
    user: {
      id: null,
      username: '',
      nickname: '',
      email: '',
      role: 'guest', // guest, user, admin
      avatar: '',
      description: '',
      face_photo: ''
    },
    token: localStorage.getItem('token') || '',
    activeName: '首页',

    // ============ 首页状态 ============
    home: {
      activeSection: 'common',
      isSidebarCollapsed: false,
      showAddMenu: false,
      dropdownOpen: false,
      engineMenuOpen: false,
      searchEngine: 'local',
      searchInput: '',
      today: '',
      weekday: '',
      currentTime: '',
      // 首页数据
      commonSites: [
        { name: '微信文件', url: 'https://file.fengfengzhidao.com', icon: '/uploads/images/common/微信文件.jpg', desc: '快速传输文件到设备' },
        { name: '和风天气', url: 'https://www.qweather.com', icon: '/uploads/images/common/和风天气.png', desc: '实时天气预报服务' },
        { name: '小红书', url: 'https://www.xiaohongshu.com', icon: '/uploads/images/common/小红书.jpeg', desc: '生活方式分享社区' },
        { name: '哔哩哔哩', url: 'https://www.bilibili.com', icon: '/uploads/images/common/哔哩哔哩_739519e278e6.ico', desc: '视频弹幕网站' },
        { name: '知乎', url: 'https://www.zhihu.com', icon: '/uploads/images/common/知乎_2e9c10f8e45e.ico', desc: '高质量问答平台' },
        { name: '百度翻译', url: 'https://fanyi.baidu.com', icon: '/uploads/images/common/百度翻译.jpeg', desc: '多语言翻译工具' },
        { name: '淘宝', url: 'https://www.taobao.com', icon: '/uploads/images/common/淘宝_65940af649c6.ico', desc: '在线购物平台' },
        { name: '抖音', url: 'https://www.douyin.com', icon: '/uploads/images/common/抖音.png', desc: '短视频分享应用' },
        { name: '京东', url: 'https://www.jd.com', icon: '/uploads/images/common/京东_828c0d051f11.ico', desc: '电商购物网站' },
        { name: '微博', url: 'https://www.weibo.com', icon: '/uploads/images/common/微博_c4814f45f6c0.ico', desc: '社交媒体平台' }
      ],
      tools: [
        { name: 'DeepL', url: 'https://www.deepl.com', icon: 'https://www.deepl.com/img/logo/deepl-logo-blue.svg', desc: '高精度翻译工具' },
        { name: 'SmallPDF', url: 'https://smallpdf.com', icon: 'https://smallpdf.com/images/favicon.png', desc: 'PDF 处理在线工具' },
        { name: 'Canvas', url: 'https://www.canva.com', icon: 'https://static.canva.com/static/images/favicon-96x96.png', desc: '在线设计平台' },
        { name: 'Figma', url: 'https://www.figma.com', icon: 'https://static.figma.com/uploads/logo.png', desc: 'UI/UX 设计工具' },
        { name: 'GitHub', url: 'https://github.com', icon: 'https://github.githubassets.com/favicons/favicon.png', desc: '代码托管平台' },
        { name: 'Excalibur', url: 'https://excalidraw.com', icon: 'https://excalidraw.com/favicon.ico', desc: '手绘风格绘图' },
        { name: 'ProcessOn', url: 'https://www.processon.com', icon: 'https://www.processon.com/favicon.ico', desc: '在线流程图工具' },
        { name: 'Wormhole', url: 'https://wormhole.app', icon: 'https://wormhole.app/favicon.ico', desc: '安全文件共享' },
        { name: 'PhotoKit', url: 'https://www.photokit.com', icon: 'https://www.photokit.com/favicon.ico', desc: '在线照片编辑' },
        { name: 'VirScan', url: 'https://www.virscan.org', icon: 'https://www.virscan.org/favicon.ico', desc: '病毒扫描工具' }
      ],
      course: [
        { name: '慕课网', url: 'https://www.imooc.com', icon: 'https://www.imooc.com/favicon.ico', desc: 'IT技能学习平台' },
        { name: 'B站课堂', url: 'https://www.bilibili.com/cheese', icon: 'https://www.bilibili.com/favicon.ico', desc: '视频课程学习' },
        { name: 'Coursera', url: 'https://www.coursera.org', icon: 'https://www.coursera.org/favicon.ico', desc: '在线大学课程' },
        { name: '网易云课堂', url: 'https://study.163.com', icon: 'https://study.163.com/favicon.ico', desc: '职业技能培训' },
        { name: '腾讯课堂', url: 'https://ke.qq.com', icon: 'https://ke.qq.com/favicon.ico', desc: '在线教育平台' },
        { name: '极客时间', url: 'https://time.geekbang.org', icon: 'https://time.geekbang.org/favicon.ico', desc: '技术学习社区' },
        { name: '实验楼', url: 'https://www.shiyanlou.com', icon: 'https://www.shiyanlou.com/favicon.ico', desc: '在线编程实验' },
        { name: '菜鸟教程', url: 'https://www.runoob.com', icon: 'https://www.runoob.com/favicon.ico', desc: '编程语言教程' },
        { name: 'MDN', url: 'https://developer.mozilla.org', icon: 'https://developer.mozilla.org/favicon.ico', desc: 'Web开发文档' },
        { name: 'W3School', url: 'https://www.w3school.com.cn', icon: 'https://www.w3school.com.cn/favicon.ico', desc: 'Web技术教程' }
      ],
      projects: [
        { name: '项目管理', url: '/projects', icon: 'https://fakeicon.com/project.svg', desc: '管理所有项目' },
        { name: '任务看板', url: '/kanban', icon: 'https://fakeicon.com/kanban.svg', desc: '可视化任务跟踪' },
        { name: '代码仓库', url: '/repo', icon: 'https://fakeicon.com/repo.svg', desc: '代码存储与协作' },
        { name: '文档中心', url: '/docs', icon: 'https://fakeicon.com/docs.svg', desc: '项目文档库' },
        { name: '统计报表', url: '/report', icon: 'https://fakeicon.com/chart.svg', desc: '数据分析报告' },
        { name: '成员管理', url: '/members', icon: 'https://fakeicon.com/team.svg', desc: '团队成员设置' },
        { name: '文件共享', url: '/files', icon: 'https://fakeicon.com/folder.svg', desc: '安全文件交换' },
        { name: '会议记录', url: '/meeting', icon: 'https://fakeicon.com/note.svg', desc: '会议纪要管理' },
        { name: '反馈收集', url: '/feedback', icon: 'https://fakeicon.com/message.svg', desc: '用户反馈系统' },
        { name: '设置', url: '/settings', icon: 'https://fakeicon.com/setting.svg', desc: '项目配置中心' }
      ],
      reviewItems: [
        { name: '待审用户', url: '/admin/review/users', icon: 'https://fakeicon.com/review-user.svg', desc: '审核新注册用户' },
        { name: '内容审核', url: '/admin/review/content', icon: 'https://fakeicon.com/review-content.svg', desc: '检查用户上传内容' },
        { name: '举报处理', url: '/admin/review/reports', icon: 'https://fakeicon.com/report.svg', desc: '处理用户举报' },
        { name: '敏感词库', url: '/admin/review/words', icon: 'https://fakeicon.com/filter.svg', desc: '管理敏感词汇' },
        { name: '日志审计', url: '/admin/review/logs', icon: 'https://fakeicon.com/log.svg', desc: '查看系统日志' },
        { name: '封禁列表', url: '/admin/review/ban', icon: 'https://fakeicon.com/ban.svg', desc: '管理封禁用户' },
        { name: '权限调整', url: '/admin/review/roles', icon: 'https://fakeicon.com/role.svg', desc: '调整用户权限' },
        { name: '系统通知', url: '/admin/review/notice', icon: 'https://fakeicon.com/notice.svg', desc: '发送系统公告' },
        { name: '备份恢复', url: '/admin/review/backup', icon: 'https://fakeicon.com/backup.svg', desc: '数据备份与恢复' },
        { name: '安全中心', url: '/admin/review/security', icon: 'https://fakeicon.com/shield.svg', desc: '系统安全设置' }
      ],
      sidebarItems: [
        { id: 'common', name: '常用', icon: 'fa-star' },
        { id: 'tools', name: '精选工具', icon: 'fa-tools' },
        { id: 'course', name: '课程浏览', icon: 'fa-book-open' },
        { id: 'projects', name: '项目情况', icon: 'fa-project-diagram' },
        { id: 'audit', name: '审核中心', icon: 'fa-gavel', adminOnly: true, route: '/check/audit' }
      ],
      engines: [
        { name: '本站', value: 'local' },
        { name: '百度', value: 'https://www.baidu.com/s?wd=' },
        { name: '搜狗', value: 'https://www.sogou.com/web?query=' },
        { name: 'Google', value: 'https://www.google.com/search?q=' },
        { name: 'Bing', value: 'https://cn.bing.com/search?q=' },
        { name: '知乎', value: 'https://www.zhihu.com/search?q=' }
      ]
    },

    // ============ 项目状态 ============
    projects: {
      projectsList: [],
      categories: [],
      isLoading: false,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        hasMore: true
      },
      searchResults: [],
      activeFilters: {
        tags: [],
        sort: '最新'
      },
      currentProjectDetail: null
    },

    // ============ 工具状态 ============
    tools: {
      toolsList: [],
      categories: [],
      isLoading: false,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        hasMore: true
      },
      searchResults: [],
      activeFilters: {
        tags: [],
        sort: '最多浏览'
      },
      currentToolDetail: null,
      disableToolSubmit: true,
      showBackButton: false,  // 新增：专门控制返回按钮显示
      // 从 toolsStore.js 添加的额外状态
      // isAuthenticated: !!localStorage.getItem('token'), // 直接从 localStorage 检查 token
      isAuthenticated: true, // 模拟时使用，后续需要删除
      tagsByCategory: {} // 缓存标签分组数据
    }
  },

  mutations: {
    // ============ 用户相关 ============
    // 设置登录状态
    setLoginIn(state, isLogin) {
      state.isLogin = isLogin
    },

    // 设置用户信息
    setUserInfo(state, userInfo) {
      state.user = { ...state.user, ...userInfo }
    },

    // 设置token
    setToken(state, token) {
      state.token = token
      if (token) {
        localStorage.setItem('token', token)
        state.tools.isAuthenticated = true
      } else {
        localStorage.removeItem('token')
        state.tools.isAuthenticated = false
      }
    },
    removeSidebarItem(state, itemId) {
      const index = state.home.sidebarItems.findIndex(item => item.id === itemId);
      if (index > -1) {
        state.home.sidebarItems.splice(index, 1);
      }
    },

    // 修改 addSidebarItem 确保不会重复添加
    addSidebarItem(state, item) {
      // 检查是否已存在相同名称和图标的自定义项目
      const exists = state.home.sidebarItems.some(existing =>
        existing.custom &&
        existing.name === item.name &&
        existing.icon === item.icon
      );

      if (!exists) {
        // 优先使用 crypto API，如果不可用则回退到 Math.random()
        let randomStr;

        if (crypto && crypto.getRandomValues) {
          const array = new Uint32Array(1);
          crypto.getRandomValues(array);
          randomStr = array[0].toString(36);
        } else {
          // 使用 slice 代替 substr
          randomStr = Math.random().toString(36).slice(2, 9);
        }

        state.home.sidebarItems.push({
          id: `custom-${Date.now()}-${randomStr}`,
          name: item.name,
          icon: item.icon,
          custom: true
        });
      }
    },

    // 清除用户信息（退出登录）
    clearUserInfo(state) {
      state.isLogin = false
      state.user = {
        id: null,
        username: '',
        nickname: '',
        email: '',
        role: 'guest',
        avatar: '',
        description: '',
        face_photo: ''
      }
      state.token = ''
      state.tools.isAuthenticated = false
      localStorage.removeItem('token')
    },

    // 设置活跃标签
    setActiveName(state, name) {
      state.activeName = name
    },

    // 更新用户部分信息
    updateUserField(state, { field, value }) {
      if (state.user[field] !== undefined) {
        state.user[field] = value
      }
    },

    // ============ 首页相关 ============
    // 设置活跃区域
    setHomeActiveSection(state, section) {
      state.home.activeSection = section
    },

    // 设置侧边栏折叠状态
    setSidebarCollapsed(state, collapsed) {
      state.home.isSidebarCollapsed = collapsed
    },

    // 设置菜单显示状态
    setHomeMenuState(state, { menu, isOpen }) {
      if (menu === 'add') {
        state.home.showAddMenu = isOpen
      } else if (menu === 'dropdown') {
        state.home.dropdownOpen = isOpen
      } else if (menu === 'engine') {
        state.home.engineMenuOpen = isOpen
      }
    },

    // 设置搜索引擎
    setSearchEngine(state, engine) {
      state.home.searchEngine = engine
    },

    // 设置搜索输入
    setSearchInput(state, input) {
      state.home.searchInput = input
    },

    // 设置时间信息
    setTimeInfo(state, { today, weekday, currentTime }) {
      state.home.today = today
      state.home.weekday = weekday
      state.home.currentTime = currentTime
    },

    // 设置首页工具数据（精选工具）
    setHomeTools(state, tools) {
      state.home.tools = tools
    },

    // 设置首页课程数据（课程浏览）
    setHomeCourses(state, courses) {
      state.home.course = courses
    },

    // 设置首页项目数据（项目情况）
    setHomeProjects(state, projects) {
      state.home.projects = projects
    },

    // ============ 项目相关 ============
    setProjectsList(state, list) {
      state.projects.projectsList = list
    },

    setProjectsCategories(state, categories) {
      state.projects.categories = categories
    },

    setProjectsLoading(state, isLoading) {
      state.projects.isLoading = isLoading
    },

    setProjectsPagination(state, pagination) {
      state.projects.pagination = { ...state.projects.pagination, ...pagination }
    },

    setProjectsSearchResults(state, results) {
      state.projects.searchResults = results
    },

    // 更新项目列表中的某个项目的收藏数和收藏状态
    updateProjectInList(state, { projectId, collections, isCollected }) {
      const project = state.projects.projectsList.find(p => (p.id === projectId || p.projectId === projectId))
      if (project) {
        if (collections !== undefined) {
          project.collections = collections
        }
        if (isCollected !== undefined) {
          project.iscollected = isCollected
          project.isCollected = isCollected
        }
      }
      // 同时更新搜索结果中的数据
      const searchProject = state.projects.searchResults.find(p => (p.id === projectId || p.projectId === projectId))
      if (searchProject) {
        if (collections !== undefined) {
          searchProject.collections = collections
        }
        if (isCollected !== undefined) {
          searchProject.iscollected = isCollected
          searchProject.isCollected = isCollected
        }
      }
    },

    // 更新课程列表中的某个课程的收藏数和收藏状态
    updateCourseInList(state, { courseId, likes, collections, isCollected }) {
      // 更新首页课程数据
      if (state.home.courses && Array.isArray(state.home.courses)) {
        const course = state.home.courses.find(c => (c.id === courseId || c.courseId === courseId || c.course_id === courseId))
        if (course) {
          // 优先使用 collections 字段（收藏数）
          if (collections !== undefined) {
            course.collections = collections
            // 如果 likes 字段被用作收藏数显示，也更新它
            course.likes = collections
          } else if (likes !== undefined) {
            // 兼容旧代码，如果只传了 likes
            course.likes = likes
            course.collections = likes
          }
          if (isCollected !== undefined) {
            course.iscollected = isCollected
            course.isCollected = isCollected
          }
        }
      }
    },

    setProjectsActiveFilters(state, filters) {
      state.projects.activeFilters = { ...state.projects.activeFilters, ...filters }
    },

    setCurrentProjectDetail(state, project) {
      state.projects.currentProjectDetail = project
    },

    updateProjectField(state, { projectId, field, value }) {
      const project = state.projects.projectsList.find(p => p.id === projectId)
      if (project) {
        project[field] = value
      }
    },

    // ============ 工具相关 ============
    setToolsList(state, list) {
      state.tools.toolsList = list
    },

    setToolsCategories(state, categories) {
      state.tools.categories = categories
    },

    setToolsLoading(state, isLoading) {
      state.tools.isLoading = isLoading
    },

    setToolsPagination(state, pagination) {
      state.tools.pagination = { ...state.tools.pagination, ...pagination }
    },

    setToolsSearchResults(state, results) {
      state.tools.searchResults = results
    },

    setToolsActiveFilters(state, filters) {
      state.tools.activeFilters = { ...state.tools.activeFilters, ...filters }
    },

    setCurrentToolDetail(state, tool) {
      state.tools.currentToolDetail = tool
    },

    setDisableToolSubmit(state, disabled) {
      state.tools.disableToolSubmit = disabled
    },

    setShowBackButton(state, show) {
      state.tools.showBackButton = show
    },

    updateToolField(state, { toolId, field, value }) {
      const tool = state.tools.toolsList.find(t => t.id === toolId)
      if (tool) {
        tool[field] = value
      }
    },

    // 从 toolsStore.js 添加的额外 mutations
    setToolsTagsByCategory(state, tagsByCategory) {
      state.tools.tagsByCategory = tagsByCategory
    },

    setToolsIsAuthenticated(state, isAuthenticated) {
      state.tools.isAuthenticated = isAuthenticated
    }
  },

  actions: {
    // ============ 用户相关 ============
    // 登录
    async login({ commit }, { username, password }) {
      try {
        const params = new FormData()
        params.append('username_or_email', username)
        params.append('password', password)

        const response = await HttpManager.loginIn(params)

        if (response.message === '1' || response.code === 1 || response.code === 200) {
          const token = response['JWT token'] || response.token || response.data?.token
          commit('setToken', token)
          commit('setLoginIn', true)

          // 获取用户信息
          await this.dispatch('fetchUserProfile')

          return { success: true, token }
        } else {
          return {
            success: false,
            message: response.message || '登录失败'
          }
        }
      } catch (error) {
        console.error('登录错误:', error)
        return {
          success: false,
          message: '网络错误，请稍后重试'
        }
      }
    },

    // 注册
    // eslint-disable-next-line no-unused-vars
    async register({ commit }, userData) {
      try {
        const params = new FormData()
        params.append('username', userData.username)
        params.append('email', userData.email)
        params.append('password', userData.password)
        params.append('nickname', userData.nickname)
        params.append('certify_password', userData.certify_password)

        const response = await HttpManager.SignUp(params)

        if (response.message === '注册成功' || response.code === 1 || response.code === 200) {
          return { success: true, message: '注册成功' }
        } else {
          return {
            success: false,
            message: response.message || '注册失败'
          }
        }
      } catch (error) {
        console.error('注册错误:', error)
        return {
          success: false,
          message: '网络错误，请稍后重试'
        }
      }
    },

    // 获取用户资料
    async fetchUserProfile({ commit, state }) {
      try {
        // 确保使用最新的token（从localStorage或state）
        const token = state.token || localStorage.getItem('token')
        if (!token) {
          throw new Error('未找到token，请重新登录')
        }
        
        const response = await HttpManager.getUserProfile()
        
        // 后端返回格式：response.Success(c, profile) 直接返回User对象
        // axios会自动解析JSON，所以response.data就是User对象
        // 但由于我们的get函数已经返回了response.data，所以response本身就是User对象
        let userData = response
        
        // 如果response有data字段，说明被包装了（可能是错误情况），使用data
        if (response && response.data && typeof response.data === 'object' && (response.data.id || response.data.username)) {
          userData = response.data
        }
        
        // 检查是否是有效的User对象
        const isSuccess = userData && (userData.id || userData.username)
        
        if (isSuccess && userData) {
          // 映射后端字段名（兼容拼写错误 avater）
          const mappedUserData = {
            ...userData,
            avatar: userData.avatar || userData.avater || '', // 兼容拼写错误
            nickname: userData.nickname || userData.username || '', // 如果昵称为空，使用用户名
            username: userData.username || ''
          }
          commit('setUserInfo', mappedUserData)
          commit('setLoginIn', true)
          commit('setToolsIsAuthenticated', true)
          return mappedUserData
        } else {
          // 响应格式不对，但不一定是401错误，不要清除登录状态
          // 可能是网络问题或数据格式问题，保留当前登录状态
          console.warn('获取用户资料失败：响应格式不正确', response)
          // 不清除登录状态，只返回null，让调用者自己处理
          return null
        }
      } catch (error) {
        console.error('获取用户资料错误:', error)
        // 只有在明确的401错误时才清除登录状态
        if (error.response?.status === 401) {
          commit('setToken', '')
          commit('setLoginIn', false)
          commit('setToolsIsAuthenticated', false)
          localStorage.removeItem('token')
        }
        // 其他错误（网络错误、超时等）不清除登录状态
        throw error
      }
    },

    // 更新用户资料
    async updateUserProfile({ commit, state }, profileData) {
      try {
        const params = new FormData()
        // 添加字段（avatar可以为空字符串，表示使用默认头像）
        if (profileData.nickname !== undefined) params.append('nickname', profileData.nickname)
        if (profileData.avatar !== undefined) params.append('avatar', profileData.avatar || '')
        if (profileData.description !== undefined) params.append('description', profileData.description || '')
        if (profileData.face_photo !== undefined) params.append('face_photo', profileData.face_photo || '')

        const response = await HttpManager.updateUserProfile(params, state.token)

        // 后端返回格式：{ message: "Profile updated successfully", user: {...} }
        // 或者：{ message: "Profile updated successfully", ...user fields }
        if (response.user || (response.message && response.message.includes('successfully'))) {
          // 如果响应中有 user 字段，使用它；否则使用整个响应对象（因为后端可能直接返回用户字段）
          const userData = response.user || response
          commit('setUserInfo', userData)
          return { success: true, data: userData, message: response.message }
        } else if (response.code === 200 || response.islogin) {
          // 兼容其他可能的响应格式
          commit('setUserInfo', response.data?.user || response.data || response)
          return { success: true, data: response.data?.user || response.data || response }
        } else {
          return {
            success: false,
            message: response.message || '更新失败'
          }
        }
      } catch (error) {
        console.error('更新用户资料错误:', error)
        throw error
      }
    },

    // 忘记密码
    async forgotPassword(context, { email, newPassword, certifyPassword }) {
      try {
        const params = new FormData()
        params.append('email', email)
        params.append('new_password', newPassword)
        params.append('certify_password', certifyPassword)

        return await HttpManager.forgotPassword(params)
      } catch (error) {
        console.error('忘记密码错误:', error)
        throw error
      }
    },

    // 退出登录
    async logout({ commit, state }) {
      let result = { success: true };

      try {
        await HttpManager.logout(state.token);
      } catch (error) {
        console.error('退出登录错误:', error);
        result = { success: false, error };
      } finally {
        // 即使API失败也清除本地状态
        commit('clearUserInfo');
      }

      return result;
    },

    // ============ 首页相关 ============
    // 更新时间信息
    updateTime({ commit }) {
      const d = new Date()
      const today = d.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
      const weekday = d.toLocaleDateString('zh-CN', { weekday: 'long' })
      const currentTime = d.toTimeString().slice(0, 8)

      commit('setTimeInfo', { today, weekday, currentTime })
    },

    // 获取首页精选工具（从工具资源中获取浏览量最高的10个）
    async fetchHomeTools({ commit }) {
      try {
        const response = await HttpManager.getTools({
          page: 1,
          page_size: 100 // 获取足够多的数据以便排序
        })

        const isSuccess = (response && (response.code === 200 || response.message === 'success'))
        const toolsData = response?.data || response?.data?.list || []

        if (isSuccess && Array.isArray(toolsData)) {
          // 按浏览量排序，取前10个
          const sortedTools = toolsData
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 10)
            .map(tool => {
              // 优先使用 image 数组的第一个元素，其次使用 logo 字段
              let icon = ''
              if (tool.image && Array.isArray(tool.image) && tool.image.length > 0 && tool.image[0]) {
                icon = tool.image[0]
              } else if (tool.logo) {
                icon = tool.logo
              } else if (tool.icon) {
                icon = tool.icon
              }
              
              return {
                name: tool.resourceName || tool.name || '未命名工具',
                url: `/tools/detail/${tool.resourceId || tool.id}`, // 使用内部路由指向工具详情页
                icon: icon, // 如果为空，将在模板中使用默认图片
                desc: tool.description || tool.desc || '暂无描述'
              }
            })

          commit('setHomeTools', sortedTools)
          return sortedTools
        }
      } catch (error) {
        console.error('获取首页精选工具失败:', error)
        // 保持默认数据，不更新
      }
    },

    // 获取首页课程浏览（从课程路线中获取浏览量最高的10个）
    async fetchHomeCourses({ commit }) {
      try {
        const response = await HttpManager.getCourses({
          limit: 1000, // 获取足够多的数据以便排序
          cursor: 0
        })

        // 课程API返回格式：{ courses_agg: [...] } 或其他格式
        let coursesData = []
        if (response && response.courses_agg) {
          coursesData = response.courses_agg
        } else if (response && response.data) {
          coursesData = Array.isArray(response.data) ? response.data : (response.data.list || [])
        } else if (Array.isArray(response)) {
          coursesData = response
        }

        console.log('首页课程数据:', { response, coursesData, count: coursesData.length })

        if (Array.isArray(coursesData) && coursesData.length > 0) {
          // 按浏览量（views）或点赞数（likes）排序，取前10个
          const sortedCourses = coursesData
            .sort((a, b) => {
              // 优先使用views，如果没有则使用likes
              const aScore = (a.views || 0) + (a.likes || 0) * 0.5
              const bScore = (b.views || 0) + (b.likes || 0) * 0.5
              return bScore - aScore
            })
            .slice(0, 10)
            .map(course => {
              // 优先使用 image 数组的第一个元素，其次使用 logo 字段
              let icon = ''
              if (course.image && Array.isArray(course.image) && course.image.length > 0 && course.image[0]) {
                icon = course.image[0]
              } else if (course.logo) {
                icon = course.logo
              } else if (course.icon) {
                icon = course.icon
              }
              
              return {
                name: course.name || course.title || '未命名课程',
                url: `/course/detail/${course.id || course.courseId}`, // 使用内部路由
                icon: icon, // 如果为空，将在模板中使用默认图片
                desc: course.teacher || '暂无教师信息'
              }
            })

          commit('setHomeCourses', sortedCourses)
          return sortedCourses
        }
      } catch (error) {
        console.error('获取首页课程浏览失败:', error)
        // 保持默认数据，不更新
      }
    },

    // 获取首页项目情况（从项目展示中获取浏览量最高的10个）
    async fetchHomeProjects({ commit }) {
      try {
        const response = await HttpManager.getProjects({
          page: 1,
          limit: 100 // 获取足够多的数据以便排序
        })

        const isSuccess = (response && (response.code === 200 || response.message === 'success'))
        const projectsData = response?.data || response?.data?.list || []

        if (isSuccess && Array.isArray(projectsData)) {
          // 按浏览量排序，取前10个
          const sortedProjects = projectsData
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 10)
            .map(project => {
              // 优先使用 coverImage，其次使用 image 数组的第一个元素，最后使用 logo 字段
              let icon = ''
              if (project.coverImage) {
                icon = project.coverImage
              } else if (project.image && Array.isArray(project.image) && project.image.length > 0 && project.image[0]) {
                icon = project.image[0]
              } else if (project.logo) {
                icon = project.logo
              } else if (project.icon) {
                icon = project.icon
              }
              
              return {
                name: project.name || project.title || '未命名项目',
                url: `/projects/detail/${project.id || project.projectId}`,
                icon: icon, // 如果为空，将在模板中使用默认图片
                desc: project.description || project.desc || '暂无描述'
              }
            })

          commit('setHomeProjects', sortedProjects)
          return sortedProjects
        }
      } catch (error) {
        console.error('获取首页项目情况失败:', error)
        // 保持默认数据，不更新
      }
    },

    // 执行搜索
    doSearch({ commit, state }, { router }) {  // 添加 router 参数
      const q = state.home.searchInput.trim()
      if (q) {
        // 如果是站内搜索
        if (state.home.searchEngine === 'local') {
          // 跳转到搜索页面，并传递搜索关键词
          if (router) {
            router.push({
              path: '/search',
              query: { q: q }
            })
          }
          commit('setSearchInput', '')  // 清空搜索输入框
        } else {
          // 外部搜索引擎，在新窗口打开
          window.open(state.home.searchEngine + encodeURIComponent(q), '_blank')
          commit('setSearchInput', '')  // 清空搜索输入框
        }
      }
    },

    // 修改 removeCustomNavigation action
    removeCustomNavigation({ commit }, itemId) {
      commit('removeSidebarItem', itemId);
    },

    // 修改 toggleCustomItem（如果在 actions 中）
    async toggleCustomItem({ commit, state }, { name, icon }) {
      const existingItem = state.home.sidebarItems.find(item =>
        item.custom && item.name === name && item.icon === icon
      );

      if (existingItem) {
        commit('removeSidebarItem', existingItem.id);
      } else {
        commit('addSidebarItem', { name, icon });
      }
    },

    // 选择搜索引擎
    // eslint-disable-next-line no-unused-vars
    selectSearchEngine({ commit, state }, engineValue) {
      commit('setSearchEngine', engineValue)
      commit('setHomeMenuState', { menu: 'engine', isOpen: false })
    },

    // 处理导航项点击
    // eslint-disable-next-line no-unused-vars
    handleNavItem({ commit, state, dispatch }, { item, router }) {
      if (item.route) {
        router.push(item.route)
        return
      }

      // 滚动到对应区域
      commit('setHomeActiveSection', item.id)
      if (typeof document !== 'undefined') {
        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },

    // 添加自定义导航
    addCustomNavigation({ commit }, { name, icon }) {
      commit('addSidebarItem', { name, icon })
    },

    // 关闭所有菜单
    closeAllMenus({ commit }) {
      commit('setHomeMenuState', { menu: 'add', isOpen: false })
      commit('setHomeMenuState', { menu: 'dropdown', isOpen: false })
      commit('setHomeMenuState', { menu: 'engine', isOpen: false })
    },

    // ============ 项目相关 ============
    // 获取项目列表
    async fetchProjects({ commit, state }, { params = {}, useMock = false } = {}) {
      commit('setProjectsLoading', true)

      try {
        if (useMock) {
          await new Promise(resolve => setTimeout(resolve, 500))
          commit('setProjectsList', mockProjects)
          commit('setProjectsCategories', [...new Set(mockProjects.map(p => p.category))])
          commit('setProjectsPagination', { total: mockProjects.length })
        } else {
          const response = await HttpManager.getProjects({
            page: state.projects.pagination.page,
            limit: state.projects.pagination.limit,
            ...params
          })

          // 后端返回格式：{ message: "success", data: [...] } 或 { code: 200, data: [...] }
          // 兼容两种格式
          const isSuccess = (response && (response.code === 200 || response.message === 'success'))
          const projectsData = response?.data || response?.data?.list || []
          
          // 调试：打印原始响应和解析后的数据
          console.log('项目列表后端原始响应:', response)
          console.log('项目列表解析后的数据（前3个）:', projectsData.slice(0, 3).map(p => ({
            name: p.name,
            collections: p.collections,
            stars: p.stars,
            loves: p.loves
          })))
          
          if (isSuccess && Array.isArray(projectsData)) {
            // 统一使用 collections 字段，移除 loves 和 stars 字段
            const mappedProjects = projectsData.map(project => {
              // 确保 collections 字段存在，如果不存在则设为 0
              const collectionsValue = (project.collections !== undefined && project.collections !== null) 
                ? project.collections 
                : 0
              
              // 移除 loves 和 stars 字段，只保留 collections
              // eslint-disable-next-line no-unused-vars
              const { loves, stars, ...rest } = project
              
              return {
                ...rest,
                collections: collectionsValue
              }
            })
            
            console.log('映射后的项目列表数据（前3个）:', mappedProjects.slice(0, 3).map(p => ({
              name: p.name,
              collections: p.collections
            })))
            
            // 即使数据为空，也正常处理（显示空列表）
            commit('setProjectsList', mappedProjects)
            commit('setProjectsPagination', {
              total: response.data?.total || mappedProjects.length,
              hasMore: response.data?.hasMore || false
            })
            commit('setProjectsCategories', [...new Set(mappedProjects.map(p => p.category))])
          }
        }
      } catch (error) {
        console.error('获取项目列表失败:', error)
        commit('setProjectsList', mockProjects)
        commit('setProjectsCategories', [...new Set(mockProjects.map(p => p.category))])
      } finally {
        commit('setProjectsLoading', false)
      }
    },

    // 搜索课程
    // eslint-disable-next-line no-unused-vars
    async searchCourses({ commit }, { query, params = {} }) {
      if (!query?.trim()) {
        return []
      }

      try {
        const response = await HttpManager.searchCourses({
          keyword: query.trim(),
          ...params
        })

        // 课程搜索API返回格式：{ message: "success", courses_agg: [...] }
        let results = []
        if (response && (response.code === 200 || response.message === 'success')) {
          if (response.courses_agg) {
            results = response.courses_agg
          } else if (response.data) {
            results = Array.isArray(response.data) ? response.data : []
          }
        } else if (Array.isArray(response)) {
          results = response
        }

        return results || []
      } catch (error) {
        console.error('搜索课程失败:', error)
        return []
      }
    },

    // 搜索项目
    async searchProjects({ commit, state }, { query, params = {} }) {
      if (!query?.trim()) {
        commit('setProjectsSearchResults', [])
        return []
      }

      try {
        const response = await HttpManager.searchProjects({
          keyword: query.trim(),
          ...params
        })

        // 项目搜索API返回格式：{ message: "success", data: [...] }
        if (response && (response.code === 200 || response.message === 'success')) {
          const results = response.data || []
          // 统一使用 collections 字段，移除 loves 和 stars 字段
          const mappedResults = results.map(project => {
            const collectionsValue = (project.collections !== undefined && project.collections !== null) 
              ? project.collections 
              : 0
            
            // 移除 loves 和 stars 字段，只保留 collections
            // eslint-disable-next-line no-unused-vars
            const { loves, stars, ...rest } = project
            
            return {
              ...rest,
              collections: collectionsValue
            }
          })
          commit('setProjectsSearchResults', mappedResults)
          return mappedResults
        }
        return []
      } catch (error) {
        console.error('搜索失败:', error)
        // 本地搜索作为fallback
        const results = state.projects.projectsList.filter(project =>
          project.name?.toLowerCase().includes(query.toLowerCase()) ||
          project.description?.toLowerCase().includes(query.toLowerCase()) ||
          project.technologies?.some(tech => tech?.toLowerCase().includes(query.toLowerCase()))
        )
        commit('setProjectsSearchResults', results)
        return results
      }
    },

    // 获取项目详情
    async getProjectDetail({ commit, state, dispatch }, projectId) {
      try {
        const response = await HttpManager.getProjectDetail(projectId)
        
        // 调试：打印后端原始响应
        console.log('后端原始响应:', response)

        // 后端返回格式：{ message: "success", data: {...} } 或直接返回 data
        // 兼容两种格式
        const isSuccess = (response && (response.code === 200 || response.message === 'success'))
        const projectData = response?.data || response
        
        // 调试：打印解析后的项目数据
        console.log('解析后的项目数据:', projectData)
        console.log('项目数据中的 collections:', projectData?.collections)

        if (isSuccess && projectData) {
          commit('setCurrentProjectDetail', projectData)
          await dispatch('addProjectView', projectId)
          return projectData
        }

        // 如果后端没有返回数据，尝试从本地列表中查找（模拟数据回退）
        return state.projects.projectsList.find(p => (p.id === parseInt(projectId) || p.projectId === parseInt(projectId))) || null
      } catch (error) {
        console.error('获取项目详情失败:', error)
        // 如果后端出错，尝试从本地列表中查找（模拟数据回退）
        return state.projects.projectsList.find(p => (p.id === parseInt(projectId) || p.projectId === parseInt(projectId))) || null
      }
    },

    // 增加项目浏览量
    async addProjectView({ commit, state }, projectId) {
      try {
        await HttpManager.addProjectView(projectId)
      } catch (error) {
        console.error('增加浏览量失败:', error)
        // 模拟增加浏览量
        commit('updateProjectField', {
          projectId,
          field: 'views',
          value: (state.projects.projectsList.find(p => p.id === projectId)?.views || 0) + 1
        })
      }
    },

    // 切换项目收藏状态
    // eslint-disable-next-line no-unused-vars
    async toggleProjectCollection({ state, dispatch }, projectId) {
      try {
        if (!state.isLogin) {
          throw new Error('请先登录')
        }

        const userCollection = await HttpManager.getUserCollection()
        // 后端返回格式: { message: "success", tools: [...], resources: [...], teaches: [...] }
        let allCollections = []
        if (userCollection.data) {
          allCollections = [
            ...(userCollection.data.tools || []),
            ...(userCollection.data.resources || []),
            ...(userCollection.data.teaches || [])
          ]
        } else if (userCollection.tools || userCollection.resources || userCollection.teaches) {
          allCollections = [
            ...(userCollection.tools || []),
            ...(userCollection.resources || []),
            ...(userCollection.teaches || [])
          ]
        }
        const isCollected = allCollections.some(item =>
          (item.resourceId || item.resource_id || item.projectId || item.project_id) === projectId && 
          (item.resourceType || item.resource_type) === 'project'
        )

        if (isCollected) {
          await HttpManager.removeProjectCollection(projectId)
        } else {
          await HttpManager.toggleProjectCollection(projectId)
        }
        return !isCollected
      } catch (error) {
        console.error('切换收藏失败:', error)
        throw error
      }
    },

    // 发表项目评论
    async addProjectComment({ state }, { projectId, content }) {
      try {
        return await HttpManager.addProjectComment(projectId, {
          content: content.trim()
        }, state.token)
      } catch (error) {
        console.error('发表评论失败:', error)
        throw error
      }
    },

    // ============ 工具相关 ============
    // 获取工具列表
    async fetchTools({ commit, state }, { params = {}, useMock = false } = {}) {
      commit('setToolsLoading', true)

      try {
        if (useMock) {
          await new Promise(resolve => setTimeout(resolve, 500))
          commit('setToolsList', mockTools)
          commit('setToolsCategories', [...new Set(mockTools.map(t => t.category))])
          commit('setToolsPagination', { total: mockTools.length })

          // 初始化标签分组数据
          const filterTags = (ids) => predefinedTags?.filter(tag => ids.includes(tag.id)) || []
          const tagsByCategory = {
            平台: filterTags(['web', 'desktop', 'mobile', 'cross-platform']),
            操作系统: filterTags(['windows', 'macos', 'linux', 'ios', 'android']),
            技术栈: filterTags(['javascript', 'python', 'java', 'csharp', 'cpp', 'php', 'go', 'rust']),
            工具类型: filterTags(['ide', 'editor', 'cli', 'api', 'debug', 'test', 'design']),
            用途领域: filterTags(['frontend', 'backend', 'database', 'devops', 'ai-ml', 'data-science', 'web3', 'game-dev']),
            许可证价格: filterTags(['open-source', 'free', 'freemium', 'paid', 'subscription']),
            其他: filterTags(['general', 'new', 'popular', 'official', 'community'])
          }
          commit('setToolsTagsByCategory', tagsByCategory)
        } else {
          const response = await HttpManager.getTools({
            page: state.tools.pagination.page,
            page_size: 100, // 设置足够大的值以获取所有工具
            ...params
          })

          // 后端返回格式：{ message: "success", data: [...] } 或 { code: 200, data: [...] }
          // 兼容两种格式
          const isSuccess = (response && (response.code === 200 || response.message === 'success'))
          const toolsData = response?.data || response?.data?.list || []
          
          if (isSuccess && Array.isArray(toolsData)) {
            // 即使数据为空，也正常处理（显示空列表）
            commit('setToolsList', toolsData)
            commit('setToolsPagination', {
              total: response.data?.total || toolsData.length,
              hasMore: response.data?.hasMore || false
            })
            // 兼容 category 和 catagory 两种拼写
            commit('setToolsCategories', [...new Set(toolsData.map(t => t.category || t.catagory).filter(Boolean))])

            // 初始化标签分组数据
            const filterTags = (ids) => predefinedTags?.filter(tag => ids.includes(tag.id)) || []
            const tagsByCategory = {
              平台: filterTags(['web', 'desktop', 'mobile', 'cross-platform']),
              操作系统: filterTags(['windows', 'macos', 'linux', 'ios', 'android']),
              技术栈: filterTags(['javascript', 'python', 'java', 'csharp', 'cpp', 'php', 'go', 'rust']),
              工具类型: filterTags(['ide', 'editor', 'cli', 'api', 'debug', 'test', 'design']),
              用途领域: filterTags(['frontend', 'backend', 'database', 'devops', 'ai-ml', 'data-science', 'web3', 'game-dev']),
              许可证价格: filterTags(['open-source', 'free', 'freemium', 'paid', 'subscription']),
              其他: filterTags(['general', 'new', 'popular', 'official', 'community'])
            }
            commit('setToolsTagsByCategory', tagsByCategory)
          } else {
            // 后端返回格式不正确或出错
            throw new Error(`后端返回错误: ${response?.message || response?.code || 'unknown'}`)
          }
        }
      } catch (error) {
        console.error('获取工具列表失败:', error)
        // 不再使用 mockTools 作为后备，因为 mockTools 中的 ID 与数据库中的实际 ID 不匹配
        // 会导致用户点击工具卡片时出现 404 错误
        // 如果后端获取失败，显示空列表，让用户知道数据加载失败
        commit('setToolsList', [])
        commit('setToolsCategories', [])

        // 初始化标签分组数据（即使没有工具数据，也初始化标签，以备后续使用）
        const filterTags = (ids) => predefinedTags?.filter(tag => ids.includes(tag.id)) || []
        const tagsByCategory = {
          平台: filterTags(['web', 'desktop', 'mobile', 'cross-platform']),
          操作系统: filterTags(['windows', 'macos', 'linux', 'ios', 'android']),
          技术栈: filterTags(['javascript', 'python', 'java', 'csharp', 'cpp', 'php', 'go', 'rust']),
          工具类型: filterTags(['ide', 'editor', 'cli', 'api', 'debug', 'test', 'design']),
          用途领域: filterTags(['frontend', 'backend', 'database', 'devops', 'ai-ml', 'data-science', 'web3', 'game-dev']),
          许可证价格: filterTags(['open-source', 'free', 'freemium', 'paid', 'subscription']),
          其他: filterTags(['general', 'new', 'popular', 'official', 'community'])
        }
        commit('setToolsTagsByCategory', tagsByCategory)
      } finally {
        commit('setToolsLoading', false)
      }
    },

    // 搜索工具
    async searchTools({ commit, state }, { query, params = {} }) {
      if (!query?.trim()) {
        commit('setToolsSearchResults', [])
        return []
      }

      try {
        const response = await HttpManager.searchTools({
          keyword: query.trim(),
          ...params
        })

        // 工具搜索API返回格式：{ message: "success", data: [...] }
        if (response && (response.code === 200 || response.message === 'success')) {
          const results = response.data || []
          commit('setToolsSearchResults', results)
          return results
        }
        return []
      } catch (error) {
        console.error('搜索失败:', error)
        // 本地搜索作为fallback
        const results = state.tools.toolsList.filter(tool =>
          tool.name?.toLowerCase().includes(query.toLowerCase()) ||
          tool.desc?.toLowerCase().includes(query.toLowerCase()) ||
          tool.tags?.some(tag => tag?.toLowerCase().includes(query.toLowerCase()))
        )
        commit('setToolsSearchResults', results)
        return results
      }
    },

    // 获取工具详情
    async getToolDetail({ commit, state }, toolId) {
      try {
        const response = await HttpManager.getToolDetail(toolId, 'tool')

        // 后端返回格式：{ message: "success", data: {...} } 或 { code: 200, data: {...} }
        // 兼容两种格式
        const isSuccess = (response && (response.code === 200 || response.message === 'success'))
        const toolData = response?.data

        if (isSuccess && toolData) {
          commit('setCurrentToolDetail', toolData)
          // 先获取当前的浏览量，然后增加浏览量，最后更新本地数据
          const currentViews = toolData.views || 0
          try {
            const viewResponse = await HttpManager.addToolView(toolId)
            // 如果 addToolView 返回了更新后的浏览量，使用它；否则使用当前浏览量 + 1
            const updatedViews = viewResponse?.data?.views ?? (currentViews + 1)
            // 更新本地工具详情中的浏览量
            toolData.views = updatedViews
            commit('setCurrentToolDetail', toolData)
            // 同时更新列表中的浏览量
            const toolIndex = state.tools.toolsList.findIndex(t => (t.resourceId || t.id) === parseInt(toolId))
            if (toolIndex !== -1) {
              const updatedList = [...state.tools.toolsList]
              updatedList[toolIndex] = { ...updatedList[toolIndex], views: updatedViews }
              commit('setToolsList', updatedList)
            }
          } catch (error) {
            console.error('增加浏览量失败:', error)
            // 即使增加浏览量失败，也继续返回工具详情
          }
          return toolData
        }

        // 如果响应格式不正确，尝试从本地列表查找（可能是缓存的数据）
        return state.tools.toolsList.find(t => (t.resourceId || t.id) === parseInt(toolId)) || null
      } catch (error) {
        console.error('获取工具详情失败:', error)
        // 404错误：工具不存在
        if (error.response?.status === 404) {
          throw new Error('该工具不存在或已被删除')
        }
        // 其他错误：尝试从本地列表查找（可能是缓存的数据）
        return state.tools.toolsList.find(t => (t.resourceId || t.id) === parseInt(toolId)) || null
      }
    },

    // 增加工具浏览量
    async addToolView({ commit, state }, toolId) {
      try {
        await HttpManager.addToolView(toolId)
      } catch (error) {
        console.error('增加浏览量失败:', error)
        // 模拟增加浏览量
        commit('updateToolField', {
          toolId,
          field: 'views',
          value: (state.tools.toolsList.find(t => t.id === toolId)?.views || 0) + 1
        })
      }
    },

    // 切换工具收藏状态
    async toggleToolCollection({ state }, { toolId, resourceType = 'tool' }) {
      try {
        if (!state.isLogin) {
          throw new Error('请先登录')
        }

        const userCollection = await HttpManager.getUserCollection()
        // 后端返回格式: { message: "success", tools: [...], resources: [...], teaches: [...] }
        let allCollections = []
        if (userCollection.data) {
          allCollections = [
            ...(userCollection.data.tools || []),
            ...(userCollection.data.resources || []),
            ...(userCollection.data.teaches || [])
          ]
        } else if (userCollection.tools || userCollection.resources || userCollection.teaches) {
          allCollections = [
            ...(userCollection.tools || []),
            ...(userCollection.resources || []),
            ...(userCollection.teaches || [])
          ]
        }
        const isCollected = allCollections.some(item =>
          (item.resourceId || item.resource_id) === toolId && 
          (item.resourceType || item.resource_type) === resourceType
        )

        if (isCollected) {
          await HttpManager.removeToolCollection(toolId, resourceType)
        } else {
          await HttpManager.toggleToolCollection(toolId, resourceType)
        }
        return !isCollected
      } catch (error) {
        console.error('切换收藏失败:', error)
        throw error
      }
    },

    // AI分析链接
    async analyzeUrl(context, url) {
      try {
        // 这里需要根据实际API调整
        // 暂时返回模拟数据
        return {
          name: url.split('//')[1]?.split('/')[0] || '未知工具',
          desc: `这是一个基于 ${url} 的工具，请手动填写详细信息。`,
          icon: `https://www.google.com/s2/favicons?sz=64&domain=${url}`
        }
      } catch (error) {
        console.error('AI分析失败:', error)
        throw error
      }
    },

    // 工具筛选操作
    toggleSort({ commit }, { type, sort }) {
      if (type === 'projects') {
        commit('setProjectsActiveFilters', { sort })
      } else if (type === 'tools') {
        commit('setToolsActiveFilters', { sort })
      }
    },

    toggleTag({ commit, state }, { type, tag }) {
      const currentTags = type === 'projects'
        ? [...state.projects.activeFilters.tags]
        : [...state.tools.activeFilters.tags]

      const index = currentTags.indexOf(tag)
      if (index > -1) {
        currentTags.splice(index, 1)
      } else {
        currentTags.push(tag)
      }

      if (type === 'projects') {
        commit('setProjectsActiveFilters', { tags: currentTags })
      } else if (type === 'tools') {
        commit('setToolsActiveFilters', { tags: currentTags })
      }
    },

    clearTags({ commit }, type) {
      if (type === 'projects') {
        commit('setProjectsActiveFilters', { tags: [] })
      } else if (type === 'tools') {
        commit('setToolsActiveFilters', { tags: [] })
      }
    },

    // 从 toolsStore.js 添加的额外 actions
    // eslint-disable-next-line no-unused-vars
    async initAuth({ commit, state }) {
      // 检查本地是否有 token
      const token = localStorage.getItem('token')
      if (token) {
        // 有 token，尝试获取用户信息来验证 token 有效性
        try {
          const response = await HttpManager.getUserProfile()
          // 后端返回格式：response.Success(c, profile) 直接返回User对象
          // axios会自动解析JSON，所以response.data就是User对象
          // 但由于我们的get函数已经返回了response.data，所以response本身就是User对象
          let userData = response
          
          // 如果response有data字段，说明被包装了（可能是错误情况），使用data
          if (response && response.data && typeof response.data === 'object' && (response.data.id || response.data.username)) {
            userData = response.data
          }
          
          // 检查是否是有效的User对象
          const isSuccess = userData && (userData.id || userData.username)
          
          if (isSuccess && userData) {
            // 映射后端字段名（兼容拼写错误 avater）
            const mappedUserData = {
              ...userData,
              avatar: userData.avatar || userData.avater || '', // 兼容拼写错误
              nickname: userData.nickname || userData.username || '', // 如果昵称为空，使用用户名
              username: userData.username || ''
            }
            commit('setUserInfo', mappedUserData)
            commit('setLoginIn', true)
            commit('setToken', token)
            commit('setToolsIsAuthenticated', true)
            localStorage.setItem('user', JSON.stringify(mappedUserData))
            return mappedUserData
          } else {
            throw new Error('未登录')
          }
        } catch (error) {
          console.log('当前为游客模式或获取资料失败')
          // 清除所有登录状态（包括token）
          // 只有明确的401错误才清除token，其他错误可能是网络问题，保留token
          if (error.response?.status === 401) {
            commit('setToken', '')
            commit('setLoginIn', false)
            commit('setToolsIsAuthenticated', false)
            commit('setUserInfo', {})
            localStorage.removeItem('token')
          } else {
            // 其他错误（网络错误、超时等），不清除登录状态，只更新UI状态
            commit('setToolsIsAuthenticated', false)
            commit('setUserInfo', {})
          }
          return null
        }
      } else {
        commit('setToolsIsAuthenticated', false)
      }
    },

    // 设置工具提交禁用状态
    setToolSubmitDisabled({ commit }, disabled) {
      commit('setDisableToolSubmit', disabled)
    }
  },

  getters: {
    // ============ 用户相关 ============
    // 获取完整用户信息
    userInfo: (state) => state.user,

    // 获取登录状态
    isLoggedIn: (state) => state.isLogin,

    // 判断是否是管理员
    isAdmin: state => state.user.role === 'admin',

    // 获取用户角色
    getUserRole: (state) => state.user.role,

    // 获取用户ID
    getUserId: (state) => state.user.id,

    // 获取用户昵称（如果没有则使用用户名）
    getUserDisplayName: (state) =>
      state.user.nickname || state.user.username || '游客',

    // 获取token
    getToken: (state) => state.token,

    // 获取活跃标签
    getActiveName: (state) => state.activeName,

    // 获取用户首字母（用于头像）
    getUserInitial: (state) => {
      if (!state.isLogin) return '访'
      return state.user.nickname?.[0] || state.user.username?.[0] || '我'
    },

    // ============ 首页相关 ============
    // 首页状态
    homeActiveSection: (state) => state.home.activeSection,
    isSidebarCollapsed: (state) => state.home.isSidebarCollapsed,
    showAddMenu: (state) => state.home.showAddMenu,
    dropdownOpen: (state) => state.home.dropdownOpen,
    engineMenuOpen: (state) => state.home.engineMenuOpen,
    searchEngine: (state) => state.home.searchEngine,
    searchInput: (state) => state.home.searchInput,
    today: (state) => state.home.today,
    weekday: (state) => state.home.weekday,
    currentTime: (state) => state.home.currentTime,

    // 首页数据
    commonSites: (state) => state.home.commonSites,
    homeTools: (state) => state.home.tools,
    course: (state) => state.home.course,
    homeProjects: (state) => state.home.projects,
    reviewItems: (state) => state.home.reviewItems,
    sidebarItems: (state) => state.home.sidebarItems,
    engines: (state) => state.home.engines,

    // 可见的侧边栏项目（根据权限过滤）
    visibleSidebarItems: (state) =>
      state.home.sidebarItems.filter(item => !item.adminOnly || state.user.role === 'admin'),

    // 当前搜索引擎名称
    currentEngineName: (state) => {
      const engine = state.home.engines.find(e => e.value === state.home.searchEngine)
      return engine ? engine.name : '本站'
    },

    // ============ 项目相关 ============
    // 获取项目列表
    projectsList: (state) => state.projects.projectsList,
    projectsCategories: (state) => state.projects.categories,
    // 按分类分组项目
    projectsByCategory: (state) => {
      const grouped = {}
      state.projects.projectsList.forEach(project => {
        if (!grouped[project.category]) {
          grouped[project.category] = []
        }
        grouped[project.category].push(project)
      })
      return grouped
    },

    // 项目标签分组
    projectsTagsByCategory: () => ({
      技术栈: [
        { id: 'vue', name: 'Vue', color: 'bg-green-100 text-green-800' },
        { id: 'react', name: 'React', color: 'bg-blue-100 text-blue-800' },
        { id: 'angular', name: 'Angular', color: 'bg-red-100 text-red-800' },
        { id: 'nodejs', name: 'Node.js', color: 'bg-green-100 text-green-800' },
        { id: 'python', name: 'Python', color: 'bg-blue-100 text-blue-800' },
        { id: 'java', name: 'Java', color: 'bg-orange-100 text-orange-800' },
        { id: 'spring', name: 'Spring', color: 'bg-green-100 text-green-800' },
        { id: 'flutter', name: 'Flutter', color: 'bg-blue-100 text-blue-800' },
        { id: 'react-native', name: 'React Native', color: 'bg-blue-100 text-blue-800' },
        { id: 'electron', name: 'Electron', color: 'bg-blue-100 text-blue-800' }
      ],
      类型: [
        { id: 'frontend', name: '前端', color: 'bg-purple-100 text-purple-800' },
        { id: 'backend', name: '后端', color: 'bg-gray-100 text-gray-800' },
        { id: 'fullstack', name: '全栈', color: 'bg-indigo-100 text-indigo-800' },
        { id: 'mobile', name: '移动端', color: 'bg-pink-100 text-pink-800' },
        { id: 'desktop', name: '桌面端', color: 'bg-yellow-100 text-yellow-800' },
        { id: 'open-source', name: '开源', color: 'bg-green-100 text-green-800' }
      ],
      状态: [
        { id: 'active', name: '活跃', color: 'bg-green-100 text-green-800' },
        { id: 'archived', name: '已归档', color: 'bg-gray-100 text-gray-800' },
        { id: 'demo', name: '有演示', color: 'bg-blue-100 text-blue-800' }
      ]
    }),

    // 获取项目加载状态
    projectsLoading: (state) => state.projects.isLoading,

    // 获取当前项目详情
    currentProjectDetail: (state) => state.projects.currentProjectDetail,

    // 添加用户相关的 getters
    user: (state) => state.user,

    // ============ 工具相关 ============
    // 获取工具列表
    toolsList: (state) => state.tools.toolsList,

    // 按分类分组工具
    toolsByCategory: (state) => {
      const grouped = {}
      state.tools.toolsList.forEach(tool => {
        if (!grouped[tool.category]) {
          grouped[tool.category] = []
        }
        grouped[tool.category].push(tool)
      })
      return grouped
    },

    // 工具标签分组
    toolsTagsByCategory: (state) => {
      // 如果已经缓存了标签分组数据，直接返回
      if (Object.keys(state.tools.tagsByCategory).length > 0) {
        return state.tools.tagsByCategory
      }

      // 否则计算并返回
      const filterTags = (ids) => predefinedTags?.filter(tag => ids.includes(tag.id)) || []

      return {
        平台: filterTags(['web', 'desktop', 'mobile', 'cross-platform']),
        操作系统: filterTags(['windows', 'macos', 'linux', 'ios', 'android']),
        技术栈: filterTags(['javascript', 'python', 'java', 'csharp', 'cpp', 'php', 'go', 'rust']),
        工具类型: filterTags(['ide', 'editor', 'cli', 'api', 'debug', 'test', 'design']),
        用途领域: filterTags(['frontend', 'backend', 'database', 'devops', 'ai-ml', 'data-science', 'web3', 'game-dev']),
        许可证价格: filterTags(['open-source', 'free', 'freemium', 'paid', 'subscription']),
        其他: filterTags(['general', 'new', 'popular', 'official', 'community'])
      }
    },

    // 获取工具加载状态
    toolsLoading: (state) => state.tools.isLoading,

    // 获取当前工具详情
    currentToolDetail: (state) => state.tools.currentToolDetail,

    // 获取工具提交禁用状态
    disableToolSubmit: (state) => state.tools.disableToolSubmit,

    // 从 toolsStore.js 添加的额外 getters
    toolsIsAuthenticated: (state) => state.tools.isAuthenticated,

    // 工具模块的认证状态别名
    isAuthenticated: (state) => state.tools.isAuthenticated
  }
})
