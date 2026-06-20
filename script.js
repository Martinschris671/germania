const { createApp } = Vue;

// Default template for easy resetting
const defaultMatches = [
  {
    id: 1,
    time: "danas 13:45",
    teams: "Sesvete - Bijelo Brdo",
    betType: "Osnovna ponuda: 1",
    category: "Nogomet / Hrvatska 2",
    odds: 1.4,
    status: 1,
  },
  {
    id: 2,
    time: "danas 19:00",
    teams: "NK Karlovac - NK Jarun",
    betType: "Osnovna ponuda: 1",
    category: "Nogomet / Hrvatska 2",
    odds: 2.05,
    status: 1,
  },
];

createApp({
  data() {
    // 1. Check local storage for saved theme preference
    const savedTheme = localStorage.getItem("isLightMode");
    const initialLightMode =
      savedTheme !== null ? JSON.parse(savedTheme) : false;

    return {
      matches: JSON.parse(JSON.stringify(defaultMatches)),
      uplata: 2000.0,
      manualMt: null,
      manualTax: null,
      infoOpen: false,
      showAdminModal: false,
      isLightMode: initialLightMode,
    };
  },
  watch: {
    // Automatically toggles the CSS class and saves to localStorage
    isLightMode: {
      handler(newVal) {
        localStorage.setItem("isLightMode", JSON.stringify(newVal));

        if (newVal) {
          document.body.classList.add("light-mode");
        } else {
          document.body.classList.remove("light-mode");
        }
      },
      immediate: true,
    },
  },
  computed: {
    tecajValue() {
      if (this.matches.length === 0) return 0;
      return this.matches.reduce((acc, m) => acc * m.odds, 1);
    },
    tecajFormatted() {
      return this.tecajValue.toFixed(2);
    },
    mtValue() {
      if (this.manualMt !== null) return this.manualMt;
      return this.uplata * 0.05;
    },
    ulogValue() {
      return this.uplata - this.mtValue;
    },
    dobitakValue() {
      return this.ulogValue * this.tecajValue;
    },
    taxValue() {
      if (this.manualTax !== null) return this.manualTax;
      let profit = this.dobitakValue - this.uplata;
      return profit > 0 ? profit * 0.1 : 0;
    },
    isplataValue() {
      return this.dobitakValue - this.taxValue;
    },
  },
  methods: {
    toggleStatus(match) {
      match.status = (match.status + 1) % 3;
    },
    addMatch() {
      this.matches.push({
        id: Date.now(),
        time: "danas 20:45",
        teams: "Novi Par - Tim B",
        betType: "Osnovna ponuda: 1",
        category: "Nogomet",
        odds: 1.5,
        status: 1,
      });
    },
    removeMatch(index) {
      this.matches.splice(index, 1);
    },
    removeAll() {
      this.matches = [];
    },
    resetToDefault() {
      this.matches = JSON.parse(JSON.stringify(defaultMatches));
      this.uplata = 2000.0;
      this.manualMt = null;
      this.manualTax = null;
    },
    updateOdds(match, event) {
      let val = parseFloat(
        event.target.innerText.replace(",", ".").replace(/ /g, ""),
      );
      if (!isNaN(val)) match.odds = val;
      event.target.innerText = match.odds.toFixed(2);
    },
    updateVal(prop, event) {
      let val = parseFloat(
        event.target.innerText
          .replace(",", ".")
          .replace(/ /g, "")
          .replace(/€/g, ""),
      );
      if (!isNaN(val)) {
        this[prop] = val;
      } else if (prop === "manualMt" || prop === "manualTax") {
        this[prop] = null;
      }
      event.target.innerText = this.formatCurrency(
        this[
          prop === "manualMt"
            ? "mtValue"
            : prop === "manualTax"
              ? "taxValue"
              : prop
        ],
      );
    },
    formatCurrency(num) {
      let val = Number(num).toFixed(2);
      let parts = val.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      return parts.join(",") + " €";
    },
  },
}).mount("#app");
