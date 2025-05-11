const {createApp, ref} = Vue

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
        greetingRatio: 20,
        priceRatio: 60,
        youtubeMembershipGiftPrice: 490,
        greetingPattern: 'おはよ,good morning',
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

    async save(e) {
      e.preventDefault();

      const res = await fetch(
        `http://127.0.0.1:11180/api/plugins/${uid}?action=set_config`,
        {
          method: 'POST',
          body: JSON.stringify(this.config)
        });

      if (res.ok) {
        this.setState((await res.json()).response, true);
        this.$toast.open({
          message: '保存しました',
          position: 'bottom'
        });
      } else {
        this.$toast.open({
          type: 'error',
          message: '保存に失敗しました',
          position: 'bottom'
        });
      }
    },

    async addCount(e, count) {
      e.preventDefault();

      const res = await fetch(
        `http://127.0.0.1:11180/api/plugins/${uid}?action=add_count`,
        {
          method: 'POST',
          body: JSON.stringify({
            count: count
          })
        });

      if (res.ok) {
        this.setState((await res.json()).response, false);
      }
    },

    async start(e) {
      e.preventDefault();

      const res = await fetch(
        `http://127.0.0.1:11180/api/plugins/${uid}?action=start`,
        {method: 'POST'});

      if (res.ok) {
        this.setState((await res.json()).response, false);
      }
    },

    async pause(e) {
      e.preventDefault();

      const res = await fetch(
        `http://127.0.0.1:11180/api/plugins/${uid}?action=pause`,
        {method: 'POST'});

      if (res.ok) {
        this.setState((await res.json()).response, false);
      }
    },

    async resetCount(e) {
      e.preventDefault();

      if (!confirm('タイマーをリセットします。\nよろしいですか？')) {
        return;
      }

      const res = await fetch(
        `http://127.0.0.1:11180/api/plugins/${uid}?action=reset_count`,
        {method: 'POST'});

      if (res.ok) {
        this.setState((await res.json()).response, false);
      }
    },

    async resetAll(e) {
      e.preventDefault();

      if (!confirm('タイマーと挨拶した人の記録をリセットします。\nよろしいですか？')) {
        return;
      }

      const res = await fetch(
        `http://127.0.0.1:11180/api/plugins/${uid}?action=reset_all`,
        {method: 'POST'});

      if (res.ok) {
        this.setState((await res.json()).response, false);
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

    const loadState = async withConfig => {
      try {
        const res = await fetch(
          `http://127.0.0.1:11180/api/plugins/${uid}?type=state`,
          {
            method: 'GET',
          });

        if (res.ok) {
          this.setState((await res.json()).response, withConfig);
          return true;
        } else {
          return false;
        }
      } catch {
        return false;
      } finally {
        setTimeout(async () => await loadState(false), 1000);
      }
    };

    if (await loadState(true)) {
      this.loaded = true;
      refreshCount();
    } else {
      this.$toast.open({
        type: 'error',
        message: '読み込みに失敗しました',
        position: 'bottom'
      });
    }
  },
});

app.use(VueToast.ToastPlugin);
app.mount('#app');
