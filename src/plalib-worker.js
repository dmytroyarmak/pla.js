import * as core from './plalib-core';

self.addEventListener('message', function(e) {
  var [methodName, taskId, ...args] = e.data;
  core[methodName](...args);
  self.postMessage(taskId);
});
