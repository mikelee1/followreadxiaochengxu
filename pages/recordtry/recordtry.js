// pages/oldMusic/index.js
const app = getApp()
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.autoplay = false

innerAudioContext.onPlay(() => {
  console.log('开始播放')
})
innerAudioContext.onStop(() => {
  console.log('stop play')
})
innerAudioContext.onPause(() => {
  console.log('pause play')
})
innerAudioContext.onError((res) => {
  console.log(res.errMsg)
  console.log(res.errCode)
})

recorderManager.onStart(() => {
  console.log('recorder start')
})
recorderManager.onResume(() => {
  console.log('recorder resume')
})
recorderManager.onPause(() => {
  console.log('recorder pause')
})
recorderManager.onStop((res) => {

  app.globalData.audiopath = res.tempFilePath

  app.globalData.duration = res.duration


  const { tempFilePath } = res
})
recorderManager.onFrameRecorded((res) => {
  const { frameBuffer } = res

})

const options = {
  duration: 60000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'aac',
  frameSize: 50
}

Page({
  data: {
    showaudio:false,
    showyuansheng:false,
    playstate:false,
    tingstate:true,
    recordstate:true,
    curTimeVal:0,
    duration:100,
    audioSrc:'',
    upload: false, 
    nodes: [{
      name: "p",
      attrs: { style: 'color:red' },
      children: [{
        type: "text",
        text: '结点列表标题结点列表标题结点列表标题结点列表标题结点列表标题结点列表标题结点列表标题结点列表标题结点列表标题'
      }]
    }],
  },

start:function(event){
  if (event.currentTarget.dataset.id) {
    recorderManager.start(options)
    
    this.setData({
      recordstate: false
    })
  } else {
    innerAudioContext.src = app.globalData.audiopath;
    recorderManager.stop()
    this.setData({
      recordstate: true,
      showyuansheng: true,
      audioSrc: app.globalData.audiopath
    })
  }
  
},


  
submit:function(){
  var that = this;
  this.setData({
    upload:true
  })
  wx.uploadFile({
    url: app.globalData.baseurl + '/upload/',
    filePath: app.globalData.audiopath,
    name: 'record',
    success: function (res) {
      app.globalData.returnaudiopath = res.data
      that.setData({
        showaudio:true
      })
    }
  })
},

ting:function(event){

  if (event.currentTarget.dataset.id) {
    this.setData({
      tingstate: false
    })
    innerAudioContext.stop()
  } else{
    this.setData({
      tingstate: true
    })
    innerAudioContext.autoplay = true
    innerAudioContext.src = app.globalData.audiopath
    innerAudioContext.play()
  }
},

play:function(event){

  if (event.currentTarget.dataset.id){

    innerAudioContext.stop()
    this.setData({
      playstate: false
    })
  }else{

    innerAudioContext.autoplay = true
    innerAudioContext.src = app.globalData.returnaudiopath
    innerAudioContext.play()

    this.setData({
      playstate: true
    })
  }

},

click:function(){

  function sleep(n) {
    var start = new Date().getTime();//定义起始时间的毫秒数
    while (true) {
      var time = new Date().getTime();//每次执行循环取得一次当前时间的毫秒数
      if (time - start > n) {//如果当前时间的毫秒数减去起始时间的毫秒数大于给定的毫秒数，即结束循环
        break;
      }
    }
  }


  var that = this

    var oP = that.data.nodes;
    var str1 = that.data.nodes[0].children[0].text;
    var str = that.data.nodes[0].children[0].text;
    var a = 0;
    var str_2 = "";
    var len = str.length;

    function color(str) {
      for (var i = 0; i < len; i++) {
        sleep(100)
        that.setData({
          nodes: [{
            name: "p",
            attrs: {
              style: "color:black;word-wrap:break-word; word-break:break-all;",
              class: "red"
            },
            children: [{
              type: "text",
              attrs: { style: 'color:black' },
              text: str1.slice(0, i + 1)
            },
            {
              name: "span",
              attrs: {
                style: "color:red;word-wrap:break-word; word-break:break-all;",
                class: "red"
              },
              children: [{
                type: "text",
                text: str1.slice(i + 1)
              }]
            }
            ]
          }
          ],
        })
    }
    }
    color(str);
},





onLoad:function(){
  
},




  play1:   function (e) {

    var that = this;
    console.log(app.globalData.audiopath)
    innerAudioContext.src = app.globalData.audiopath;
    console.log(innerAudioContext.src)
    innerAudioContext.play(options);

    innerAudioContext.onPlay((res) =>that.updateTime(that)) //没有这个事件触发，无法执行updatatime

    this.setData({
      tingstate: false
    })
},





pause1: function() {

  innerAudioContext.pause();
  this.setData({
    tingstate: true
  })
},





updateTime: function(that) {
  console.log("duratio的值：", innerAudioContext.duration)
  console.log('curtime',innerAudioContext.currentTime)
  innerAudioContext.onTimeUpdate((res) => {
    //更新时把当前的值给slide组件里的value值。slide的滑块就能实现同步更新
    

    that.setData({
      duration: innerAudioContext.duration.toFixed(2) *100,
      curTimeVal: innerAudioContext.currentTime.toFixed(2) *100,
    })
  })

  //播放到最后一秒
  // if (innerAudioContext.duration.toFixed(2) - innerAudioContext.currentTime.toFixed(2)
  //   <= 0) {
  //   that.setStopState(that)
  // }


  innerAudioContext.onEnded(() => {
    that.setStopState(that)
  })


},

//拖动滑块



slideBar: function(e) {
  let that = this;

  var curval = e.detail.value; //滑块拖动的当前值

  innerAudioContext.seek(curval); //让滑块跳转至指定位置

  innerAudioContext.onSeeked((res) => {

    this.updateTime(that) //注意这里要继续出发updataTime事件，

  })


},



setStopState: function(that) {


  that.setData({

    curTimeVal: 0,
    tingstate: true

  })

  innerAudioContext.stop()

},










  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }


})
