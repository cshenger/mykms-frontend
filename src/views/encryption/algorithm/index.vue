<template>
  <div class="box">
    <section class="box-header">
      <a-form layout="inline" :model="searchForm" @submit="renderTable(1)">
        <a-form-item>
          <a-select v-model:value="searchForm.name" placeholder="算法名称" allowClear style="width: 170px">
            <a-select-option v-for="item in nameOptions" :key="item" :value="item">{{item}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select v-model:value="searchForm.status" placeholder="算法状态" allowClear style="width: 170px">
            <a-select-option v-for="item in statusOptions" :key="item.code" :value="item.code">{{item.value}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="renderTable(1)"><template #icon>
              <SearchOutlined />
            </template>搜索</a-button>
        </a-form-item>
      </a-form>
    </section>

    <a-table :columns="columns" :data-source="tableData" @change="changeTable" :pagination="pages" :loading="loadingTable" rowKey="id">
      <template #num="{ index }">
        <span>{{ index+1 }}</span>
      </template>
      <template #status="{ record }">
        <a-switch checked-children="启用" un-checked-children="停用" v-model:checked="record.status" @change="(bool, event) => { changeSwitch(bool, event, record) }" />
      </template>
    </a-table>
  </div>
</template>

<script>
import { ref, reactive, getCurrentInstance, createVNode } from "vue";
import { Modal } from "ant-design-vue";
import {
  SearchOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import useTable from "../../USE/useTable";

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
    title: "算法名称",
    key: "name",
    dataIndex: "name",
  },
  {
    title: "算法类型",
    key: "mode",
    dataIndex: "mode",
  },
  {
    title: "算法长度",
    key: "length",
    dataIndex: "length",
  },
  {
    title: "算法别名",
    key: "alias",
    dataIndex: "alias",
  },
  {
    title: "加密方式",
    key: "way",
    dataIndex: "way",
  },
  {
    title: "启停状态",
    key: "status",
    dataIndex: "status",
    slots: { customRender: "status" },
  },
];

export default {
  name: "EncryptionAlgor",
  components: {
    SearchOutlined,
  },
  setup() {
    const { ctx } = getCurrentInstance();
    const { pages, loadingTable, getTableData } = useTable();

    /* 搜索部分 */
    let searchForm = reactive({ name: undefined, status: undefined });
    const statusOptions = reactive([
      { code: 1, value: "启用" },
      { code: 0, value: "停用" },
    ]);

    let nameOptions = ref([]);
    ctx.$http({ url: "/dict/algors" }).then((res) => {
      nameOptions.value = res.data;
    });

    let tableData = ref([]);

    const renderTable = (current = 1) => {
      getTableData(ctx.$http, {
        url: "/algor/list",
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

    // 状态切换
    const changeSwitch = (bool, event, record) => {
      let text = bool ? "启用" : "停用";
      let code = bool ? 1 : 0;

      Modal.confirm({
        title: "提示",
        icon: createVNode(ExclamationCircleOutlined),
        content: `你确定要${text}此算法吗？`,
        onOk() {
          return ctx
            .$http({
              url: "/algor/toggle",
              method: "put",
              data: { id: record.id, way: record.way, status: code },
              loading: true,
              showSucMes: true,
            })
            .then((res) => {
              if (res.code == 200) {
                renderTable(pages.current);
              } else {
                record.status = !record.status;
              }
            })
            .catch((err) => {
              record.status = !record.status;
            });
        },
        onCancel() {
          record.status = !record.status;
        },
      });
    };

    return {
      columns,
      nameOptions,
      statusOptions,
      loadingTable,
      searchForm,
      pages,
      tableData,
      renderTable,
      changeTable,
      changeSwitch,
    };
  },
};
</script>

<style>
</style>