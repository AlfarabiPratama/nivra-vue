import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useFinanceStore = defineStore(
  "finance",
  () => {
    // State
    const transactions = ref([
      {
        id: 1,
        title: "Gaji Bulanan",
        amount: 5000000,
        type: "income",
        category: "Pekerjaan",
        date: "2023-10-25",
      },
      {
        id: 2,
        title: "Belanja Mingguan",
        amount: 350000,
        type: "expense",
        category: "Makanan",
        date: "2023-10-26",
      },
      {
        id: 3,
        title: "Tiket Bioskop",
        amount: 75000,
        type: "expense",
        category: "Hiburan",
        date: "2023-10-27",
      },
    ]);

    // Getters
    const totalIncome = computed(() =>
      transactions.value
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0)
    );

    const totalExpense = computed(() =>
      transactions.value
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0)
    );

    const balance = computed(() => totalIncome.value - totalExpense.value);

    const recentTransactions = computed(() => {
      return [...transactions.value]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    });

    const thisWeekExpenses = computed(() => {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      return transactions.value
        .filter((t) => t.type === "expense" && new Date(t.date) >= weekAgo)
        .reduce((sum, t) => sum + t.amount, 0);
    });

    const lastWeekExpenses = computed(() => {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      return transactions.value
        .filter(
          (t) =>
            t.type === "expense" &&
            new Date(t.date) >= twoWeeksAgo &&
            new Date(t.date) < weekAgo
        )
        .reduce((sum, t) => sum + t.amount, 0);
    });

    const weekOverWeekChange = computed(() => {
      if (lastWeekExpenses.value === 0) return 0;
      return (
        ((thisWeekExpenses.value - lastWeekExpenses.value) /
          lastWeekExpenses.value) *
        100
      );
    });

    // Actions
    function addTransaction(transaction) {
      transactions.value.push({
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        ...transaction,
      });
    }

    function deleteTransaction(id) {
      transactions.value = transactions.value.filter((t) => t.id !== id);
    }

    return {
      transactions,
      totalIncome,
      totalExpense,
      balance,
      recentTransactions,
      thisWeekExpenses,
      lastWeekExpenses,
      weekOverWeekChange,
      addTransaction,
      deleteTransaction,
    };
  },
  {
    persist: true,
  }
);
