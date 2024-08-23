<template>
  <div class="invoice-details">
    <h1>Detalles de la Factura</h1>
    <div class="card">
      <div class="header">
        <div class="invoice-number">
          Factura #{{ invoice?.numberTemplate?.fullNumber }}
        </div>
        <div class="status" :class="invoice?.status">
          {{ getStatusText(invoice?.status) }}
        </div>
      </div>
      <div class="content">
        <div class="section">
          <h2>Información General</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Fecha:</span>
              <span>{{ formatDate(invoice?.date) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Fecha de vencimiento:</span>
              <span>{{ formatDate(invoice?.dueDate) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Término:</span>
              <span>{{ invoice?.term }}</span>
            </div>
            <div class="info-item">
              <span class="label">Estado:</span>
              <span>{{ getStatusText(invoice?.status) }}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Cliente</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Nombre:</span>
              <span>{{ invoice?.client?.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">Identificación:</span>
              <span>{{ invoice?.client?.identification }}</span>
            </div>
            <div class="info-item">
              <span class="label">Dirección:</span>
              <span>{{ formatAddress(invoice?.client?.address) }}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Vendedor</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Nombre:</span>
              <span>{{ invoice?.seller?.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">ID:</span>
              <span>{{ invoice?.seller?.id }}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Artículos</h2>
          <table class="items-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in invoice?.items" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ formatCurrency(item.price) }}</td>
                <td>{{ formatCurrency(item.total) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section totals">
          <div class="info-item">
            <span class="label">Subtotal:</span>
            <span>{{ formatCurrency(invoice?.subtotal) }}</span>
          </div>
          <div class="info-item">
            <span class="label">Descuento:</span>
            <span>{{ formatCurrency(invoice?.discount) }}</span>
          </div>
          <div class="info-item">
            <span class="label">Impuesto:</span>
            <span>{{ formatCurrency(invoice?.tax) }}</span>
          </div>
          <div class="info-item total">
            <span class="label">Total:</span>
            <span>{{ formatCurrency(invoice?.total) }}</span>
          </div>
        </div>
      </div>
    </div>
    <button @click="goHome" class="reset-button">Volver al Inicio</button>
  </div>
</template>

<script>
import { useSellerStore } from "@/stores/sellerStore";
import { mapState } from "pinia";

export default {
  name: "InvoiceDetails",
  computed: {
    ...mapState(useSellerStore, {
      invoice: "invoice",
    }),
  },
  methods: {
    goHome() {
      this.$router.push("/");
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    },
    formatAddress(address) {
      return `${address?.street} ${address?.exteriorNumber}, ${address?.colony}, ${address?.municipality}, ${address?.state}, ${address?.zipCode}`;
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(amount);
    },
    getStatusText(status) {
      const statusMap = {
        draft: "Borrador",
        open: "Abierta",
        paid: "Pagada",
        overdue: "Vencida",
      };
      return statusMap[status] || status;
    },
  },
};
</script>

<style scoped>
.reset-button {
  margin-top: 20px;
  border-radius: 25px;
}
.invoice-details {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
}

.card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.header {
  background-color: #f8f9fa;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.invoice-number {
  font-size: 1.5em;
  font-weight: bold;
  color: #2c3e50;
}

.status {
  padding: 5px 10px;
  border-radius: 20px;
  font-weight: bold;
  text-transform: uppercase;
}

.status.draft {
  background-color: #ffeeba;
  color: #856404;
}
.status.open {
  background-color: #b8daff;
  color: #004085;
}
.status.paid {
  background-color: #c3e6cb;
  color: #155724;
}
.status.overdue {
  background-color: #f8d7da;
  color: #721c24;
}

.content {
  padding: 20px;
}

.section {
  margin-bottom: 30px;
}

h2 {
  color: #2c3e50;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-weight: bold;
  color: #6c757d;
  margin-bottom: 5px;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
}

.items-table th,
.items-table td {
  border: 1px solid #dee2e6;
  padding: 10px;
  text-align: left;
}

.items-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.totals {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.totals .info-item {
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
}

.totals .total {
  font-size: 1.2em;
  font-weight: bold;
  color: #2c3e50;
}
</style>
