<template>
  <div class="invoice-view container" v-if="currentInvoice">
    <router-link class="nav-link flex" :to="{ name: 'Home'}">
      <img src="@/assets/icon-arrow-left.svg" alt=""> Go Back
    </router-link>
    <!-- Header -->
    <div class="header flex">
      <div class="left flex">
        <span>Status</span>
        <div
          class="status-button flex"
          :class="{paid: currentInvoice.invoicePaid, draft: currentInvoice.invoiceDraft, pending: currentInvoice.invoicePending}"
        >
          <span v-if="currentInvoice.invoicePaid">Paid</span>
          <span v-if="currentInvoice.invoiceDraft">Draft</span>
          <span v-if="currentInvoice.invoicePending">Pending</span>
        </div>
      </div>
      <div class="right flex">
        <button @click="toggleEditInvoice" class="blue">Edit</button>
        <button @click="deleteInvoice(currentInvoice.docId)" class="red">Delete</button>
        <button
          class="green"
          v-if="currentInvoice.invoicePending"
          @click="updateStatusToPaid(currentInvoice.docId)"
        >
          Mark as Paid
        </button>
        <button
          class="orange"
          v-if="currentInvoice.invoiceDraft || currentInvoice.invoicePaid"
          @click="updateStatusToPending(currentInvoice.docId)"
        >
          Mark as Pending
        </button>
      </div>
    </div>

    <!-- Invoice Details -->
    <div class="invoice-details flex flex-column">
      <div class="top flex">
        <div class="left flex">
          <p><span>#</span>{{currentInvoice.invoiceId}}</p>&nbsp;
          <p>{{currentInvoice.productDescription}}</p>
        </div>
        <div class="right flex flex-column">
          <p>{{currentInvoice.billerStreetAddress}}</p>
          <p>{{currentInvoice.billerCity}}</p>
          <p>{{currentInvoice.billerZipCode}}</p>
          <p>{{currentInvoice.billerCountry}}</p>
        </div>
      </div>
      <div class="middle flex">
        <div class="payment flex flex-column">
          <h4>Invoice Date</h4>
          <p>{{currentInvoice.invoiceDate}}</p>
          <h4>Payment Date</h4>
          <p>{{currentInvoice.paymentDueDate}}</p>
        </div>
        <div class="bill flex flex-column">
          <h4>Bill To</h4>
          <p>{{currentInvoice.clientName}}</p>
          <p>{{currentInvoice.clientStreetAddress}}</p>
          <p>{{currentInvoice.clientCity}}</p>
          <p>{{currentInvoice.clientZipCode}}</p>
          <p>{{currentInvoice.clientCountry}}</p>
        </div>
        <div class="send-to flex flex-column">
          <h4>Send To</h4>
          <p>{{currentInvoice.clientEmail}}</p>
        </div>
      </div>
      <div class="bottom flex flex-column">
        <div class="billing-items">
          <div class="heading flex">
            <p>Item Name</p>
            <p>QTY</p>
            <p>Price</p>
            <p>Total</p>
          </div>
          <div class="item flex" v-for="item in currentInvoice.invoiceItemList" :key="item.id">
            <p>{{item.itemName}}</p>
            <p>{{item.qty}}</p>
            <p>{{item.price}}</p>
            <p>{{item.total}}</p>
          </div>
        </div>
        <div class="total flex">
          <p>Amount Due</p>
          <p>{{currentInvoice.invoiceTotal}}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
export default {
  name: 'InvoiceView',
  data () {
    return {
      // currInvoice: null
    }
  },
  methods: {
    ...mapMutations(['SET_CURRENT_INVOICE', 'TOGGLE_EDIT_INVOICE', 'TOGGLE_INVOICE']),
    ...mapActions(['DELETE_INVOICE', 'UPDATE_STATUS_TO_PAID', 'UPDATE_STATUS_TO_PENDING']),
    getCurrentInvoice () {
      this.SET_CURRENT_INVOICE(this.$route.params.invoiceId)
      // this.currInvoice = this.currentInvoice
    },
    toggleEditInvoice () {
      this.TOGGLE_EDIT_INVOICE()
      this.TOGGLE_INVOICE()
    },
    async deleteInvoice (docId) {
      await this.DELETE_INVOICE(docId)
      this.$router.push({ name: 'Home' })
    },
    updateStatusToPaid (docId) {
      this.UPDATE_STATUS_TO_PAID(docId)
    },
    updateStatusToPending (docId) {
      this.UPDATE_STATUS_TO_PENDING(docId)
    }
  },
  computed: {
    ...mapState(['currentInvoice', 'editInvoice'])
  },
  created () {
    this.getCurrentInvoice()
  }
  // watch: {
  //   editInvoice () {
  //     if (!this.editInvoice) {
  //       // update currInvoice
  //     }
  //   }
  // }
}
</script>

<style lang="scss" scoped>
.invoice-view {
  .nav-link {
    margin-bottom: 32px;
    align-items: center;
    color: red;
    font-size: 12px;
    font-weight: 700;

    img {
      margin-right: 16px;
      width: 7px;
      height: 10px;
    }
  }

  .header,
  .invoice-details {
    background-color: #a1a1a1;
    border-radius: 20px;
  }

  .header {
    align-items: center;
    padding: 24px 32px;
    font-size: 12px;

    .left {
      align-items: center;

      span {
        color: #000;
        margin-right: 16px;
      }
    }

    .right {
      flex: 1;
      justify-content: flex-end;

      button {
        color: #fff;
      }
    }
  }

  .invoice-details {
    padding: 48px;
    margin-top: 24px;

    .top {
      div {
        color: #dfe3fa;
        flex: 1;
      }

      .left {
        font-size: 12px;

        p:first-child {
          font-size: 24px;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 8px;
        }

        p:nth-child(2) {
          font-size: 18px;
          display: block;
        }

        span {
          color: #e1e1e1;
        }
      }

      .right {
        font-size: 12px;
        align-items: flex-end;
      }
    }

    .middle {
      margin-top: 50px;
      color: #f1f1f1;
      gap: 16px;

      h4 {
        font-size: 12px;
        font-weight: 400;
        margin-bottom: 12px;
      }

      p {
        font-size: 16px;
      }

      .bill,
      .payment {
        flex: 1;
      }

      .payment {
        h4:nth-child(3) {
          margin-top: 32px;
        }

        p {
          font-weight: 600;
        }
      }

      .bill {
        p:nth-child(2) {
          font-size: 16px;
        }

        p:nth-child(3) {
          margin-top: auto;
        }

        p {
          font-size: 12px;
        }
      }

      .send-to {
        flex: 2;
      }
    }

    .bottom {
      margin-top: 50px;

      .billing-items {
        padding: 32px;
        border-radius: 20px 20px 0 0;
        background-color: #e1e1e1;

        .heading {
          color: #555;
          font-size: 12px;
          margin-bottom: 32px;
          font-weight: 700;

          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }

        .item {
          margin-bottom: 32px;
          font-size: 14px;
          color: #555;

          &:last-child {
            margin-bottom: 0;
          }

          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }
      }

      .total {
        color: #444;
        padding: 32px;
        background-color: rgba(225, 225, 225, 0.6);
        align-items: center;
        border-radius: 0 0 20px 20px;

        p {
          flex: 1;
          font-size: 12px;
        }

        p:nth-child(2) {
          font-size: 28px;
          text-align: right;
        }
      }
    }
  }
}
</style>
