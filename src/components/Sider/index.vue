<template>
  <a-layout-sider breakpoint="lg" :collapsed-width="collapsedWidth" :trigger="null" :collapsed="collapsed" @breakpoint="onBreakpoint" class="sider"> -->
    <!-- <div class="logo" /> -->
    <a-menu theme="dark" mode="inline" v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys">
      <template v-for="item in navs">
        <a-menu-item v-if="!item.children && !item.hidden && showFromRole(item)" :key="item.path">
          <router-link :to="{path: item.path}">
            <span v-if="item.meta.icon" class="anticon"><i :class="item.meta.icon"></i></span>
            <span>{{ item.meta.title }}</span>
          </router-link>
        </a-menu-item>
        <a-menu-item v-if="item.children && item.children.length===1 && !item.hidden && showFromRole(item)" :key="item.children[0].path">
          <router-link :to="{path: item.children[0].path}">
            <span v-if="item.children[0].meta.icon" class="anticon"><i :class="item.children[0].meta.icon"></i></span>
            <span>{{ item.children[0].meta.title }}</span>
          </router-link>
        </a-menu-item>
        <sub-menu v-if="item.children && item.children.length>1 && !item.hidden && showFromRole(item)" :menu-info="item" :key="item.path" :collapsed="collapsed" />
      </template>
    </a-menu>
  </a-layout-sider>
</template>

<script>
import routes from "../../router/routes";
import SubMenu from "./SubMenu";
import { hasRoles } from "../../utils/index";

export default {
  name: "Sider",
  components: {
    SubMenu,
  },
  props: {
    collapsed: Boolean,
  },
  data() {
    return {
      navs: [],
      collapsedWidth: 80,
      selectedKeys: [],
      openKeys: [],
      roles: [],
      userRole: [],
    };
  },
  watch: {
    $route: {
      handler() {
        this.selectedKeys = [this.$route.path];
        this.openKeys = [this.$route.matched[0].path];
      },
      immediate: true,
    },
  },
  methods: {
    onBreakpoint() {
      if (window.innerWidth > 650) {
        this.collapsedWidth = 80;
      } else {
        this.collapsedWidth = 0;
      }
    },
    hasRoles: hasRoles,
    showFromRole(item) {
      return (
        !item.meta ||
        !item.meta.roles ||
        (item.meta.roles && hasRoles(this.userRole, item.meta.roles))
      );
    },
  },
  created() {
    this.navs = routes;
    this.userRole = this.$store.state.userRole;
  },
};
</script>

<style lang="scss">
.sider {
  i.fa {
    font-size: 16px;
    position: relative;
    vertical-align: text-top;
  }
}
</style>