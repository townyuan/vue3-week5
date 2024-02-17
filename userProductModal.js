export default {
  template: '#userProductModal',
  props: ['tempProduct', 'addToCart'],
  data() {
    return {
      modal: '',
      qty: 1,
    }
  },
  methods: {
    open() {
      this.modal.show();
    },
    close() {
      this.modal.hide();
    }
  },
  watch: {
    tempProduct() {
      this.qty = 1;
    }
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal, {
      keyboard: false,
      backdrop: 'static'
    });
  }
}