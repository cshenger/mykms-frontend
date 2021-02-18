<template>
  <div class="box users">
    <section class="box-header">
      <div class="fl-left">
        <a-form layout="inline" :model="searchForm" @submit="renderTable(1)">
          <a-form-item>
            <a-input v-model:value="searchForm.loginName" placeholder="登录名" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="renderTable(1)"><template #icon>
                <SearchOutlined />
              </template>搜索</a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="fl-right">
        <a-button type="primary" @click="addData"><template #icon>
            <PlusOutlined />
          </template>新增</a-button>
      </div>
    </section>

    <a-table :columns="columns" :data-source="tableData" @change="changeTable" :pagination="pages" :loading="loadingTable" rowKey="id">
      <template #num="{ index }">
        <span>{{ index+1 }}</span>
      </template>
      <template #roles="{ record }">
        <span>
          <a-tag v-for="role in record.fullRoles" :key="role.id" :color="tagColors[role.code]">
            {{ role.text }}
          </a-tag>
        </span>
      </template>
      <template #action="{ record }">
        <a-button type="primary" size="small" @click="editData(record.id)"><template #icon>
            <EditOutlined />
          </template>编辑</a-button>
        <a-button type="primary" size="small" @click="viewData(record.id)"><template #icon>
            <EyeOutlined />
          </template>查看</a-button>
        <a-button type="danger" size="small" @click="deleteData(record.id)"><template #icon>
            <DeleteOutlined />
          </template>删除</a-button>
      </template>
    </a-table>

    <!-- 弹框部分-->
    <a-modal v-model:visible="dialogs.visible" :title="dialogs.title" :maskClosable="false" :footer="null">
      <Add v-if="dialogs.visible" :subType="dialogs.subType" :parentData="dialogs.parentData" @cancel-dialog="cancelDialog" />
    </a-modal>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  createVNode,
  getCurrentInstance,
} from "vue";
import { Modal } from "ant-design-vue";
import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import useTable from "../USE/useTable";
import Add from "./add";

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
    title: "登录名",
    key: "loginName",
    dataIndex: "loginName",
  },
  {
    title: "姓名",
    key: "userName",
    dataIndex: "userName",
  },
  {
    title: "角色",
    key: "roles",
    dataIndex: "roles",
    slots: { customRender: "roles" },
  },
  {
    title: "操作",
    key: "action",
    slots: { customRender: "action" },
  },
];

const tagColors = {
  sysAdmin: "green",
  keyAdmin: "cyan",
  keyAudit: "orange",
  keyUser: "blue",
};

export default defineComponent({
  name: "Users",
  components: {
    EditOutlined,
    EyeOutlined,
    DeleteOutlined,
    PlusOutlined,
    SearchOutlined,
    Add,
  },
  setup() {
    const { ctx } = getCurrentInstance();
    const { pages, loadingTable, getTableData } = useTable();
    let searchForm = reactive({ loginName: "" });
    let tableData = ref([]);

    const renderTable = (current = 1) => {
      getTableData(ctx.$http, {
        url: "/users/list",
        searchForm,
        current: current,
      }).then((res) => {
        loadingTable.value = false;
        tableData.value = res.data.records;
        pages.total = res.data.total;
      });
    };

    renderTable();

    const changeTable = (pag) => {
      pages.current = pag.current;
      renderTable(pages.current);
    };

    /* 表格操作 */
    // 属性------
    let dialogs = reactive({
      title: "",
      visible: false,
      subType: "",
      parentData: null,
    });

    // 事件------
    const cancelDialog = (reload) => {
      dialogs.subType = "";
      dialogs.title = "";
      dialogs.visible = false;
      dialogs.parentData = null;
      if (reload) {
        renderTable(pages.current);
      }
    };

    const addData = () => {
      dialogs.subType = "add";
      dialogs.visible = true;
      dialogs.title = "新增用户";
      dialogs.parentData = null;
    };

    const _renderUser = (id) => {
      return ctx.$http({
        url: `/users/user`,
        params: { id: id },
        loading: true,
      });
    };

    const editData = (id) => {
      _renderUser(id).then((res) => {
        dialogs.parentData = res.data.user;
        dialogs.subType = "edit";
        dialogs.visible = true;
        dialogs.title = "编辑用户";
      });
    };

    const viewData = (id) => {
      _renderUser(id).then((res) => {
        dialogs.parentData = res.data.user;
        dialogs.subType = "view";
        dialogs.visible = true;
        dialogs.title = "查看用户";
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
              url: "/users/delete",
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

    return {
      columns,
      tagColors,
      loadingTable,
      searchForm,
      pages,
      tableData,
      renderTable,
      changeTable,
      dialogs,
      cancelDialog,
      addData,
      editData,
      viewData,
      deleteData,
    };
  },
});
</script>

<style>
</style>