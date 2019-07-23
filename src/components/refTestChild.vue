/**
* @Description:
* @Author: yanhui.gao
* @Date: 2019/7/23  17:21
*/
<template>
  <div></div>
</template>

<script>
export default {
  props: ['month'],
  computed: {},
  methods: {
    showMonth () {
      console.log(`当前组件${this.month}`)
    }
  },
  created () {}
}
</script>
