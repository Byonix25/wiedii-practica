if (typeof window.l === 'undefined'){
    window.l = new Loader();
}
var Whiteboard = function (ruta) {
    this.us = "";
    this.contadorMuro =0;
    this.traer = function (nuevo) {
        //sistema.check_session();
		$.ajax({
            url: ruta+'wall_t', type: 'post', dataType: 'json',
            data: {accion: "muroT",contador:whiteboard.contadorMuro,nuevo:nuevo, token: sistema.token},
            success: function (call) {
                call = call.data;

                if(call.status=="END"){
                    return false;
                }

                if (!jQuery.isEmptyObject(call)) {
                    var aux = false;
                    var div = '<div class="wb_div">{0}</div>';
                    var tab = '<table align="center"  class="{1}" id="{2}"> {0} </table>';
                    var tr = '<tr id="{1}">{0}</tr>';
                    var td = '<td {1} > {0} </td>';
                    var botones = '<img class="whiteboardComentario" style="width:45px;height:45px;cursor:pointer;position:absolute;right: 45px;" src="static/images/icons/whiteboard_icons/comment-.svg" data-value="{0}" alt="Comment"> <img class="whiteboardCool" style="width:45px;height:45px;cursor:pointer;" border="0" hspace="0" src="static/images/icons/whiteboard_icons/favorite1.svg" data-value="{0}" alt="Cool">'
                    var botones2 = '<img class="whiteboardComentario" style="width:45px;height:45px;cursor:pointer;position:absolute;right: 45px;" src="static/images/icons/whiteboard_icons/comment-.svg" data-value="{0}" alt="Comment"> <img class="whiteboardOffCool" style="width:45px;height:45px;cursor:pointer;" border="0" hspace="0" src="static/images/icons/whiteboard_icons/favorite3.svg" data-value="{0} alt="Cool">'
                    var cools = '<span name="{2}" class="whiteboardViewCool" style="position: absolute;right: 0;cursor:pointer;width: 20px;text-align: center;top: 12px;" {1}>{0}</span>';
                    var coolC = '';
                    var tdC = '';
                    var trC = '';
                    var tabC = '';
                    var td2 = '';
                    var tr2 = '';
                    var tab2 = '';
                    $.each(call, function (indice, data) {
                        if (indice == 0) {
                            whiteboard.us = data.MSG[6];
                        }
                        tdC = td.format('<div class="divFotoMuro"><img src="' + data.MSG[1] + '" class="fotoMuro"></div>', 'style="width: 90px;text-align: center;"');
                        if(data.MSG[4] == ""){
                            tdC += td.format('<p class="p_muro_nameuser_wb">' + data.MSG[2] + '<img src="static/images/icons/universal_icons/cancelar_orange.svg" class="whiteboardBorrar" data-value="' + data.MSG[0] + '"></span></p><p class="p_muro_text_wb">' + data.MSG[3].convertirURL() + '</p>', '');
                        } else {
                            tdC += td.format('<p class="p_muro_nameuser_wb">' + data.MSG[2] + '<img src="static/images/icons/universal_icons/cancelar_orange.svg" class="whiteboardBorrar" data-value="' + data.MSG[0] + '"></span></p><p class="p_muro_text_wb"><a class="documentosBotonDescargar" data-value="' + data.MSG[4] + '" style="color:#2E82B3;cursor:pointer;">' + data.MSG[3] + '</a></p>', '');
                        }
                        if (!jQuery.isEmptyObject(data.LIK)) {
                            coolC = cools.format(data.LIK[0], ' class="whiteboardViewCool" data-value="' + data.LIK[1] + '"', data.LIK[1]);
                             aux = (data.LIK[2] == 1)
                        } else {
                            coolC = cools.format('0', '', '');
                            aux = false;
                        }
                        if (aux) {
                            data.MSG[5]=moment(data.MSG[5]).format('MM-DD-YYYY');
                            trC = tr.format(tdC) + tr.format(td.format('<div style="position: relative;margin-bottom:1rem;"><span class="wb_date">posted : '+ data.MSG[5] +'</span>' + botones2.format(data.MSG[0]) + coolC + '</div>', 'colspan="2" style="text-align: right;"'));
                        }
                        else {
                            data.MSG[5]=moment(data.MSG[5]).format('MM-DD-YYYY');
                            trC = tr.format(tdC) + tr.format(td.format('<div style="position: relative;margin-bottom:1rem;"><span class="wb_date">posted : '+ data.MSG[5] +'</span>'  + botones.format(data.MSG[0]) + coolC + '</div>', 'colspan="2" style="text-align: right;"'));
                        }
                        if (!jQuery.isEmptyObject(data.COM)) {
                            $.each(data.COM, function (indice2, data2) {
                                td2 = td.format('<div class="divFotoMuroC"><img src="' + data2[1] + '" class="fotoMuroC"></div>', 'style="width: 90px;text-align: center;"');
                                td2 += td.format('<p class="p_coment_wb">' + data2[2] + '<img src="static/images/icons/universal_icons/cancelar_orange.svg" class="whiteboardBorrarComentarios" data-value="' + data2[0] + '"></span></p><div class="div_p_comment_text"><p class="p_comment_text">' + data2[3] +'</p></div><p class="date_c_wb">posted : '+data2[4]+'</p>', 'style="padding-bottom: 1rem;"')
                                tr2 += tr.format(td2,'comment_'+data2[0]);
                            });
                            tab2 = tab.format(tr2, 'tablaMuroC');
                        }
                        trC += tr.format(td.format('', '') + td.format(tab2, ''));
                        trC += tr.format(td.format('<hr style="margin-top:10px;margin-bottom: 10px;">', 'colspan="2"'));
                        tabC += div.format(tab.format(trC, 'tablaMuro', 'muro_' + data.MSG[0]));
                        td2 = tr2 = tab2 = '';
                    });
                    div = div.format(tabC);
                    if(nuevo==1){
                        $('#whiteboardVista').prepend(div)
                    }else{
                        if(whiteboard.contadorMuro>0){
                            $('#whiteboardVista').append(div);
                        }else{
                            $('#whiteboardVista').html(div);    
                        }    
                    }
                    helper.validaImgError();
                } else {
                    $('#whiteboardVista').html('<div class="divcont_wb"><div class="cont_wb"><p class="p_wb">Empty timeline, let’s fill it up.. Post a message!</p><button  class="button success btn_wb">New Message</button></div></div>');
                }                
            },
            error: function (recuest, status, error) {
                $('#whiteboardVista').html('<div class="divcont_wb"><div class="cont_wb"><p class="p_wb">Empty timeline, let’s fill it up.. Post a message!</p><button  class="button success btn_wb">New Message</button></div></div>');
            }
        });
    };
    this.coolsMsg = function (ids) {
        whiteboard.abreModal(480, 135);
        $("#contenedorModalWhite").html(sistema.loader);
        //sistema.check_session();
		$.ajax({
            url: ruta+'cools_msg', type: 'post', dataType: 'json',
            data: {accion: "coolsMsg", ids: ids, token: sistema.token},
            success: function (call) {

                call = call.data;

                var div = '<div  style="margin-top: 15px;overflow: auto;overflow-y: hidden;white-space: nowrap;">{0}</div>';
                var tab = '<table style="{1}"> {0} </table>';
                var tr = '<tr>{0}</tr>';
                var td = '<td {1} > {0} </td>';
                var tdC = '';
                var trC = '';
                var tabC = '';
                var td2 = '';
                var tr2 = '';
                var tab2 = '';
                $.each(call, function (indice, data) {
                    tdC += td.format('<div class="divFotoMuro"><img src="' + data[0] + '" class="fotoMuro"></div><p style="margin-top: 5px;margin-bottom: 5px;text-align: center;font-size: 12px;">' + data[1] + '</p>', 'style="text-align: center;"');
                });
                div = div.format(tab.format(tr.format(tdC), 'border-collapse: separate;border-spacing: 22px 20px;'));
                $("#contenedorModalWhite").html(div);
            }
        });
    };
    this.cerrarModal = function (recurso) {
        $(recurso).css("display", "none");
        $('body').removeClass('modalOpen');
    };
    this.coolOffMsg = function (id, recurso) {
      //sistema.check_session();
      $.post(ruta+'wall_like', {accion: "muroLike",tipo: false, id: id, token: sistema.token}, function () {

          var sp2 = (parseInt($(recurso).siblings('span.whiteboardViewCool').text()) - 1);
          var span = $(recurso).siblings('span');
          $(recurso).siblings('span.whiteboardViewCool').text(sp2.toString());
          $(recurso).attr('src', 'static/images/icons/whiteboard_icons/favorite1.svg');
          $(recurso).attr('class', 'whiteboardCool');
          $(recurso).css('cursor', 'pointer');
          var name = $(span).attr('name');
          if (name == "") {
              $(span).click(function () {
                  whiteboard.coolsMsg(whiteboard.us.toString());
              });
          } else {
              $(span).click(function () {
                  whiteboard.coolsMsg((name + ',' + whiteboard.us).toString());
              });
          }
      });
    };
    this.coolMsg = function (id, recurso) {
        //sistema.check_session();
	    $.post(ruta+'wall_like', {accion: "muroLike", id: id, token: sistema.token}, function () {

            var sp2 = (parseInt($(recurso).siblings('span.whiteboardViewCool').text()) + 1);
            var span = $(recurso).siblings('span');
            $(recurso).siblings('span.whiteboardViewCool').text(sp2.toString());
            $(recurso).attr('src', 'static/images/icons/whiteboard_icons/favorite3.svg');
            $(recurso).attr('class', 'whiteboardOffCool');
            $(recurso).css('cursor', 'pointer');
            var name = $(span).attr('name');
            if (name == "") {
                $(span).click(function () {
                    whiteboard.coolsMsg(whiteboard.us.toString());
                });
            } else {
                $(span).click(function () {
                    whiteboard.coolsMsg((name + ',' + whiteboard.us).toString());
                });
            }
      });
    };
    this.commentMsg = function (id) {
        whiteboard.abreModal(480, 250);
        $("#contenedorModalWhite").html('<p class="wb_comment_p">Comment</p><textarea id="muroCommentTexto" placeholder="COMMENT" class="form-control form-control--textarea"></textarea><table style="border-collapse: separate;border-spacing: 10px 12px;" align="center" style="width:90%"><tr><td colspan="2" style="text-align: center;"><button class="whiteboardModalCerrar button alert">Back</button> <button class="whiteboardModalEnviarComentario button success" data-value="' + id + '">Send</button></td></tr></table>');
    };
    this.enviaCommentMsg = function (id) {
        var recurso = $("#muroCommentTexto").val();
        if (recurso != "") {
            //sistema.check_session();
			$.post(ruta+'send_comment_msg', {accion: "enviaCommentMsg", id: id, recurso: recurso, token: sistema.token}, function () {
                whiteboard.cerrarModal('#whiteboardModal');
                whiteboard.contadorMuro = 0;
                whiteboard.traer(0);
            });
        } else {
            alertas.warning("The comment cannot be empty");
        }
    };
    this.nuevoMsg = function () {
        whiteboard.abreModal(700, 280);
        //sistema.check_session();
		$.ajax({
            url: ruta+'get_cate', type: 'post', dataType: 'json',
            data: {accion: "traeCate", token: sistema.token},
            success: function (call) {

                call = call.data;

                var sele = '<select style="width: 90%;" id="selWhite" multiple="multiple">{0}</select>'
                var opt = '<option value="{1}">{0}</option>';
                var optC = '';
                $.each(call, function (indice, data) {
                    optC += opt.format(data.titulo, data.id_item);
                });
                sele = sele.format(optC);
                $("#contenedorModalWhite").html('<p class="p_modal_wb"><img class="img_modal_wb" src="static/images/icons/universal_icons/mensaje_white.svg" alt="mensaje"><span>New Message</span></p><textarea id="muroTexto" placeholder="Type Message" class="form-control form-control--textarea"></textarea><table class="tabla_modal_wb"><tr><td>' + sele + '</td><td>Notify<input style="margin-left:5px;"type="checkbox" id="muroNotificar"></td><td><button class="whiteboardModalCerrar button alert">Back</button> <button class="whiteboardModalEnviar button success">Send</button></td></tr></table>');
                $("#selWhite").multiselect({
                    noneSelectedText: 'Share With...'
                });
                $("#selWhite").siblings('button.ui-multiselect')
                    .addClass('dropdown');
            }
        });
    };
    this.enviaMsg = function () {
        var recurso = $("#muroTexto").val();
        var share = $("#selWhite").val();
        var noti = ( $("#muroNotificar").prop("checked") ) ? 1 : 0;
        var expresionRegular = recurso.trim();
        if (valida.validForm(['muroTexto']) || share == null || expresionRegular === "") {
            alertas.warning("Compose and Share With fields are required.");
            return false;
        } else {
            // $('#loaderWeb').css('opacity', '1');
            // $('#loaderWeb').css('display', 'block');
            l.show();
            //sistema.check_session();
			$.ajax({
                url: ruta+'new_msg',
                type: 'post',
                dataType: 'json',
                data: {accion: "nuevoMsg", noti: noti, recurso: recurso, share: share, token: sistema.token},
                success: function () {
                    whiteboard.traer(0);
                    l.hide();
                    // $('#loaderWeb').css('display', 'none');
                }, error: function () {
                    l.hide();
                    // $('#loaderWeb').css('display', 'none');
                    whiteboard.traer(1)
                }
            });
            whiteboard.cerrarModal('#whiteboardModal');
        }
    };//end send function
    this.abreModal = function (ancho, alto) {
        $("#contwhite").animate({width: ancho, height: alto}, 200);
        $('#whiteboardModal').addClass('mostrar');
        $('#whiteboardModal').removeClass('ocultar');
        $('#whiteboardModal').fadeTo(0.2, 1);
        $('body').addClass('modalOpen');
    };
    this.borrarMsg = function (id) {
        alertas.confirmaAjax('Confirm Delete?', function (isConfirm) {
            if (isConfirm) {
                //sistema.check_session();
				$.ajax({
                    url: ruta+'delete_message', type: 'post', dataType: 'json',
                    data: {accion: "borrarMsg", id: id, token: sistema.token},
                    success: function (data) {

                        data = data.data;

                        if (data == "OK") {
                            alertas.success("The Message has been deleted.", "Delete",function(){
                                $('#muro_'+id).fadeOut('slow');    
                            });
                        }
                        else {
                            alertas.warning(data);
                        }
                    }
                });
            }
        });
    };
    this.borrarCom = function (id) {
        alertas.confirmaAjax('Confirm Delete?', function (isConfirm) {
            if (isConfirm) {
                //sistema.check_session();
				$.ajax({
                    url: ruta+'delete_com', type: 'post', dataType: 'json',
                    data: {accion: "borrarCom", id: id, token: sistema.token},
                    success: function (data) {
                        data = data.data;

                        if (data == "OK") {
                            alertas.success("The Comment has been deleted.", "Delete",function(){
                                $('#comment_'+id).fadeOut('slow');    
                            });
                        }
                        else {
                            alertas.warning(data);
                        }
                    }
                });
            }
        });
    }
};

var whiteboard = new Whiteboard("api/whiteboard/");

$(function () {
    $('#whiteIcon').on('click', function(){
        whiteboard.nuevoMsg();
    });
    $('#contwhite').on('click', '.whiteboardModalCerrar', function(){
        whiteboard.cerrarModal('#whiteboardModal');
    });
    $('#contwhite').on('click', '.whiteboardModalEnviar',function(){
        whiteboard.enviaMsg();
    });
    $('#contwhite').on('click', '.whiteboardModalEnviarComentario', function(){ 
        var recurso = $("#muroCommentTexto").val().trim();
        if (recurso != "" && recurso != null) {
        whiteboard.enviaCommentMsg($(this).data('value'));
        } else {
            alertas.warning("The comment cannot be empty");
        }
    });
    $('#whiteboardCapa1').on('click', '.whiteboardComentario', function(){
        whiteboard.commentMsg($(this).data('value'));
    });
    $('#whiteboardCapa1').on('click', '.whiteboardCool', function(){
        whiteboard.coolMsg( $(this).data('value') ,this);
    });
    $('#whiteboardCapa1').on('click', '.whiteboardOffCool', function(){
      whiteboard.coolOffMsg( $(this).data('value') ,this);
  });
    $('#whiteboardCapa1').on('click', '.whiteboardViewCool', function(){
        whiteboard.coolsMsg($(this).data('value'));
    });
    $('#whiteboardCapa1').on('click', '.whiteboardBorrar', function(){
        whiteboard.borrarMsg($(this).data('value'));
    });
    $('#whiteboardCapa1').on('click', '.whiteboardBorrarComentarios', function(){
        whiteboard.borrarCom($(this).data('value'));
    });
});

$('#whiteboardVista').on('click', '.btn_wb', function() {
    whiteboard.nuevoMsg();
});

$(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
        if($('#whiteboard').is(':visible')){
            whiteboard.contadorMuro = whiteboard.contadorMuro + 7;
            whiteboard.traer(0);
        }
    }
});
