<template>
  <a-config-provider :locale="locale">
    <a-spin :spinning="spinning" tip="Loading..." class="spin-global">
      <a-layout id="components-layout">
        <Sider :collapsed="collapsed" />

        <a-layout>
          <Header :collapsed="collapsed" @toggle-collapsed="collapsed = !collapsed" />
          <Breadcrumb />
          <a-layout-content>
            <router-view></router-view>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-spin>
  </a-config-provider>
</template>

<script>
import { ref, computed } from "vue";
import Sider from "@/components/Sider";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
import store from "../store";

moment.locale("zh-cn");

export default {
  components: {
    Sider,
    Header,
    Breadcrumb,
  },
  setup() {
    let collapsed = ref(false);
    const locale = ref(zhCN);
    const spinning = computed(() => {
      return store.state.spinning;
    });

    return { collapsed, locale, spinning };
  },
};
</script>

<style lang="scss">
#components-layout {
  min-height: 100vh;

  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: #1890ff;
    }
  }

  .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }
}

.spin-global {
  z-index: 100;
}
</style>
