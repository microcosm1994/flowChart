<template>
  <div class="imageWrapper" ref="imageWrapper">
    <img style="width: 100%;height: 300px;" class="real_pic" :src="dataURL" />
    <slot></slot>
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
        setTimeout(this.$html2canvas(this.$refs.imageWrapper,{
          backgroundColor: null,
          allowTaint: true
        }).then((canvas) => {
          let dataURL = canvas.toDataURL("image/png")
          this.dataURL = dataURL
        }), 0)
      }
    }
  }
</script>
