importScripts('./plalib.js');

onmessage = function(e) {
  var methodName = e.data[0];
  var taskId = e.data[1];
  var args = e.data.slice(2);
  plalib[methodName].apply(plalib, args);
  postMessage(taskId);
};



