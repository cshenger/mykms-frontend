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
          </a-avatar> {{userName}}
          <DownOutlined />
        </a>
        <template v-slot:overlay>
          <a-menu @click="handleMenuClick">
            <a-menu-item key="2">
              <span @click="editPassword">修改密码</span>
            </a-menu-item>
            <a-menu-item key="1">
              <span @click="logOut">退出</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </section>
  </a-layout-header>

  <!-- 弹框部分-->
  <a-modal v-model:visible="dialogs.visible" :title="dialogs.title" :maskClosable="false" :footer="null">
    <EditPassword v-if="dialogs.visible" :userId="dialogs.userId" @cancel-dialog="cancelDialog" />
  </a-modal>
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
import EditPassword from "../views/users/editPassword";

export default {
  name: "Header",
  components: {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    DownOutlined,
    UserOutlined,
    Breadcrumb,
    EditPassword,
  },
  props: {
    collapsed: Boolean,
  },
  emits: {
    toggleCollapsed: (payload) => {
      return payload;
    },
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

    // 弹框
    let dialogs = reactive({
      title: "",
      visible: false,
      userId: "",
    });

    const cancelDialog = (reload) => {
      dialogs.subType = "";
      dialogs.title = "";
      dialogs.visible = false;
      dialogs.userId = "";
    };

    const editPassword = () => {
      dialogs.visible = true;
      dialogs.title = "修改密码";
      dialogs.userId = store.state.userId;
    };

    return {
      ...toRefs(state),
      toggleCollapsed,
      visible,
      handleMenuClick,
      logOut,
      dialogs,
      cancelDialog,
      editPassword,
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