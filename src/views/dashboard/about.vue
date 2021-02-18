<template>
  <div class="das-box">
    <header>
      <h3>假装有标题</h3>
      <section class="fl-right">
      </section>
    </header>
    <section class="das-box-main" id="ecmain"></section>
  </div>
</template>
 
<script>
export default {
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = this.$echarts.init(document.getElementById("ecmain"));
    // 绘制图表
    myChart.setOption({
      tooltip: {},
      xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
      },
      yAxis: {},
      series: [
        {
          name: "销量",
          type: "bar",
          data: [5, 20, 36, 10, 10, 20],
        },
      ],
    });

    // 测试todos
    // this.$http({ url: "/dashboard/todoList" }).then((res) => {
    //   console.log(res.data);
    // });

    // this.$http({
    //   url: "/dashboard/algorKeys",
    //   params: { createUser: "user_1_0.59728" },
    // }).then((res) => {
    //   console.log(res.data);
    // });

    // this.$http({
    //   url: "/dashboard/keysMonth",
    //   params: { year: "2021", month: "02", createUser: "user_1_0.59728" },
    // }).then((res) => {
    //   console.log(res.data);
    // });
  },
};
</script>
 
<style lang="scss" scoped>
</style>