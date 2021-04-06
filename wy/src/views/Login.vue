<template>
<div class="homeBox">
 <div id="bigBox">
  <h1>LOGIN</h1>
  <div class="inputBox bg">
   <div class="inputText">
    <span class="iconfont icon-nickname"></span>
    <input type="text" placeholder="Username" />
   </div>
   <div class="inputText">
    <span class="iconfont icon-visible"></span>
    <input type="password" placeholder="Password" />
   </div>
  </div>
  <input class="loginButton" type="button" value="Login" v-on:click="Login()" />
 </div>
 </div>
</template>
<script>
export default {
 name: "login",
 data: function () {
  return {
   user: {},
   remember: true, // 默认勾选记住我
   imageCodeToken: "",
  };
 },
 mounted: function () {},
 methods: {
  Login() {
   let _this = this;
   _this.$router.push("/");
  }
 },
};
</script>
<style scoped>
.homeBox {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0px;
		background-image: url("C:/Users/80504/Desktop/wy/wy/public/static/img/bgimg.jpg");
        background-repeat: no-repeat;	/* 背景图片不重复 */
	}
</style>
