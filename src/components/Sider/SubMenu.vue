<template>
  <a-sub-menu :key="menuInfo.path" v-bind="$props">
    <template v-slot:title>
      <span v-if="menuInfo.meta.icon" class="anticon"><i :class="menuInfo.meta.icon"></i></span>
      <span>{{ menuInfo.meta.title }}</span>
    </template>
    <template v-for="item in menuInfo.children">
      <a-menu-item v-if="(!item.children || item.children.length==1) && !item.hidden && showFromRole(item)" :key="item.path">
        <router-link :to="{path: item.path}">
          <span>{{ item.meta.title }}</span>
        </router-link>
      </a-menu-item>
      <sub-menu v-if="item.children && item.children.length>1 && !item.hidden && showFromRole(item)" :key="item.path" :menu-info="item" :collapsed="collapsed" />
    </template>
  </a-sub-menu>
</template>

<script>
import { hasRoles } from "../../utils/index";

export default {
  name: "SubMenu",
  props: {
    menuInfo: {
      type: Object,
      default: () => ({}),
    },
    collapsed: Boolean,
  },
  data() {
    return {
      userRole: [],
    };
  },
  methods: {
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
    this.userRole = this.$store.state.userRole;
  },
};
</script>

<style>
</style>