<template>
  <div class="login">
    <section class="main">
      <h1>密钥管理系统</h1>
      <a-form ref="ruleForm" :model="form" :rules="rules">
        <a-form-item ref="loginName" name="loginName">
          <a-input size="large" v-model:value="form.loginName" placeholder="登录名">
            <template #prefix>
              <UserOutlined style="color:rgba(0,0,0,.25)" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item ref="password" name="password">
          <a-input size="large" v-model:value="form.password" type="password" placeholder="密码">
            <template #prefix>
              <LockOutlined style="color:rgba(0,0,0,.25)" />
            </template>
          </a-input>
        </a-form-item>
        <a-button size="large" type="primary" block @click="onSubmit">
          登 录
        </a-button>
      </a-form>
    </section>
    <back-ground />
  </div>
</template>

<script>
import { ref, reactive, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import BackGround from "./background.vue";
const md5 = require("blueimp-md5");

export default {
  name: "Login",
  components: {
    UserOutlined,
    LockOutlined,
    BackGround,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const { ctx } = getCurrentInstance();
    const ruleForm = ref(null);

    store.commit("del_token");

    let form = reactive({
      loginName: "",
      password: "",
    });

    let rules = reactive({
      loginName: [{ required: true, message: "请输入登录名", trigger: "blur" }],
      password: [
        { required: true, message: "请输入登录密码", trigger: "blur" },
      ],
    });

    let onSubmit = () => {
      let subData = {
        loginName: form.loginName,
        hexPassword: md5(form.password),
      };

      ruleForm.value
        .validate()
        .then(() => {
          ctx
            .$http({
              url: "/login",
              method: "post",
              data: subData,
              loading: true,
              showSucMes: true,
            })
            .then((res) => {
              store.commit("set_token", {
                token: res.data.token,
                userId: res.data.userId,
                loginName: res.data.loginName,
                userRole: res.data.userRole,
                userName: res.data.userName,
              });
              router.push({ path: "/" });
            });
        })
        .catch((error) => {
          console.log("error", error);
        });
    };

    return {
      ruleForm,
      form,
      rules,
      onSubmit,
    };
  },
};
</script>

<style lang="scss">
.login {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  .main {
    position: absolute;
    z-index: 2;
    top: -300px;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 300px;
    height: 200px;

    h1 {
      text-align: center;
      margin-bottom: 15px;
    }

    .ant-col {
      width: 100%;
    }
  }
}
</style>