window.RQ = window.RQ || {};
RQ.Methods = RQ.Methods || {};

RQ.Methods.submitEvent = function(eventObject) {
  ga('send', {
    hitType: 'event',
    eventCategory: eventObject.category,
    eventAction: eventObject.action,
    eventLabel: eventObject.label
  });
};

RQ.Methods.getEventObject = function($el) {
  return {
    category: $el.attr('data-category'),
    action: $el.attr('data-action'),
    label: $el.attr('data-label')
  };
};

RQ.Methods.handleMutationList = function(mutations) {
	mutations.forEach(RQ.Methods.handleMutation);    
};

RQ.Methods.handleMutation = function(mutation) {
  var addedNodes = mutation.addedNodes,
    eventObject;

  for (var nodeIndex = 0; nodeIndex < addedNodes.length; nodeIndex++) {
    eventObject = RQ.Methods.getEventObject($(addedNodes[nodeIndex]));
    RQ.Methods.submitEvent(eventObject);  
  }
};

RQ.Methods.addObserverForEvents = function(targetNode) {
  var observer = new MutationObserver(RQ.Methods.handleMutationList);

  // Notify me when a new child is added
  var observerConfig = {
    attributes: false, 
    childList: true, 
    characterData: false 
  };
  
  observer.observe(targetNode, observerConfig);
  return observer;
};

RQ.mutationObserver = RQ.Methods.addObserverForEvents(document.getElementById('events-observer-placeholder'));
