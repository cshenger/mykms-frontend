<template>
  <a-breadcrumb v-if="showBread" :style="{
      padding: '24px',
      paddingBottom: '0',
    }">
    <template v-if="matched.length > 0">
      <a-breadcrumb-item v-for="item in matched" :key="item.path"><a href="javascript:;" @click="jumped(item.path)">{{
          item.meta.title
        }}</a></a-breadcrumb-item>
    </template>
  </a-breadcrumb>
</template>

<script>
import { ref, watch, reactive, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "Breadcrumb",
  setup() {
    const route = useRoute();
    const router = useRouter();

    const state = reactive({
      matched: JSON.parse(JSON.stringify(route.matched)),
    });
    const showBread = ref(true);

    watch(
      () => route,
      (route) => {
        // console.log(route.matched);
        state.matched = JSON.parse(JSON.stringify(route.matched));
        if (route.path == "/dashboard/index") {
          showBread.value = false;
        } else {
          showBread.value = true;
        }
        state.matched = state.matched.filter((item) => {
          return !!item.meta.title;
        });
      },
      {
        immediate: true,
        deep: true,
      }
    );

    const jumped = (path) => {
      router.push({
        path: path,
      });
    };

    return { ...toRefs(state), jumped, showBread };
  },
};
</script>