<template>
  <div class="das-box">
    <header>
      <h3>待办事项</h3>
    </header>
    <a-list size="small" bordered :data-source="todos" class="todolist">
      <template #renderItem="{ item }">
        <a-list-item><a href="javascript:;" @click="jumpTo(item)">{{ item.text }}</a></a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script>
export default {
  name: "TodoList",
  data() {
    return {
      todos: [],
    };
  },
  methods: {
    getTodos() {
      this.$http({ url: "/dashboard/todoList" }).then((res) => {
        this.todos = res.data;
      });
    },
    jumpTo(item) {
      this.$router.push({
        path: "/encryption/keys",
        query: { id: item.id, activeKey: item.activeKey },
      });
    },
  },
  created() {
    this.getTodos();
  },
};
</script>

<style lang="scss" scoped>
.todolist {
  height: 400px;
  overflow-y: auto;
  a {
    color: #333;
    &:hover {
      color: #999;
    }
  }
}
</style>