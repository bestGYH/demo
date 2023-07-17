<template>
  <div>
    <h2> ant-design 下拉框虚拟滚动</h2>
    <a-select  style="width: 300px"
      :allowClear="false" 
      placeholder="请选择"
      showSearch 
      :filterOption="false" 
      @search="e => onSearch(e)" 
      @blur="onSelectBlur"
      @popupScroll="onSelectScroll"
      @change="handleChange" 
      >
      <a-select-option
        v-for="item in selectDataLists"
        :key="item.id"
        :value="item.id"
      >
        {{ item.text }}
      </a-select-option>
    </a-select>
    <h2> 无下拉框虚拟滚动</h2>
    <a-select  style="width: 300px"
      :allowClear="false" 
      placeholder="请选择"
      @change="handleChange" 
      >
      <a-select-option
        v-for="item in allSelectDataLists"
        :key="item.id"
        :value="item.id"
      >
        {{ item.text }}
      </a-select-option>
    </a-select>
  </div>
</template>
<script>
import debounce from "lodash/debounce";

let allSelectDataLists = []

for(let i =0;i<9000;i++){
  allSelectDataLists.push({id:i,text:`第${i+1}个`})
}
export default {
  
  data() {
     // 函数节流，防止数据频繁更新，每300毫秒才搜索一次
   this.onSearch = debounce(this.onSearch, 300);
    return {
      allSelectDataLists,
      selectDataLists:[],
      pagination:{
        pageSize: 100,
        currentPage: 1,
        keyWords: "",
      }

    }
  },
  mounted() {
this.selectDataLists = this.get100Items();
  },
  computed: {

  },
  methods: {
    handleChange(value) {
      console.log(`selected ${value}`);
    },

    get100Items() {
      return this.allSelectDataLists.slice(0, 100);
    },
    onSearch(value) {
      this.$set(this.pagination, "keyWords", value);
      this.searchValueRelUrl(value);
    },
    searchValueRelUrl(value) {
      const datas = this.allSelectDataLists.filter(item => {
        return item.text.indexOf(value) > -1;
      });
      // 然后只显示符合搜索条件的所有数据中的前100条
      this.$set(this, "selectDataLists", datas.slice(0, 100));
    },
    onSelectBlur() {
      this.selectDataLists = this.get100Items();
    },
    onSelectScroll(e) {
      const { target } = e;
      const rmHeight = target.scrollHeight - target.scrollTop;
      console.log('target.scrollHeight',target.scrollHeight);
      console.log('target.scrollTop',target.scrollTop);
      const clHeight = target.clientHeight;
      console.log(clHeight);
      if (rmHeight === 0 && clHeight === 0) {
        this.pagination.currentPage = 1;
      } else {
        if (rmHeight < clHeight + 5) {
          // 滚到底了
          this.pagination.currentPage += 1;
          this.onProxyLoadPage(this.pagination.currentPage);
        }
      }
    },
    onProxyLoadPage(currentPage) {
      const { pageSize, keyWords } = this.pagination;
      // 通过每页的数据条数和页数得到总的需要展示的数据条数
      const newPageSize = pageSize * (currentPage || 1);
      let newOptionsData = [],
        maxLen; // len 能展示的数据的最大条数
      if (this.allSelectDataLists.length > newPageSize) {
        // 如果总数据的条数大于需要展示的数据
        maxLen = newPageSize;
      } else {
        // 否则
        maxLen = this.allSelectDataLists.length;
      }
      // 如果有搜索的话，就走这里
      if (!!keyWords) {
        let data_ =
          this.allSelectDataLists.filter(item => item.text.indexOf(keyWords) > -1) ||
          [];
        data_.forEach((item, index) => {
          if (index < maxLen) {
            newOptionsData.push(item);
          }
        });
      } else {
        this.allSelectDataLists.forEach((item, index) => {
          if (index < maxLen) {
            newOptionsData.push(item);
          }
        });
      }
      this.$set(this, "selectDataLists", newOptionsData);
    },
  },
}
</script>
<style scoped></style>
