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
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: black;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
</style>
