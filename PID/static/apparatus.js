//Apparatus
var Apparatus = function(width, height) {
	//this.scale = 100.0;
	this.width = width;
	this.height = height;
	this.color = "rgb(31, 191, 191)";
	// this.init();
	// this.init2();
};
Apparatus.prototype.init2= function() {
	this.scale=Number(scale.value);
	this.M=Number(M.value);
	this.m =Number(m.value) ;
	this.l =Number(l.value); 
	this.g = Number(g.value);
	this.fdown = Number(fdown.value);
	this.fup = Number(fup.value);
	this.uz = Number(uz.value);
	this.uth = Number(uth.value);
	this.x0 = Number(x0.value);
	this.theta0 = Number(th0.value);
	this.K =[Number(K1.value),Number(K2.value),Number(K3.value),Number(K4.value)];
	// doc=document.ele.elements;
	// this.scale = Number(doc[0].value);
    // this.M = Number(doc[1].value); // [kg]
	// this.m = Number(doc[2].value); // [kg]
	// this.l = Number(doc[3].value); // [m]
	// this.g = Number(doc[4].value); // [m/sec^2]
	// this.fdown = Number(doc[5].value); // [N]
	// this.fup = Number(doc[6].value); // [N]
	// this.uz = Number(doc[7].value); // [N]
	// this.uth = Number(doc[8].value); // [N]
	// this.x0 = Number(doc[9].value); // [N]
	// this.theta0 = Number(doc[10].value); // [N]
	// this.K = [Number(doc[11].value),Number(doc[12].value),Number(doc[13].value),Number(doc[14].value)]; // [N]
	//htmlを書き換えるたびにloadして図を変えていきたい
};


Apparatus.prototype.init1 = function() {
	this.canvasx0 = MainFrame.WIDTH / 2.0;
	this.canvasy0 = MainFrame.HEIGHT - this.height - 160;
	// x0=0;
	// theta0 = Math.random() * 0.02 - 0.01;
	// this.x = x0;
	// this.theta=theta0+1.57;
	this.x=this.x0;
	this.theta=this.theta0;
	this.dx = 0.0;
	this.dtheta = 0.0;
	this.tau = 0.02; // [sec]
	//グラフのための配列
	this.xarray=[];
	this.tharray=[];
	this.dxarray = [];
	this.dtharray = [];
	this.farray=[]
	this.timearray=[]
	this.xarray.push(this.x);
	this.tharray.push(this.theta);
	this.dxarray.push(this.dx);
	this.dtharray.push(this.dtheta);
	this.farray.push(0)
	this.timearray.push(0);
}

Apparatus.prototype.move = function(action) {
	var uz=this.uz;
	var uth=this.uth;
	var J=(this.m*this.l*this.l)/3
	var I=J+this.m*this.l*this.l
	// var ff = this.fdown * action
	var ff = this.K[0]*this.x+this.K[1]*this.dx+this.K[2]*this.theta+this.K[3]*this.dtheta+this.fdown*action
	var torque=2*this.l*this.fup*action
	var sinTheta = Math.sin(this.theta);
	var cosTheta = Math.cos(this.theta);
	var R=(this.m*this.m*this.l*this.l*cosTheta*cosTheta)-I*(this.M+this.m)
	var ddx = (-I*ff-I*this.dtheta*this.dtheta*this.m*this.l*sinTheta+this.m*this.m*this.l*this.l*this.g*sinTheta*cosTheta+this.m*this.m*this.l*this.l*this.dx*this.dtheta*sinTheta*cosTheta+I*uz*this.dx-this.m*this.l*cosTheta*uth*this.dtheta+this.m*(this.m+this.M)*this.l*cosTheta*torque)/R;
	var ddtheta =(this.m*this.l*cosTheta*ff+this.m*this.m*this.l*this.l*sinTheta*cosTheta*this.dtheta*this.dtheta-(this.M+this.m)*this.m*this.l*this.g*sinTheta-(this.M+this.m)*this.m*this.l*this.dx*this.dtheta*sinTheta+(this.M+this.m)*uth*this.dtheta-this.m*this.l*cosTheta*uz*this.dx-(this.m*this.M)*torque)/R ;
	this.x += this.dx * this.tau;
	this.dx += ddx * this.tau;
	this.dtheta += ddtheta * this.tau;
	this.theta += this.dtheta * this.tau;
	this.xarray.push(this.x);
	this.tharray.push(this.theta);
	this.dxarray.push(this.dx);
	this.dtharray.push(this.dtheta);
	this.farray.push(ff);
};

Apparatus.prototype.drawCart = function(ctx) {
	var width=this.width*this.scale/100
	var height=this.height*this.scale/100
	var l=this.l*this.scale
	var x=this.x*this.scale
	var tmpx = this.canvasx0 + x  - width / 2.0;
	var tmpy = this.canvasy0;
	var r = height / 5.0;
	ctx.globalCompositeOperation = "source-over";
	ctx.clearRect(0,0,MainFrame.WIDTH,MainFrame.HEIGHT);
    ctx.fillStyle = "rgb(191, 191, 191)";
    ctx.fillRect(0, tmpy+height, MainFrame.WIDTH, MainFrame.HEIGHT - tmpy - height);
	ctx.fillStyle = "rgb(31, 191, 191)";
	ctx.fillRect(tmpx, tmpy, width,height - r);
	ctx.fillStyle = "rgb(127, 127, 127)";
	ctx.beginPath();
	ctx.arc(tmpx + width/4.0, tmpy + height - r, r, 0.0, Math.PI*2.0, true);
    ctx.fill();
	ctx.beginPath();
	ctx.arc(tmpx + 3*width/4.0, tmpy + height - r, r, 0.0, Math.PI*2.0, true);
    ctx.fill();
	ctx.strokeStyle = "rgb(0, 0, 0)";
	ctx.lineWidth = 1;
	ctx.strokeStyle="rgb(255,0,191)"
	ctx.beginPath();
	ctx.moveTo(tmpx + width / 2.0, tmpy);
	ctx.lineTo(tmpx + width / 2.0 + 2.0 * l * Math.sin(this.theta),
		tmpy - 2.0 * l  * Math.cos(this.theta));
	ctx.stroke();
};
//縮尺を変えるときに台車の大きさも変えたほうがいい

//計算はpythonのodeintでやったほうがいいかも
//こうすると途中で外力を加えられなくなる
