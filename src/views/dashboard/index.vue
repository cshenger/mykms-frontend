<template>
  <div class="dashboard">
    <section class="header mb-15">{{$store.state.userName}}，您好。欢迎访问密钥管理系统</section>

    <a-row :gutter="16">
      <a-col :span="girdspan" class="mb-20">
        <todo-list />
      </a-col>
      <a-col v-if="userRole.includes('sysAdmin')" :span="girdspan" class="mb-20">
        <user-roles @addBoxNum="addBoxNum" />
      </a-col>
      <a-col v-if="userRole.includes('keyAdmin')" :span="girdspan" class="mb-20">
        <algor-keys @addBoxNum="addBoxNum" />
      </a-col>
      <a-col v-if="userRole.includes('keyAudit')" :span="girdspan" class="mb-20">
        <status-keys @addBoxNum="addBoxNum" />
      </a-col>
      <a-col :span="24">
        <keys-month />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import UserRoles from "./userRoles";
import TodoList from "./todoList";
import AlgorKeys from "./algorKeys";
import StatusKeys from "./statusKeys";
import KeysMonth from "./keysMonth";

export default {
  name: "Dashboard",
  components: {
    UserRoles,
    TodoList,
    AlgorKeys,
    StatusKeys,
    KeysMonth,
  },
  data() {
    return {
      boxNum: 0,
      girdspan: 24,
    };
  },
  computed: {
    userRole() {
      return this.$store.state.userRole;
    },
  },
  watch: {
    boxNum() {
      if (this.boxNum == 0) {
        this.girdspan = 24;
      } else if (this.boxNum == 1) {
        this.girdspan = 12;
      } else if (this.boxNum == 2) {
        this.girdspan = 8;
      } else if (this.boxNum == 3) {
        this.girdspan = 12;
      }
    },
  },
  methods: {
    addBoxNum(value) {
      this.boxNum += value;
    },
  },
  created() {
    console.log(this.userRole);
  },
};
</script>

<style lang="scss">
.dashboard {
  box-sizing: border-box;
  padding: 20px;
}

.das-box {
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 3px 5px #ccc;
  border-radius: 5px;

  & > header {
    padding: 10px;

    &:after {
      content: "";
      display: block;
      clear: both;
    }

    h3 {
      display: inline-block;
    }
  }
}

.das-box-main {
  width: 100%;
  height: 400px;
  border-radius: 0 0 5px 5px;
}
</style>