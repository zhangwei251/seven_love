$(function(){
    //===初始化操作===
    //查找元素
    var $container = $("#content");
    var $wrapElement = $container.find(":first");
    var $slides = $wrapElement.children("li");
    var $boy = $("#boy");
    var $shop = $(".shop");
    var $door = $(".door");
    var $girl = $(".girl");
    var $a_bg_middle = $(".a_bg_middle");
    //根据浏览器窗口调整容器尺寸
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var sizeBase = windowWidth > windowHeight ? windowHeight : windowWidth;
    $container.css({
        "width": sizeBase * 0.8 + "px",
        "height": sizeBase * 0.5 + "px",
        "marginTop": -sizeBase * 0.5/2 + "px",
        "marginLeft": -sizeBase * 0.8/2 + "px"
    });
    //获取容器尺寸
    var width = $container.width();
    var height = $container.height();
    //设置ul总宽度
    $wrapElement.css({
        width: ($slides.length * width) + "px",
        height: height + "px"
    });
    //设置每一个页面li的宽度
    $.each($slides, function(index){
        //获取每一个li元素
        var $slide = $slides.eq(index);
        $slide.css({
            width: width + "px",
            height: height + "px"
        });
    });
    //修正boy位置
    //获取路的Y轴位置
    var pathY = function() {
        var top = $a_bg_middle.position().top;
        var height = $a_bg_middle.height();
        return top + height / 2;
    }();
    //设置boy的top坐标值 = 中间路段的中间坐标值 - 小男孩的高度 + 阴影修正值
    var boyHeight = $boy.height();
    $boy.css({
        top: pathY - boyHeight + height * 0.0278
    });

    //设置小女孩的位置
    // 桥top值
    var bridgeY = function() {
        return $(".c_bg_middle").position().top;
    }();
    $girl.css({
        left: width / 2,
        top: bridgeY - $girl.height()
    });
    //将boy走路行为封装为一个对象的方法
    function BoyWalk($boy){
        var boy = $boy;
        boy.walkTo = function(duration, percentageX,percentageY){
            var defer = $.Deferred();
            $(this).addClass("slowWalk");
            var distX = width * percentageX;
            var distY = height * percentageY;
            $(this).animate({
                "left": distX + "px",
                "top": distY + "px"
            },duration,function(){
                defer.resolve();
            });
            return defer;
        };
        boy.stopWalk = function(){
            var defer = $.Deferred();
            $(this).addClass("pauseWalk");
            defer.resolve();
            return defer;
        };
        boy.toShop = function(duration) {
            var defer = $.Deferred();
            boy.removeClass("pauseWalk");
            var top = $shop.position().top;
            var left = ($shop.position().left) + ($shop.width()/2) - ($boy.width()/2);
            $(this).animate({
                "left": left + "px",
                "top": top + "px",
                "opacity": 0
            }, duration, function () {
                defer.resolve();
            });
            return defer;
        };
        boy.takeFlower = function(){
            var defer = $.Deferred();
            //增加延时等待效果
            setTimeout(function() {
                //取花
                boy.addClass("takeFlowerWalk");
                defer.resolve();
            }, 1000);
            return defer;
        };
        boy.outShop = function(duration){
            var defer = $.Deferred();
            $(this).animate({
                "top" : pathY - boyHeight + height * 0.0278 + "px",
                "opacity": 1
            },duration,function(){
                defer.resolve();
            });
            return defer;
        };
        boy.toBridge = function(duration){
            var defer = $.Deferred();
            var distX = ($girl.position().left) - ($boy.width()) + width * 0.0243;//修正值
            var distY = $girl.position().top - height * 0.011;//修正值
            $(this).animate({
                "left": distX + "px",
                "top": distY + "px"
            },4000,function(){
                defer.resolve();
            });
            return defer;
        };
        boy.takeFlowerStop = function(){
            $(this).addClass("pauseWalk").addClass("boyTakeFlowerStop");
        };
        boy.turnAround = function(){
            $(this).addClass("boyTurnAround").removeClass("pauseWalk");
        };
        return boy;
    }
    var boy = BoyWalk($boy);

    //页面切换方法
    var page = {
        elem: $wrapElement,
        scrollTo: function(duration, pageCount){
            var defer = $.Deferred();
            var distX = $container.width() * pageCount;
            this.elem.animate({
                "left" : "-"+distX + "px"
            },duration,function(){
                defer.resolve();
            });
            return defer;
        }
    };
    /*第一个页面*/
    //云飘动方法
    function cloudAnimate(){
        var $cloud1 = $("#cloud1");
        var $cloud2 = $("#cloud2");
        $cloud1.addClass("cloud1-animation");
        $cloud2.addClass("cloud2-animation");
    }
    //太阳下山方法
    function sunRotate(){
        var $sun = $("#sun");
        $sun.addClass("sunRotation");
    }
    /*第二个页面*/
    //门动画方法
    function doorAction(left, right, time) {
        var defer = $.Deferred();
        var doorLeft = $(".door_left");
        var doorRight = $(".door_right");
        var count = 2;
        // 等待开门完成
        var complete = function() {
            if (count == 1) {
                defer.resolve();
                return;
            }
            count--;
        };
        doorLeft.animate({
            "left": left
        }, time,complete);
        doorRight.animate({
            "left": right
        }, time,complete);
        return defer;
    }
    // 开门
    function openDoor() {
        return doorAction("-50%", "100%", 2000);
    }
    // 关门
    function shutDoor() {
        return doorAction("0%", "50%", 2000);
    }
    //灯动画
    var lamp = {
        elem: $(".lamp"),
        bright: function() {
            var defer = $.Deferred();
            this.elem.addClass("lamp_bright");
            defer.resolve();
        },
        dark: function() {
            this.elem.removeClass("lamp_bright");
        }
    };
    //飞鸟动画
    var bird = {
        elem: $(".bird"),
        fly: function() {
            this.elem.addClass("birdFly");
            this.elem.animate({
                right: $container.width()
            }, 15000);
        }
    };

    /*第三个页面*/
    //小女孩动画方法
    var girl = {
        elem: $girl,
        turnAround:function(){
            this.elem.addClass("girlTurnAround");
        }
    };
    //两人转身动画
    function turnAround(){
        var defer = $.Deferred();
        setTimeout(function(){
            girl.turnAround();
            boy.turnAround();
            defer.resolve();
        },1000);
        return defer;
    }
    //星星闪动方法
    function starTwinkle(){
        var $stars = $(".stars > li");
        var len = $stars.length;
        var i = 0;
        var timer = setInterval(function(){
            $($stars[i]).addClass("starTwinkle");
            if(i < len){
                i++;
            }else{
                clearInterval(timer);
            }
        },1000);

    }
    //水波动方法
    function waterWave(){
        var $waters = $(".waters > li");
        var len = $waters.length;
        var i = 0;
        var timer = setInterval(function(){
            $($waters[i]).addClass("waterWave");
            if(i < len){
                i++;
            }else{
                clearInterval(timer);
            }
        },1000);

    }
    //存放6种花瓣图片位置百分比
    var flowersPos = ["0", "20%", "40%", "60%", "80","100%"];
    // 获取花瓣容器
    var $flowerContainer = $("#flower_wrap");
    var flowerUrl = "images/flower.png";
    //花瓣飘落动画方法
    function flowerDrop() {
        // 随机获取花瓣图片url
        function getFlowerPos() {
            return flowersPos[Math.floor(Math.random() * 6)];
        }
        //花瓣盒子宽高
        var flowerBoxWidth = width * 0.0285;
        var flowerBoxHeight = height * 0.0456;
        // 创建一个花瓣元素，添加旋转类
        function createFlowerBox() {
            var pos = getFlowerPos();
            return $('<div class="flowerBox"></div>').css({
                "width":  flowerBoxWidth+ "px",
                "height":  flowerBoxHeight+ "px",
                "position": "absolute",
                "zIndex": 1000,
                "top": -flowerBoxHeight + "px",
                "backgroundImage": "url(" + flowerUrl + ")",
                "backgroundRepeat": "no-repeat",
                "backgroundSize": "600% 100%",
                "backgroundPosition": pos + " 0"
            }).addClass("flowerRotate");
        }
        // 开始飘花
        setInterval(function() {
            // 运动轨迹随机
            var startPositionLeft = Math.random() * width - 100,
                startOpacity    = 1,
                endPositionTop  = height - 40,
                endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
                duration        = height * 10 + Math.random() * 5000;

            // 随机透明度，不小于0.5
            var randomStart = Math.random();
            randomStart = randomStart < 0.5 ? startOpacity : randomStart;

            // 创建一个花瓣
            var $flower = createFlowerBox();
            // 设计起点位置
            $flower.css({
                left: startPositionLeft + "px",
                opacity : randomStart
            });
            // 加入到容器
            $flowerContainer.append($flower);
            // 开始执行动画
            $flower.animate({
                top: endPositionTop + "px",
                left: endPositionLeft + "px",
                opacity: 0.7
            }, duration, function() {
                $(this).animate({
                    opacity: 0
                },1000,function(){
                    $(this).remove(); //结束后删除
                });
            });

        }, 300);
    }

    // 音乐配置
    var audioConfig = {
        enable: true, // 是否开启音乐
        playURl: "music/happy.wav", // 正常播放地址
        cycleURL: "music/circulation.wav" // 正常循环播放地址
    };
    //背景音乐播放
    function Html5Audio(url, isloop) {
        var audio = new Audio(url);
        audio.autoPlay = true;
        audio.loop = isloop || false;
        audio.play();
        return {
            end: function(callback) {
                audio.addEventListener("ended", function() {
                    callback();
                }, false);
            }
        };
    }
    //页面动画
    function pageAStartRun(){
        //播放音乐
        var audio1 = Html5Audio(audioConfig.playURl);
        audio1.end(function() {
            Html5Audio(audioConfig.cycleURL, true);
        })
        //云飘动
        cloudAnimate();
        //太阳下山
        sunRotate();
        boy.walkTo(4000,0.5)
            .then(function(){
                return page.scrollTo(9000,1);
            }).then(function(){
                bird.fly();
                return boy.stopWalk();
            }).then(function(){
                return openDoor();
            }).then(function(){
                return lamp.bright();
            }).then(function(){
                return boy.toShop(2000);
            }).then(function(){
                return boy.takeFlower();
            }).then(function(){
                return boy.outShop(2000);
            }).then(function(){
                lamp.dark();
                shutDoor();
                page.scrollTo(9000,2);
            }).then(function(){
                return boy.walkTo(9000,0.15);
            }).then(function(){
                starTwinkle();
                waterWave();
                return boy.toBridge(4000);
            }).then(function(){
                boy.takeFlowerStop();
                return turnAround();
            }).then(function(){
                flowerDrop();
            });
    }
    $("button").click(function(){
        $(this).animate({
            "opacity": 0
        },1000);
        pageAStartRun();
    });
});
