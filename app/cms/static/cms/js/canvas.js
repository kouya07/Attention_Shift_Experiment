const canvas = new fabric.Canvas('canvas', {width: 1200, height: 700, selection: false});
const obj_length = 100; // 一辺の長さ Length of one side of object
let obj_side, obj_A, obj_B, circle, rect, triangle, star, hexagon, line, correct, not_correct, error, error1, error2, gazing_point, gazing_point1, gazing_point2;
let button_frame, a, b, c, bar_frame, slider; // Variable for Control_Option
let r; // Array for displaying in obj_A and obj_B
let mouse_event;
let left_limit = 200, frame_limit = 0;
let trial = 100, trial_count = 0, random_rate = 0, object_height = 450;
let trial_array = Array.apply(null, Array(trial)).map(function () {return 1 });
let hint_option = false, random_option = false, control_option = false;

line = new fabric.Line([0, 700, 0, 0], {top: 0, left: 200, stroke: 'black', selectable: false});
correct = new fabric.Text('✔', {fill: 'green', fontSize: 80, top: 150, left: 650, selectable: false});
not_correct = new fabric.Text('✖', {fill:'red', fontSize: 80, top: 150, left: 650, selectable: false});
error1 = new fabric.Text('error' , {fill:'red', fontSize: 80, top: 150, left: 600, selectable: false});
error2 = new fabric.Text('please drag about bar' , {fill:'red', fontSize: 30, top: 250, left: 550, selectable: false});
error = new fabric.Group([error1, error2], {});
gazing_point1 = new fabric.Line([0, 50, 0, 0], {top: 125, left: 600, stroke: 'black'});
gazing_point2 = new fabric.Line([0, 0, 50, 0], {top: 150, left: 575, stroke: 'black'});
gazing_point = new fabric.Group([gazing_point1, gazing_point2], {selectable: false});

// object to drag the block in a bounded tunnel
button_frame = new fabric.Rect({width: 100, height: 100, top: 400, fill: 'rgba(128,128,128,0.8)', strokeWidth: 1.5, stroke: 'black'});
a = new fabric.Line([60, 0, 0, 0], {top: 430, left: 20, stroke: 'rgba(128,128,128,1)', strokeWidth: 2});
b = new fabric.Line([60, 0, 0, 0], {top: 450, left: 20, stroke: 'rgba(128,128,128,1)', strokeWidth: 2});
c = new fabric.Line([60, 0, 0, 0], {top: 470, left: 20, stroke: 'rgba(128,128,0128,1)', strokeWidth: 2});
bar_frame = new fabric.Rect({width: 750, height: 100, fill: 'rgba(0,0,0,0)', top: 500, left: 400, strokeWidth: 1, stroke: 'black', selectable: false});

circle = new fabric.Circle({name: 'select_obj_circle', radius: 50});
rect = new fabric.Rect({name: 'select_obj_rect', width: obj_length, height: obj_length});
triangle = new fabric.Triangle({name: 'select_obj_triangle', width: obj_length, height: obj_length});
star = new fabric.Star({name: 'select_obj_star', numPoints: 5, innerRadius:25, outerRadius: 50});
hexagon = new fabric.Polygon([{x:0,y:-55},{x:47,y:-26.5},{x:47,y:26.5},{x:0,y:55},{x:-47,y:26.5},{x:-47,y:-26.5}], {name: 'select_obj_hexagon'});
hexagon.height =110;

const array = [circle, rect, triangle, star, hexagon];
for (let i = 0; i < array.length; i++) {
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
    /* if trial_array[?] = 0 -> obj_A != obj_B
       if trial_array[?] = 1 -> obj_A = obj_B */
    switch (trial_array[trial_count]) {
        case 0:
            r = RandomArray(2);
            break;

        case 1:
            let f = $.extend({}, array[Math.floor(Math.random() * array.length)]);
            r = Array.apply(null, Array(2)).map(function () {return f });
            break;
    }

    if (trial_count === trial) logout();

    trial_count++;

    // 固定オブジェクト Fixed object Coordinate
    obj_A = $.extend({}, r[0]);
    obj_A.fill = 'rgba(255,127,0,0.2)';
    obj_A.top = object_height;
    obj_A.left = 1000;
    obj_A.name = obj_A.name.substr(11);

    // 動く方のオブジェクト Moving object Coordinate
    obj_B = $.extend({}, r[1]);
    obj_B.fill = 'rgba(0,160,240,1)';
    obj_B.top = object_height;
    obj_B.left = 400;
    obj_B.name = obj_B.name.substr(11);
    obj_B.lockMovementX =  false;
    obj_B.lockMovementY = false;

    if (!control_option) {
        slider  = new fabric.Group([$.extend({}, button_frame), $.extend({}, a), $.extend({}, b), $.extend({}, c)], {name: 'slider', top: 500, left: 400, hasControls: false, hasBorders: false, lockMovementY: true, objectCaching: false});
        canvas.add(bar_frame, slider);
    }

    if (random_option) {
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
    if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
        return;
    }
    obj.setCoords();
    // top-left  corner
    if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < left_limit){
        obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
        obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left+left_limit);
    }
    // bot-right
    if (obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width-frame_limit){
        obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
        obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left-frame_limit);
    }

    if (!control_option && canvas.getActiveObject() != obj_B) obj_B.left = slider.left;
});

// オブジェクトの選択（変更） Object selection (Change)
function ChangeObj(active_obj) {
    canvas.remove(obj_B);

    obj_B = $.extend({}, active_obj);
    obj_B.name = obj_B.name.substr(11);
    obj_B.fill = 'rgba(0,160,240,1)';
    obj_B.top = object_height;
    obj_B.left = 400;
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

    for (let n = m-1; n >= 0; n--) {
        let i = Math.random() * l | 0;
        r[n] = t[i] || array[i];
        --l;
        t[i] = t[l] || array[l];
    }
    return r;
}

// ランダム率分の0を格納 Store 0 (e.g. trial*random_rate/100 -> 100times * 20% = 20times)
function TrialArray() {
    for (let i = trial*random_rate/100; i > 0; i--) {
        let m = Math.floor(Math.random() * trial);

        if (trial_array[m] !== 0) trial_array[m] = 0;
        else i++;
    }
    // console.log(trial*random_rate/100, trial_array);
}
