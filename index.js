
import userModal from './userProductModal.js'

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  generateMessage: localize('zh_TW'),
});

const baseUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'townyuan';


Vue.createApp({
	data() {
		return {
			products: [],
      tempProduct: {},
      status: {
        addCartLoading: '',
        cartQtyLoading: '',
      },
      carts: {},
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
		}
	},
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
	methods: {
    //取得產品們
		getProducts() {
			axios.get(`${baseUrl}/api/${apiPath}/products/all`).then((res) => {
				this.products = res.data.products;
			})
      .catch((err) => {
        alert(err.response.data.message);
      })
		},
    openModal(product) {
      this.tempProduct = product;
      this.$refs.userModal.open();
    },
    //加入購物車
    addToCart(product_id, qty = 1) {
      const order = {
          product_id,
          qty,
        };
      this.status.addCartLoading = product_id;
      axios.post(`${baseUrl}/api/${apiPath}/cart`, { data: order})
        .then((res) => {
        this.status.addCartLoading = '';
        this.getCart();
        this.$refs.userModal.close();
			})
      .catch((err) => {
        alert(err.response.data.message);
      })
    },
    //取得購物車
    getCart() {
      axios.get(`${baseUrl}/api/${apiPath}/cart`).then((res) => {
        this.carts = res.data.data;
      })
      .catch((err) => {
        alert(err.response.data.message);
      })
    },
    //變更購物車數量
    changeCartQty(item, qty = 1) {
      const order = {
        product_id: item.product_id,
        qty,
      };
      this.status.cartQtyLoading = item.id;
      axios.put(`${baseUrl}/api/${apiPath}/cart/${item.id}`, { data: order})
        .then((res) => {
        this.status.cartQtyLoading = '';
        this.getCart();
      })
      .catch((err) => {
        alert(err.response.data.message);
      })
    },
    //移除購物車項目
    removeCartItem(id) {
      this.status.cartQtyLoading = id;
      axios.delete(`${baseUrl}/api/${apiPath}/cart/${id}`)
        .then((res) => {
        this.status.cartQtyLoading = '';
        this.getCart();
      })
      .catch((err) => {
        alert(err.response.data.message);
      })
    },
    //清空購物車
    deleteAllCarts() {
      axios.delete(`${baseUrl}/api/${apiPath}/carts`)
        .then((res) => {
          this.getCart();
      })
      .catch((err) => {
        alert.log(err.response.message);
      })
    },
    //建立訂單
    createOrder() {
      const order = this.form;
      axios.post(`${baseUrl}/api/${apiPath}/order`, { data: order })
        .then((response) => {
          alert(response.data.message);
          this.$refs.form.resetForm();
          this.getCart();
        }).catch((err) => {
          alert(err.response.data.message);
        });
    },
	},
	mounted() {
		this.getProducts();
    this.getCart();
	},
})
//註冊元件
.component('userModal', userModal)
.mount('#app')
