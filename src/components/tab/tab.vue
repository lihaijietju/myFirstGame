<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/index">
      <span class="tab-link">首页</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/index">
      <span class="tab-link">首页</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/index">
      <span class="tab-link">首页</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/index">
      <span class="tab-link">首页</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/index">
      <span class="tab-link">首页</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .tab
    display: flex;
    height: 44px
    line-height: 44px
    font-size: $font-size-medium
    .tab-item
      flex: 1
      text-align: center;
      .tab-link
        padding-bottom: 5px
        color: #F56C6C
      &.router-link-active
        .tab-link
          color: $color-theme
          border-bottom: 2px solid $color-theme

</style>
