<template>
  <div class="box">
    <a-form ref="ruleForm" :model="form" :rules="rules" :label-col="{span: 4}" :wrapper-col="{span: 18}">
      <a-form-item ref="inputer" label="输入内容" name="inputer">
        <a-textarea v-model:value="form.inputer" placeholder="请输入内容" showCount :maxlength="200" />
      </a-form-item>
      <a-form-item ref="way" label="操作方式" name="way">
        <a-radio-group v-model:value="form.way">
          <a-radio value="1">加密</a-radio>
          <a-radio value="0">解密</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item ref="theKey" label="操作密钥" name="theKey">
        <a-select v-model:value="form.theKey" allowClear placeholder="请选择操作算法">
          <a-select-option v-for="item in theKeyOptions" :key="item.id" :value="item.id">{{item.keyName}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="onSubmit" :loading="loading">确 定</a-button>
      </a-form-item>
      <a-form-item v-if="!!outputer" label="输出内容">
        <a-textarea v-model:value="outputer" disabled />
        <section class="text-right">
          <a-button size="small" @click="copyContent">复制</a-button>
        </section>
        <textarea id="copyarea" style="position:absolute;left:-1000px;"></textarea>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { reactive, ref, getCurrentInstance } from "vue";
import { message } from "ant-design-vue";

export default {
  name: "EncryptionOperation",
  setup() {
    const { ctx } = getCurrentInstance();
    const ruleForm = ref(null);
    const theKeyOptions = ref([]);
    let loading = ref(false);

    ctx.$http({ url: "/keys/userKeys" }).then((res) => {
      theKeyOptions.value = res.data;
    });

    let form = reactive({
      inputer: "",
      way: "1",
      theKey: undefined,
    });

    let rules = reactive({
      inputer: [
        { required: true, message: "输入内容不能为空", trigger: "blur" },
        { max: 200, message: "输入内容不得超过200个字符", trigger: "blur" },
      ],
      way: [{ required: true, message: "请选择操作方式", trigger: "change" }],
      theKey: [
        { required: true, message: "请选择操作密钥", trigger: "change" },
      ],
    });

    const outputer = ref("");

    const onSubmit = () => {
      let subData = JSON.parse(JSON.stringify(form));
      ruleForm.value
        .validate()
        .then(() => {
          loading.value = true;
          ctx
            .$http({
              url: "/operation/submit",
              method: "post",
              data: subData,
              loading: true,
              showSucMes: true,
            })
            .then((res) => {
              loading.value = false;
              outputer.value = res.data;
            });
        })
        .catch((error) => {
          console.log("error", error);
        });
    };

    // 复制
    const copyContent = (evt) => {
      let $copyarea = document.getElementById("copyarea");
      $copyarea.innerText = outputer.value;
      $copyarea.select();
      if (document.execCommand("copy")) {
        document.execCommand("copy");
        message.success("复制成功");
      }
    };

    return {
      loading,
      ruleForm,
      theKeyOptions,
      form,
      rules,
      outputer,
      onSubmit,
      copyContent,
    };
  },
};
</script>

<style>
</style>