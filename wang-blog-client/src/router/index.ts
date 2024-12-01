import { createRouter, createWebHashHistory } from "vue-router";

const routes: Array<any> = [
    { name: '', path: "/", component: () => import("../pages/Login.vue") },
    { name: 'login', path: "/login", component: () => import("../pages/Login.vue") },
    {
        name: 'MainPage', path: "/MainPage", component: () => import("../pages/MainPage.vue"),
        children: [
            { name: 'BlogManage', path: "/MainPage/BlogManage", component: () => import("../pages/BlogManage/BlogManage.vue") },
            { name: 'AccountManage', path: "/MainPage/AccountManage", component: () => import("../pages/AccountManage/AccountManage.vue") },
            { name: 'AccountEdit', path: "/MainPage/AccountEdit/:account", component: () => import("../pages/AccountManage/AccountEdit.vue") },

            { name: 'BlogUpdate', path: "/MainPage/BlogUpdate/:id", component: () => import("../pages/BlogManage/BlogUpdate.vue") },
        ]
    },
    {
        name: 'PreviewPc', path: "/PreviewPc", component: () => import("../pages/BlogPreview/Pc/PreviewPc.vue"),
        children: [
            { name: 'PreviewPcBlog', path: '/PreviewPc/PreviewBlog/:id', component: () => import("../pages/BlogPreview/Pc/PreviewBlog.vue"), }
        ]
    },
    {
        name: 'PreviewMobile', path: "/PreviewMobile", component: () => import("../pages/BlogPreview/Mobile/PreviewMobile.vue"),
        children: [
            { name: 'PreviewMobileBlog', path: '/PreviewMobile/PreviewBlog/:id', component: () => import("../pages/BlogPreview/Mobile/PreviewBlog.vue"), }
        ]
    },
    { name: 'preview', path: "/preview", component: () => import("../pages/BlogPreview/Preview.vue") },

]

const router = createRouter({
    history: createWebHashHistory(),
    routes,

});

export { router };