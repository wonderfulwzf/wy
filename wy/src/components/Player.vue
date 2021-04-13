<template>
  <div v-bind:id="playerId">
  </div>
</template>
<script>
  export default {
    name: "player",
    props: {
      playerId: {
        default: "player-div"
      },
    },
    data: function () {
      return {
        aliPlayer: {}, // 播放器实例
      }
    },
    methods: {
      //url播放
      playUrl(url) {
        let _this = this;
        console.log("开始播放:", url);

        //如果已经有播放器了，则将播放器div删除
        if (_this.aliPlayer) {
          _this.aliPlayer = null;
          $("#" + _this.playerId + '-player').remove();
        }
        console.log(_this.playerId);
        // 初始化播放器
        $("#" + _this.playerId).append("<div class=\"prism-player\" id=\"" + _this.playerId + "-player\"></div>");
        _this.aliPlayer = new Aliplayer({
          id: _this.playerId + '-player',
          width: '100%',
          autoplay: false,
          source: url,
          //封面地址
          cover: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2345405443,3355156438&fm=11&gp=0.jpg',
        }, function (player) {// eslint-disable-line no-unused-vars
          console.log(_this.playerId);
          console.log('播放器创建好了。')
        });
      },
      //vod播放
      playVod (vod) {
        let _this = this;
        Loading.show();
        _this.$ajax.get(process.env.VUE_APP_SERVER + '/file/file/get-auth/' + vod).then((response)=>{
          Loading.hide();
          let resp = response.data;
          if (resp.success) {
            //如果已经有播放器了，则将播放器div删除
            if (_this.aliPlayer) {
              _this.aliPlayer = null;
              $("#" + _this.playerId + '-player').remove();
            }
            console.log(_this.playerId);
            console.log(resp.data);
            // 初始化播放器
            $("#" + _this.playerId).append("<div class=\"prism-player\" id=\"" + _this.playerId + "-player\"></div>");
            _this.aliPlayer = new Aliplayer({
              id: _this.playerId + '-player',
              width: '100%',
              autoplay: false,
              vid: vod,
              playauth: resp.data,
              cover: 'http://liveroom-img.oss-cn-qingdao.aliyuncs.com/logo.png',
              encryptType:1, //当播放私有加密流时需要设置。
            },function(player){// eslint-disable-line no-unused-vars
              console.log('播放器创建好了。')
            });
          } else {
            ToastMax.warning('播放错误。')
          }
        })

      }
    }
  }
</script>