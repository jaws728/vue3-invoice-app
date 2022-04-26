<template>
  <div v-if="invoicesLoaded">
    <div v-if="!mobile" class="app flex flex-column">
      <Navigator/>
      <div class="app-content flex flex-column">
        <Modal v-if="modalActive"/>
        <transition name="invoice">
          <InvoiceModal v-if="invoiceModal"/>
        </transition>
        <router-view/>
        <!-- <Home/> -->
      </div>
    </div>
    <div v-else class="mobile-msg flex flex-column">
      <h2>Sorry, this app is not supported on mobile devices</h2>
      <p>To use this app, please use computer or tablet</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Navigator from '@/components/Navigator.vue'
import InvoiceModal from '@/components/InvoiceModal.vue'
import Modal from '@/components/Modal.vue'
// import Home from '@/views/Home.vue'

export default {
  components: {
    Navigator,
    InvoiceModal,
    // Home,
    Modal
  },
  data () {
    return {
      mobile: null
    }
  },
  methods: {
    ...mapActions(['GET_INVOICES']),
    checkScreen () {
      const windowWidth = window.innerWidth
      if (windowWidth <= 750) {
        this.mobile = true
      } else {
        this.mobile = false
      }
    }
  },
  created () {
    this.GET_INVOICES()
    // check screen width when data is created
    this.checkScreen()
    window.addEventListener('resize', this.checkScreen)
  },
  computed: {
    ...mapState(['invoiceModal', 'modalActive', 'invoicesLoaded'])
  }
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

.app{
  background-color: #e1e1e1;
  min-height: 100vh;
  @media(min-width: 900px) {
    flex-direction: row !important;
  }

  .app-content{
    padding: 0 20px;
    flex: 1;
    position: relative;
  }
}

.mobile-msg{
  text-align: center;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: #141625;
  color: #fff;

  p{
    margin-top: 16px;
  }
}

// animated invoice
.invoice-enter-active,
.invoice-leave-active {
  transition: 0.8s ease all
}

.invoice-enter-from,
.invoice-leave-to {
  transform: translateX(-700px);
}

button,
.button {
  cursor: pointer;
  padding: 16px 24px;
  border-radius: 30px;
  border: none;
  font-size: 12px;
  margin-right: 8px;
  color: #fff;
}

.dark-purple {
  background-color: #252945;
}

.red {
  background-color: #ec5757;
}

.purple {
  background-color: #7c5dfa;
}

.green {
  background-color: #33d69f;
}

.orange {
  background-color: #ff8f00;
}

.blue {
  background-color: #3276FF;
}

// utility classes

.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.container {
  width: 100%;
  padding: 40px 10px;
  max-width: 850px;
  margin: 0 auto;

  @media (min-width: 900px) {
    padding-top: 72px;
  }
}

.nav-link {
  text-decoration: none;
  color: initial;
}

// Status Button Styling

.status-button {
  &::before {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 8px;
  }
  font-size: 12px;
  margin-right: 30px;
  align-items: center;
  padding: 8px 30px;
  border-radius: 10px;
}

.paid {
  &::before {
    background-color: #33d69f;
  }
  color: #33d69f;
  background-color: rgba(51, 214, 160, 0.1);
}

.pending {
  &::before {
    // background-color: #ff8f00;
    background-color: #3276FF;
  }
  color: #3276FF;
  background-color: rgba(50, 118, 255, 0.1);
}

.draft {
  &::before {
    background-color: #dfe3fa;
  }
  color: #dfe3fa;
  background-color: rgba(223, 227, 250, 0.1);
}
</style>
