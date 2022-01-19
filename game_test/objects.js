let update_objects = []
let collision_objects = []
let keyPressed = [false,false,false,false]
class Object{
    constructor(pX,pY,name,wi=32,he=32,texture="./dot.png"){
        this.pX = pX;
        this.pY = pY;
        this.w=wi;
        this.h=he;
        this.name = name;
        this.self = document.createElement("img");
        this.self.src=texture
        this.self.width=wi;
        this.self.height=he;
        document.body.appendChild(this.self);
        this.self.style.position = "Absolute";
        this.self.style.top = this.pY+"px";
        this.self.style.left = this.pX+"px";
    };
    setTexture(tex){
        this.self.src=tex;
    }
    move(pX,pY){
        this.pX = pX;
        this.pY = pY;
        this.self.style.top = pY+"px"
        this.self.style.left = pX+"px"
    }
    move_by(pX,pY){
        this.pX += pX;
        this.pY += pY;
        this.self.style.top = this.pY+"px"
        this.self.style.left = this.pX+"px"
}}
class MovingObject extends Object{
    constructor(pX,pY,name,gravity,friction){
        super(pX,pY,name,16,16);
        this.gravity = gravity;
        this.friction = friction;
        this.cur_force = [0,0];
        this.applied_force = [0,0]
        this.on_floor=false;
    }
    update(delta){
        this.cur_force[0] += this.applied_force[0]*delta
        this.cur_force[1] += this.gravity*delta;
        let collision = collide(this,true);
        this.move_by(
            this.cur_force[0]*delta*
            (collision[0]==0||collision[0]!=Math.sign(this.cur_force[0])),
            this.cur_force[1]*delta*
            (collision[1]==0||collision[1]!=Math.sign(this.cur_force[1])));
        this.cur_force[0] -= this.cur_force[0]*this.friction*delta;
        this.cur_force[1] -= this.cur_force[1]*this.friction*delta;
        if(collision[1]==1){this.cur_force[1]=0}
        this.on_floor=collision[1]==1
}}
class Player extends MovingObject{
    constructor(pX,pY,name,gravity,friction){
        super(pX,pY,name,gravity,friction);
        this.double_jump=true;
        this.just_pressed_jump=0;
    }
    update(delta){
        if(this.on_floor){this.double_jump=true}
        
        if(keyPressed[0]&&this.just_pressed_jump<2&&(this.on_floor||this.double_jump)){this.cur_force[1]=-128;
            if(!this.on_floor){this.double_jump=false};
            this.just_pressed_jump++};
        if(!keyPressed[0]){this.just_pressed_jump=0}
        if(keyPressed[1]){this.cur_force[0] -= 128*delta_time}
        if(keyPressed[3]){this.cur_force[0] += 128*delta_time}
        if (Math.abs(this.cur_force[0] > 128)){
            this.cur_force[0]=64*(this.cur_force[0]/Math.abs(this.cur_force[0]))}
        super.update(delta)
}}


//objects added into scene
let n = new Player(100,364,"a",128.0,0.5);
n.setTexture("./Rocket.png")
update_objects.push(n);
let floor = new Object(32,500,"floor",500,32);
collision_objects.push(floor);
let floor1 = new Object(0,0,"floor2",32,500);
collision_objects.push(floor1)
//game update rate
let delta_time = 50;
window.setInterval(update_all,delta_time);
delta_time = delta_time/1000;
function update_all(){
    for (const obj of update_objects) {
        obj.update(delta_time);
    };
}

//collision
function collide(self,side=false){
    let out = [0,0];
    for (const obj of collision_objects) {
        if(obj!=self){
            out = collision(self,obj)
            if(out[0]!=0||out[1]!=0){return out}
        }}
    return out
}
function collision(o1,o2){
    let out = [0,0]
    if (!(
        ((o1.pX + o1.w) < o2.pX)||
        (o1.pX > (o2.pX + o2.w))||
        ((o1.pY + o1.h) < o2.pY)||
        (o1.pY > (o2.pY + o2.h))
        )){
            out[0]=(
                ((o2.pX > o1.pX) && (o2.pX < o1.pX + o1.w))-
                ((o1.pX > o2.pX) && (o1.pX < o2.pX + o2.w)))
            out[1]=(
            ((o2.pY > o1.pY) && (o2.pY < o1.pY + o1.h))-
            ((o1.pY > o2.pY) && (o1.pY < o2.pY + o2.h)))
            
            if(o2.pY+4 > o1.pY+o1.h
                && (o2.pX+1 < o1.pX&&o2.pY<o1.pY+o1.h+1)){out[0]=0}
            if(o2.pX+o2.w < o1.pX+2){out[1]=0}
        }
    return out;
}
var dat = new Date();
console.log(dat.getDay());
console.log(dat.getHours());
console.log(dat.getMinutes());
console.log(dat.getSeconds());
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