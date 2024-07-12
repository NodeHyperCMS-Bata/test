export default {
	admin: {
		id: "admin",
		password: "test",
		email: "admin@ex.com"
	},
	site: {
		title: "My wiki",
		mainMenus: [
			{name: "home", href: "/"},
			{name: "로그인", href: "@signin", show: 'signout'},
			{name: "설정", href: "@settings", show: 'signin'},
			{name: "로그아웃", href: "@signout", show: 'signin'},
			{name: "가입", href: "@signup", show: 'signout'},
			{name: "dropdown test", dropdown: [
				{name: "dropdown test", dropdown: [
					{name: "test", href: "/test"}
				]},
				{name: "test", type: 'divider', show: 'signout'},
				{name: "dropdown test", dropdown: [
					{name: "test1", href: "/test1"}
				]}
			]}
		],
		adminMenu: [
			{type: 'text', text: '기본'},
			{name: "관리자 홈", href: "/", icon: "fas fa-gauge-high"},
			{name: "사이트 설정", dropdown: [
				{name: "기본 환경설정", href: "/site/BasicPreferences", icon: "fas fa-gear"},
				{name: "메뉴 설정", href: "/site/menuSettings", icon: "fas fa-gear"},
			], icon: "fas fa-gears"},
			{name: "서버", dropdown: [
				{name: "서버 설정", href: "/server/serverSettings", icon: "fas fa-gear"},
			], icon: "fas fa-server"},
			{name: "회원", dropdown: [
				{name: "회원 관리", href: "/member/memberManagement", icon: "fas fa-database"},
				{name: "접속자 집계", href: "/member/visitorCount", icon: "fas fa-users"},
			], icon: "fas fa-user"},
			{name: "테마", dropdown: [
				{name: "테마 관리", href: "/theme-update/themeManager", icon: "fas fa-list-check"},
				{name: "테마 설치", href: "/theme-update/themeInstaller", icon: "fas fa-bars-progress"},
			], icon: "fas fa-brush"},
			{name: "플러그인", dropdown: [
				{name: "플러그인 관리", href: "/plugin-update/pluginManager", icon: "fas fa-list-check"},
				{name: "플러그인 설치", href: "/plugin-update/pluginInstaller", icon: "fas fa-bars-progress"},
			], icon: "fas fa-plug"}
		],
		pages: {
			signin: '/signin/',
			signup: '/signup/',
			signout: '/signout/',
			settings: '/settings/',

			api_signin: '/api/auth/signin/',
			api_signup: '/api/auth/signup/',
			api_signout: '/api/auth/signout/',
			api_settings: '/api/auth/settings/',
		},
		skin: {

		},
		theme: "basic",
        activePlugins: [],
		description: "My wiki는 누구나 기여할 수 있는 위키입니다. 검증되지 않았거나 편향된 내용이 있을 수 있습니다.",
		headadds: [],
        bodyadds: []
    }
}