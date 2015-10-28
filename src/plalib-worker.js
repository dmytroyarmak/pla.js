import * as core from './plalib-core';

onmessage = function(e) {
  var [methodName, taskId, ...args] = e.data;
  core[methodName](...args);
  postMessage(taskId);
};
