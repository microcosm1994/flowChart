<template>
  <div class="imageWrapper" ref="imageWrapper">
    <img style="width: 100%;height: 300px;" class="real_pic" :src="dataURL" />
    <div style="text-align: center">
      <el-button size="mini" type="primary" @click="submitForm()">保存</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'screenshot',
    data () {
      return {
        dataURL : ''
      }
    },
    computed: {
      refs: function () {
        return this.$store.state.refs
      }
    },
    mounted () {
      this.toImage()
    },
    methods: {
      toImage () {
        let self = this
        this.$html2canvas(this.refs,{
          backgroundColor: '#142E48',
          canvas:null,
          scale:window.devicePixelRatio,
          useCORS:true,
          async:false
        }).then((canvas) => {
          let dataURL = canvas.toDataURL("image/png")
          self.dataURL = dataURL
        })
      },
      submitForm () {
        let self = this
        let a = document.createElement('a')
        a.download = '故障树截图'
        a.href = this.dataURL
        let event = new MouseEvent('click')
        a.dispatchEvent(event)
      }
    }
  }
</script>
