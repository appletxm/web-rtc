(function(win, doc){
  var url = window.location.href
  var isDebug = url.indexOf('debug=1') >= 0
  var isClear = url.indexOf('clear=1') >= 0
  var debugUrl = 'https://cdn.bootcss.com/eruda/1.4.2/eruda.min.js'
  // var debugUrl = 'http://s.url.cn/qqun/qun/qqweb/m/qun/confession/js/vconsole.min.js'
  // var debugUrl = window.location.origin + '/fytmobile/assets/js-libs/eruda.min.js'
  var script

  function scriptLoad() {
    eruda.init()
    console.warn("****debug mode start****")
  }

  function clearCookie() {
    var exp, cval, cookieNames = ['appDownloadFlag']

    cookieNames.forEach(function(name){
      exp = new Date()
      exp.setTime(exp.getTime() - 1)
      document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString() + ';path=/'
    })
  }

  function clearAllFunction() {
    let clearBtn = document.createElement('button')
    clearBtn.innerHTML = 'clear All'
    clearBtn.setAttribute('style', 'position: fixed; top: 0; left: 0; z-index: 30000; background-color: rgba(0,0,0,0.5); padding: 5px; border-radius: 4px; color: white; font-size: 14px;')
    clearBtn.addEventListener('click', function(event) {
      event.stopPropagation()
      clearCookie()
    })
    document.body.appendChild(clearBtn)
  }
  
  if (isDebug === true) {
    script = document.createElement('script')
    script.setAttribute('charset', 'utf-8')

    script.addEventListener('load', () => {
      scriptLoad()
    })
    document.body.appendChild(script)
    script.setAttribute('src', debugUrl)
  }

  if (isClear === true) {
    clearAllFunction()
  }
})(window, document)
