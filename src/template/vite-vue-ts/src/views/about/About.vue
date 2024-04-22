<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { getUserInfo, postUserInfo } from '@/api/user'
import { httpRequest } from '@/utils/http'
import { ref } from 'vue'

const getData = async () => {
  const res = await getUserInfo(3282, {
    reconnect: {
      enable: false,
      count: 30
    }
  })

  console.log(res)
}

const getList = () => {
  console.log(httpRequest.getController())
}
</script>
<template>
  <div>
    <div>About</div>

    <div>
      <RouterLink to="home">home</RouterLink>
      <RouterLink to="login">login</RouterLink>
    </div>
    <div class="my-6">
      <button
        @click="getData()"
        class="mr-6"
      >
        get
      </button>
    </div>
    <div class="my-6">
      <button
        @click="getList()"
        class="mr-6"
      >
        get
      </button>
    </div>
  </div>
</template>
<style></style>
