/**
* @Description:
* @Author: yanhui.gao
* @Date: 2019/7/23  17:17
*/
<template>
  <RefTestDemo v-if="refTestDemoShow"></RefTestDemo>
</template>
<script>
import RefTestDemo from './refTestDemo.vue'

export default {
  name: 'home',
  data () {
    return {
      refTestDemoShow: true
    }
  },
  components: {
    RefTestDemo
  },
  methods: {

  }
}
</script>
