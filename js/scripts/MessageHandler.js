window.RQ = window.RQ || {};

RQ.MessageHandler = {
  eventCallbackMap: {},

  configs: {
    isLoggingEnabled: false
  },

  constants: {
    CONTENT_SCRIPT: 'content_script',
    PAGE_SCRIPT: 'page_script',
    /*DOMAIN: 'http://www.requestly.in',*/
    DOMAIN: 'http://localhost:7070',
    SOURCE_FIELD: 'source',
    ACTION_USER_LOGGED_IN: 'user:loggedIn'
  },

  addMessageListener: function() {
    window.addEventListener('message', this.handleMessageReceived.bind(this));
  },

  registerCallback: function(action, callback) {
    this.eventCallbackMap[action] = callback;
  },

  sendMessage: function(message, callback) {
    if (!message.action) {
      this.isLoggingEnabled && console.error('Invalid message. Must contain some action');
      return;
    }

    this.eventCallbackMap[message.action] = callback;

    message[this.constants.SOURCE_FIELD] = this.constants.PAGE_SCRIPT;
    window.postMessage(message, this.constants.DOMAIN);
  },

  handleMessageReceived: function(event) {
    var that = this;

    if (event && event.data && event.data.source === this.constants.CONTENT_SCRIPT) {
      this.isLoggingEnabled && console.log('Received message: ', event.data);

      if (event.data.action === 'authenticate') {
        RQ.DataStore.loginWithGoogle().then(function(result) {
          var userProfile = Object.assign({}, result.user.providerData[0]);

          // Update uid inside providerData to user's uid
          userProfile.uid = result.user.uid;

          that.sendMessage({ action: event.data.action, response: userProfile });
        }).catch(function(error) {
          console.error('Error signing in', error);
        });
      }

      if (event.data.action === 'check:userAuthenticated') {
        that.sendMessage({ action: event.data.action, response: RQ.DataStore.isUserAuthenticated() })
      }

      if (event.data.action === 'getValue') {
        RQ.DataStore.getValue(event.data.pathArray, function(value) {
          that.sendMessage({ action: event.data.action, response: value })
        });
      }
    }
  },

  init: function() {
    this.addMessageListener();
  }
};

RQ.MessageHandler.init();