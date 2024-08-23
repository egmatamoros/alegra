<template>
  <div class="error-view">
    <div class="error-card">
      <div class="error-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h1>¡Ups! Algo salió mal</h1>
      <p>Ha ocurrido un error inesperado en la plataforma.</p>
      <div class="action-buttons">
        <button @click="goHome" class="secondary-button">Ir al inicio</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ErrorView",
  methods: {
    goHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.error-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.error-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  padding: 40px;
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.error-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  color: #e74c3c;
}

h1 {
  color: #2c3e50;
  font-size: 24px;
  margin-bottom: 16px;
}

p {
  color: #34495e;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 24px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-button {
  background-color: #3498db;
  color: white;
}

.primary-button:hover {
  background-color: #2980b9;
}

.secondary-button {
  background-color: #ecf0f1;
  color: #34495e;
}

.secondary-button:hover {
  background-color: #bdc3c7;
}

.error-details {
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 16px;
  margin-top: 24px;
  text-align: left;
}

.error-details h2 {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 12px;
}

.error-details pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 14px;
  color: #34495e;
}

.toggle-details {
  background: none;
  border: none;
  color: #3498db;
  font-size: 14px;
  margin-top: 16px;
  cursor: pointer;
}

.toggle-details:hover {
  text-decoration: underline;
}
</style>
