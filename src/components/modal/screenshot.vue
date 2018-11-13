<template>
  <div class="imageWrapper" ref="imageWrapper">
    <img style="width: 100%;height: 300px;" class="real_pic" :src="dataURL" />
  </div>
</template>

<script>
  export default {
    name: 'screenshot',
    data () {
      return {
        dataURL: ''
      }
    },
    mounted () {
      this.toImage()
    },
    methods: {
      toImage () {
        let self = this
        setTimeout(this.$html2canvas(this.$refs.imageWrapper,{
          backgroundColor: null,
          width: '100%',
          height: 300,
          windowWidth: '100%',
          windowHeight: 300
        }).then((canvas) => {
          document.body.appendChild(canvas)
          let dataURL = canvas.toDataURL("image/png")
          self.dataURL = dataURL
        }), 0)
      }
    }
  }
</script>
