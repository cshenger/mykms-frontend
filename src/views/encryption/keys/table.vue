<template>
  <div>
    <section class="box-header">
      <div class="fl-left">
        <a-form layout="inline" :model="searchForm" @submit="renderTable(1)">
          <a-form-item>
            <a-input v-model:value="searchForm.keyName" placeholder="密钥名称" />
          </a-form-item>
          <a-form-item>
            <a-select v-model:value="searchForm.algorithmName" placeholder="使用算法" allowClear style="width: 170px">
              <a-select-option v-for="item in algorOptions" :key="item" :value="item">{{item}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item v-if="tabsType!='history'">
            <a-select v-model:value="searchForm.status" placeholder="状态" allowClear style="width: 170px">
              <a-select-option v-for="item in statusOptions" :key="item.code" :value="item.code">{{item.text}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="renderTable(1)"><template #icon>
                <SearchOutlined />
              </template>搜索</a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="fl-right">
        <a-button v-if="userRole.includes('keyAdmin')" type="primary" @click="addData"><template #icon>
            <PlusOutlined />
          </template>新增</a-button>
      </div>
    </section>

    <a-table :columns="columns" :data-source="tableData" @change="changeTable" :pagination="pages" :loading="loadingTable" rowKey="id" :scroll="{ x: 2200 }">
      <template #num="{ index }">
        <span>{{ index+1 }}</span>
      </template>
      <template #createUser="{text: createUser}">
        <span>{{!!createUser ? createUser.value : ""}}</span>
      </template>
      <template #auditUser="{text: auditUser}">
        <span>{{!!auditUser ? auditUser.value : ""}}</span>
      </template>
      <template #keyUser="{ record }">
        <span v-for="user in record.keyUser" :key="user.code">{{user.value}}&nbsp;&nbsp;</span>
      </template>
      <template #status="{text: status}">
        <span :style="{color: statusColor(status.code)}">{{!!status ? status.value : ""}}</span>
      </template>
      <template #action="{ record }">
        <a-button v-if="(record.status.code==0||record.status.code==3) && store.state.userId==record.createUser.code" type="primary" size="small" @click="sendData(record.id)"><template #icon>
            <SendOutlined />
          </template>提交</a-button>
        <a-button v-if="(record.status.code==0||record.status.code==3) && store.state.userId==record.createUser.code" type="primary" size="small" @click="editData(record.id)"><template #icon>
            <EditOutlined />
          </template>编辑</a-button>
        <a-button v-if="record.status.code==1 && !!record.auditUser && store.state.userId==record.auditUser.code" type="primary" size="small" @click="auditData(record.id)"><template #icon>
            <CheckOutlined />
          </template>审核</a-button>
        <a-button type="primary" size="small" @click="viewData(record.id)"><template #icon>
            <EyeOutlined />
          </template>查看</a-button>
        <a-button v-if="(record.status.code==0||record.status.code==3) && store.state.userId==record.createUser.code" type="danger" size="small" @click="deleteData(record.id)"><template #icon>
            <DeleteOutlined />
          </template>删除</a-button>
      </template>
    </a-table>

    <!-- 弹框部分-->
    <a-modal v-model:visible="dialogs.visible" :title="dialogs.title" :maskClosable="false" :footer="null" :width="800" @cancel="cancelDialog">
      <Add v-if="dialogs.visible && dialogs.subType!='send'" :subType="dialogs.subType" :parentData="dialogs.parentData" @cancel-dialog="cancelDialog" />
      <Send v-if="dialogs.visible && dialogs.subType=='send'" :subType="dialogs.subType" :id="dialogs.id" @cancel-dialog="cancelDialog" />
    </a-modal>
  </div>
</template>

<script>
import { reactive, ref, getCurrentInstance, createVNode, watch } from "vue";
import { Modal } from "ant-design-vue";
import Add from "./add";
import Send from "./send";
import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  CheckOutlined,
  SendOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import useTable from "../../USE/useTable";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

const columns = [
  {
    title: "序号",
    width: 60,
    align: "center",
    key: "num",
    dataIndex: "num",
    slots: { customRender: "num" },
  },
  {
    title: "密钥名称",
    key: "keyName",
    dataIndex: "keyName",
  },
  {
    title: "算法名称",
    key: "algorithmName",
    dataIndex: "algorithmName",
  },
  {
    title: "加密模式",
    key: "mode",
    dataIndex: "mode",
  },
  {
    title: "密钥长度",
    key: "length",
    dataIndex: "length",
  },
  {
    title: "过期时间",
    key: "deadDate",
    dataIndex: "deadDate",
  },
  {
    title: "创建人",
    key: "createUser",
    dataIndex: "createUser",
    slots: { customRender: "createUser" },
  },
  {
    title: "创建时间",
    key: "createDate",
    dataIndex: "createDate",
  },
  {
    title: "审核人",
    key: "auditUser",
    dataIndex: "auditUser",
    slots: { customRender: "auditUser" },
  },
  {
    title: "审核时间",
    key: "auditDate",
    dataIndex: "auditDate",
  },
  {
    title: "使用人",
    key: "keyUser",
    slots: { customRender: "keyUser" },
  },
  {
    title: "状态",
    key: "status",
    dataIndex: "status",
    slots: { customRender: "status" },
  },
  {
    title: "操作",
    key: "action",
    slots: { customRender: "action" },
    width: 320,
  },
];

export default {
  name: "TableKeys",
  props: ["tabsType"],
  components: {
    EditOutlined,
    EyeOutlined,
    DeleteOutlined,
    PlusOutlined,
    SearchOutlined,
    CheckOutlined,
    SendOutlined,
    Add,
    Send,
  },
  setup(props, { emit }) {
    const route = useRoute();
    const store = useStore();
    const { ctx } = getCurrentInstance();
    const userRole = store.state.userRole;
    const algorOptions = ref([]);
    const statusOptions = ref([]);
    // 搜索框列表
    ctx.$http({ url: "/keys/status" }).then((res) => {
      statusOptions.value = res.data;
    });
    ctx.$http({ url: "/dict/algors" }).then((res) => {
      algorOptions.value = res.data;
    });

    // 表格
    const { pages, loadingTable, getTableData } = useTable();
    let searchForm = reactive({
      keyName: "",
      algorithmName: undefined,
      status: undefined,
      type: props.tabsType,
    });
    let tableData = ref([]);

    if (props.tabsType == "history") {
      searchForm.status = 4;
    }

    const renderTable = (current = 1) => {
      getTableData(ctx.$http, {
        url: "/keys/list",
        searchForm,
        current: current,
      }).then((res) => {
        loadingTable.value = false;
        tableData.value = res.data.records;
        pages.total = res.data.total;
      });
    };

    // renderTable();
    watch(
      () => route.query.id,
      () => {
        searchForm.id = route.query.id || "";
        renderTable();
      },
      { immediate: true }
    );

    const changeTable = (pag) => {
      console.log(pag);
      pages.current = pag.current;
      renderTable(pages.current);
    };

    /* 表格的操作 */
    let dialogs = reactive({
      title: "",
      visible: false,
      subType: "",
      id: "",
      parentData: null,
    });

    const cancelDialog = (reload) => {
      dialogs.subType = "";
      dialogs.title = "";
      dialogs.visible = false;
      dialogs.id = "";
      dialogs.parentData = null;
      if (reload) {
        renderTable(pages.current);
      }
    };

    const addData = () => {
      dialogs.subType = "add";
      dialogs.title = "新增密钥";
      dialogs.visible = true;
    };

    const renderData = (id) => {
      return ctx.$http({ url: "/keys/key", params: { id: id }, loading: true });
    };

    const editData = (id) => {
      renderData(id).then((res) => {
        dialogs.parentData = res.data.key;
        dialogs.subType = "edit";
        dialogs.title = "编辑密钥";
        dialogs.visible = true;
      });
    };

    const viewData = (id) => {
      renderData(id).then((res) => {
        dialogs.parentData = res.data.key;
        dialogs.subType = "view";
        dialogs.visible = true;
        dialogs.title = "查看密钥";
      });
    };

    const sendData = (id) => {
      dialogs.subType = "send";
      dialogs.id = id;
      dialogs.visible = true;
      dialogs.title = "提交密钥";
    };

    const auditData = (id) => {
      renderData(id).then((res) => {
        dialogs.parentData = res.data.key;
        dialogs.subType = "audit";
        dialogs.visible = true;
        dialogs.title = "审核密钥";
      });
    };

    const deleteData = (id) => {
      Modal.confirm({
        title: "提示",
        icon: createVNode(ExclamationCircleOutlined),
        content: "确定删除该用户吗?",
        okType: "danger",
        okText: "是",
        cancelText: "否",
        onOk() {
          return ctx
            .$http({
              url: "/keys/delete",
              method: "delete",
              params: { id: id },
              loading: true,
              showSucMes: true,
            })
            .then((res) => {
              renderTable(1);
            });
        },
        onCancel() {},
      });
    };

    // 状态颜色
    const statusColor = (code) => {
      let color = "rgba(0, 0, 0, 0.85)";
      switch (code) {
        case 0:
          color = "#B0C4DE";
          break;
        case 1:
          color = "#F4A460";
          break;
        case 2:
          color = "#90EE90";
          break;
        case 3:
          color = "#FF6347";
          break;
        case 4:
          color = "#DCDCDC";
          break;
        default:
          color = "rgba(0, 0, 0, 0.85)";
          break;
      }

      return color;
    };

    return {
      store,
      columns,
      userRole,
      algorOptions,
      statusOptions,
      loadingTable,
      searchForm,
      pages,
      tableData,
      renderTable,
      changeTable,
      // 表格操作部分
      dialogs,
      cancelDialog,
      sendData,
      addData,
      editData,
      viewData,
      auditData,
      deleteData,
      statusColor,
    };
  },
};
</script>

<style>
</style>