$(function(){
	$(".start").bind("click",function(){
		puzzle.start();
	});
});
$(window).load(function(){
	puzzle=new myPuzzle({
		id:"game",
		pic:"images/p1.jpg",//图片
		x:3,
		y:3,
		hard:10,//最大难度最好不要大于总格数的一半
		duration:100,//毫秒
		stepStart:function(){//每步开始移动时的回调
			var t=this;
			t.addClass(t.touchChild,"cur");
		},
		startInit:function(){//每次重新开始游戏时的回调(相当于初始化)
			var t=this;
			$(".desc").html('本关难度为 <i>'+t.options.hard+'</i> ,只需 <i>'+t.options.hard+'</i> 步就能完成,天才可以更少,已走 <i>'+t.step+'</i> 步<br />提示：'+t.answer);
			
		},
		finish:function(){
			var t=this;
			t.removeClass(t.touchChild,"cur");
			$(".desc").html('本关难度为 <i>'+t.options.hard+'</i> ,只需 <i>'+t.options.hard+'</i> 步就能完成,天才可以更少,已走 <i>'+t.step+'</i> 步<br />提示：'+t.answer);
		},
		stepEnd:function(){
			var t=this;
			t.removeClass(t.touchChild,"cur");
			$(".desc").html('本关难度为 <i>'+t.options.hard+'</i> ,只需 <i>'+t.options.hard+'</i> 步就能完成,天才可以更少,已走 <i>'+t.step+'</i> 步<br />提示：'+t.answer);
		}
	});
});
$(window).resize(function(){
	puzzle.refresh();
});