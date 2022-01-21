let update_objects = []
let collision_objects = []
let keyPressed = [false,false,false,false]
let width = screen.width;
let height = screen.height;
let default_width = 1024;
let default_height = 600;
class Object{
    constructor(pX,pY,name,wi=32,he=32,color=[0,0,0],texture="./"){
        this.pX = pX;
        this.pY = pY;
        this.w=wi;
        this.h=he;
        this.color=color;
        this.name = name;
        this.self = document.createElement("img");
        if(texture!="./"){this.self.src=texture}else{this.self.style.backgroundColor="rgb("+color[0]+","+color[1]+","+color[2]+")";}
        this.self.width=wi/default_width*width;
        this.self.height=he/default_height*height;
        document.body.appendChild(this.self);
        this.self.style.position = "Absolute";
        let output = this.px_to_percent(this.pX,this.pY)
        this.self.style.top = output[1]+"px";
        this.self.style.left = output[0]+"px";
        this.text = null

    };
    setText(text){
        if(this.text==null){
            this.text = document.createElement('p')
            document.body.appendChild(this.text)
            this.text.style.position = "Absolute";
            this.text.style.top = this.pY/default_height*height+"px";
            this.text.style.left = this.pX/default_width*width+"px";
            this.text.style.minWidth=this.w/default_width*width+"px";
            this.text.style.minHeight=this.h/default_height*height+"px";
            this.text.style.maxWidth=this.w/default_width*width+"px";
            this.text.style.maxHeight=this.h/default_height*height+"px";}
        this.text.innerText=text
    }
    setTexture(tex){
        if(tex!="./"){this.self.src=tex;this.self.style.backgroundColor="rgba(0,0,0,0)"}else{this.self.style.backgroundColor="rgb("+color[0]+","+color[1]+","+color[2]+")"}
    }
    setColor(color=[0,0,0]){
        this.color = color;
        this.self.style.backgroundColor="rgb("+color[0]+","+color[1]+","+color[2]+")";
    }
    move(pX,pY){
        this.pX = pX;
        this.pY = pY;
        let output = this.px_to_percent(this.pX,this.pY)
        this.self.style.top = output[1]+"px"
        this.self.style.left = output[0]+"px"
    }
    move_by(pX,pY){
        this.pX += pX;
        this.pY += pY;
        let output = this.px_to_percent(this.pX,this.pY)
        this.self.style.top = output[1]+"px"
        this.self.style.left = output[0]+"px"
    }
    px_to_percent(pX,pY){
        return [pX/default_width*width,pY/default_height*height]
    }
}

class MovingObject extends Object{
    constructor(pX,pY,name,gravity,friction,max_gravity=256){
        super(pX,pY,name,16,16);
        this.gravity = gravity;
        this.friction = friction;
        this.cur_force = [0,0];
        this.applied_force = [0,0]
        this.on_floor=false;
        this.on_wall=0
        this.max_fall_speed=max_gravity
        this.swap_this_frame=false;
    }
    update(delta){
        this.cur_force[0] += this.applied_force[0]*delta
        this.cur_force[1] += this.gravity*delta;
        let collision = collide(this,true);
        this.move_by(
            this.cur_force[0]*delta*
            !(Math.sign(this.cur_force[0])==1?collision[1]:collision[0]),
            this.cur_force[1]*delta*
            (Math.sign(this.cur_force[1])==1?!collision[2]:collision[3]||true));
        if(Math.abs(collision[4])>=2){if(this.swap_this_frame){this.swap_this_frame=false}else{collision[4]=0;this.swap_this_frame=true}}else{this.swap_this_frame=false}     
        this.move_by(collision[4],collision[5])
        this.cur_force[0] -= this.cur_force[0]*(this.friction*(this.on_floor))*delta;
        this.cur_force[1] -= this.cur_force[1]*this.friction*delta;
        if(collision[2]){this.cur_force[1]=Math.min(this.cur_force[1],0)}
        if(collision[3]){this.cur_force[1]=Math.max(this.cur_force[1],0)}
        if(collision[5]!=0){this.can_jump=true;this.on_floor=true}
        if(collision[0]){this.cur_force[0]=Math.max(this.cur_force[0],0)}
        if(collision[1]){this.cur_force[0]=Math.min(this.cur_force[0],0)}
        this.cur_force[1]=Math.min(this.cur_force[1],this.max_fall_speed)
        this.on_floor=collision[2]
        this.on_wall=collision[0]-collision[1]
}}

class Player extends MovingObject{
    constructor(pX,pY,name,gravity,friction){
        super(pX,pY,name,gravity,friction);
        this.double_jump=true;
        this.just_pressed_jump=0;
    }
    update(delta){
        if(this.on_floor){this.double_jump=true}
        if(keyPressed[0]&&this.just_pressed_jump<2&&(this.on_floor||this.double_jump||this.on_wall!=0)){this.cur_force[1]=-160;
            if(!this.on_floor&&this.on_wall==0){this.double_jump=false};
            this.just_pressed_jump++
            this.cur_force[0]-=(keyPressed[1]-keyPressed[3])*128
            this.cur_force[0]=Math.min(Math.abs(this.cur_force[0]),196)*Math.sign(this.cur_force[0])
            if(this.on_wall!=0&&!this.on_floor){this.cur_force[0]=128*this.on_wall;/*this.double_jump=true*/;this.cur_force[1]=-96}};
        if(this.on_floor){this.cur_force[0]-=this.cur_force[0]*this.friction*(16*!(keyPressed[1]||keyPressed[3]))*delta}
        if(!keyPressed[0]){this.just_pressed_jump=0}
        if(keyPressed[1]){this.cur_force[0] -= 128*delta_time*((3*this.cur_force[0]>0)+1)}
        if(keyPressed[3]){this.cur_force[0] += 128*delta_time*((3*this.cur_force[0]<0)+1)}
        if (Math.abs(this.cur_force[0]) > 256){
            this.cur_force[0]=256*Math.sign(this.cur_force[0])}
        super.update(delta)
        scroll((this.pX-512)/default_width*width,0)
}}


//objects added into scene
let for_changing = null;
add_scene_object(0,512-48,2048,48,[0,0,0])
add_scene_object(0,0,48,512,[0,0,0])
add_scene_object(0,0,2048,48,[0,0,0])
for_changing = add_scene_object(96,260,64,72,[255,255,255])
collision_objects.pop()
for_changing.setText("LEVEL 1")
add_scene_object(512,420,64,16,[255,255,0])
add_scene_object(485,320,128,32,[255,0,255])
add_scene_object(440,240,32,16,[0,255,0])
add_scene_object(128,96,32,16,[255,0,255])
add_scene_object(450,320,8,32,[255,0,255])
add_scene_object(485+128+20,320,8,16,[255,0,255])
add_scene_object(457,320,29,8,[255,255,255])
add_scene_object(320,200,32,8,[255,0,0])
add_scene_object(48,196,4,4,[255,255,255])
add_scene_object(512,128,4,64,[255,255,0])
add_scene_object(612,128,32,8,[255,255,0])
add_scene_object(768,72,16,392,[255,255,0])
add_scene_object(800,48,16,400,[255,255,0])
add_scene_object(832,400,32,16,[255,0,0])
add_scene_object(860,264,32,16,[0,255,0])
add_scene_object(872,164,4,4,[0,255,0])
add_scene_object(964,96,8,8,[0,255,0])
add_scene_object(1064,106,8,8,[255,155,155])
//player
let n = new Player(800-16,48,"a",256.0,0.5);
n.setColor([0,255,255])
update_objects.push(n);


//add object to scene//
function add_scene_object(pX=0,pY=0,sizeX=32,sizeY=32,color=[0,0,0],name="Node"){
    let object = new Object(pX,pY,name,sizeX,sizeY,color)
    collision_objects.push(object)
    return object
}


//game update rate
let delta_time = 25;
window.setInterval(update_all,delta_time);
delta_time = delta_time/1000;
function update_all(){
    for (const obj of update_objects) {
        obj.update(delta_time);
    };
}

//collision
function collide(self,side=false){
    let out = [false,false,false,false,0,0];
    for (const obj of collision_objects) {
        if(obj!=self){
            let n_out = collision(self,obj)
            if(n_out[2]&&Math.abs((self.pY+self.h)-obj.pY)<16){out[2]=true;out[5]-=(self.pY+self.h)-obj.pY}else
            if(n_out[3]&&Math.abs((obj.pY+obj.h)-self.pY)<16){out[3]=true;out[5]+=(obj.pY+obj.h)-self.pY}else
            if(n_out[0]&&Math.abs((obj.pX+obj.w)-self.pX)<16){out[0]=true;out[4]+=(obj.pX+obj.w)-self.pX}else
            if(n_out[1]&&Math.abs((self.pX+self.w)-obj.pX)<16){out[1]=true;out[4]-=(self.pX+self.w)-obj.pX}
        }}
    return out
}
function collision(o1,o2){
    let out = [false,false,false,false];
    if (!(((o1.pX + o1.w) < o2.pX)||(o1.pX > (o2.pX + o2.w))||((o1.pY + o1.h) < o2.pY)||(o1.pY > (o2.pY + o2.h)))){
            out[2]=!(((o1.pY + o1.h) < o2.pY+4)&&(o1.pY+4 > (o2.pY + o2.h)))&&!(((o1.pX + o1.w) < o2.pX+4)||(o1.pX+4 > (o2.pX + o2.w)))
            out[3]=!((o1.pY+4 > (o2.pY + o2.h))&&((o1.pY + o1.h) < o2.pY+4))&&!(((o1.pX + o1.w) < o2.pX+4)||(o1.pX+4 > (o2.pX + o2.w)))
            out[0]=!((o1.pX + o1.w) < o2.pX+1)&&((o1.pY+4 < (o2.pY + o2.h))&&((o1.pY + o1.h) > o2.pY+4))
            out[1]=!(o1.pX+1 > (o2.pX + o2.w))&&((o1.pY+4 < (o2.pY + o2.h))&&((o1.pY + o1.h) > o2.pY+4))
};return out;}




//inputs
document.addEventListener('keydown', function(event) {change_keys(event.key,true);});
document.addEventListener('keyup', function(event) {change_keys(event.key,false);});
function change_keys(inp,out){
    switch(inp){
        case "w":keyPressed[0]=out;break
        case "a":keyPressed[1]=out;break
        case "s":keyPressed[2]=out;break
        case "d":keyPressed[3]=out;break
}
}