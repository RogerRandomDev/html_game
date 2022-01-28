let past_load=false;
function load_objects(){for(const [key,object] of Object.entries(object_list)){
    let olor=null
    switch(object.type){    
        case("Node"):new Node("Node");break;
        case("Node2D"):olor=object.color;new Node2D(anti_pos(object.position),anti_pos(object.Size),object.Name,new color(olor.r,olor.g,olor.b,olor.a),null);break;
        case("Text2D"):olor=object.color;new Text2D(anti_pos(object.position),anti_pos(object.Size),object.Name,new color(olor.r,olor.g,olor.b,olor.a),object.text);break;
        case("Physics2D"):olor=object.color;new Physics2D(anti_pos(object.position),anti_pos(object.Size),object.Name,new color(olor.r,olor.g,olor.b,olor.a),object.text);break;
        case("Player2D"):olor=object.color;new Player2D(anti_pos(object.position),anti_pos(object.Size),object.Name,new color(olor.r,olor.g,olor.b,olor.a),object.text);break;
}};past_load=true}

function create_object(type){
    switch(type){
        case("Node"):new Node("Node");break;
        case("Node2D"):new Node2D(m_pos(),Vector(16,16),"Node2D",make_color(),null);break;
        case('Text2D'):new Text2D(m_pos(),Vector(16,16),"Text2D",new Color(255,255,255,0),prompt("Text to show:"));break;
        case("Physics2D"):new Physics2D(m_pos(),Vector(16,16),"Physics2D",make_color(),null);break;
        case("Player2D"):new Player2D(m_pos(),Vector(16,16),"Player2D",make_color(),null);break;
}}
function m_pos(){
    let out = Vector(cur_mouse_position.x*screen_size.x/1024.0,cur_mouse_position.y*screen_size.y/600.0)
    return out
}
function random_color(){return new Color(Math.round(Math.random()*225+20),Math.round(Math.random()*225+20),Math.round(Math.random()*225+20),255);};
function make_color(){
    let colo = prompt("color values:");
    let Color = null
    let co=null
    if(colo!=null){co = colo.split(",")}else{colo=""}
    if(colo==""){Color = random_color()}else{Color = new color(co[0],co[1],co[2],255)}
    return Color
}
function get_objects(){
    let output = {}
    for(const [key,object] of Object.entries(scene_objects)){
        output[object.name]=object.get_data()
    }
    console.log(JSON.stringify(output))
}
function load_first(val){return Vector(val.x*screen_size.x/1024.0,val.y*screen_size.y/600.0)}