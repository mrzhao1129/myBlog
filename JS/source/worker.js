console.log('worker');
onmessage = function(e) {
  // e.data[0] =@ 3;//err
  console.log(e.data[0], e.data[1]);
  postMessage([e.data[0] + 1, e.data[1] + 1]);
}
// close();