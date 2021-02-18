import {
  ref,
  reactive,
} from "vue";

let loadingTable = ref(false);

let pages = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

const changeTable = (pag, filters, sorter) => {
  console.log(pag);
};

export default function useTable() {
  function getTableData($http, options = {
    url: "",
    searchForm: {},
    current: 1
  }) {
    loadingTable.value = true;
    pages.current = options.current;
    return $http({
      url: options.url,
      params: {
        ...options.searchForm,
        ...pages
      }
    })
  }

  return {
    loadingTable,
    pages,
    getTableData,
    changeTable
  };
}