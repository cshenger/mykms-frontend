import {
  ref,
  reactive,
} from "vue";

const loadingTable = ref(false);

const pages = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

const getTableData = ($http, options = {
  url: "",
  searchForm: {},
  current: 1
}) => {
  pages.current = options.current;
  return $http({
    url: options.url,
    params: {
      ...options.searchForm,
      ...pages
    }
  })
};

const changeTable = (pagination) => {
  console.log(pagination);
};

export {
  loadingTable,
  pages,
  getTableData,
  changeTable
}