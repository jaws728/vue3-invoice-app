<template>
  <header class="flex">
    <div class="branding flex">
      <img src="@/assets/file-invoice-dollar-solid.png" alt=""/>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Navigator'
}
</script>

<style lang="scss">
header{
  z-index: 99;
  flex-direction: row;
  background-color: #a1a1a1;
  @media (min-width: 900px){
    min-height: 100%;
    min-width: 90px;
    flex-direction: column;
    border-radius: 0 20px 20px 0;
  }

  .branding{
    border-radius: 0 20px 20px 0;
    background-color: #f32;
    justify-content: center;
    padding: 24px;
    @media(min-width: 900px){
      width: 100%;
    }

    img{
      width: auto;
      height: 30px;
    }
  }
}
</style>
