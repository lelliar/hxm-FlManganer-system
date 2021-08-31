<template>
  <div>
    <slot :name="item.name" v-for="(item, i) in slotName" :Key="i"></slot>
  </div>
</template>

<script>
export default {
  name: 'Title',
  data() {
    return {
      slotName: [{ name: 'title' }, { name: 'button' }, { name: 'formList' }, { name: 'page' }]
    }
  }
}
</script>

<style></style>
