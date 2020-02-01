let delay = 1 //default is 5 seconds

const onMessage = message => {
  chrome.alarms.create("second", {when: Date.now() + 1000})
}

const decrementTime = () => {
  const s = parseInt(localStorage.getItem('seconds'),10)
  const m = parseInt(localStorage.getItem('minutes'),10)
  const h = parseInt(localStorage.getItem('hours'),10)

  localStorage.setItem('seconds',s <= 0 ? 0 : s - 1)

  if(m > 0){
    localStorage.setItem('seconds', 59)
    localStorage.setItem('minutes', m-1)
    return;
  }

  if(h > 0){
    localStorage.setItem('seconds', 59)
    localStorage.setItem('minutes', 59)
    localStorage.setItem('hours', h- 1)

    return;
  }
}

const getTimeLeftMs = () => {
  const s = parseInt(localStorage.getItem('seconds'),10)
  const m = parseInt(localStorage.getItem('minutes'),10)
  const h = parseInt(localStorage.getItem('hours'),10)
  return (s + (m* 60) + (h* 60)) * 1000
}

const onAlarm = alarm => {
  console.log(alarm)
  chrome.alarms.clear("second")
  decrementTime()
  const timeLeft = getTimeLeftMs()
  console.log(timeLeft)
  if (timeLeft === 0){
      console.log("DONE!")
      chrome.runtime.sendMessage({done: true})
      localStorage.setItem('cancel', false)
      // chrome.tabs.create({url: 'index.html'});
      return;
  }
  chrome.runtime.sendMessage({updateTime: true})
  chrome.alarms.create("second", {when: Date.now() + 1000})
}

chrome.runtime.onMessage.addListener(onMessage)
chrome.alarms.onAlarm.addListener(onAlarm)