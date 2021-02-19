<template>
  <a-layout-header class="header">
    <menu-unfold-outlined v-if="collapsed" class="trigger" @click="toggleCollapsed" />
    <menu-fold-outlined v-else class="trigger" @click="toggleCollapsed" />
    <Breadcrumb class="bread" />
    <section class="fl-right">
      <a-dropdown v-model:visible="visible">
        <a class="ant-dropdown-link" @click="e => e.preventDefault()">
          <a-avatar size="small" :style="{position: 'relative', top: '-2px'}">
            <template v-slot:icon>
              <UserOutlined />
            </template>
          </a-avatar> {{loginName}}
          <DownOutlined />
        </a>
        <template v-slot:overlay>
          <a-menu @click="handleMenuClick">
            <a-menu-item key="1">
              <span @click="logOut">退出</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </section>
  </a-layout-header>
</template>

<script>
import { reactive, ref, toRefs } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DownOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import Breadcrumb from "@/components/Breadcrumb";

export default {
  name: "Header",
  components: {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    DownOutlined,
    UserOutlined,
    Breadcrumb,
  },
  props: {
    collapsed: Boolean,
  },
  setup(props, { emit }) {
    const state = reactive(useStore().state);
    const store = useStore();
    const router = useRouter();

    const toggleCollapsed = () => {
      emit("toggle-collapsed");
      store.commit("changeCollapsed", Math.random());
    };

    const visible = ref(false);
    const handleMenuClick = (e) => {
      if (e.key === "3") {
        visible.value = false;
      }
    };

    const logOut = () => {
      router.push({ path: "/login" });
    };

    return {
      ...toRefs(state),
      toggleCollapsed,
      visible,
      handleMenuClick,
      logOut,
    };
  },
};
</script>

<style lang="scss" scoped>
.header {
  background-color: #fff;
  padding: 0;
  padding-right: 20px;
  &:after {
    content: "";
    display: block;
    clear: both;
  }

  .bread {
    position: relative;
    top: -3px;
    display: inline-block;
  }
}
</style>