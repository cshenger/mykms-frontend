<template>
  <a-form ref="ruleForm" :model="formState" :rules="rules" :label-col="{span: 4}" :wrapper-col="{span: 18}">
    <a-form-item ref="oldPass" label="旧密码" name="oldPass">
      <a-input type="password" v-model:value="formState.oldPass" placeholder="旧密码" />
    </a-form-item>
    <a-form-item ref="newPass" label="新密码" name="newPass">
      <a-input type="password" v-model:value="formState.newPass" placeholder="新密码" />
    </a-form-item>
    <a-form-item ref="checkPass" label="确认密码" name="checkPass">
      <a-input type="password" v-model:value="formState.checkPass" placeholder="确认密码" />
    </a-form-item>
    <section class="text-center">
      <a-button @click="cancel(false)" class="mr-10">取消</a-button>
      <a-button type="primary" @click="editSubmit" :loading="loading">确定</a-button>
    </section>
  </a-form>
</template>

<script>
import { reactive, ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "EditPassword",
  props: ["userId"],
  setup(props, { emit }) {
    const { ctx } = getCurrentInstance();
    const router = useRouter();
    let loading = ref(false);
    const ruleForm = ref(null);
    const formState = reactive({
      userId: props.userId,
      oldPass: "",
      newPass: "",
      checkPass: "",
    });

    let validatePass = async (rule, value) => {
      if (value === "") {
        return Promise.reject("请输入密码");
      } else if (value === formState.oldPass) {
        return Promise.reject("新密码不能与旧密码相同");
      } else {
        if (formState.checkPass !== "") {
          ruleForm.value.validateField("checkPass");
        }
        return Promise.resolve();
      }
    };
    let validatePass2 = async (rule, value) => {
      if (value === "") {
        return Promise.reject("请再次输入密码");
      } else if (value !== formState.newPass) {
        return Promise.reject("两次密码不相同");
      } else {
        return Promise.resolve();
      }
    };

    const rules = {
      oldPass: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
      newPass: [
        { required: true, validator: validatePass, trigger: "change" },
        {
          min: 6,
          max: 12,
          message: "登录密码需在6到12位之间",
          trigger: "blur",
        },
      ],
      checkPass: [
        { required: true, validator: validatePass2, trigger: "change" },
      ],
    };

    const cancel = (reload = false) => {
      emit("cancel-dialog", reload);
    };

    let editSubmit = () => {
      let subData = JSON.parse(JSON.stringify(formState));

      ruleForm.value.validate().then(() => {
        loading.value = true;
        ctx
          .$http({
            url: "/users/editPassword",
            method: "post",
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
              router.push({ path: "/login" });
            }
          });
      });
    };

    return {
      loading,
      ruleForm,
      formState,
      rules,
      cancel,
      editSubmit,
    };
  },
};
</script>

<style>
</style>