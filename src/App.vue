<template>
  <div id="app">
    <tab></tab>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import MHeader from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'
  import indexApi from 'components/index/indexApi'

  export default {
    components: {
      MHeader,
      Tab
    },
    data () {
      return {
        lists: []
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
