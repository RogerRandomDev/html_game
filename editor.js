let scale_rate = 1.0
const require_object = ["e",'=','-',']','[',"z"]

document.addEventListener('keydown',function(ev){
    if(selected_object==null&&require_object.includes(ev.key)){return}
    switch(ev.key){
        case("q"):create_object("Node2D");break
        case('t'):create_object("Text2D");break
        case('f'):create_object('Physics2D');break
        case('p'):create_object("Player2D");break
        case('`'):update_toggle();break
        case('9'):scale_rate-=1;scale_rate=Math.max(Math.min(scale_rate,16),1);update_scale();break
        case('0'):scale_rate+=1;scale_rate=Math.max(Math.min(scale_rate,16),1);update_scale();break
        case("e"):if(selected_object.self!=null){selected_object.self.remove();delete scene_objects[selected_object.name]};break
        case("="):selected_object.size.x+=scale_rate;selected_object.update_size();break
        case("-"):selected_object.size.x-=scale_rate;selected_object.update_size();break
        case("]"):selected_object.size.y+=scale_rate;selected_object.update_size();break
        case("["):selected_object.size.y-=scale_rate;selected_object.update_size();break
    }})

function editor_load(){
    document.getElementById("UpdateToggle").addEventListener('mousedown',update_toggle)
    document.getElementById('scaler').addEventListener('change',function(ev){scale_rate=parseInt(this.value);update_scale()})
}
function update_toggle(){
    do_update=!do_update;document.getElementById("UpdateToggle").style.backgroundColor="rgb("+!do_update*255+","+do_update*255+",0)"
}
function update_scale(){
    document.getElementById("scaler").value=scale_rate
}