//collision
function collide(self,side=false){
    let out = [0,0];
    for (const obj of collision_objects){if(obj!=self){
            let n_out = collision(self,obj)
            if(Math.sign(n_out[1])==Math.sign(out[1])||out[1]==0){out[1]+=n_out[1]};
            out[0]+=n_out[0]
            }
        }return out}
function collision(o1,o2){
    let out = [0,0];
    
    if (!(((o1.position.x + o1.size.x) < o2.position.x)||(o1.position.x > (o2.position.x + o2.size.x))||((o1.position.y + o1.size.y) < o2.position.y)||(o1.position.y > (o2.position.y + o2.size.y)))){
            let modifier = [false,false,false,false]
            modifier[2]=!(((o1.position.y + o1.size.y) < o2.position.y+4)&&(o1.position.y+4 > (o2.position.y + o2.size.y)))&&!(((o1.position.x + o1.size.x) < o2.position.x+4)||(o1.position.x+4 > (o2.position.x + o2.size.x)))
            modifier[3]=!((o1.position.y+4 > (o2.position.y + o2.size.y))&&((o1.position.y + o1.size.y) < o2.position.y+4))&&!(((o1.position.x + o1.size.x) < o2.position.x+4)||(o1.position.x+4 > (o2.position.x + o2.size.x)))
            modifier[0]=!((o1.position.x + o1.size.x) < o2.position.x+1)&&((o1.position.y+4 < (o2.position.y + o2.size.y))&&((o1.position.y + o1.size.y) > o2.position.y+4))
            modifier[1]=!(o1.position.x+1 > (o2.position.x + o2.size.x))&&((o1.position.y+4 < (o2.position.y + o2.size.y))&&((o1.position.y + o1.size.y) > o2.position.y+4))
            if(modifier[2]&&Math.abs((o1.position.y+o1.size.y)-o2.position.y)<16){out[1]-=(o1.position.y+o1.size.y)-o2.position.y}else
            if(modifier[3]&&Math.abs((o2.position.y+o2.size.y)-o1.position.y)<16){out[1]+=(o2.position.y+o2.size.y)-o1.position.y}else
            if(modifier[0]&&Math.abs((o2.position.x+o2.size.x)-o1.position.x)<16){out[0]+=(o2.position.x+o2.size.x)-o1.position.x}else
            if(modifier[1]&&Math.abs((o1.position.x+o1.size.x)-o2.position.x)<16){out[0]-=(o1.position.x+o1.size.x)-o2.position.x}
};return out;}
