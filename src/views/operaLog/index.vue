<template>
  <div class="box">
    <section class="box-header">
      <div class="fl-left">
        <a-form layout="inline" :model="searchForm" @submit="renderTable(1)">
          <a-form-item>
            <a-select v-model:value="searchForm.userId" placeholder="操作人" allowClear style="width: 150px">
              <a-select-option v-for="item in userOptions" :key="item.id" :value="item.id">{{item.userName}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-select v-model:value="searchForm.method" placeholder="操作方法" allowClear style="width: 150px">
              <a-select-option value="POST">POST</a-select-option>
              <a-select-option value="PUT">PUT</a-select-option>
              <a-select-option value="DELETE">DELETE</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-select v-model:value="searchForm.action" placeholder="操作动作" allowClear style="width: 150px">
              <a-select-option value="登录">登录</a-select-option>
              <a-select-option value="新增">新增</a-select-option>
              <a-select-option value="修改">修改</a-select-option>
              <a-select-option value="删除">删除</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-range-picker style="width: 400px" v-model:value="operaDates" show-time format="YYYY-MM-DD HH:mm:ss" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="renderTable(1)"><template #icon>
                <SearchOutlined />
              </template>搜索</a-button>
          </a-form-item>
        </a-form>
      </div>
    </section>

    <a-table :columns="columns" :data-source="tableData" @change="changeTable" :pagination="pages" :loading="loadingTable" rowKey="id">
      <template #num="{ index }">
        <span>{{ index+1 }}</span>
      </template>
      <template #status="{text: status}">
        <span :style="{color: status==1 ? '#19f319' : '#f52225'}">{{status==1 ? '成功' : '失败'}}</span>
      </template>
    </a-table>
  </div>
</template>

<script>
import { reactive, ref, getCurrentInstance, watch, ssrContextKey } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import useTable from "../USE/useTable";
import moment from "moment";

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
    title: "操作账户",
    key: "loginName",
    dataIndex: "loginName",
  },
  {
    title: "操作人",
    key: "userName",
    dataIndex: "userName",
  },
  {
    title: "操作时间",
    key: "operaDate",
    dataIndex: "operaDate",
  },
  {
    title: "路径",
    key: "url",
    dataIndex: "url",
  },
  {
    title: "方法",
    key: "method",
    dataIndex: "method",
  },
  {
    title: "动作",
    key: "action",
    dataIndex: "action",
  },
  {
    title: "状态",
    key: "status",
    dataIndex: "status",
    slots: { customRender: "status" },
  },
];

export default {
  name: "operaLog",
  components: { SearchOutlined },
  setup() {
    const { ctx } = getCurrentInstance();

    // 表格
    let userOptions = ref([]);
    let operaDates = ref([]);
    const { pages, loadingTable, getTableData } = useTable();
    let searchForm = reactive({
      userId: undefined,
      method: undefined,
      action: undefined,
      startTime: "",
      endTime: "",
    });
    let tableData = ref([]);

    const renderTable = (current = 1) => {
      getTableData(ctx.$http, {
        url: "/operaLog/list",
        searchForm,
        current: current,
      }).then((res) => {
        loadingTable.value = false;
        tableData.value = res.data.records;
        pages.total = res.data.total;
      });
    };

    const changeTable = (pag) => {
      console.log(pag);
      pages.current = pag.current;
      renderTable(pages.current);
    };

    renderTable();

    watch(
      () => operaDates.value,
      () => {
        if (operaDates.value.length > 0) {
          searchForm.startTime = moment(operaDates.value[0]).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          searchForm.endTime = moment(operaDates.value[1]).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        } else {
          searchForm.startTime = searchForm.endTime = "";
        }
        console.log(searchForm);
        // renderTable();
      }
    );

    ctx.$http({ url: "/dict/users", ignoreReq: true }).then((res) => {
      userOptions.value = res.data;
    });

    return {
      columns,
      loadingTable,
      userOptions,
      operaDates,
      searchForm,
      pages,
      tableData,
      renderTable,
      changeTable,
    };
  },
};
</script>

<style>
</style>