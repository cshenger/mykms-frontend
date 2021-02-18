<template>
  <div class="box">
    <a-tabs v-model:activeKey="activeKey" @change="changeTabs">
      <a-tab-pane key="using" tab="当前库">
        <table-keys v-if="activeKey=='using'" :tabsType="activeKey" />
      </a-tab-pane>
      <a-tab-pane key="history" tab="历史库">
        <table-keys v-if="activeKey=='history'" :tabsType="activeKey" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { ref } from "vue";
import TableKeys from "./table";
import { useRoute } from "vue-router";

export default {
  name: "EncryptionKeys",
  components: { TableKeys },
  setup() {
    const route = useRoute();
    let activeKey = ref("using");

    const changeTabs = (value) => {
      console.log(value);
    };

    if (route.query && route.query.activeKey) {
      activeKey.value = route.query.activeKey;
    }

    return {
      activeKey,
      changeTabs,
    };
  },
};
</script>

<style>
</style>