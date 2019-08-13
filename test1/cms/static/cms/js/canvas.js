const canvas = new fabric.Canvas('canvas', {width: 1200, height: 700, selection: false});
const obj_length = 100; // 一辺の長さ Length of a side
let obj_side, obj_A, obj_B, circle, rect, triangle, star, hexagon, line, correct, not_correct, error, error1, error2;
let a, b, c, d, adjustment_obj, frame, slider; // Variable for Control_Option
let r; // Array for displaying in obj_A and obj_B
let mouse_event;
let left_limit = 200, frame_limit = 0;
let round = 10, round_count = 0;
let random_rate = 0;
let round_array = Array.apply(null, Array(round)).map(function () {return 1 });

let hint_option = false, random_option = false, control_option = false;

line = new fabric.Line([0, 700, 0, 0], {top: 0, left: 200, stroke: 'black', selectable: false});
correct = new fabric.Text('✔', {fill: 'green', fontSize: 80, top: 150, left: 650, selectable: false});
not_correct = new fabric.Text('✖', {fill:'red', fontSize: 80, top: 150, left: 650, selectable: false});
error1 = new fabric.Text('error' , {fill:'red', fontSize: 80, top: 150, left: 600, selectable: false});
error2 = new fabric.Text('please drag about bar' , {fill:'red', fontSize: 30, top: 250, left: 550, selectable: false});
error = new fabric.Group([error1, error2], {});

// object to drag the block in a bounded tunnel
a = new fabric.Rect({width: 100, height: 100, top: 400, fill: 'rgba(128,128,128,0.8)', strokeWidth: 1.5, stroke: 'black'});
b = new fabric.Line([60, 0, 0, 0], {top: 430, left: 20, stroke: 'rgba(128,128,128,1)', strokeWidth: 2});
c = new fabric.Line([60, 0, 0, 0], {top: 450, left: 20, stroke: 'rgba(128,128,128,1)', strokeWidth: 2});
d = new fabric.Line([60, 0, 0, 0], {top: 470, left: 20, stroke: 'rgba(128,128,0128,1)', strokeWidth: 2});
adjustment_obj = new fabric.Line([0, 0, 0, 0], {top: 0, left: 0, stroke: 'rgba(128,128,0128,1)', strokeWidth: 2}); // 座標調節用
frame = new fabric.Rect({width: 850, height: 100, fill: 'rgba(0,0,0,0)', top: 500, left: 300, strokeWidth: 1, stroke: 'black', selectable: false});

circle = new fabric.Circle({name: 'circle', radius: 50});
rect = new fabric.Rect({name: 'rect', width: obj_length, height: obj_length});
triangle = new fabric.Triangle({name: 'triangle', width: obj_length, height: obj_length});
star = new fabric.Star({name: 'star', numPoints: 5, innerRadius:25, outerRadius: 50});
hexagon = new fabric.Polygon([{x:0,y:-55},{x:47,y:-26.5},{x:47,y:26.5},{x:0,y:55},{x:-47,y:26.5},{x:-47,y:-26.5}], {name: 'hexagon'});
hexagon.height =110;

const array = [circle, rect, triangle, star, hexagon];
for(let i = 0; i < array.length; i++) {
    let top = 25 + 135 * i;
    array[i].strokeWidth = 1.5;
    array[i].stroke = 'black';
    array[i].fill = 'green';
    array[i].top = top;
    array[i].left = 50;
    array[i].lockMovementX = true;
    array[i].lockMovementY = true;
    array[i].hasControls = false;
    array[i].hasBorders = false;
    array[i].objectCaching = false;
}

function Init() {
    /* if round_array[?] = 0 -> obj_A != obj_B
       if round_array[?] = 1 -> obj_A = obj_B */
    if(round_array[round_count] === 0) {
        r = RandomArray(2);
    } else if (round_array[round_count] === 1) {
        let f = $.extend({}, array[Math.floor(Math.random() * array.length)]);
        r = Array.apply(null, Array(2)).map(function () {return f });
    }

    if(round_count === round) logout();

    // 固定オブジェクト Fixed object Coordinate
    obj_A = $.extend({}, r[0]);
    obj_A.fill = 'rgba(255,127,0,0.2)';
    obj_A.top = 300;
    obj_A.left = 1000;

    // 動く方のオブジェクト Moving object Coordinate
    obj_B = $.extend({}, r[1]);
    obj_B.fill = 'rgba(0,160,240,1)';
    obj_B.top = 300;
    obj_B.left = 300;
    obj_B.lockMovementX =  false;
    obj_B.lockMovementY = false;

    round_count++;
    startTime = Date.now();

    if(control_option) {
    slider  = new fabric.Group([$.extend({}, a), $.extend({}, b), $.extend({}, c), $.extend({}, d)], {name: 'slider', top: 500, left: 300, hasControls: false, hasBorders: false, lockMovementY: true, objectCaching: false});
    canvas.add(frame, slider);
    }

    if(random_option) {
        canvas.add(obj_A, obj_B, line);
        RandomOption();
    } else {
        canvas.add(obj_A, obj_B, circle, rect, triangle, star, hexagon, line);
    }
}

canvas.observe({'mouse:move': function (e) {
    mouse_event = 'move';
    CursorLog(e, mouse_event);
}});

canvas.observe({'mouse:down': function (e) {
    mouse_event = 'down';
    CursorLog(e, mouse_event);
}});

canvas.observe({'mouse:up': function (e) {
    mouse_event = 'up';
    CursorLog(e, mouse_event);
}});

// オブジェクトの移動制限 Object movement limit
canvas.on('object:moving', function (e) {
    let obj = e.target;

    // if object is too big ignore
    if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
        return;
    }
    obj.setCoords();
    // top-left  corner
    if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < left_limit){
        obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
        obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left+left_limit);
    }
    // bot-right
    if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width-frame_limit){
        obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
        obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left-frame_limit);
    }

    if(control_option && canvas.getActiveObject() != obj_B) obj_B.left = slider.left;
});

// オブジェクトの選択（変更） Object selection (Change)
function ChangeObj(active_obj) {
    canvas.remove(obj_B);

    obj_B = $.extend({}, active_obj);
    obj_B.fill = 'rgba(0,160,240,1)';
    obj_B.top = 300;
    obj_B.left = 300;
    obj_B.lockMovementX = false;
    obj_B.lockMovementY = false;

    canvas.add(obj_B);
}

// サイドのオブジェクトをランダムに配置させる Place side objects randomly
function RandomOption() {
    let top = 25;
    let r = RandomArray(array.length);

    for (let i = 0; i < array.length; i++) {
        obj_side = $.extend({}, r[i]);
        obj_side.top = top;
        canvas.add(obj_side);
        top += 135;
    }
}

// 重複なしのランダム配列を作成 Create random array without duplicates
function RandomArray(m) {
    let t = [];
    let r = [];
    let l = array.length;

    for(let n = m-1; n >= 0; n--) {
        let i = Math.random() * l | 0;
        r[n] = t[i] || array[i];
        --l;
        t[i] = t[l] || array[l];
    }
    return r;
}

// ランダム率分の0を格納 Store 0 (e.g. round*random_rate/100 -> 100times * 20% = 20times)
function RoundArray() {
    for(let i = round*random_rate/100; i > 0; i--) {
        let m = Math.floor(Math.random() * round);
        if(round_array[m] !== 0) round_array[m] = 0;
        else i++;
    }
    console.log(round*random_rate/100, round_array);
}
