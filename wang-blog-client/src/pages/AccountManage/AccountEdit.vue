<template>
    <div class="box">
        <div class="form-content">
            <el-form ref="formRef" :model="form" :style="{ width: '600px' }" @submit="handleSubmit" :rules="rules">
                <el-form-item prop="username" tooltip="请输入用户名" label="用户名">
                    <el-input v-model="form.username" placeholder="请输入用户名..." />
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input v-model="form.password" placeholder="请输入密码..." />
                </el-form-item>
                <el-form-item prop="copyPassword" label="确认密码">
                    <el-input v-model="form.copyPassword" placeholder="请再次确认密码..." />
                </el-form-item>



            </el-form>
        </div>

        <div class="form-actions">
            <el-button type="primary" @click="handleSubmit">确定</el-button>
            <el-button type="info">取消</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Account } from '@/model/Account'
import { FormRules } from '@/utils/ComponentUtils'
import { AccountManageApi } from '@/api/AccountManageApi'
import { useRouter, useRoute } from 'vue-router'
import { ElForm } from 'el-cool'
import { ElMessage, ElDialog } from 'el-cool'


const router = useRouter()
const route = useRoute()

interface Form extends Account {
    copyPassword: string
}
const rules = computed(() => {
    return {
        username: [FormRules.Required()],
        password: [FormRules.Required()],
        copyPassword: [FormRules.Required()],
    }
})
const form3Rules = [
    {
        validator: (value: string, cb: any) => {
            if (value !== form.value.password) {

                cb('两次输入密码不一致')
            }
        }
    },
    FormRules.Required()
]
const form = ref<Form>({
    username: '',
    password: '',
    createTime: '',
    updateTime: '',
    id: 1,
    uuid: '12',
    copyPassword: ''
})
const formRef = ref<InstanceType<typeof ElForm>>(null)
let isEdit = false

onMounted(() => {
    let account: any = route.params.account as string

    if (account !== 'noaccount') {
        isEdit = true
        account = JSON.parse(account)
        form.value.uuid = account.uuid
        form.value.username = account.username

    }
})

const handleSubmit = () => {
    // 先校验表单
    formRef.value.validate(flag => {
        if (!flag) {
            return
        }
    
        if (form.value.password !== form.value.copyPassword) {
            ElMessage.warning('两次输入密码不一致!')
            return
        }
        // 二次弹窗确认
        isEdit ? editAccount() : addAccount()
    })


}
const editAccount = () => {
    let params = {
        uuid: form.value.uuid,
        password: form.value.password,
    }
    AccountManageApi.editAccount(params).then(res => {
        ElMessage.success('修改密码成功！请重新登陆')
        localStorage.setItem('token', '')
        router.push('/login')
    }).catch(err => {
        ElMessage.error(err?.message || '修改账号失败！')
    })
}
const addAccount = () => {
    let params = {
        username: form.value.username,
        password: form.value.password,
    }
    AccountManageApi.addAccount(params).then(res => {
        ElMessage.success('添加账号成功！')
        router.push('/MainPage/AccountManage')
    }).catch(err => {
        ElMessage.error(err?.message || '添加账号失败！')
    })
}
</script>

<style lang="scss" scoped>
.box {


    .form-content {
        margin: 150px 0 0 100px;
        display: flex;
        justify-content: flex-start;
    }

    .form-actions {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-left: 100px;
    }
}
</style>