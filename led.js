
jQuery.event.add(window, "load", function(){
    var target = document.getElementById("sample");

    var canvas = target;
    var context = canvas.getContext('2d');
    var canvasSize = $('body').width() * 0.9;


    canvas.width = canvasSize;
    canvas.height = canvasSize / 3;

    var size = canvasSize / 8;
    var led7 = [];

    var colon = new SeparatorSegment(target, 20, 30, size);
    var period = new SeparatorSegment(target, 20+size*0.3, 30, size);
    colon.draw(':',true);
    period.draw('.',true);
    for(var i=0; i<10; i++){
        led7[i] = new SevenSegment(target, 140+(size*0.7)*i, 30, size);
        led7[i].setOnColor(255,2,2);
        led7[i].setOffColor(220,200,200);
        led7[i].draw(led7[i].mapping(i));
    }

    var str = 'abcdefghijklmnopqrstuvwxyz';
    var sizeOf14 = canvasSize / (str.length-7);
    for(var i=0; i<str.length; i++){
        var c = str.charAt(i);
        var led14 = new FourteenSegment(target, 20+(sizeOf14*0.7)*i,30+size*1.2,sizeOf14);
        led14.draw(led14.mapping(c));
    }

    /* 一秒ごとに表示を切り替える */
    var count = 1;
    var timer = setInterval(function(){
        for(var i=0; i<10; i++){
            var mapping7 = led7[i].mapping((i+count)%10);

            led7[i].draw(mapping7);
        }
        count++;
        colon.draw(':',count%2);
        period.draw('.',(count+1)%2);
    }, 1000);
    //clearInterval(timer);
});

//{{{ period & colon
//{{{ function SeparatorSegment(canvas, x,y,size){
// period
// colon
function SeparatorSegment(canvas, x,y,size){
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.width = size*0.2;
    this.height = size;
    this.onColor = [255,50,50];
    var context = canvas.getContext('2d');
    context.rect(x, y, this.width, this.height);
    context.stroke();
}
//}}}
//{{{ SeparatorSegment.prototype.draw = function(type, flg){
SeparatorSegment.prototype.draw = function(type, flg){
    var context = this.canvas.getContext('2d');
    var rgb = this.onColor[0] + ',' + this.onColor[1] + ',' + this.onColor[2];
    context.fillStyle = "red";
    context.clearRect(this.x, this.y, this.width, this.height);

    switch(type){
        case '.':
            var xposit = this.x + this.width * 0.5;
            var yposit = this.y + this.height * 0.9;
            var radius = ((this.width < this.height)? this.width : this.height) / 6;
            context.fillStyle = "red";
            context.beginPath();
            context.arc(xposit, yposit, radius, 0, Math.PI * 2, false);
            context.stroke();
            if(flg){
                context.fill();
            }
            context.closePath();
            break;
        case ':':
            var xposit = this.x + this.width * 0.5;
            var ypositT = this.y + this.height * 0.3;
            var ypositB = this.y + this.height * 0.7;
            var radius = ((this.width < this.height)? this.width : this.height) / 6;
            context.fillStyle = "red";
            context.beginPath();
            context.arc(xposit, ypositT, radius, 0, Math.PI * 2, false);
            if(flg){
                context.fill();
            }
            context.stroke();
            context.closePath();
            context.fillStyle = "red";
            context.beginPath();
            context.arc(xposit, ypositB, radius, 0, Math.PI * 2, false);
            if(flg){
                context.fill();
            }
            context.stroke();
            context.closePath();
            break;
        default:
            break;
    }
}
//}}}
//}}}

//{{{ 7SegmentLED
//
//{{{ function SevenSegment(canvas, x, y, size){
//   a
// f   b
//   g
// e   c
//   d
function SevenSegment(canvas, x, y, size){
    this.canvas = canvas;
    this.onColor = [255,50,50];
    this.offColor = [240,230,230];
    this.width = size*0.6;
    this.height = size;
    this.x = x;
    this.y = y;
    this.shadowBlur = size*0.05;

    var bd = size * 0.09;
    var lx = x + bd;//左
    var ty = y + bd;//上
    var rx = x + this.width - bd;//右
    var by = y + this.height - bd;//下
    var context = canvas.getContext('2d');

    //context.rect(this.x, this.y, this.width, this.height);
    //context.stroke();

    var cy = y + this.height / 2;

    this.point = {
        a:[ /* 左端 */[lx+bd/6,ty+bd/6], [lx+bd/3,ty], [rx-bd/3,ty],   /* 右端 */[rx-bd/6,ty+bd/6], [rx-bd,ty+bd],   [lx+bd,ty+bd] ],
        b:[ /* 上端 */[rx-bd/6,ty+bd/6], [rx,ty+bd/3], [rx,cy-bd/3],       /* 下端 */[rx-bd/6,cy], [rx-bd,cy-bd/2], [rx-bd,ty+bd] ],
        c:[ /* 上端 */[rx-bd/6,cy],[rx,cy+bd/3],      [rx,by-bd/3], /* 下端 */[rx-bd/6,by-bd/6], [rx-bd,by-bd], [rx-bd,cy+bd/2]   ],
        d:[ /* 左端 */[lx+bd/6,by-bd/6], [lx+bd/3,by], [rx-bd/3,by],   /* 右端 */[rx-bd/6,by-bd/6], [rx-bd,by-bd],   [lx+bd,by-bd] ],
        e:[ /* 上端 */[lx+bd/6,cy], [lx+bd,cy+bd/2], [lx+bd,by-bd], /* 下端 */[lx+bd/6,by-bd/6], [lx,by-bd/3],      [lx,cy+bd/3]  ],
        f:[ /* 上端 */[lx+bd/6,ty+bd/6], [lx+bd,ty+bd],   [lx+bd,cy-bd/2], /* 下端 */[lx+bd/6,cy],    [lx,cy-bd/3],[lx,ty+bd/3]   ],
        g:[ /* 左端 */[lx+bd/6,cy], [lx+bd,cy-bd/2], [rx-bd,cy-bd/2],   /* 右端 */[rx-bd/6,cy], [rx-bd,cy+bd/2], [lx+bd,cy+bd/2] ],
    };
    var slide = function(array, x, y){
        for(var i=0;i<array.length;i++){
            array[i][0] = array[i][0] + x ;
            array[i][1] = array[i][1] + y ;
        }
    }
    slide(this.point.a,        0, -bd*0.25);
    slide(this.point.b,  bd*0.15, -bd*0.15);
    slide(this.point.c,  bd*0.15,  bd*0.15);
    slide(this.point.d,        0,  bd*0.25);
    slide(this.point.e, -bd*0.15,  bd*0.15);
    slide(this.point.f, -bd*0.15, -bd*0.15);

}
//}}}
//{{{ SevenSegment.prototype.mapping = function(number){
SevenSegment.prototype.mapping = function(number){
    switch(number){
        case 0:
            return {'number':number,'a':true,'b':true, 'c':true,'d':true, 'e':true, 'f':true, 'g':false,};
        case 1:
            return {'number':number,'a':false,'b':true, 'c':true,'d':false, 'e':false, 'f':false, 'g':false,};
        case 2:
            return {'number':number,'a':true,'b':true, 'c':false,'d':true, 'e':true, 'f':false, 'g':true,};
        case 3:
            return {'number':number,'a':true,'b':true, 'c':true,'d':true, 'e':false, 'f':false, 'g':true,};
        case 4:
            return {'number':number,'a':false,'b':true, 'c':true,'d':false, 'e':false, 'f':true, 'g':true,};
        case 5:
            return {'number':number,'a':true,'b':false, 'c':true,'d':true, 'e':false, 'f':true, 'g':true,};
        case 6:
            return {'number':number,'a':true,'b':false, 'c':true,'d':true, 'e':true, 'f':true, 'g':true,};
        case 7:
            return {'number':number,'a':true,'b':true, 'c':true,'d':false, 'e':false, 'f':false, 'g':false,};
        case 8:
            return {'number':number,'a':true,'b':true, 'c':true,'d':true, 'e':true, 'f':true, 'g':true,};
        case 9:
            return {'number':number,'a':true,'b':true, 'c':true,'d':true, 'e':false, 'f':true, 'g':true,};
        default:
            return {'number':number,}
    }
}
//}}}
//{{{ SevenSegment.prototype.draw = function(input){
SevenSegment.prototype.draw = function(input){
    var context = this.canvas.getContext('2d');
    //var input = this.mapping(number);

    context.save();
    context.shadowColor = "rgba(" + this.onColor[0] + ","+ this.onColor[1] + "," + this.onColor[2] + ",0.5" + ")";
    context.clearRect(this.x,this.y,this.width, this.height);

    context.strokeStyle = 'transparent';

    for(var key in this.point){
        var point = this.point[key.toString()];
        context.beginPath();
        for(var i=0;i<point.length;i++){
            context.lineTo(point[i][0] , point[i][1]);
        }
        if(input[key.toString()]){
            context.fillStyle = "rgba(" + this.onColor[0] + ","+ this.onColor[1] + "," + this.onColor[2] + ",1.0" + ")";
            context.shadowBlur = this.shadowBlur;
            context.fill();
        }else{
            context.fillStyle = "rgba(" + this.offColor[0] + ","+ this.offColor[1] + "," + this.offColor[2] + ",1.0" + ")";
            context.shadowBlur = 0;
            context.fill();
        }
        context.closePath();
        context.stroke();
    }
    context.restore();
}
//}}}
//{{{ SevenSegment.prototype.setOnColor = function(r,g,b){
SevenSegment.prototype.setOnColor = function(r,g,b){
    this.onColor[0] = r;
    this.onColor[1] = g;
    this.onColor[2] = b;
}
//}}}
//{{{ SevenSegment.prototype.setOffColor = function(r,g,b){
SevenSegment.prototype.setOffColor = function(r,g,b){
    this.offColor[0] = r;
    this.offColor[1] = g;
    this.offColor[2] = b;
}
//}}}
//}}}

//{{{ 14SegmentLED
//{{{ function FourteenSegment(canvas, x, y, size){
//     a
// f h i j  b
//   g1  g2
// e m l k  c
//     d
function FourteenSegment(canvas, x, y, size){
    this.canvas = canvas;
    this.onColor = [255,50,50];
    this.offColor = [240,230,230];
    this.width = size*0.68;
    this.height = size;
    this.x = x;
    this.y = y;
    this.shadowBlur = size*0.05;

    var bd = size * 0.065;
    var lx = x + bd;//左
    var ty = y + bd;//上
    var rx = x + this.width - bd;//右
    var by = y + this.height - bd;//下
    var context = canvas.getContext('2d');

    //context.rect(this.x, this.y, this.width, this.height);
    //context.stroke();

    var cy = y + this.height / 2;
    var cx = x + this.width / 2;

    this.point = {
        a:[ /* 左端 */[lx+bd/6,ty+bd/6], [lx+bd/3,ty], [rx-bd/3,ty],   /* 右端 */[rx-bd/6,ty+bd/6], [rx-bd,ty+bd],   [lx+bd,ty+bd] ],
        b:[ /* 上端 */[rx-bd/6,ty+bd/6], [rx,ty+bd/3], [rx,cy-bd/3],       /* 下端 */[rx-bd/6,cy], [rx-bd,cy-bd/2], [rx-bd,ty+bd] ],
        c:[ /* 上端 */[rx-bd/6,cy],[rx,cy+bd/3],      [rx,by-bd/3], /* 下端 */[rx-bd/6,by-bd/6], [rx-bd,by-bd], [rx-bd,cy+bd/2]   ],
        d:[ /* 左端 */[lx+bd/6,by-bd/6], [lx+bd/3,by], [rx-bd/3,by],   /* 右端 */[rx-bd/6,by-bd/6], [rx-bd,by-bd],   [lx+bd,by-bd] ],
        e:[ /* 上端 */[lx+bd/6,cy], [lx+bd,cy+bd/2], [lx+bd,by-bd], /* 下端 */[lx+bd/6,by-bd/6], [lx,by-bd/3],      [lx,cy+bd/3]  ],
        f:[ /* 上端 */[lx+bd/6,ty+bd/6], [lx+bd,ty+bd],   [lx+bd,cy-bd/2], /* 下端 */[lx+bd/6,cy],    [lx,cy-bd/3],[lx,ty+bd/3]   ],
        g1:[ /* 左端 */[lx+bd/6,cy], [lx+bd,cy-bd/2], [cx-bd/2,cy-bd/2],   /* 右端 */[cx-bd/6,cy], [cx-bd/2,cy+bd/2], [lx+bd,cy+bd/2] ],
        g2:[ /* 左端 */[cx+bd/6,cy], [cx+bd/2,cy-bd/2], [rx-bd,cy-bd/2],   /* 右端 */[rx-bd/6,cy], [rx-bd,cy+bd/2], [cx+bd/2,cy+bd/2] ],

        h:[ /* 左上 */[lx+bd,ty+bd],[lx+bd*1.5,ty+bd],[cx-bd,cy-bd*2.5],/* 右下 */[cx-bd,cy-bd],[cx-bd*1.5,cy-bd],[lx+bd,ty+bd*2.5] ],
        i:[ /* 下端 */[cx,cy-bd/6], /* 左下 */[cx-bd/2,cy-bd],[cx-bd/2,ty+bd],[cx+bd/2,ty+bd] ,/* 右下 */[cx+bd/2,cy-bd] ],
        j:[ /* 右上 */[rx-bd,ty+bd],[rx-bd*1.5,ty+bd],[cx+bd,cy-bd*2.5],/* 左下 */[cx+bd,cy-bd],[cx+bd*1.5,cy-bd],[rx-bd,ty+bd*2.5] ],

        k:[ /* 左上 */[cx+bd,cy+bd],[cx+bd*1.5,cy+bd],[rx-bd,by-bd*2.5],/* 右下 */[rx-bd,by-bd],[rx-bd*1.5,by-bd],[cx+bd,cy+bd*2.5]],
        l:[ /* 下端 */[cx,cy+bd/6], /* 左下 */[cx-bd/2,cy+bd],[cx-bd/2,by-bd],[cx+bd/2,by-bd] ,/* 右下 */[cx+bd/2,cy+bd] ],
        m:[ /* 右上 */[cx-bd,cy+bd],[cx-bd*1.5,cy+bd],[lx+bd,by-bd*2.5],/* 左下 */[lx+bd,by-bd],[lx+bd*1.5,by-bd],[cx-bd,cy+bd*2.5] ],
    };
    var slide = function(array, x, y){
        for(var i=0;i<array.length;i++){
            array[i][0] = array[i][0] + x ;
            array[i][1] = array[i][1] + y ;
        }
    }
    slide(this.point.a,       0, -bd*0.25);
    slide(this.point.b,  bd*0.2, -bd*0.15);
    slide(this.point.c,  bd*0.2,  bd*0.15);
    slide(this.point.d,       0,  bd*0.25);
    slide(this.point.e, -bd*0.2,  bd*0.15);
    slide(this.point.f, -bd*0.2, -bd*0.15);

    slide(this.point.h,  bd*0.15, 0);
    slide(this.point.j, -bd*0.15, 0);
    slide(this.point.k, -bd*0.15, 0);
    slide(this.point.m,  bd*0.15, 0);
}
//}}}
//{{{ FourteenSegment.prototype.mapping = function(number){
FourteenSegment.prototype.mapping = function(number){
    switch(number.toUpperCase()){
        case '0':
            return {'number':number,'a':true,'b':true, 'c':true,'d':true, 'e':true, 'f':true, 'g1':false,'g2':false, 'h':false, 'i':false, 'j':false, 'k':false, 'l':false, 'm':false, };
        case '1':
            return {'number':number,'a':false,'b':true, 'c':true,'d':false, 'e':false, 'f':false, 'g1':false,'g2':false, 'h':false, 'i':false, 'j':true, 'k':false, 'l':false, 'm':false, };
        case '2':
            return {'number':number,'a':true,'b':true, 'c':false,'d':true, 'e':true, 'f':false, 'g1':true, 'g2':true, 'h':false, 'i':false, 'j':false, 'k':false, 'l':false, 'm':false, };
        case '3':
            return {'number':number,'a':true,'b':true, 'c':true,'d':true, 'e':false, 'f':false, 'g1':false, 'g2':true, 'h':false, 'i':false, 'j':false, 'k':false, 'l':false, 'm':false, };
        case '4':
            return {'number':number,'a':false,'b':true, 'c':true,'d':false, 'e':false, 'f':true, 'g1':true, 'g2':true, 'h':false, 'i':false, 'j':false, 'k':false, 'l':false, 'm':false, };
        case '5':
            return {'number':number,'a':true,'b':false, 'c':true,'d':true, 'e':false, 'f':true, 'g1':true, 'g2':true, 'h':false, 'i':false, 'j':false, 'k':false, 'l':false, 'm':false, };
        case '6':
            return {'number':number,'a':true,'b':false, 'c':true,'d':true, 'e':true, 'f':true, 'g1':true, 'g2':true, 'h':false, 'i':false, 'j':false, 'k':false, 'l':false, 'm':false, };
        case '7':
            return {'number':number,'a':true,'b':false, 'c':false,'d':false, 'e':false, 'f':false, 'g1':false,'g2':false, 'h':false, 'i':false, 'j':true, 'k':false, 'l':true, 'm':false, };
        case '8':
            return {'number':number,'a':true,'b':true, 'c':true,'d':true, 'e':true, 'f':true, 'g1':true, 'g2':true, 'h':false, 'i':false, 'j':false, 'k':false, 'l':false, 'm':false, };
        case '9':
            return {'number':number,'a':true,'b':true, 'c':true,'d':true, 'e':false, 'f':true, 'g1':true, 'g2':true, 'h':false, 'i':false, 'j':false, 'k':false, 'l':false, 'm':false, };
        case 'A':
            return {'number':number,'a':true,'b':true, 'c':true, 'e':true, 'f':true, 'g1':true,'g2':true, };
        case 'B':
            return {'number':number,'a':true,'b':true, 'c':true,'d':true, 'g2':true, 'i':true, 'l':true, };
        case 'C':
            return {'number':number,'a':true, 'd':true, 'e':true, 'f':true, };
        case 'D':
            return {'number':number,'a':true,'b':true, 'c':true,'d':true, 'i':true, 'l':true, };
        case 'E':
            return {'number':number,'a':true, 'd':true, 'e':true, 'f':true, 'g1':true,'g2':true, };
        case 'F':
            return {'number':number,'a':true, 'e':true, 'f':true, 'g1':true,'g2':true, };
        case 'G':
            return {'number':number,'a':true, 'c':true, 'g2':true, 'd':true, 'e':true, 'f':true, };
        case 'H':
            return {'number':number,'b':true, 'c':true, 'e':true, 'f':true, 'g1':true, 'g2':true, };
        case 'I':
            return {'number':number,'a':true, 'd':true, 'i':true, 'l':true, };
        case 'J':
            return {'number':number, 'b':true, 'c':true,'d':true, 'e':true, 'g1':false,'g2':false, 'h':false, 'i':false, 'j':false, 'k':false, 'l':false, 'm':false, };
        case 'K':
            return {'number':number, 'e':true, 'f':true, 'g1':true, 'j':true, 'k':true };
        case 'L':
            return {'number':number, 'd':true, 'e':true, 'f':true, };
        case 'M':
            return {'number':number, 'b':true, 'c':true, 'e':true, 'f':true, 'h':true, 'j':true, };
        case 'N':
            return {'number':number, 'b':true, 'c':true, 'e':true, 'f':true, 'h':true, 'k':true, };
        case 'O':
            return {'number':number, 'a':true, 'b':true, 'c':true,'d':true, 'e':true, 'f':true, 'g1':false,'g2':false, 'h':false, 'i':false, 'j':false, 'k':false, 'l':false, 'm':false, };
        case 'P':
            return {'number':number, 'a':true, 'b':true, 'e':true, 'f':true, 'g1':true,'g2':true, };
        case 'Q':
            return {'number':number, 'a':true,'b':true, 'c':true,'d':true, 'e':true, 'f':true, 'g1':false,'g2':false, 'h':false, 'i':false, 'j':false, 'k':true, 'l':false, 'm':false, };
        case 'R':
            return {'number':number, 'a':true, 'b':true, 'e':true, 'f':true, 'g1':true,'g2':true, 'k':true, };
        case 'S':
            return {'number':number, 'a':true, 'c':true, 'g2':true, 'd':true, 'h':true, };
        case 'T':
            return {'number':number, 'a':true, 'i':true, 'l':true, };
        case 'U':
            return {'number':number, 'b':true, 'c':true,'d':true, 'e':true, 'f':true, 'g1':false,'g2':false, 'h':false, 'i':false, 'j':false, 'k':false, 'l':false, 'm':false, };
        case 'V':
            return {'number':number, 'e':true, 'f':true, 'j':true, 'm':true, };
        case 'W':
            return {'number':number, 'b':true, 'c':true, 'e':true, 'f':true, 'k':true, 'm':true, };
        case 'X':
            return {'number':number, 'h':true, 'j':true, 'k':true, 'm':true, };
        case 'Y':
            return {'number':number, 'h':true, 'j':true, 'l':true, };
        case 'Z':
            return {'number':number,'a':true, 'd':true, 'j':true, 'm':true, };
        default:
            return {'number':number,}
    }
}
//}}}
//{{{ FourteenSegment.prototype.draw = function(input){
FourteenSegment.prototype.draw = function(input){
    var context = this.canvas.getContext('2d');
    context.save();
    context.shadowColor = "rgba(" + this.onColor[0] + ","+ this.onColor[1] + "," + this.onColor[2] + ",0.5" + ")";
    context.clearRect(this.x,this.y,this.width, this.height);

    context.strokeStyle = 'transparent';

    for(var key in this.point){
        var point = this.point[key.toString()];
        context.beginPath();
        for(var i=0;i<point.length;i++){
            context.lineTo(point[i][0] , point[i][1]);
        }
        if(input[key.toString()]){
            context.fillStyle = "rgba(" + this.onColor[0] + ","+ this.onColor[1] + "," + this.onColor[2] + ",1.0" + ")";
            context.shadowBlur = this.shadowBlur;
            context.fill();
        }else{
            context.fillStyle = "rgba(" + this.offColor[0] + ","+ this.offColor[1] + "," + this.offColor[2] + ",1.0" + ")";
            context.shadowBlur = 0;
            context.fill();
        }
        context.closePath();
        context.stroke();
    }
    context.restore();
}
//}}}
//{{{ FourteenSegment.prototype.setOnColor = function(r,g,b){
FourteenSegment.prototype.setOnColor = function(r,g,b){
    this.onColor[0] = r;
    this.onColor[1] = g;
    this.onColor[2] = b;
}
//}}}
//{{{ FourteenSegment.prototype.setOffColor = function(r,g,b){
FourteenSegment.prototype.setOffColor = function(r,g,b){
    this.offColor[0] = r;
    this.offColor[1] = g;
    this.offColor[2] = b;
}
//}}}
//}}}

