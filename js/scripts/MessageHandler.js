window.RQ = window.RQ || {};

RQ.MessageHandler = {
  configs: {
    isLoggingEnabled: true
  },

  constants: {
    CONTENT_SCRIPT: 'content_script',
    PAGE_SCRIPT: 'page_script',
    /*DOMAIN: 'http://www.requestly.in',*/
    DOMAIN: 'http://localhost:7070',
    SOURCE_FIELD: 'source',
    ACTION_USER_LOGGED_IN: 'user:loggedIn'
  },

  sendMessage: function(message) {
    if (!message.action && !message.event) {
      this.isLoggingEnabled && console.error('Invalid message. Must contain some action or event');
      return;
    }

    message[this.constants.SOURCE_FIELD] = this.constants.PAGE_SCRIPT;
    window.postMessage(message, this.constants.DOMAIN);
  },

  handleMessageReceived: function(event) {
    var that = this;

    if (event && event.data && event.data.source === this.constants.CONTENT_SCRIPT) {
      this.isLoggingEnabled && console.log('Received message: ', event.data);

      if (event.data.action === 'login') {
        RQ.DataStore.loginWithGoogle().then(function(result) {
          that.sendMessage({ action: that.constants.ACTION_USER_LOGGED_IN })
        }).catch(function(error) {
          console.error('Error signing in', error);
        });
      }

      if (event.data.action === 'check:userAuthenticated') {
        that.sendMessage({ action: 'check:userAuthenticated', response: RQ.DataStore.isUserAuthenticated() })
      }
    }
  },

  addMessageListener: function() {
    window.addEventListener('message', this.handleMessageReceived.bind(this));
  },

  init: function() {
    this.addMessageListener();
  }
};

RQ.MessageHandler.init();