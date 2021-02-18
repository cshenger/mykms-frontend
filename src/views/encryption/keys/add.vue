<template>
  <div>
    <a-form ref="ruleForm" :model="form" :rules="rules" :label-col="{span: 6}" :wrapper-col="{span: 18}">
      <a-row class="keys-add">
        <a-col :span="12">
          <a-form-item ref="keyName" label="密钥名称" name="keyName">
            <a-input v-model:value="form.keyName" placeholder="密钥名称" :disabled="subType=='view' || subType=='audit'" />
          </a-form-item>
          <a-form-item ref="algorithmName" label="算法名称" name="algorithmName">
            <a-input v-model:value="form.algorithmName" placeholder="算法名称" disabled />
          </a-form-item>
          <a-form-item ref="length" label="加密长度" name="length">
            <a-input v-model:value="form.length" placeholder="加密长度" disabled />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item ref="way" label="密钥模式" name="way">
            <a-tree-select v-model:value="form.way" style="width: 100%" :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" :tree-data="treeData" placeholder="请选择密钥模式" @change="changeWays" :disabled="subType=='view' || subType=='audit'">
            </a-tree-select>
          </a-form-item>
          <a-form-item ref="mode" label="加密模式" name="mode">
            <a-input v-model:value="form.mode" placeholder="加密模式" disabled />
          </a-form-item>
          <a-form-item ref="deadDate" label="过期时间" name="deadDate">
            <a-date-picker v-model:value="form.deadDate" format="YYYY-MM-DD HH:mm:ss" :disabled-date="disabledDate" :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }" :disabled="subType=='view' || subType=='audit' || noDead" />
            <a-checkbox v-model:checked="noDead" class="ml-10" :disabled="subType=='view' || subType=='audit'">不过期</a-checkbox>
          </a-form-item>
        </a-col>
        <a-col :span="24" class="remark">
          <a-form-item ref="keyUser" label="密钥使用人" name="keyUser">
            <a-select mode="multiple" v-model:value="form.keyUser" allowClear placeholder="请选择密钥使用人" :disabled="subType=='view' || subType=='audit'">
              <a-select-option v-for="item in keyUserOptions" :key="item.id" :value="item.id">{{item.userName}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item ref="remark" label="备注" name="remark">
            <a-textarea v-model:value="form.remark" showCount :maxlength="100" :disabled="subType=='view' || subType=='audit'" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <!-- 审核操作 -->
    <a-form v-if="subType=='audit' || (!!parentData && (parentData.status==2 || parentData.status==3))" ref="auditRuleForm" :model="auditForm" :rules="auditRules" :label-col="{span: 4}" :wrapper-col="{span: 20}">
      <a-form-item ref="result" label="审核结果" name="result">
        <a-radio-group v-model:value="auditForm.result" :disabled="subType=='edit'||subType=='view'">
          <a-radio :value="2">通过</a-radio>
          <a-radio :value="3">不通过</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="auditForm.result==3" ref="reason" label="原因" name="reason">
        <a-textarea v-model:value="auditForm.reason" showCount :maxlength="100" :disabled="subType=='edit'||subType=='view'" />
      </a-form-item>
      <section class="text-center">
        <a-button v-if="subType!='view' && subType!='edit'" @click="cancel" class="mr-10">取消</a-button>
        <a-button v-if="subType=='audit'" type="primary" @click="auditSubmit" :loading="loading">确定</a-button>
      </section>
    </a-form>

    <section class="text-center">
      <a-button v-if="subType=='view'" @click="cancel">返回</a-button>
      <a-button v-if="subType!='view'&&subType!='audit'" @click="cancel" class="mr-10">取消</a-button>
      <a-button v-if="subType=='add'" type="primary" @click="addSubmit" :loading="loading">确定</a-button>
      <a-button v-if="subType=='edit'" type="primary" @click="editSubmit" :loading="loading">确定</a-button>
    </section>
  </div>
</template>

<script>
import moment from "moment";
import { reactive, ref, watch, defineComponent, getCurrentInstance } from "vue";

export default defineComponent({
  name: "AddKeys",
  props: ["subType", "parentData"],
  setup(props, { emit }) {
    const { ctx } = getCurrentInstance();
    let loading = ref(false);

    const ruleForm = ref(null);
    let keyUserOptions = ref([]);
    let treeData = ref([]);
    let noDead = ref(false);
    let form = reactive({
      keyName: "",
      way: undefined,
      algorithmName: "",
      mode: "",
      length: "",
      deadDate: undefined,
      keyUser: [],
      remark: "",
    });

    let rules = reactive({
      keyName: [
        { required: true, message: "请输入密钥名称", trigger: "blur" },
        { max: 100, message: "密钥名称不能超过100个字符", trigger: "blur" },
      ],
      way: [{ required: true, message: "请选择加密方式", trigger: "change" }],
      deadDate: [
        {
          required: true,
          message: "请选择过期时间",
          trigger: "change",
          type: "object",
        },
      ],
      keyUser: [
        {
          type: "array",
          required: true,
          message: "请选择密钥使用人",
          trigger: "change",
        },
      ],
    });

    watch(
      () => noDead.value,
      () => {
        if (noDead.value) {
          form.deadDate = moment("2099-12-31 23:59:59");
        } else {
          form.deadDate = undefined;
        }
      }
    );

    // 审核部分
    const auditRuleForm = ref(null);
    let auditForm = reactive({
      id: "",
      result: 2,
      reason: "",
    });

    let auditRules = reactive({
      result: [
        {
          type: "number",
          required: true,
          message: "请选择审核结果",
          trigger: "change",
        },
      ],
      reason: [{ required: true, message: "请填写原因", trigger: "blur" }],
    });

    // 获取父层数据渲染
    const _renderKey = (data) => {
      if (!!data) {
        for (let key in form) {
          form[key] = data[key];
        }
        form.id = data.id;
        form.deadDate = moment(new Date(data.deadDate));
        form.keyUser = form.keyUser.split(",");
        if (
          form.deadDate.format("YYYY-MM-DD HH:mm:ss") == "2099-12-31 23:59:59"
        ) {
          noDead.value = true;
        }

        auditForm.id = data.id;
        if (data.status == 2 || data.status == 3) {
          auditForm.result = data.status;
          auditForm.reason = data.reason || "";
        }
      }
    };
    _renderKey(props.parentData);

    watch(
      () => props.parentData,
      (data) => {
        _renderKey(data);
      },
      { deep: true }
    );

    // 时间判断
    const range = (start, end) => {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    };
    const disabledDate = (current) => {
      // Can not select days before today and today
      return current && current < moment().endOf("day");
    };
    const disabledDateTime = () => {
      return {
        disabledHours: () => range(0, 24).splice(3, 24),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
      };
    };

    // 获取密钥模式
    const changeWays = (value, label, extra) => {
      let arrs = label[0].split("/");
      form.algorithmName = arrs[0];
      form.mode = arrs[1];
      form.length = parseInt(arrs[2]);
    };

    const cancel = (reload = false) => {
      emit("cancel-dialog", reload);
    };

    const __addOrEdit = (url, method = "post") => {
      let subData = JSON.parse(JSON.stringify(form));
      subData.deadDate = moment(new Date(subData.deadDate)).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      subData.keyUser = subData.keyUser.join(",");
      console.log(subData);

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

    const addSubmit = () => {
      __addOrEdit("/keys/add");
    };
    const editSubmit = () => {
      __addOrEdit("/keys/update", "put");
    };

    // 审核
    const auditSubmit = () => {
      console.log(auditForm);

      auditRuleForm.value.validate().then(() => {
        ctx
          .$http({
            url: "/keys/audit",
            method: "put",
            data: auditForm,
            loading: true,
            showSucMes: true,
          })
          .then((res) => {
            if (res.code == 200) {
              cancel(true);
            }
          });
      });
    };

    ctx.$http({ url: "/dict/allAlgorWays" }).then((res) => {
      treeData.value = res.data;
    });
    ctx.$http({ url: "/users/userList" }).then((res) => {
      keyUserOptions.value = res.data;
    });

    return {
      moment,
      loading,
      ruleForm,
      keyUserOptions,
      treeData,
      noDead,
      form,
      rules,
      auditRuleForm,
      auditForm,
      auditRules,
      disabledDate,
      disabledDateTime,
      changeWays,
      cancel,
      addSubmit,
      editSubmit,
      auditSubmit,
    };
  },
});
</script>

<style lang="scss">
.keys-add {
  .remark {
    .ant-col-6 {
      flex: 0 0 12.5%;
    }
    .ant-col-18 {
      flex: 0 0 87.5%;
      max-width: 87.5%;
    }
  }
}
</style>