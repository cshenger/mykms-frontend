<template>
  <div class="das-box">
    <header>
      <h3>密钥每月趋势</h3>
      <section class="fl-right">
        <a-month-picker v-model:value="searchForm.dated" format="YYYY-MM" allowClear placeholder="月份" @change="changeDated" />
        <a-select v-model:value="searchForm.createUser" placeholder="创建人" ref="select" showSearch allowClear @change="handleChange" style="width: 150px">
          <a-select-option v-for="user in userOptions" :key="user.id" :value="user.id">{{user.userName}}</a-select-option>
        </a-select>
      </section>
    </header>
    <section class="das-box-main" id="keys-month"></section>
  </div>
</template>

<script>
import moment from "moment";

const option = {
  tooltip: {
    trigger: "axis",
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: [],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [],
      type: "line",
      areaStyle: {},
    },
  ],
};

let myChart = null;

export default {
  name: "KeysMonth",
  data() {
    return {
      // chart: null,
      searchForm: {
        dated: moment(new Date()).format("YYYY-MM"),
        createUser: undefined,
      },
      userOptions: [],
    };
  },
  methods: {
    renderChart() {
      this.$http({
        url: "/dashboard/keysMonth",
        params: { ...this.searchForm },
      }).then((res) => {
        option.xAxis.data = res.data.xData;
        option.series[0].data = res.data.yData;
        myChart.setOption(option);
        this.resizeChart();
      });
    },
    resizeChart() {
      let _this = this;
      myChart.resize();
    },

    changeDated(dated) {
      console.log(dated);
      this.searchForm.dated = !!dated
        ? dated.format("YYYY-MM")
        : moment(new Date()).format("YYYY-MM");
      this.renderChart();
    },
    handleChange(id) {
      this.searchForm.createUser = id;
      this.renderChart();
    },
  },
  created() {
    this.$http({ url: "/dict/users", ignoreReq: true }).then((res) => {
      this.userOptions = res.data;
    });
  },
  mounted() {
    let _this = this;
    myChart = this.$echarts.init(document.getElementById("keys-month"));
    this.$nextTick(() => {
      this.renderChart();
    });
    window.addEventListener("resize", _this.resizeChart);
  },
  beforeUnmount() {
    let _this = this;
    window.removeEventListener("resize", _this.resizeChart);
  },
};
</script>