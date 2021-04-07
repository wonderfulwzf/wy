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
  <div><input class="loginButton" type="button" value="登录" v-on:click="Login()" /></div>
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
   _this.$router.push("/welcome");
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
		background-image: url("../../public/static/img/bgimg.jpg");
        background-repeat: no-repeat;	/* 背景图片不重复 */
	}
</style>
