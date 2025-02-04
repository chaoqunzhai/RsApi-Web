<template>
  <div class="basic-layout">
    <header class="box-form" v-if="showHeader">
      <el-card >
        <slot name="header" />
      </el-card>
    </header>
    <el-main class="wrapper el-card is-always-shadow" style="display: flex;flex-direction: column">
      <slot name="wrapper" />
    </el-main>
  </div>
</template>

<script>
export default {
  name: 'BasicLayout',
  props: {
    showHeader: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .basic-layout{
    height: 100%;
    padding: 10px;
    background: #f2f3f5;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .wrapper {
      transition: none !important;
      overflow: hidden;
      flex: 1;
      padding-top:18px;
      ::v-deep .el-card__body {
        display: flex;
        flex-direction: column;
      }
    }
    .card {
      background-color: #fff;
      border-radius: 6px;
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
    }
  }
  ::v-deep .el-card__body {
    height: 100%!important;
  }
  //.box-form {
  //  margin-bottom: 10px;
  //  .queryForm {
  //    ::v-deep .el-card__body {
  //      padding: 8px 18px !important;
  //    }
  //    ::v-deep .el-form-item {
  //      margin-bottom: 10px;
  //      display: flex !important;
  //    }
  //    ::v-deep .el-form-item__label {
  //      flex: 0 0 auto !important;
  //    }
  //    ::v-deep .el-form-item__content {
  //      flex: 1!important;
  //    }
  //  }
  //}
  //.is-always-shadow {
  //  height: 100%!important;
  //}
</style>
