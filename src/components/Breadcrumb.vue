<template>
  <a-breadcrumb v-if="showBread">
    <template v-if="$store.state.matched.length > 0">
      <a-breadcrumb-item v-for="item in $store.state.matched" :key="item.path"><a href="javascript:;" @click="jumped(item.path)">{{
          item.meta.title
        }}</a></a-breadcrumb-item>
    </template>
  </a-breadcrumb>
</template>

<script>
export default {
  name: "Breadcrumb",
  data() {
    return {
      showBread: true,
    };
  },
  watch: {
    $route: {
      handler() {
        if (this.$route.path == "/dashboard/index") {
          this.showBread = false;
        } else {
          this.showBread = true;
        }
        this.$store.state.matched = this.$route.matched.filter((item) => {
          return !!item.meta.title;
        });
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    jumped(path) {
      this.$router.push({
        path: path,
      });
    },
  },
};
</script>