let in_editor=true;
let object_list = {}
let scene_objects={}
let collision_objects=[]
let update_object = []
let cur_mouse_position = Vector(0,0)
let Gravity = 512;
let delta_time = 25;
let screen_size = Vector(window.innerWidth,window.innerHeight)
console.log(screen_size)
let do_update=true;

function scene_loaded_scene(){
    document.addEventListener('mousemove',function(ev){
        cur_mouse_position=Vector(ev.pageX,ev.pageY)
        if(selected_object!=null){selected_object.move_to_global(cur_mouse_position.sub(mouse_offset))}})
    window.setInterval(update_objects, delta_time);
    delta_time = delta_time/1000
}

function update_objects(){if(!do_update){return};for(const object of update_object){object.update()}}