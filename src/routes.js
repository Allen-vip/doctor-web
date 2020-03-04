import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
//import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'
import Devices from '@/views/devices/Devices.vue'
import BlackList from '@/views/blacklist/BlackList.vue'
import ICCard from '@/views/iccard/ICCard.vue'
import Face from '@/views/face/Face.vue'
import User from '@/views/user/User.vue'
import GateEvent from '@/views/gateevent/GateEvent.vue'
import DevCfg from '@/views/devcfg/DevCfg.vue'
import Account from '@/views/account/Account.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-user',
        leaf: true,//只有一个节点
        children: [
            { path: '/user', component: User, name: '用户管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
//        iconCls: 'el-icon-message',//图标样式class
        iconCls: 'fa fa-sitemap',
        leaf: true,
        children: [
            {path: '/devices', component: Devices, name: '设备管理'}
        ]
//        children: [
//            { path: '/main', component: Main, name: '主页', hidden: true },
//            { path: '/table', component: Table, name: 'Table' },
//            { path: '/form', component: Form, name: 'Form' },
//            { path: '/user', component: user, name: '列表' },
//        ]
    },
//    {
//        path: '/',
//        component: Home,
//        name: '导航二',
//        iconCls: 'fa fa-id-card-o',
//        children: [
//            { path: '/page4', component: Page4, name: '页面4' },
//            { path: '/page5', component: Page5, name: '页面5' }
//        ]
//    },
/*    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-rss-square',
        leaf: true,//只有一个节点
        children: [
            { path: '/iccard', component: ICCard, name: 'IC卡管理' }
        ]
    },*//*
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-smile-o',
        leaf: true,//只有一个节点
        children: [
            { path: '/face', component: Face, name: '人脸管理' }
        ]
    },*/
/*    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-hand-paper-o',
        leaf: true,//只有一个节点
        children: [
            { path: '/blacklist', component: BlackList, name: '黑名单' }
        ]
    },*/
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-cog',
        leaf: true,//只有一个节点
        children: [
            { path: '/devcfg', component: DevCfg, name: '设备配置' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-database',
        leaf: true,//只有一个节点
        children: [
            { path: '/gateevent', component: GateEvent, name: '门禁记录' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-user-secret',
        leaf: true,//只有一个节点
        children: [
            { path: '/account', component: Account, name: '账号管理' }
        ]
    },
//    {
//        path: '/',
//        component: Home,
//        name: 'Charts',
//        iconCls: 'fa fa-bar-chart',
//        children: [
//            { path: '/echarts', component: echarts, name: 'echarts' }
//        ]
//    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;
