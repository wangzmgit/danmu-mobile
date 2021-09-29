<template>
  <div id="danmaku"></div>
</template>

<script>
import "../player-global.css";
export default {
  props: {
    danmakuList: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      danmaku: [],
      danTunnel: {
        row: [], //轨道结束的时间
        top:[],
        bottom:[],
      },
      currentTime: 0,
      paused:false,
    };
  },
  methods: {
    Pause() {
      for (let i = 0; i < this.danmaku.length; i++) {
        this.danmaku[i].style.animationPlayState = "paused";
      }
      this.paused = true;
    },
    Start() {
      for (let i = 0; i < this.danmaku.length; i++) {
        this.danmaku[i].style.animationPlayState = "running";
      }
      this.paused = false;
    },
    //更新时间
    TimeUpdate(currTime) {
      if (Math.round(currTime) !== this.currentTime) {
        this.currentTime = Math.round(currTime);
        //绘制弹幕
        if(this.danmakuList == null){
          return;
        }
        let len = this.danmakuList.length;
        for (let i = 0; i < len; i++) {
          if (this.danmakuList[i].time == this.currentTime) {
            this.DrawDanmaku(this.danmakuList[i])
          }
        }
      }
    },
    //获取滚动弹道
    GetRowTunnel(text) {
      //当前弹幕结束时间
      let duration = 30 - text.length * 0.5;
      let width = document.getElementById("danmaku").offsetWidth;
      duration =
        Math.ceil((width + text.length * 20) / (3000 / duration)) +
        this.currentTime;
      //计算弹道数量
      let tunnnel = document.getElementById("danmaku").offsetHeight / 26;
      tunnnel = Math.floor(tunnnel);
      //遍历轨道
      for (let i = 0; i < this.danTunnel.row.length; i++) {
        //如果当前轨道结束时间小于新弹幕的结束时间
        //说明弹幕可以放在该弹道
        if (this.danTunnel.row[i] < duration) {
          this.danTunnel.row[i] = duration;
          return i;
        }
      }
      //如果没有则尝试新增加弹道
      if (this.danTunnel.row.length < tunnnel) {
        this.danTunnel.row.push(duration);
        return this.danTunnel.row.length - 1;
      }
      //如果不可以新增弹道，则使用随机弹道
      return Math.round(Math.random() * tunnnel);
    },
    //获取固定弹道
    GetFixedTunnel(type) {
      //当前弹幕结束时间
      let duration = this.currentTime + 5;
      //计算弹道数量
      let tunnnel = document.getElementById("danmaku").offsetHeight / 26;
      tunnnel = Math.floor(tunnnel);
      switch (type) {
        case 1:
          //遍历轨道
          for (let i = 0; i < this.danTunnel.row.length; i++) {
            //如果当前轨道结束时间小于新弹幕的结束时间
            //说明弹幕可以放在该弹道
            if (this.danTunnel.top[i] < duration) {
              this.danTunnel.top[i] = duration;
              return i;
            }
          }
          //如果没有则尝试新增加弹道
          if (this.danTunnel.top.length < tunnnel) {
            this.danTunnel.top.push(duration);
            return this.danTunnel.top.length - 1;
          }
          break;
        case 2:
          //遍历底部弹幕轨道
          for (let i = 0; i < this.danTunnel.bottom.length; i++) {
            //如果当前轨道结束时间小于新弹幕的结束时间
            //说明弹幕可以放在该弹道
            if (this.danTunnel.bottom[i] < duration) {
              this.danTunnel.bottom[i] = duration;
              return i;
            }
          }
          //如果没有则尝试新增加弹道
          if (this.danTunnel.bottom.length < tunnnel) {
            this.danTunnel.bottom.push(duration);
            return this.danTunnel.bottom.length - 1;
          }
          break;
      }
      //如果不可以新增弹道，则使用随机弹道
      return Math.round(Math.random() * tunnnel);
    },
    //清除弹幕
    ClearDanmaku(){
      this.danTunnel.row = [];
      this.danTunnel.top = [];
      this.danTunnel.bottom = [];
      document.getElementById("danmaku").innerHTML = "";
    },
    DrawDanmaku({text, color, type},send = false) {
      var item = document.createElement("span");
      var content = document.createTextNode(text);
      item.style.color = color;
      item.appendChild(content);
      item.className = "danmaku-item";
      //滚动弹幕
      if (type == 0) {
        item.style.textAlign = "left";
        item.style.top = String(this.GetRowTunnel(text) * 26) + "px";
        let duration = 30 - text.length * 0.5;
        item.style.animation = "mov " + String(duration) + "s";
        this.danmaku.push(item);
        document.getElementById("danmaku").appendChild(item);
        item.addEventListener("animationend", () => {
          this.danmaku.splice(item);
          document.getElementById("danmaku").removeChild(item);
        });
        if(send){
          item.style.border = "1px solid red";
        }
      }else if(type == 1){
        item.style.width = "100%";
        item.style.textAlign = "center";
        item.style.top = String(this.GetFixedTunnel(1) * 26) + "px";
        item.style.animation = "danmaku-center 5s";
        this.danmaku.push(item);
        document.getElementById("danmaku").appendChild(item);
        item.addEventListener("animationend", () => {
          this.danmaku.splice(item);
          document.getElementById("danmaku").removeChild(item);
        });
      }else if(type == 2){
        item.style.width = "100%";
        item.style.textAlign = "center";
        item.style.bottom = String(this.GetFixedTunnel(1) * 26) + "px";
        item.style.animation = "danmaku-center 5s";
        this.danmaku.push(item);
        document.getElementById("danmaku").appendChild(item);
        item.addEventListener("animationend", () => {
          this.danmaku.splice(item);
          document.getElementById("danmaku").removeChild(item);
        });
      }
      if(this.paused){
        item.style.animationPlayState = "paused";
      }
    },
    //设置弹幕不透明度
    SetOpaque(opacity){
      let danmaku = document.getElementById("danmaku");
      if(danmaku != null){
        danmaku.style.opacity = parseFloat(opacity) * 0.01;
      }
    },
  },
};
</script>

<style scoped>
#danmaku {
  z-index: 1;
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
</style>

