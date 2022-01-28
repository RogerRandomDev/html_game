let keys_pressed = []
let ignore_keys='qetf=-[]`'
document.addEventListener('keydown',function(ev){if(!keys_pressed.includes(ev.key)&&!ignore_keys.includes(ev.key)){keys_pressed.push(ev.key)}})
document.addEventListener('keyup',function(ev){if(keys_pressed.includes(ev.key)){keys_pressed.splice(keys_pressed.indexOf(ev.key,1))}})

function stop_pressed(key_code){if(keys_pressed.includes(key_code)){keys_pressed.splice(keys_pressed.indexOf(key_code,1))}}