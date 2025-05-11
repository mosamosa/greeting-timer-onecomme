import {OnePlugin, PluginRequest} from '@onecomme.com/onesdk/types/Plugin'
import {Comment} from "@onecomme.com/onesdk/types/Comment";

const plugin: OnePlugin = {
  name: '挨拶タイマー',
  uid: 'mosamosa.greeting-timer',
  version: '1.0.0',
  author: 'mosamosa',
  url: 'http://127.0.0.1:11180/plugins/mosamosa.greeting-timer/index.html',
  permissions: ['comments'],

  defaultState: {
    minusCount: false,
    greetingRatio: 20,
    priceRatio: 60,
    youtubeMembershipGiftPrice: 490,
    greetingPattern: 'おはよ,good morning',
  },

  paused: true,
  expiresAt: 0,
  remainCount: 0,
  processedIds: {},

  init(api, initialData) {
    this.store = api.store;
    this.expiresAt = this.getTime();
  },

  destroy() {
  },

  getMinusCount() {
    return this.store.get('minusCount') as boolean;
  },

  getGreetingRatio() {
    return this.store.get('greetingRatio') as number;
  },

  getPriceRatio() {
    return this.store.get('priceRatio') as number;
  },

  getYoutubeMembershipGiftPrice() {
    return this.store.get('youtubeMembershipGiftPrice') as number;
  },

  getGreetingPattern() {
    return this.store.get('greetingPattern') as string;
  },

  getGreetingPatternRegExp() {
    const pattern = this.getGreetingPattern()
      .replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&')
      .replaceAll(',', '|');
    return new RegExp(pattern, 'i');
  },

  processComment(comment: Comment) {
    const greetingPattern = this.getGreetingPatternRegExp();
    const youtubeMembershipGiftPattern = new RegExp('(\\d+) 個贈りました')

    if (comment.service == 'youtube') {
      if (greetingPattern.test(comment.data.comment)) {
        this.addCount(this.getGreetingRatio(), comment.data.userId);
      }

      if (comment.data.price && comment.data.price > 0) {
        if (comment.data.unit == '¥') {
          this.addCount(comment.data.price / 100.0 * this.getPriceRatio(), comment.data.id);
        }
      } else if (comment.data.giftType == 'sponsorgift') {
        const m = youtubeMembershipGiftPattern.exec(comment.data.comment);
        const n = m ? parseInt(m[1]) : 1;
        this.addCount(this.getYoutubeMembershipGiftPrice() / 100.0 * this.getPriceRatio() * n, comment.data.id);
      }
    } else if (comment.service == 'twitch') {
      if (greetingPattern.test(comment.data.comment)) {
        this.addCount(this.getGreetingRatio(), comment.data.userId);
      }
    }
  },

  subscribe(type, ...args) {
    switch (type) {
      case 'comments':
        const data: Comment[] = args[0]['comments'];
        data.forEach(item => {
          this.processComment(item);
        })
        break;
    }
  },

  getTime() {
    return new Date().getTime() / 1000.0;
  },

  getRemainCount() {
    const minusCount = this.store.get('minusCount') as boolean;
    const count = this.expiresAt - this.getTime();
    return minusCount ? count : Math.max(0, count);
  },

  addCount(count: number, id: string) {
    if (id) {
      if (id in this.processedIds) {
        return;
      }
      this.processedIds[id] = true;
    }

    this.expiresAt = this.getTime() + this.getRemainCount() + count;
    this.remainCount += count;
  },

  resetCount() {
    this.remainCount = 0;
    this.expiresAt = this.getTime();
  },

  resetAll() {
    this.resetCount();
    this.processedIds = {};
    this.processedChats = {};
  },

  createStateResponse() {
    return {
      paused: this.paused,
      expiresAt: this.expiresAt,
      remainCount: this.remainCount,
      config: {
        minusCount: this.getMinusCount(),
        greetingRatio: this.getGreetingRatio(),
        priceRatio: this.getPriceRatio(),
        youtubeMembershipGiftPrice: this.getYoutubeMembershipGiftPrice(),
        greetingPattern: this.getGreetingPattern(),
      }
    };
  },

  async request(req: PluginRequest) {
    switch (req.method) {
      case 'GET':
        switch (req.params['type']) {
          case 'state': {
            return {
              code: 200,
              response: this.createStateResponse(),
            }
          }
        }
        break;

      case 'POST':
        switch (req.params['action']) {
          case 'add_count': {
            const data = JSON.parse(req.body);
            this.addCount(data['count'], null);
            return {
              code: 200,
              response: this.createStateResponse(),
            }
          }

          case 'reset_count': {
            this.resetCount();
            return {
              code: 200,
              response: this.createStateResponse(),
            }
          }

          case 'reset_all': {
            this.resetAll();
            return {
              code: 200,
              response: this.createStateResponse(),
            }
          }

          case 'set_config': {
            this.store.store = JSON.parse(req.body);
            return {
              code: 200,
              response: this.createStateResponse(),
            }
          }

          case 'start': {
            if (this.paused) {
              this.expiresAt = this.getTime() + this.remainCount;
              this.paused = false;
            }
            return {
              code: 200,
              response: this.createStateResponse(),
            }
          }

          case 'pause': {
            if (!this.paused) {
              this.remainCount = this.getRemainCount();
              this.paused = true;
            }
            return {
              code: 200,
              response: this.createStateResponse(),
            }
          }
        }
        break;
    }

    return {
      code: 404,
      response: {}
    }
  }
}

module.exports = plugin
