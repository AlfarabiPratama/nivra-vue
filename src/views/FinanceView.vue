<template>
  <v-container fluid class="pa-4 pa-md-8 h-100 bg-background">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-black text-on-background">Keuangan</h1>
        <p class="text-body-1 text-medium-emphasis">
          Kelola pemasukan dan pengeluaran Anda
        </p>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        rounded="lg"
        elevation="2"
        @click="showAddDialog = true"
      >
        Tambah Transaksi
      </v-btn>
    </div>

    <!-- Summary Cards (Bento Grid) -->
    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-card
          class="ocean-card h-100 pa-4 d-flex flex-column justify-center position-relative overflow-hidden"
        >
          <div class="absolute-bg-icon opacity-10">
            <v-icon size="120" color="primary">mdi-wallet</v-icon>
          </div>
          <div class="text-overline font-weight-bold text-medium-emphasis mb-1">
            Total Saldo
          </div>
          <div class="text-h4 font-weight-black text-primary">
            {{ formatCurrency(financeStore.balance) }}
          </div>
          <div class="text-caption text-medium-emphasis mt-2">
            +12% dari bulan lalu
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card
          class="ocean-card h-100 pa-4 d-flex flex-column justify-center position-relative overflow-hidden"
        >
          <div class="absolute-bg-icon opacity-10">
            <v-icon size="120" color="success">mdi-arrow-up-circle</v-icon>
          </div>
          <div class="text-overline font-weight-bold text-medium-emphasis mb-1">
            Pemasukan
          </div>
          <div class="text-h4 font-weight-black text-success">
            {{ formatCurrency(financeStore.totalIncome) }}
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card
          class="ocean-card h-100 pa-4 d-flex flex-column justify-center position-relative overflow-hidden"
        >
          <div class="absolute-bg-icon opacity-10">
            <v-icon size="120" color="error">mdi-arrow-down-circle</v-icon>
          </div>
          <div class="text-overline font-weight-bold text-medium-emphasis mb-1">
            Pengeluaran
          </div>
          <div class="text-h4 font-weight-black text-error">
            {{ formatCurrency(financeStore.totalExpense) }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Grid -->
    <v-row>
      <!-- Recent Transactions -->
      <v-col cols="12" md="8">
        <v-card class="ocean-card h-100 pa-0" elevation="0">
          <div class="pa-4 border-b d-flex justify-space-between align-center">
            <h3 class="text-h6 font-weight-bold">Transaksi Terbaru</h3>
            <v-btn variant="text" size="small" color="primary"
              >Lihat Semua</v-btn
            >
          </div>

          <v-list class="bg-transparent pa-0">
            <v-list-item
              v-for="transaction in financeStore.recentTransactions"
              :key="transaction.id"
              class="transaction-item py-3 px-4 border-b"
            >
              <template v-slot:prepend>
                <v-avatar
                  :color="
                    transaction.type === 'income'
                      ? 'success-lighten-4'
                      : 'error-lighten-4'
                  "
                  size="48"
                  class="rounded-lg mr-4"
                >
                  <v-icon
                    :color="transaction.type === 'income' ? 'success' : 'error'"
                    size="24"
                  >
                    {{ getCategoryIcon(transaction.category) }}
                  </v-icon>
                </v-avatar>
              </template>

              <v-list-item-title class="font-weight-bold text-body-1 mb-1">
                {{ transaction.title }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-caption">
                {{ transaction.category }} • {{ formatDate(transaction.date) }}
              </v-list-item-subtitle>

              <template v-slot:append>
                <div
                  class="text-body-1 font-weight-black"
                  :class="
                    transaction.type === 'income'
                      ? 'text-success'
                      : 'text-error'
                  "
                >
                  {{ transaction.type === "income" ? "+" : "-" }}
                  {{ formatCurrency(transaction.amount) }}
                </div>
              </template>
            </v-list-item>

            <div
              v-if="financeStore.transactions.length === 0"
              class="pa-8 text-center text-medium-emphasis"
            >
              Belum ada transaksi
            </div>
          </v-list>
        </v-card>
      </v-col>

      <!-- Finance Chart -->
      <v-col cols="12" md="4">
        <v-card class="ocean-card h-100 pa-4" elevation="0">
          <h3 class="text-h6 font-weight-bold mb-4">
            Pengeluaran per Kategori
          </h3>
          <FinanceChart :transactions="financeStore.transactions" />
        </v-card>
      </v-col>
    </v-row>

    <!-- Add Transaction Dialog -->
    <v-dialog v-model="showAddDialog" max-width="500">
      <v-card class="ocean-card pa-4">
        <v-card-title class="text-h5 font-weight-bold mb-4">
          Tambah Transaksi
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newTransaction.title"
            label="Judul"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          ></v-text-field>
          <v-text-field
            v-model.number="newTransaction.amount"
            label="Jumlah (Rp)"
            type="number"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          ></v-text-field>
          <v-select
            v-model="newTransaction.type"
            :items="[
              { title: 'Pemasukan', value: 'income' },
              { title: 'Pengeluaran', value: 'expense' },
            ]"
            label="Tipe"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          ></v-select>
          <v-select
            v-model="newTransaction.category"
            :items="[
              'Makanan',
              'Transportasi',
              'Hiburan',
              'Pekerjaan',
              'Lainnya',
            ]"
            label="Kategori"
            variant="outlined"
            density="comfortable"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showAddDialog = false">Batal</v-btn>
          <v-btn color="primary" variant="flat" @click="handleAddTransaction">
            Simpan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useFinanceStore } from "@/store/financeStore";
import FinanceChart from "@/components/FinanceChart.vue";

const financeStore = useFinanceStore();
const showAddDialog = ref(false);

const newTransaction = ref({
  title: "",
  amount: null,
  type: "expense",
  category: "Lainnya",
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    month: "short",
    day: "numeric",
  });
};

const getCategoryIcon = (category) => {
  const map = {
    Makanan: "mdi-food",
    Transportasi: "mdi-bus",
    Hiburan: "mdi-movie",
    Pekerjaan: "mdi-briefcase",
    Lainnya: "mdi-dots-horizontal",
  };
  return map[category] || "mdi-circle-outline";
};

const handleAddTransaction = () => {
  if (newTransaction.value.title && newTransaction.value.amount) {
    financeStore.addTransaction(newTransaction.value);
    showAddDialog.value = false;
    newTransaction.value = {
      title: "",
      amount: null,
      type: "expense",
      category: "Lainnya",
    };
  }
};
</script>

<style scoped>
.ocean-card {
  background: rgb(var(--v-theme-surface));
  border-radius: 24px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.ocean-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.bg-surface-soft {
  background-color: rgb(var(--v-theme-surface-soft)) !important;
}

.absolute-bg-icon {
  position: absolute;
  right: -20px;
  bottom: -20px;
  z-index: 0;
}

.opacity-10 {
  opacity: 0.1;
}

.transaction-item {
  transition: background-color 0.2s ease;
}
.transaction-item:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.03);
}
</style>
