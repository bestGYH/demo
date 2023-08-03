import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import selectVirtualScroll from '@/components/SelectVirtualScroll'
import CalcTableTotal from '@/components/CalcTableTotal'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/selectVirtualScroll',
      name: 'selectVirtualScroll',
      component: selectVirtualScroll
    },
    {
      path: '/CalcTableTotal',
      name: 'CalcTableTotal',
      component: CalcTableTotal
    }
  ]
})
