<template>
  <div class="das-box">
    <header>
      <h3>用户角色分布</h3>
    </header>
    <section class="das-box-main" id="user-roles"></section>
  </div>
</template>

<script>
const option = {
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
  },
  legend: {
    top: "5%",
    left: "center",
  },
  series: [
    {
      name: "角色",
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2,
      },
      // label: {
      //   show: false,
      //   position: "center",
      // },
      // emphasis: {
      //   label: {
      //     show: true,
      //     fontSize: "20",
      //     fontWeight: "bold",
      //   },
      // },
      data: [],
    },
  ],
};

export default {
  name: "UserRoles",
  props: ["collapsed"],
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    collapsed() {
      setTimeout(() => {
        this.resizeChart();
      }, 300);
    },
  },
  methods: {
    renderChart() {
      let _this = this;
      this.$http({ url: "/dashboard/userroles" }).then((res) => {
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
  },
  mounted() {
    let _this = this;
    this.$emit("addBoxNum", 1);
    this.chart = this.$echarts.init(document.getElementById("user-roles"));
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