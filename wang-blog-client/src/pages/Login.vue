<template>
    <div class="login-box">
        <el-card class="login-card">
            管理后台登录
            <el-form ref="formRef" :model="form" style="margin-top: 20px;">
                <el-form-item prop="account" label="账号" :rules="[FormRules.Required()]">
                    <el-input v-model="form.account" placeholder="请输入账号" />
                </el-form-item>
                <el-form-item prop="password" label="密码" :rules="[FormRules.Required()]">
                    <el-input type="password" show-password ref="inputRef" v-model="form.password"
                        placeholder="请输入密码" />
                </el-form-item>
            </el-form>
            <div class="login-actions">
                <el-button type="primary" @click="handleSubmit">登录</el-button>
            </div>

        </el-card>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { FormRules } from '@/utils/ComponentUtils'
import { Api } from '@/api/login';
import { ElMessage } from 'element-plus';
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '@/store';
import { ElForm } from 'element-plus';


const router = useRouter()
const store = useStore()
const formRef = ref<InstanceType<typeof ElForm>>(null)

const inputRef: any = ref(null)
const form: any = reactive({
    account: '',
    password: '',
});
const handleFocus = () => {

    inputRef.value.focus()
}
const handleSubmit = () => {
   
    formRef.value.validate((flag) => {
        if (!flag) {
            return
        }


        const params = {
            account: form.account,
            password: form.password,
        }
        Api.login(params).then(res => {
            store.userStore.setUser(res.user)

            localStorage.setItem('token', res.token)
            router.push('/MainPage/BlogManage')
        }).catch(err => {

            ElMessage.error(err.message || '失败')
        })

    })
}
</script>

<style lang="scss" scoped>
@import "../styles/var.scss";

.login-box {
    background-image: url("/Blog/assets/mountain.jpg");
    height: 100%;
    background-size: cover;
    display: flex;
    justify-content: center;

    .el-card {
        background-color: $--blue-1;
        width: 500px;
        margin-top: 30vh;
        height: 220px;

        .login-actions {
            display: flex;
            justify-content: center;
        }
    }
}
</style>