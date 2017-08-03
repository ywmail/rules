window.RQ = window.RQ || {};

(function(RQ) {
  RQ.DataStore = {
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
    
    isUserAuthenticated: function() {
      return firebase.auth().currentUser !== null;
    },

    getNodeRef: function(pathArray) {
      return firebase.database().ref(pathArray.join('/'))
    },

    getValue: function(pathArray, callback) {
      var nodeRef = this.getNodeRef(pathArray);

      nodeRef.once('value', function(snapshot) {
        callback.call(null, snapshot.val())
      });
    }
  };
}(RQ));
