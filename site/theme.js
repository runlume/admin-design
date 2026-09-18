/*
 * 深浅模式：首屏前把解析结果写到 <html data-theme>，避免先亮后暗。
 * 默认跟随系统；用户点过「亮暗」后记住选择（localStorage）。
 */
;(function () {
  var key = 'runlume-landing-theme'
  var root = document.documentElement
  var saved = null
  try {
    saved = localStorage.getItem(key)
  } catch {
    /* 隐私模式读不到就跟随系统 */
  }
  var system = window.matchMedia('(prefers-color-scheme: dark)')
  var resolve = function () {
    return saved === 'light' || saved === 'dark' ? saved : system.matches ? 'dark' : 'light'
  }
  root.dataset.theme = resolve()

  window.addEventListener('DOMContentLoaded', function () {
    var button = document.querySelector('[data-theme-toggle]')
    if (!button) return
    var sync = function () {
      var dark = root.dataset.theme === 'dark'
      button.setAttribute('aria-pressed', String(dark))
      button.title = dark ? button.dataset.labelLight : button.dataset.labelDark
      button.setAttribute('aria-label', button.title)
    }
    sync()
    button.addEventListener('click', function () {
      saved = root.dataset.theme === 'dark' ? 'light' : 'dark'
      root.dataset.theme = saved
      try {
        localStorage.setItem(key, saved)
      } catch {
        /* 存不下就只对本次会话生效 */
      }
      sync()
    })
    // 用户没手动选过时，跟随系统切换
    system.addEventListener('change', function () {
      if (saved) return
      root.dataset.theme = system.matches ? 'dark' : 'light'
      sync()
    })
  })
})()
