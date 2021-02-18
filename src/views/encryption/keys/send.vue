<template>
  <a-form ref="ruleForm" :model="form" :rules="rules" :label-col="{span: 4}" :wrapper-col="{span: 18}">
    <a-form-item ref="auditer" label="审核人" name="auditer">
      <a-select v-model:value="form.auditer" allowClear placeholder="请选择审核人">
        <a-select-option v-for="item in auditerOptions" :key="item.id" :value="item.id">{{item.userName}}</a-select-option>
      </a-select>
    </a-form-item>
    <section class="text-center">
      <a-button @click="cancel" class="mr-10">取消</a-button>
      <a-button type="primary" @click="addSubmit" :loading="loading">确定</a-button>
    </section>
  </a-form>
</template>

<script>
import { ref, reactive, getCurrentInstance } from "vue";

export default {
  name: "SendKeys",
  props: ["id", "subType"],
  setup(props, { emit }) {
    const ruleForm = ref(null);
    let loading = ref(false);
    const { ctx } = getCurrentInstance();
    let auditerOptions = ref([]);
    let form = reactive({ auditer: undefined, sendId: props.id });
    let rules = reactive({
      auditer: [{ required: true, message: "请选择审核人", trigger: "change" }],
    });

    ctx.$http({ url: "/users/auditList" }).then((res) => {
      auditerOptions.value = res.data;
    });

    const cancel = (reload = false) => {
      emit("cancel-dialog", reload);
    };

    const addSubmit = () => {
      ruleForm.value.validate().then(() => {
        loading.value = true;
        ctx
          .$http({
            url: "/keys/send",
            method: "put",
            data: form,
            loading: true,
            showSucMes: true,
          })
          .then((res) => {
            loading.value = false;
            cancel(true);
          });
      });
    };

    return {
      loading,
      ruleForm,
      auditerOptions,
      form,
      rules,
      cancel,
      addSubmit,
    };
  },
};
</script>

<style>
</style>