<template>

    <router-view></router-view>

</template>

<script>
  import { registerAPI } from '@/api'

  export default {
    async created () {
      console.log(5555)
      const res = await registerAPI()
      console.log(res)
    }
  }
</script>

<style lang="less">

</style>
