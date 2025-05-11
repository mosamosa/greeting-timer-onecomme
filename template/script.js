const {createApp} = Vue

const uid = 'mosamosa.greeting-timer'

const app = createApp({
  data() {
    return {
      loaded: false,
      paused: true,
      expiresAt: 0,
      remainCount: 0,
      count: '',
      config: {
        minusCount: false,
      }
    };
  },

  setup() {
    try {
      document.body.removeAttribute('hidden')
    } catch (e) {
      alert(e.message)
    }
    return {};
  },

  methods: {
    setState(state, withConfig) {
      this.paused = state.paused;
      this.remainCount = state.remainCount;
      this.expiresAt = state.expiresAt;
      if (withConfig) {
        this.config = state.config;
      }
    },
  },

  async mounted() {
    const refreshCount = () => {
      const t = this.paused ?
        Math.ceil(this.remainCount) :
        Math.ceil(this.expiresAt - new Date().getTime() / 1000.0);
      const t2 = this.config.minusCount ? t : Math.max(0, t);
      const t3 = Math.abs(t2);
      const seconds = t3 % 60;
      const minutes = Math.floor(t3 / 60) % 60;
      const hours = Math.floor(t3 / 3600);
      this.count =
        `${t2 < 0 ? '-' : ''}` +
        `${hours}:` +
        `${minutes.toString().padStart(2, '0')}:` +
        `${seconds.toString().padStart(2, '0')}`;

      setTimeout(refreshCount, 100);
    };

    const loadState = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:11180/api/plugins/${uid}?type=state`,
          {
            method: 'GET',
          });

        if (res.ok) {
          this.setState((await res.json()).response, true);

          if (!this.loaded) {
            this.loaded = true;
            refreshCount();
          }
        }
      } catch {
      } finally {
        setTimeout(loadState, 1000);
      }
    };

    await loadState(true);
  },
});

app.mount('#app');
