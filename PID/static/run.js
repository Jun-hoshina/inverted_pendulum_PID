// var outerDiv;
// var canvasDiv;
var ctx;
var cart;
var action = 0;
var time = 0;
let keydown = '';
// var episode = 1;
// var record = 0;
var MainFrame = {
    WIDTH: 800,
    HEIGHT: 480
};
var ApparatusAction = {
    LEFT: -1,
    RIGHT: 1,
    NONE: 0
};
var timerID;

window.addEventListener('load', init)

//ここにdocument.getelementbyid
scale = document.getElementById('scale')
M = document.getElementById('M')
m = document.getElementById('m')
l = document.getElementById('l')
g = document.getElementById('g')
fdown = document.getElementById('fdown')
fup = document.getElementById('fup')
uz = document.getElementById('uz')
uth = document.getElementById('uth')
x0 = document.getElementById('x0')
th0 = document.getElementById('th0')
K1 = document.getElementById('K1')
K2 = document.getElementById('K2')
K3 = document.getElementById('K3')
K4 = document.getElementById('K4')
action0 = document.getElementsByName('action')[0]
action1 = document.getElementsByName('action')[1]

function init() {
    chg4();
    time = 0;
    timeUpdate();
    cart = new Apparatus(100, 50);
    var canvas = document.getElementById('tutorial');
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        cart.init2();
        cart.init1();
        init3();
        disable(0)
        cart.drawCart(ctx);
    }
};
function run() {
    timeUpdate();
    onDocKeyDown();
    cart.move(action);
    cart.drawCart(ctx);
    time += cart.tau;
    cart.timearray.push(time);
    time = Math.round(time * 100) / 100
}

function onDocKeyDown() {
    document.body.addEventListener('keydown', e => {
        keydown = e.key;
    });
    document.body.addEventListener('keyup', e => {
        keydown = '';
    });
    if (keydown == "ArrowRight") {
        action = ApparatusAction.RIGHT;
    } else if (keydown == "ArrowLeft") {
        action = ApparatusAction.LEFT;
    } else {
        action = 0;
    }
};

function chg1() {
    document.myForm.play.disabled = "true";
    document.myForm.pause.disabled = "";
    document.myForm.quit.disabled = ""
}

function chg3() {
    document.myForm.play.disabled = "";
    document.myForm.pause.disabled = "true";
    document.myForm.quit.disabled = ""
}

function chg4() {
    document.myForm.play.disabled = "";
    document.myForm.pause.disabled = "true";
    document.myForm.quit.disabled = "true"
    time = 0;
    timeUpdate();
    //なんかtimeupdateが機能しないんだが
}

function initdraw() {
    cart.init2();
    cart.init1();
    cart.drawCart(ctx);
}

function init3() {
    // document.getElementById('scale').addEventListener('change', initdraw)
    // document.getElementById('M').addEventListener('change', initdraw)
    // document.getElementById('m').addEventListener('change', initdraw)
    // document.getElementById('l').addEventListener('change', initdraw)
    // document.getElementById('g').addEventListener('change', initdraw)
    // document.getElementById('fdown').addEventListener('change', initdraw)
    // document.getElementById('fup').addEventListener('change', initdraw)
    // document.getElementById('uz').addEventListener('change', initdraw)
    // document.getElementById('uth').addEventListener('change', initdraw)
    // document.getElementById('x0').addEventListener('change', initdraw)
    // document.getElementById('th0').addEventListener('change', initdraw)
    // document.getElementById('K1').addEventListener('change', initdraw)
    // document.getElementById('K2').addEventListener('change', initdraw)
    // document.getElementById('K3').addEventListener('change', initdraw)
    // document.getElementById('K4').addEventListener('change', initdraw)
    // document.getElementsByName('action')[0].addEventListener('change', { value: 0, handleEvent: radio })
    // document.getElementsByName('action')[1].addEventListener('change', { value: 1, handleEvent: radio })

    scale.addEventListener('change', initdraw)
    M.addEventListener('change', initdraw)
    m.addEventListener('change', initdraw)
    l.addEventListener('change', initdraw)
    g.addEventListener('change', initdraw)
    fdown.addEventListener('change', initdraw)
    fup.addEventListener('change', initdraw)
    uz.addEventListener('change', initdraw)
    uth.addEventListener('change', initdraw)
    x0.addEventListener('change', initdraw)
    th0.addEventListener('change', initdraw)
    K1.addEventListener('change', initdraw)
    K2.addEventListener('change', initdraw)
    K3.addEventListener('change', initdraw)
    K4.addEventListener('change', initdraw)
    action0.addEventListener('change', { value: 0, handleEvent: radio })
    action1.addEventListener('change', { value: 1, handleEvent: radio })
}

function disable(flag) {
    scale.disabled = flag;
    M.disabled = flag;
    m.disabled = flag;
    l.disabled = flag;
    g.disabled = flag;
    uz.disabled = flag;
    uth.disabled = flag;
    x0.disabled = flag;
    th0.disabled = flag;
    action0.disabled = flag;
    action1.disabled = flag;
    if (flag == 1) {

        fdown.disabled = flag;
        fup.disabled = flag;
        K1.disabled = flag;
        K2.disabled = flag;
        K3.disabled = flag;
        K4.disabled = flag;
    }
    else {
        if (action0.checked == 1) {
            radio(0);
        } else {
            radio(1);
        }
    }

}

function radio(i) {
    if (typeof (i) != "number") {
        i = this.value;
    }
    //ラジオ場単だけ変えて他のフォームを変えていない時には
    //=0としたところがそのまま残ってしまうためinit2が必要
    cart.init2();
    if (i == 0) {
        //PID
        fdown.disabled = 1;
        fup.disabled = 0;
        K1.disabled = 0;
        K2.disabled = 0;
        K3.disabled = 0;
        K4.disabled = 0;
        cart.fdown = 0; // [N]
    } else {
        //手動
        fdown.disabled = 0;
        fup.disabled = 1;
        K1.disabled = 1;
        K2.disabled = 1;
        K3.disabled = 1;
        K4.disabled = 1;
        cart.K = [0, 0, 0, 0]; // [N]
        cart.fup = 0; // [N]
    }
}
// addEventListenerでradioを指定するとかどう?

function timeUpdate() {
    document.getElementById("time").innerHTML = "time: " + time;
}

function draw() {
    array = [cart.xarray, cart.dxarray, cart.tharray, cart.dtharray, cart.farray]
    label = ["位置 x[m]", "速度 dx[m/s]", "角度 θ[rad]", "角速度 dθ[rad/s]", "力 f[N]"]
    canvasarray = ["canvas_1", "canvas_2", "canvas_3", "canvas_4", "canvas_5"]
    for (var j = 0; j < 5; j++) {
        var data = [];
        var t = 0;
        for (var i = 0; i < array[j].length; i++) {
            // 配列に格納
            data.push({ x: cart.timearray[i], y: array[j][i] });
        }
        var ctx = document.getElementById(canvasarray[j]).getContext('2d');
        var chart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        data: data,
                        // pointBorderColor: 'rgb( 128, 0, 0)',	//点の枠線の色	色
                        // pointBackgroundColor: 'rgb( 128, 0, 0)',	//点の塗りつぶしの色	色
                        pointRadius: 0,	//点の大きさ	数値（0で点を描画しない）
                        borderColor: 'rgb( 255, 0, 0)',	//線の色	色
                        borderWidth: 1,	//線の太さ
                        // マーカー 背景色
                        backgroundColor: 'rgba( 0, 0, 0, 0)',
                        label: label[j]
                    }
                ]
            },
            options: {
                // responsive: false,
                legend: {
                    display: false
                },
                scales: {                          // 軸設定
                    xAxes: [                           // Ｘ軸設定
                        {
                            scaleLabel: {                 // 軸ラベル
                                display: true,                // 表示設定
                                labelString: '時間(s)',    // ラベル
                                fontColor: "red",             // 文字の色
                                fontSize: 16                  // フォントサイズ
                            }
                            // ,
                            // gridLines: {                   // 補助線
                            //     color: "rgba(255, 0, 0, 0.2)", // 補助線の色
                            // },
                            // ticks: {                      // 目盛り
                            //     fontColor: "red",             // 目盛りの色
                            //     fontSize: 14                  // フォントサイズ
                            // }
                        }
                    ],
                    yAxes: [                           // Ｙ軸設定
                        {
                            scaleLabel: {                  // 軸ラベル
                                display: true,                 // 表示の有無
                                labelString: label[j],     // ラベル
                                // fontFamily: "sans-serif",
                                fontColor: "red",             // 文字の色
                                fontSize: 16                   // フォントサイズ
                            }
                            // ,
                            // gridLines: {                   // 補助線
                            //     color: "rgba(0, 0, 255, 0.2)", // 補助線の色
                            //     zeroLineColor: "black"         // y=0（Ｘ軸の色）
                            // },
                            // ticks: {                       // 目盛り
                            //     min: 0,                        // 最小値
                            //     max: 25,                       // 最大値
                            //     stepSize: 5,                   // 軸間隔
                            //     fontColor: "blue",             // 目盛りの色
                            //     fontSize: 14                   // フォントサイズ
                            // }
                        }
                    ]
                }
            }




        });
    }
}

//jsでグラフはかけないのだろうか
// 制御している途中で力を加えたときに反映されて，それをグラフにも描けたらいいな
//quitのボタンを押したらそのepisodeを終えてグラフを表示する

//制御時と手動時でラジオボタンとかで切り替えられればいい
//このとき，加える力fとゲインKのhtml入力を制限する


//振子に加える力の運動方程式
//ウィジェット変数　ラジオボタンとも連動
//グラフを5つ描く　関数を作る　グラフが大きすぎる
//canvasを最初(loadしたとき)は表示しないようにする
//制御していない時の挙動が変