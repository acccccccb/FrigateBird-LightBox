/*
	FrigateBird-LightBox
	Version:	v1.0.0
	Author:		futureis404
	Website:	http://www.python-pro.com
	GitHub:		https://github.com/futureis404/FrigateBird-LightBox
*/
$(document).ready(function(){
	var ImgBoxFlash = 300; //闪烁时间
	var OpenBox = 500; //打开时间
	var CloseBox = 500; //关闭时间
    var scale;//缩放大小
    if(document.body.clientWidth >=992){
        scale = 1;
    } else if(document.body.clientWidth >= 768 && document.body.clientWidth < 992) {
        scale = 0.7;
    } else if(document.body.clientWidth >= 440 && document.body.clientWidth < 768) {
        scale = 0.6;
    } else if(document.body.clientWidth < 440) {
        scale = 0.4;
    }

    var ImgText,ImgTit;
    var ViewImgObj = [];
    var JSONIndex = -1;
    var ViewImgHtml = '';
    //初始化数据
    function LoadIni() {
        $('.ImgBox>img').css({
            'max-height':500 * scale + 'px'
        });
        $('.ImgWindow>.ImgBox>img').css({
            'max-width':600 * scale + 'px'
        });
        $('.ImgListBox').css({
            'width': 600 * scale +'px',
            'height':86 * scale + 'px'
        });
        $('.ImgListBox>.ViewImgList').css({
            'width':100 * scale + 'px',
            'height':70 * scale + 'px',
            'margin':4 * scale + 'px',
            'padding':4 * scale + 'px'

        });
        $('.ImgWindow').css({
            'padding':20 * scale + 'px'
        });
    }
	function ImgFlash() {
		$(".ImgBox").stop(true).fadeOut(ImgBoxFlash).fadeIn(ImgBoxFlash);
    }
    function ImgWindow(){
        var AlertHtml = '';
        AlertHtml +='<div class="imgmask mask"></div>';
        AlertHtml +='<div class="ImgWindow">';
        AlertHtml +='<div class="ImgPrev"><img src="ico/prev.png" /></div>';
        AlertHtml +='<div class="ImgNext"><img src="ico/next.png" /></div>';
        AlertHtml +='<div class="ImgBox">' + ImgText;
        AlertHtml +='<div class="ImgText">' + ImgTit + '</div>';
        AlertHtml +='</div>';
        AlertHtml +='<div class="ImgListBox">'+ViewImgHtml+'</div>';
        AlertHtml +='<div class="ImgKey"><span>可用方向键"←"和"→"浏览</span></div>';
        AlertHtml +='<div class="closeBtnIco" ><img src="ico/close.png" /></div>';
		AlertHtml +='<span class="ImgNumber"></span>';
        AlertHtml +='</div>';
        AlertHtml +='</div>';
        $('body').append(AlertHtml);
        $(".mask").fadeIn(OpenBox,function(){
			$('.ImgWindow').fadeIn(OpenBox);
		});
    }
	//关闭
    function CloseImgWindow() {
        $(".ImgWindow").fadeOut(CloseBox,function(){
            $(".imgmask,.ImgWindow").remove();
        });
    }
    //调整位置
    function MoveTo(){
        var ImgWindowWidth = (-$('.ImgWindow>.ImgBox').outerWidth(true)/2 - 41) * scale;
        var ImgWindowHeight = (-$('.ImgWindow>.ImgBox').outerHeight(true)/2 - 81.5) * scale;
        $('.ImgWindow').stop().animate({marginLeft:ImgWindowWidth,marginTop:ImgWindowHeight});
        console.log('宽度：' + ImgWindowWidth + '高度：' + ImgWindowHeight);
        LoadIni();
    }
    //点击下方缩略图显示对应图片
    $(document).on('click','.ViewImgList',function(){
		ImgFlash();
        var ViewImgListSrc = $(this).children('img').attr('src');
        var ViewImgListTit = $(this).children('img').attr('alt');
        var ViewImgListIndex1 = $(this).index() - 2;
        var ViewImgListIndex2 = $(this).index() - 1;
        var ViewImgListIndex3 = $(this).index();
        var ViewImgListIndex4 = $(this).index() + 1;
        var ViewImgListIndex5 = $(this).index() + 2;
        var ViewImgListLength = $('.ViewImgList').length;
        $('.ImgBox').children('img').attr('src',''+ ViewImgListSrc +'');
        MoveTo();
        $('.ImgText').text(''+ ViewImgListTit +'');
        $(this).addClass('ViewImgListFocus').siblings('.ViewImgList').removeClass('ViewImgListFocus');
        if(ViewImgListIndex1<=0 || ViewImgListIndex5>=ViewImgListLength ) {
            return false;
        } else {
            $('.ViewImgList').siblings('.ViewImgList').hide();
            $('.ViewImgList:eq('+ ViewImgListIndex1 +'),.ViewImgList:eq('+ ViewImgListIndex2 +'),.ViewImgList:eq('+ ViewImgListIndex3 +'),.ViewImgList:eq('+ ViewImgListIndex4 +'),.ViewImgList:eq('+ ViewImgListIndex5 +')').show();
        }
    });

    //键盘事件
    $(document).keydown(function(event){
        var ImgKey = event.keyCode;
        if (ImgKey==37) {
            $('.ImgPrev').click();
        }
        if (ImgKey==39) {
            $('.ImgNext').click();
        }
    });

    $('.ViewImg').each(function(){
        JSONIndex++;
        var JSONUrl = $(this).attr('src');
        var JSONTitle = $(this).attr('alt');
        var JSONViewImg = {"index":JSONIndex,"url":JSONUrl,"title":JSONTitle};
        ViewImgObj.push(JSONViewImg);
        ViewImgHtml += '<div class="ViewImgList"><img alt="'+JSONTitle+'" src="'+JSONUrl+'" /></div>';
    });

    //上一张图
    $('body').on('click','.ImgPrev',function(){
		ImgFlash();
        var TempImgUrl = $(this).siblings('.ImgBox').children('img').attr('src');
        $.each(ViewImgObj,function(index, content){
            if(content.url==TempImgUrl){
                var ImgNumber = content.index - 1;
                if(ImgNumber == -1) {
                    ImgNumber = JSONIndex;
                }
                $('.ImgBox').html('<img src="' + ViewImgObj[ImgNumber].url + '" />' + '<div class="ImgText">' + ViewImgObj[ImgNumber].title + '</div>');
                $('.ViewImgList:eq('+ViewImgObj[ImgNumber].index+')').addClass('ViewImgListFocus').siblings('.ViewImgList').removeClass('ViewImgListFocus');
                var HideBefore = content.index - 3;
                var HideAfter = content.index + 1;
                var MaxImgList = $('.ImgListBox>div.ViewImgList').length - 2;
                if( content.index > 2 && content.index <= MaxImgList && MaxImgList + 2 > 5 ) {
                    $('.ViewImgList:eq('+ HideBefore +')').show(100);
                    $('.ViewImgList:gt('+ HideAfter +')').hide(100);
                } if(content.index >0 && content.index <= 2 && MaxImgList + 2 <= 5 ) {
                    $('.ViewImgList:gt(5)').hide(100);
                    $('.ViewImgList:lt(4)').show(100);
                } if( content.index <= 0 && MaxImgList + 2 > 5 || content.index > MaxImgList && MaxImgList + 2 > 5 ){
                    var ghasd = MaxImgList -4;
                    $('.ViewImgList:gt('+ ghasd +')').show(100);
                    $('.ViewImgList:lt('+ ghasd +')').hide(100);
                }
				var FocusImgIndex = ViewImgObj[ImgNumber].index + 1;
				$('.ImgNumber').text(FocusImgIndex + ' / '+ $('.ViewImgList').length);
            }
        });
        MoveTo();
    });
    //下一张图
    $('body').on('click','.ImgNext',function(){
		ImgFlash();
        var TempImgUrl = $(this).siblings('.ImgBox').children('img').attr('src');
        $.each(ViewImgObj,function(index, content){
            if(content.url==TempImgUrl){
                var ImgNumber = content.index + 1;
                if(ImgNumber > JSONIndex) {
                    ImgNumber = 0;
                }
                $('.ImgBox').html('<img src="' + ViewImgObj[ImgNumber].url + '" />' + '<div class="ImgText">' + ViewImgObj[ImgNumber].title + '</div>');
                $('.ViewImgList:eq('+ViewImgObj[ImgNumber].index+')').addClass('ViewImgListFocus').siblings('.ViewImgList').removeClass('ViewImgListFocus');
                var HideBefore = content.index - 1;
                var HideAfter = content.index + 3;
                var MaxImgList = $('.ImgListBox>div.ViewImgList').length - 2;
                if( content.index >= 2 && content.index <= MaxImgList -2 ) {
                    $('.ViewImgList:lt('+ HideBefore +')').hide(100);
                    $('.ViewImgList:eq('+ HideAfter +')').show(100);
                } if ( content.index > MaxImgList) {
                    $('.ViewImgList:lt(5)').show();
                    $('.ViewImgList:gt(5)').hide();
                }
				var FocusImgIndex = ViewImgObj[ImgNumber].index + 1;
				$('.ImgNumber').text(FocusImgIndex + ' / '+ $('.ViewImgList').length);
            }
        });
        MoveTo();
    });

    $('body').on('click','.closeBtnIco,.CloseBtn,.mask,.ImgBox',function(){
        CloseImgWindow();
    });
	
    $('.ViewImg').on('click',function(){
        var deviceImg = $(this).attr('src');
        ImgTit = $(this).attr('alt');
        ImgText = '<img src="' + deviceImg + '" />';
        ImgWindow();
        var ImgWindowWidth = (-$('.ImgWindow').outerWidth(true)/2 - 20) * scale ;
        var ImgWindowHeight = (-$('.ImgWindow').outerHeight(true)/2 - 10) * scale;
        $('.ImgWindow').animate({marginLeft:ImgWindowWidth,marginTop:ImgWindowHeight});
        console.log('宽度：' + ImgWindowWidth + '高度：' + ImgWindowHeight);
        var Temp1ImgUrl = $(this).attr('src');
        $.each(ViewImgObj,function(index, content){
            if(content.url==Temp1ImgUrl){
                var Img1Number = content.index;
                if(Img1Number == -1) {
                    Img1Number = JSONIndex;
                }
                var MinImgIndex = ViewImgObj[Img1Number].index - 3;
                var MaxImgIndex = ViewImgObj[Img1Number].index + 3;
                var ImgIndexLength = $('.ViewImgList').length;
                var ImgIndexLength1 = $('.ViewImgList').length - 6;
                if(ImgIndexLength <=5) {
                    $('.ViewImgList:lt(6)').show();
                } else {
                    if(MinImgIndex<0 ) {
                        $('.ViewImgList:lt(5)').show();
                    } if (MinImgIndex > ImgIndexLength - 6 ) {
                        $('.ViewImgList:gt('+ImgIndexLength1+')').show();
                        $('.ViewImgList:lt('+ImgIndexLength1+')').hide();
                    } else {
                        $('.ViewImgList:lt('+MaxImgIndex+'):gt('+MinImgIndex+')').show();
                    }
                }
                $('.ViewImgList:eq('+ViewImgObj[Img1Number].index+')').addClass('ViewImgListFocus').siblings('.ViewImgList').removeClass('ViewImgListFocus');
				var FocusImgIndex = ViewImgObj[Img1Number].index + 1;
				$('.ImgNumber').text(FocusImgIndex + ' / '+ $('.ViewImgList').length);
            }
        });
        LoadIni();
		return false;
    });
});
