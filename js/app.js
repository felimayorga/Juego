$(function(){
    setInterval(function(){
        var color=$(".main-titulo").css("color")
        if(color=="rgb(220, 255, 14)"){
            $(".main-titulo").css("color","white")
        } else {
            $(".main-titulo").css("color","#DCFF0E")
        }
    },1000)
})

var rbh=0, rbv=0, bnewd=0, lenres=["","","","","","",""], lencol=["","","","","","",""], maximo=0, contador=0, matriz=0, intervalo=0,eliminar=0, newdulces=0, tiempo=0, i=0, espera=0, score=0, mov=0, min=2, seg=0

$(".btn-reinicio").click(function(){
    i=0, score=0, mov=0, min=2, seg=0
    $(".titulo-over").hide("slide", "fast");
    $(".panel-score").css("width","25%")
    $(".panel-tablero").show("fold", "slow")
    $(".time").show("drop", "slow")
    $("#score-text").html("0")
    $("#movimientos-text").html("0")
    $(this).html("Reiniciar")
    clearInterval(intervalo)
    clearInterval(eliminar)
    clearInterval(newdulces)
    clearInterval(tiempo)
    borrartotal()
    intervalo=setInterval(function(){desplazamiento()},600)
    tiempo=setInterval(function(){timer()},1000)
})

function aleatorio() {
    return Math.floor(Math.random()*4)+1
}

function timer(){
    if(seg!=0){
        seg--
    }
    if(seg==0){
        if(min==0){
            clearInterval(eliminar)
            clearInterval(newdulces)
            clearInterval(intervalo)
            clearInterval(tiempo);
            $(".panel-tablero").hide("fold","slow",function() {
                $(".panel-score").animate({width:'100%'},4000, function() {
                    var titulo = "<h1 class='titulo-over'>Juego Terminado</h1>"
                    $(this).prepend(titulo)
                });
            });
            $(".time").hide("drop", "slow");
        }
        seg=59;
        min--;
    }
    $("#timer").html("0"+min+":"+seg)
}

function borrartotal(){
    for(var j=1;j<8;j++){
        $(".col-"+j).children("img").detach();
    }
}

function desplazamiento(){
    i++
    var numero=0, imagen=0;

    $(".elemento").draggable({ disabled: true });
    if(i<8){
        for(var j=1;j<8;j++){
            if($(".col-"+j).children("img:nth-child("+i+")").html()==null){
                imagen="image/"+aleatorio()+".png";
                $(".col-"+j).prepend("<img src="+imagen+" class='elemento'/>").css("justify-content","flex-start")
            }
        }
    }
    if(i==8){
        clearInterval(intervalo);
        eliminar=setInterval(function(){eliminarhorver()},150)
    }
}

function eliminarhorver(){
    matriz=0;
    rbh=horizontal()
    rbv=vertical()
    for(var j=1;j<8;j++){
        matriz=matriz+$(".col-"+j).children().length;
    }
    if(rbh==0 && rbv==0 && matriz!=49){
        clearInterval(eliminar);
        bnewd=0;
        newdulces=setInterval(function(){nuevosdulces()},600)
    }
    if(rbh==1 || rbv==1){
        $(".elemento").draggable({ disabled: true });
        $("div[class^='col']").css("justify-content","flex-end")
        $(".activo").hide("pulsate",1000,function(){
            var scoretmp=$(".activo").length;
            $(".activo").remove("img")
            score=score+scoretmp;
            $("#score-text").html(score)
        })
    }
    if(rbh==0 && rbv==0 && matriz==49){
        $(".elemento").draggable({
            disabled: false,
            containment: ".panel-tablero",
            revert: true,
            revertDuration: 0,
            snap: ".elemento",
            start: function(event, ui){
                mov++;
                $("#movimientos-text").html(mov)
            }
        });
    }
    $(".elemento").droppable({
        drop: function (event, ui) {
            espera=0;
            do{
                espera=ui.draggable.swap($(this));
            }while(espera==0)
            rbh=horizontal()
            rbv=vertical()
            if(rbh==0 && rbv==0){
                ui.draggable.swap($(this));
            }
            if(rbh==1 || rbv==1){
                clearInterval(newdulces);
                clearInterval(eliminar);
                eliminar=setInterval(function(){eliminarhorver()},150)
            }
        }
    });
}

jQuery.fn.swap = function(b){
    b = jQuery(b)[0];
    var a = this[0];
    var t = a.parentNode.insertBefore(document.createTextNode(''), a);
    b.parentNode.insertBefore(a, b);
    t.parentNode.insertBefore(b, t);
    t.parentNode.removeChild(t);
    return this;
}

function nuevosdulces(){
    $(".elemento").draggable({ disabled: true });
    $("div[class^='col']").css("justify-content","flex-start")
    for(var j=1;j<8;j++){
        lencol[j-1]=$(".col-"+j).children().length;
    }
    if(bnewd==0){
        for(var j=0;j<7;j++){
            lenres[j]=(7-lencol[j]);
        }
        maximo=Math.max.apply(null,lenres);
        contador=maximo;
    }
    if(maximo!=0){
        if(bnewd==1){
            for(var j=1;j<8;j++){
                if(contador>(maximo-lenres[j-1])){
                    $(".col-"+j).children("img:nth-child("+(lenres[j-1])+")").remove("img")
                }
            }
        }
        if(bnewd==0){
            bnewd=1;
            for(var k=1;k<8;k++){
                for(var j=0;j<(lenres[k-1]-1);j++){
                    $(".col-"+k).prepend("<img src='' class='elemento' style='visibility:hidden'/>")
                }
            }
        }
        for(var j=1;j<8;j++){
            if(contador>(maximo-lenres[j-1])){
                imagen="image/"+aleatorio()+".png";
                $(".col-"+j).prepend("<img src="+imagen+" class='elemento'/>")
            }
        }
    }
    if(contador==1){
        clearInterval(newdulces);
        eliminar=setInterval(function(){eliminarhorver()},150)
    }
    contador--;
}

function horizontal(){
    var bh=0;
    for(var j=1;j<8;j++){
        for(var k=1;k<6;k++){
            var res1=$(".col-"+k).children("img:nth-last-child("+j+")").attr("src")
            var res2=$(".col-"+(k+1)).children("img:nth-last-child("+j+")").attr("src")
            var res3=$(".col-"+(k+2)).children("img:nth-last-child("+j+")").attr("src")
            if((res1==res2) && (res2==res3) && (res1!=null) && (res2!=null) && (res3!=null)){
                $(".col-"+k).children("img:nth-last-child("+(j)+")").attr("class","elemento activo")
                $(".col-"+(k+1)).children("img:nth-last-child("+(j)+")").attr("class","elemento activo")
                $(".col-"+(k+2)).children("img:nth-last-child("+(j)+")").attr("class","elemento activo")
                bh=1;
            }
        }
    }
    return bh;
}

function vertical(){
    var bv=0;
    for(var l=1;l<6;l++){
        for(var k=1;k<8;k++){
            var res1=$(".col-"+k).children("img:nth-child("+l+")").attr("src")
            var res2=$(".col-"+k).children("img:nth-child("+(l+1)+")").attr("src")
            var res3=$(".col-"+k).children("img:nth-child("+(l+2)+")").attr("src")
            if((res1==res2) && (res2==res3) && (res1!=null) && (res2!=null) && (res3!=null)){
                $(".col-"+k).children("img:nth-child("+(l)+")").attr("class","elemento activo")
                $(".col-"+k).children("img:nth-child("+(l+1)+")").attr("class","elemento activo")
                $(".col-"+k).children("img:nth-child("+(l+2)+")").attr("class","elemento activo")
                bv=1;
            }
        }
    }
    return bv;
}
