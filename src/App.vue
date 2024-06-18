<template>
  <div id="app">
    <AppMain />
  </div>
</template>

<script>
import AppMain from './components/AppMain.vue';


export default {
  name: 'App',
  components: {
    AppMain
  }
};
</script>

<style>

body{
  font-family:Arial, Helvetica, sans-serif;
}

*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
</style>
