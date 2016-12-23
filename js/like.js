// Like


var likeStrip = Strip({
	preset:'none',
	target:'#like-slider',
	pagination: '<div class="pagination"></div>',
	duration:1000,
	setup:function(self){
		self.$frames.eq(0).css('opacity',1).addClass('on-top');
	},
	init:function(self){

		var frames = [],
			length = self.$frames.length,
			setFrameAnimations = function(i){
				var o = {};

				var textBoxRed = self.$frames.eq(i).find('.text-box-red')[0],
					textBox = self.$frames.eq(i).find('.text-box')[0];

				
				o.inAnimation = new TimelineMax();

				o.inAnimation
				.to(self.frames[i],1,{
					opacity:1
				})
				.fromTo(textBoxRed,.6,{
					opacity:0,
					y:'100px'
				},{
					opacity:1,
					y:'0px'
				},0.4)
				.fromTo(textBox,.3,{
					opacity:0,
					x:'-100px'
				},{
					opacity:1,
					x:'0px'
				},0.2)
				.pause();

				o.outAnimation = new TimelineMax();

				o.outAnimation
				.to(self.frames[i],1,{
					opacity:0
				})
				.fromTo(textBoxRed,.2,{
					opacity:1,
					y:'0px'
				},{
					opacity:0,
					y:'-100px'
				},0)
				.fromTo(textBox,.6,{
					opacity:1,
					x:'0'
				},{
					opacity:0,
					x:'100px'
				},0)
				.pause();


				frames.push(o);
			};
			for(var i = 0;i<length;i++){
				setFrameAnimations(i);
			}


			//

			self.on('move',function(s){
				console.log(s.current + ' > '+s.future);
				frames[s.current].outAnimation.seek(0).play();
				frames[s.future].inAnimation.seek(0).play();


			});
			self.on('end',function(s){
				console.log('end');

				self.$frames.eq(s.current).removeClass('on-top');
				self.$frames.eq(s.future).addClass('on-top');
			});

	}
});