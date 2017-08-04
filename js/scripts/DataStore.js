window.RQ = window.RQ || {};

(function(RQ) {
  RQ.DataStore = {
    db: firebase.database(),

    /**
     *
     * @returns Promise Object which can be chained with then and catch to handle success and error respectively
     */
    loginWithGoogle: function() {
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');

      return firebase.auth().signInWithPopup(provider);
    },

    checkAuthenticationOnPageLoad: function(callback) {
      var currentUser = firebase.auth().currentUser,
        that = this;

      if (currentUser !== null) {
        callback.call(null, this.getAuthData(currentUser))
      } else {
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            callback.call(null, that.getAuthData(user))
          } else {
            callback.call(null, null);
          }
        });
      }
    },

    getAuthData: function(user) {
      var userProfile = Object.assign({}, user.providerData[0]);

      // Update uid inside providerData to user's uid
      userProfile.uid = user.uid;

      return userProfile;
    },

    isUserAuthenticated: function() {
      return firebase.auth().currentUser !== null ? this.getAuthData(firebase.auth().currentUser) : null;
    },

    getNodeRef: function(pathArray) {
      return this.db.ref(pathArray.join('/'))
    },

    getValue: function(pathArray, callback) {
      var nodeRef = this.getNodeRef(pathArray);

      nodeRef.once('value', function(snapshot) {
        callback.call(null, snapshot.val())
      });
    },

    setValue: function(pathArray, value, callback) {
      var nodeRef = this.getNodeRef(pathArray);

      nodeRef.set(value, callback);
    }
  };
}(RQ));

