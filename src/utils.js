export const getHostName = function() {
  var myHostname = window.location.hostname

  if (!myHostname) {
    myHostname = 'localhost'
  }

  return myHostname
}
