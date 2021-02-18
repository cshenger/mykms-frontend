<template>
  <a-form ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-item ref="loginName" label="登录名" name="loginName">
      <a-input v-model:value="form.loginName" placeholder="登录名" :disabled="subType=='view'" />
    </a-form-item>
    <a-form-item ref="userName" label="姓名" name="userName">
      <a-input v-model:value="form.userName" placeholder="姓名" :disabled="subType=='view'" />
    </a-form-item>
    <a-form-item ref="password" label="密码" name="password">
      <a-input v-model:value="form.password" placeholder="密码" :disabled="subType=='view'" />
    </a-form-item>
    <a-form-item label="角色" name="roles">
      <a-select mode="multiple" v-model:value="form.roles" placeholder="角色" :disabled="subType=='view'">
        <a-select-option v-for="item in rolesOptions" :key="item.code" :value="item.code">{{item.text}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item ref="email" label="邮箱" name="email">
      <a-input type="email" v-model:value="form.email" placeholder="邮箱" :disabled="subType=='view'" />
    </a-form-item>
    <section class="text-center">
      <a-button v-if="subType!='view'" @click="cancel(false)" class="mr-10">取消</a-button>
      <a-button v-if="subType=='view'" @click="cancel(false)">返回</a-button>
      <a-button v-if="subType=='add'" type="primary" @click="addSubmit" :loading="loading">提交</a-button>
      <a-button v-if="subType=='edit'" type="primary" @click="editSubmit" :loading="loading">确定</a-button>
    </section>
  </a-form>
</template>

<script>
import { reactive, ref, getCurrentInstance, watch } from "vue";
import regs from "@/utils/regs";

export default {
  name: "UserAdd",
  props: ["subType", "parentData"],
  setup(props, { emit }) {
    let labelCol = { span: 4 };
    let wrapperCol = { span: 18 };
    const { ctx } = getCurrentInstance();
    let loading = ref(false);

    // 属性------
    const ruleForm = ref(null);

    const rolesOptions = reactive([]);
    ctx.$http({ url: "/dict/roles" }).then((res) => {
      res.data.roles.forEach((item) => {
        rolesOptions.push(item);
      });
    });

    let form = reactive({
      loginName: "",
      userName: "",
      password: "",
      roles: [],
      email: "",
    });

    let rules = reactive({
      loginName: [
        { required: true, message: "请输入登录名", trigger: "blur" },
        { min: 3, max: 16, message: "登录名需在3到16位之间", trigger: "blur" },
      ],
      userName: [
        { required: true, message: "请输入姓名", trigger: "blur" },
        { min: 2, max: 8, message: "姓名需在2到8位之间", trigger: "blur" },
      ],
      password: [
        { required: true, message: "请输入登录密码", trigger: "blur" },
        {
          min: 6,
          max: 12,
          message: "登录密码需在6到12位之间",
          trigger: "blur",
        },
      ],
      roles: [
        {
          required: true,
          message: "请选择角色",
          trigger: "change",
          type: "array",
        },
      ],
      email: [
        { required: true, message: "请输入邮箱", trigger: "blur" },
        { pattern: regs.isEmail, message: "邮箱格式有误", trigger: "blur" },
      ],
    });

    // 事件------
    const cancel = (reload = false) => {
      emit("cancel-dialog", reload);
    };

    const __addOrEdit = (url, method = "post") => {
      let subData = JSON.parse(JSON.stringify(form));

      ruleForm.value.validate().then(() => {
        loading.value = true;
        ctx
          .$http({
            url: url,
            method: method,
            // headers: {
            //   "Content-Type": "multipart/form-data",
            // },
            data: subData,
            loading: true,
            showSucMes: true,
          })
          .then((res) => {
            loading.value = false;
            if (res.code == 200) {
              cancel(true);
            }
          });
      });
    };

    let addSubmit = () => {
      __addOrEdit("/users/add");
    };
    let editSubmit = () => {
      __addOrEdit("/users/update", "put");
    };

    // 获取父层数据渲染
    const _renderUser = (data) => {
      if (!!data) {
        for (let key in form) {
          form[key] = data[key];
        }
        form.id = data.id;
        form.roles = data.roles.split(",");
      }
    };
    _renderUser(props.parentData);

    watch(
      () => props.parentData,
      (data) => {
        _renderUser(data);
      },
      { deep: true }
    );

    return {
      labelCol,
      wrapperCol,
      loading,
      ruleForm,
      rolesOptions,
      form,
      rules,
      cancel,
      addSubmit,
      editSubmit,
    };
  },
};
</script>