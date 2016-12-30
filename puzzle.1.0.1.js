/**
 * page-scroll 1.0.2
 * https://github.com/zhouxitian/puzzle
 * author:zhouxitian@163.com
 */
;(function(window,undefined){
	myPuzzle=function(opt){
		var t=this;
		t.options={
			id:"game",
			pic:"images/p1.jpg",//图片
			x:4,//列
			y:3,//行
			hard:5,//最大难度最好不要大于总格数的一半
			duration:100,//毫秒
			startInit:null,//每次重新开始游戏时的回调(相当于初始化)
			stepStart:null,//每步开始移动时的回调
			finish:null,//游戏完成后的回调
			stepEnd:null//每走一步后的回调
		};
		t.extend(t.options,opt);
		t.container=t.getId(t.options.id);
		t.length=t.options.x*t.options.y;
		t.current={};//当前拖动的元素信息
		//t.moveChild={};//需要移动的元素的信息
		t.move=true;//当前的移动对象是否li
		t.isMove=false;//是否能移动
		t.init();
	}
	myPuzzle.prototype={
		init:function(){
			var t=this;
			t.createGrid();//排序
			t.touch=new myTouch({//滑屏
				wrapper:"#"+t.wid,
				start:function(e){
					e=e||window.event;
					t.touchChild=e.target||e.srcElement;
					t.move=true;
					if(t.touchChild.nodeName.toLowerCase()!="li"){
						t.move=false;
					}
					t.checkMove=false;//是否需要检查 是否能移动
					t.isMove=false;//是否能移动
					if(t.move){
						t.touchChild.style.transitionDuration="0ms";
						t.current.index=parseInt(t.touchChild.getAttribute("index"));
						t.current.x=t.position[t.current.index].x*t.cWidth;
						t.current.y=t.position[t.current.index].y*t.cHeight;
						t.current._x=t.position[t.current.index]._x*t.cWidth;
						t.current._y=t.position[t.current.index]._y*t.cHeight;
					}
				}
			});
			t.start();
			t.touch.moveX=t.touch.moveY=function(){
				if(t.move){
					var _t=this,MoveXY=0;
					if(!t.checkMove){//判断移动方向
						if(_t.x){
							if(_t.changeX<0){
								t.direction="left";
							}else if(_t.changeX>0){
								t.direction="right";
							}
							MoveXY=_t.changeX;
						}else if(_t.y){
							if(_t.changeY<0){
								t.direction="up";
							}else if(_t.changeY>0){
								t.direction="down";
							}
							MoveXY=_t.changeY;
						}
						t.isMove=t.canMove(t.position[t.current.index]._index,t.direction);
						if(t.isMove){//能移动才触发 每步的开始回调
							t.options.stepStart&&t.options.stepStart.call(t);
						}
						//console.log(t.position[t.index]);
						//console.log(t.getRadomPosition(t.position[t.index]._index))
						t.checkMove=true;
					}else{//限制移动范围
						if(_t.x){
							if(t.direction=="left"){
								MoveXY=_t.changeX<-t.cWidth?-t.cWidth:(_t.changeX>0?0:_t.changeX);
							}else{
								MoveXY=_t.changeX>t.cWidth?t.cWidth:(_t.changeX<0?0:_t.changeX);
							}
						}else if(_t.y){
							if(t.direction=="up"){
								MoveXY=_t.changeY<-t.cHeight?-t.cHeight:(_t.changeY>0?0:_t.changeY);
							}else{
								MoveXY=_t.changeY>t.cHeight?t.cHeight:(_t.changeY<0?0:_t.changeY);
							}
						}
					}
					if(t.isMove){
						if(_t.x){
							t.touchChild.style.cssText='transition-duration:0ms;-webkit-transition-duration:0ms;z-index:2;left:'+(t.current._x+MoveXY)+'px;top:'+t.current._y+'px;background-position: -'+t.current.x+'px -'+t.current.y+'px;';
						}else if(_t.y){
							t.touchChild.style.cssText='transition-duration:0ms;-webkit-transition-duration:0ms;z-index:2;left:'+t.current._x+'px;top:'+(t.current._y+MoveXY)+'px;background-position: -'+t.current.x+'px -'+t.current.y+'px;';
						}
					}	
				}
			}
			t.touch.endX=t.touch.endY=function(){
				if(t.move&&t.isMove){
					var _t=this,xy,_x=t.position[t.current.index]._x,_y=t.position[t.current.index]._y,_index=t.position[t.current.index]._index;
					if(_t.x){
						xy=t.position[t.index]._x*t.cWidth;
						t.touchChild.style.cssText='transition-duration:'+t.options.duration+'ms;-webkit-transition-duration:'+t.options.duration+'ms;z-index:0;left:'+xy+'px;top:'+t.current._y+'px;background-position: -'+t.current.x+'px -'+t.current.y+'px;';
					}else if(_t.y){	
						xy=t.position[t.index]._y*t.cHeight;
						t.touchChild.style.cssText='transition-duration:'+t.options.duration+'ms;-webkit-transition-duration:'+t.options.duration+'ms;z-index:0;left:'+t.current._x+'px;top:'+xy+'px;background-position: -'+t.current.x+'px -'+t.current.y+'px;';
					}
					//交换坐标
					t.position[t.current.index]._x=t.position[t.index]._x;
					t.position[t.current.index]._y=t.position[t.index]._y;
					t.position[t.current.index]._index=t.position[t.index]._index;
					t.position[t.index]._x=_x;
					t.position[t.index]._y=_y;
					t.position[t.index]._index=_index;
					var win=true;
					for(var i=t.position.length;i--;){
						if(t.position[i].index!=t.position[i]._index){
							win=false;
							break;
						}
					}
					t.touch.moveing=true;
					t.step++;
					if(win){
						setTimeout(function(){
							t.removeClass(t.visible,"hidden");
							t.options.finish&&t.options.finish.call(t);
						},t.options.duration);
					}else{
						setTimeout(function(){
							t.touch.moveing=false;
							t.options.stepEnd&&t.options.stepEnd.call(t);
						},t.options.duration);	
					}
					//console.log("curIndex:"+t.position[t.current.index]._index+",cur.x:"+t.position[t.current.index]._x+",cur.y:"+t.position[t.current.index]._y+",Index:"+t.position[t.index]._index+",x:"+t.position[t.index]._x+",y:"+t.position[t.index]._y+"t.index:"+t.index);
				}
			}
		},
		start:function(){
			var t=this;
			t.position=new Array();//记录每个移动元素的坐标
			t.positionM=new Array();//记录移动后的元素
			t.step=0;//记录移动的步数
			if(t.visible){
				t.removeClass(t.visible,"hidden");
			}
			for(var i=0;i<t.length;i++){
				var x=i%t.options.x;
				var y=Math.floor(i/t.options.x);
				t.position.push({index:i,x:x,y:y,_index:i,_x:x,_y:y});
				t.positionM.push(i);
				x=x*t.cWidth;
				y=y*t.cHeight;
				t.wrapper.children[i].style.cssText='left:'+x+'px;top:'+y+'px;transition-duration:0ms;-webkit-transition-duration:0ms;background-position: -'+x+'px -'+y+'px;';
			}
			t.setGrid();//抽空一格
			t.upSet();//打乱
			t.touch.moveing=false;
			t.options.startInit&&t.options.startInit.call(t);
		},
		refresh:function(){
			var t=this;
			t.width=parseInt(t.getStyles(t.container,"width"));
			t.height=parseInt(t.getStyles(t.container,"height"));
			t.cWidth=t.width/t.options.x;
			t.cHeight=t.height/t.options.y;
			for(var i=t.length;i--;){
				x=t.position[i].x*t.cWidth;//原始x坐标
				y=t.position[i].y*t.cHeight;//原始y坐标
				_x=t.position[i]._x*t.cWidth;//移动x坐标
				_y=t.position[i]._y*t.cHeight;//移动y坐标
				t.wrapper.children[i].style.cssText='left:'+_x+'px;top:'+_y+'px;background-position:-'+x+'px -'+y+'px;';
			}
		},
		createGrid:function(){//排序
			var t=this;
			t.width=parseInt(t.getStyles(t.container,"width"));
			t.height=parseInt(t.getStyles(t.container,"height"));
			t.cWidth=t.width/t.options.x;
			t.cHeight=t.height/t.options.y;
			var position=t.getStyles(t.container,"position");
			if(position=="static"){
				t.container.style.position="relative";
			}
			var ul=document.createElement('ul');
			var data=new Date().getTime();
			t.wid="myPuzzle_"+data;
			ul.setAttribute("id",t.wid);
			var style={};
			style['#'+t.wid]='position:absolute;width:100%;height:100%;left:0;top:0;user-select:none;-webkit-user-select:none;';
			style['#'+t.wid+' li']='transition-property:left,top,opacity;transition-timing-function:linear;-webkit-transition-property:left,top,opacity;-webkit-transition-timing-function:linear;width:'+(100/t.options.x)+'%;height:'+(100/t.options.y)+'%;position:absolute;background-image:url('+t.options.pic+');background-repeat:no-repeat;background-size:'+t.options.x+'00% '+t.options.y+'00%;';
			style['#'+t.wid+' li.hidden']='visibility:hidden;opacity:0;';
			//style['#'+t.wid+' li.hidden']='opacity:0.5;';
			t.setCss(t.container,style);
			var html='';
			for(var i=0;i<t.length;i++){
				var x=i%t.options.x;
				var y=Math.floor(i/t.options.x);
				//t.position.push({index:i,x:x,y:y,_index:i,_x:x,_y:y});
				//t.positionM.push(i);
				x=x*t.cWidth;
				y=y*t.cHeight;
				html+='<li index='+i+'>'+i+'</li>';
			}
			ul.innerHTML=html;
			t.container.appendChild(ul);
			t.wrapper=t.getId(t.wid);
		},
		setGrid:function(){//随机空一格
			var t=this;
			var random=Math.round(Math.random()*(t.length-1));
			t.visible=t.wrapper.children[random];
			t.addClass(t.visible,"hidden");
			t.index=random;
			/*if(random==0){//左上角
				console.log(random,"左上角");
			}else if(random==(t.options.x-1)){//右上角
				console.log(random,"右上角");
			}else if(random==t.length-t.options.x){//左下角
				console.log(random,"左下角");
			}else if(random==t.length-1){//右下角
				console.log(random,"右下角");
			}else if(Math.floor(random/t.options.x)==0){//第一行
				console.log(random,"第一行");
			}else if(random%t.options.x==0){//左边
				console.log(random,"左边");
			}else if((random+1)%t.options.x==0){//右边
				console.log(random,"右边");
			}else if(Math.floor(random/t.options.x)==t.options.y-1){//最后一行
				console.log(random,"最后一行");
			}else{
				console.log(random,"中间");
			}*/
			//t.moveObj=t.getRadomPosition(random);//记录能移动的元素(下标，方向);
		},
		upSet:function(){//根据难度打乱排序
			var t=this;
			t.answer=new Array();//记录走法
			//var now=new Date().getTime();
			//var num=0;
			/**;(function(length){**/
				var answer=new Array();//记录移动方向
			/**	for(var i=length;i--;){**/
				for(var i=t.options.hard;i--;){
					var moveObj=t.getRadomPosition(t.position[t.index]._index);//记录能移动的元素(下标，方向);
					//console.log("能移动的坐标:");
					//console.log(moveObj);
					//console.log("随机："+random);
					//console.log(answer[answer.length-2]);
					var random=Math.ceil(Math.random()*moveObj.length)-1;//在能移动的元素里随机一个移动
					;(function(){//检查随机走向，修正使其不走重复的路径
						var length=answer.length;
						if(length>0){
							length--;
							//console.log("random:"+random);
							if((moveObj[random].direction=="up"&&answer[length]=="down")||(moveObj[random].direction=="down"&&answer[length]=="up")||(moveObj[random].direction=="left"&&answer[length]=="right")||(moveObj[random].direction=="right"&&answer[length]=="left")){
								//console.log("相邻方向相反:"+moveObj[random].direction,answer[length],random);
								if(random<moveObj.length-1){
									random++;
								}else{
									random=0;
								}
								//console.log("相邻方向相反:"+moveObj[random].direction,answer[length],random);
								arguments.callee();
							}else if(moveObj.length>2&&length>1&&((moveObj[random].direction=="up"&&answer[length-1]=="down")||(moveObj[random].direction=="down"&&answer[length-1]=="up")||(moveObj[random].direction=="left"&&answer[length-1]=="right")||(moveObj[random].direction=="right"&&answer[length-1]=="left"))){
								//console.log(moveObj,answer)
								for(var i=moveObj.length;i--;){
									if(i!=random//不取当前的
									&&!((moveObj[i].direction=="up"&&answer[length-1]=="down")||(moveObj[i].direction=="down"&&answer[length-1]=="up")||(moveObj[i].direction=="left"&&answer[length-1]=="right")||(moveObj[i].direction=="right"&&answer[length-1]=="left"))//随机方向对比上一个方向
									&&!((moveObj[i].direction=="up"&&answer[length]=="down")||(moveObj[i].direction=="down"&&answer[length]=="up")||(moveObj[i].direction=="left"&&answer[length]=="right")||(moveObj[i].direction=="right"&&answer[length]=="left"))){//随机方向对比前一个方向
										random=i;
										//console.log("相隔方向相反:"+moveObj[random].direction,random);
										break;
									}
								}
							}
						}
					})();	
					t.touchChild=t.container.querySelectorAll("li")[moveObj[random].index];
					//console.log(t.position[t.index].index+"换"+moveObj[random].index);
					t.answer.push(moveObj[random].index);
					answer.push(moveObj[random].direction);
					t.current.x=t.position[moveObj[random].index].x*t.cWidth;
					t.current.y=t.position[moveObj[random].index].y*t.cHeight;
					t.current._x=t.position[moveObj[random].index]._x*t.cWidth;
					t.current._y=t.position[moveObj[random].index]._y*t.cHeight;
					
					var xy,
					_x=t.position[moveObj[random].index]._x,//临时保存需交换的坐标
					_y=t.position[moveObj[random].index]._y,
					_index=t.position[moveObj[random].index]._index;
					
					if(moveObj[random].direction=="right"||moveObj[random].direction=="left"){
						xy=t.position[t.index]._x*t.cWidth;
						t.touchChild.style.cssText='transition-duration:0ms;-webkit-transition-duration:0ms;z-index:0;left:'+xy+'px;top:'+t.current._y+'px;background-position: -'+t.current.x+'px -'+t.current.y+'px;';
					}else{	
						xy=t.position[t.index]._y*t.cHeight;
						t.touchChild.style.cssText='transition-duration:0ms;-webkit-transition-duration:0ms;z-index:0;left:'+t.current._x+'px;top:'+xy+'px;background-position: -'+t.current.x+'px -'+t.current.y+'px;';
					}
					//交换移动后的坐标
					var aa=t.positionM[t.position[t.index]._index];
					//console.log("空"+t.positionM[t.position[t.index]._index]+"换"+_index+","+_index+"换"+aa);
					t.positionM[t.position[t.index]._index]=t.positionM[_index];
					t.positionM[_index]=aa;	
					//交换坐标
					t.position[moveObj[random].index]._x=t.position[t.index]._x;
					t.position[moveObj[random].index]._y=t.position[t.index]._y;
					t.position[moveObj[random].index]._index=t.position[t.index]._index;
					t.position[t.index]._x=_x;
					t.position[t.index]._y=_y;
					t.position[t.index]._index=_index;
				}
				//var rightAnswer=new Array();
				//num++;
				//计算难度
				/**;(function(length){//控制了随机走向后这里估计不会进入了。
					for(var i=0;i<length-1;i++){
						if(t.answer[i]==t.answer[i+1]){
							t.answer.splice(i,2);
							arguments.callee(t.answer.length);
							break;
						}
					}
				})(t.answer.length);
				//检查难度
				if(t.answer.length<t.options.hard){//控制了随机走向后这里估计不会进入了。
					//console.log("难道过低。重新打乱");
					console.log("难度")
					arguments.callee(t.options.hard-t.answer.length);
				}else{**/
					//console.log("打乱"+num+"次，花时："+((new Date().getTime()-now)/1000)+"s");
					t.answer.reverse();//=t.reverse(t.answer,t.answer.length-1,"");
					//console.log("走法路径："+t.answer);
			/**	}
			})(t.options.hard);**/
		},
		//递归反转数组(不改变原数组),arr数组;length数组长度;str:""(空字符串)
		reverse:function(arr,length,str){
			var t=this;
			return length==0?str+arr[0]:(t.reverse(arr,length-1,str+arr[length]+"=>"));
		},
		/**返回所有能移动的坐标信息
		***index:当前隐藏元素的下标
		**/
		getRadomPosition:function(index){
			var t=this;
			var arry=new Array();
			if(t.position[index].y>0){
				arry.push({index:t.positionM[index-t.options.x],direction:"down"});
			}
			if(t.position[index].x>0){
				arry.push({index:t.positionM[index-1],direction:"right"});
			}
			if(t.position[index].x<t.options.x-1){
				arry.push({index:t.positionM[index+1],direction:"left"});
			}
			if(t.position[index].y<t.options.y-1){
				arry.push({index:t.positionM[index+t.options.x],direction:"up"});
			}
			return arry;
		},
		/**判断是否能移动 
		***index:移动对象的下标 
		***direction移动方向 
		**/
		canMove:function(index,direction){
			var t=this,_index=t.position[t.index]._index;
			if((direction=="right"&&index==_index-1)||(direction=="left"&&index==_index+1)||(direction=="down"&&index==_index-t.options.x)||(direction=="up"&&index==_index+t.options.x)){
				return true;
			}
			return false;
		},
		extend:function(target,source){//拷贝不引用，改变拷贝的数组不会改变原数组
			var t=this;
			for (var p in source){
				if(t.getType(source[p])=="array"||t.getType(source[p])=="object"){
					target[p]=t.getType(source[p])=="array"?[]:{};
					arguments.callee(target[p],source[p]);
				}else{
					target[p] = source[p];
				}
			}
			return target;
		},
		getType:function(o)
		{
			var _t;
			return ((_t = typeof(o)) == "object" ? o==null && "null" || Object.prototype.toString.call(o).slice(8,-1):_t).toLowerCase();
		},
		getId:function(elemId){return document.getElementById(elemId);},
		getStyles:function(obj,name){
			if(window.getComputedStyle){
				var getStyles;
				if ( obj.ownerDocument.defaultView.opener ) {
					var computed =obj.ownerDocument.defaultView.getComputedStyle( obj, null );
					getStyles= computed.getPropertyValue(name)||computed[ name];
				}else{
					var computed =window.getComputedStyle( obj, null);
					getStyles= computed.getPropertyValue(name)||computed[ name ];
				}
			}else{
				getStyles=obj.currentStyle[name];
			}
			if(name=="width"){
				var maxWidth=arguments.callee(obj,"max-width");
				var pmaxWidth=parseFloat(maxWidth)||0;
				var pgetStyles=parseFloat(getStyles)||0;
				if(pmaxWidth&&(pgetStyles>pmaxWidth||!pgetStyles)){
					getStyles=maxWidth;
				}
			}else if(name=="height"){
				var maxHeight=arguments.callee(obj,"max-height");
				var pmaxHeight=parseFloat(maxHeight)||0;
				var pgetStyles=parseFloat(getStyles)||0;
				if(pmaxHeight&&(pgetStyles>pmaxHeight||!pgetStyles)){
					getStyles=maxHeight;
				}
			}
			return getStyles;
		},
		setCss:function(obj,styleObj){
			var cssCode = '';
			if(document.createStyleSheet)//兼容ie8不能动态加载css
			{  
				var sheet = document.createStyleSheet();
				for (var c in styleObj){
					this.insertCssRule(sheet,c,styleObj[c]);
				}
			}else{
				for (var c in styleObj){
					cssCode+=c+'{'+styleObj[c]+'}';
				}
				var styleElement = document.createElement('STYLE');
				styleElement.type = 'text/css';
				var innerHTML = document.createTextNode(cssCode);
				styleElement.appendChild(innerHTML);
				if(obj.hasChildNodes()){
					obj.insertBefore(styleElement,obj.children[0]);
				}else if(obj){
					obj.appendChild(styleElement);
				}else{
					document.head.appendChild(styleElement);
				}
			}	
		},
		insertCssRule:function(sheet,selectorText,cssText, position) {
			position=position||0;
			if (sheet.insertRule) {
				sheet.insertRule(selectorText + "{" + cssText + "}", position);
			} else if (sheet.addRule) {
				sheet.addRule(selectorText, cssText, position);
			}
		},
		addClass:function(o,cn){var re = new RegExp("(\\s*|^)"+cn+"\\b","g");o.className +=o.className?(re.test(o.className)?"":" "+ cn):cn;},
		removeClass:function(o,cn){var re = new RegExp("(\\s*|^)"+cn+"\\b","g");var sName = o.className;o.className = sName.replace(re,"");}
	}
})(window);