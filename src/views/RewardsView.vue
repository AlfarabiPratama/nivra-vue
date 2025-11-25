<template>
  <div class="view-container">
    <h2>Hadiah & Lencana</h2>

    <div class="rewards-stats responsive-grid">
      <div class="card stat-card">
        <p class="stat-label">Level</p>
        <p class="stat-value">1</p>
      </div>
      <div class="card stat-card">
        <p class="stat-label">Total XP</p>
        <p class="stat-value">0</p>
      </div>
      <div class="card stat-card">
        <p class="stat-label">Lencana</p>
        <p class="stat-value">0</p>
      </div>
    </div>

    <div class="card">
      <h3>Lencana Anda</h3>
      <p>🏆 Raih lencana dengan menyelesaikan tugas dan membangun streak!</p>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  text-align: center;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 8px;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--primary);
  margin: 0;
}

.card h3 {
  margin-top: 0;
  color: var(--primary);
}

@media (max-width: 480px) {
  .stat-value {
    font-size: 1.4rem;
  }
}
</style>
