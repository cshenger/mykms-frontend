<template>
  <div class="das-box">
    <header>
      <h3>密钥算法统计</h3>
      <section class="fl-right">
        <a-select v-model:value="searchForm.createUser" placeholder="创建人" ref="select" showSearch allowClear @change="handleChange" style="width: 120px">
          <a-select-option v-for="user in userOptions" :key="user.id" :value="user.id">{{user.userName}}</a-select-option>
        </a-select>
      </section>
    </header>
    <section class="das-box-main" id="status-keys"></section>
  </div>
</template>

<script>
const option = {
  tooltip: {
    trigger: "item",
  },
  legend: {
    // orient: "vertical",
    // left: "left",
  },
  series: [
    {
      name: "状态",
      type: "pie",
      radius: "50%",
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
};

export default {
  name: "StatusKeys",
  data() {
    return {
      chart: null,
      searchForm: {
        createUser: undefined,
      },
      userOptions: [],
    };
  },
  methods: {
    renderChart() {
      let _this = this;
      this.$http({
        url: "/dashboard/statusKeys",
        params: { ...this.searchForm },
      }).then((res) => {
        option.series[0].data = res.data;
        this.chart.setOption(option);
        this.resizeChart();
      });
    },
    resizeChart() {
      let _this = this;
      if (this.chart) {
        _this.chart.resize();
      }
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
    this.$emit("addBoxNum", 1);
    this.chart = this.$echarts.init(document.getElementById("status-keys"));
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