/**
* @Description:
* @Author: yanhui.gao
* @Date: 2019/7/23  17:19
*/
<template>
  <div>
    <child :ref="`${yearInfo}`" :month="yearInfo" ></child>
    <child v-for="col in monthList" :ref="`${col}`" :month="col" :key="col"></child>
    <button @click="callSubmethod()">调用子组件方法</button>
  </div>
</template>
<script>
import child from '../components/refTestChild.vue'

export default {
  name: 'app',
  data () {
    return {
      monthList: [
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december'],
      yearInfo: 'year'
    }
  },
  components: {
    child
  },
  methods: {
    callSubmethod () {
      const refName = `${this.yearInfo}`
      this.$refs[refName].showMonth()
      this.monthList.forEach((filed) => {
        const refName = `${filed}`
        this.$refs[refName][0].showMonth()
      })
    }
  }
}
</script>
