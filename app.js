const ts = "touchstart";
const tm = "touchmove";
const te = "touchend";
let isResizing = false;

function main(){
    $(".retime_ctr__tab").on(te, function(){
        $(".retime_ctr__tab").removeClass('active')
        $(this).addClass('active')
        $(".iframe_ctr").removeClass('active')
        $(`.${$(this).data('js-iframe')}`).addClass('active')
    })

    $(".resize_divider__handle").on(ts, function(){
        isResizing = true;
        $("iframe, .retime_ctr__tab").css('pointer-events', 'none');

    })
    
    $("body").on(tm, function(e){
        if (isResizing){
            $(".resize_divider__handle").parent().css('left', e.clientX)
            let srWidth = e.clientX/window.innerWidth * 100;
            $(".srcom_ctr").css("width", srWidth + "%")
            $(".retime_ctr").css("width", (100 - srWidth) + "%")
        }
    })
    .on(te, function(){
        isResizing = false;
        $("iframe, .retime_ctr__tab").css('pointer-events', 'auto');
    })

    addEventListener("resize", onWindowResize)
}

function onWindowResize(){
    $(".resize_divider").css("left", $(".srcom_ctr").offset().width/window.innerWidth * 100 + "%")
}