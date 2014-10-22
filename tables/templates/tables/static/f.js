    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
          beforeSend: function (request) {
              request.setRequestHeader('X-CSRFToken',getCookie('csrftoken'));
          }
        });
    function replr(e, name) {
        if (e.className == "DateField") {
               $(e).html(
                       _.template('<div id="datetimepicker4">' +
                           '<input name="<%- name %>" data-format="yyyy-MM-dd" type="text" class="add-on" value=<%- text %>></input>' +
                    '</div>', {'text': $(e).text(), 'name': name})
               );
               $(function() {$('#datetimepicker4').datetimepicker({pickTime: false});});
        };
        if ((e.className == "CharField") || (e.className == "IntegerField")) {
               $(e).html(
                       _.template('<div>' +
                           '<input name="<%- name %>" type="text" value=<%- text %>></input>' +
                    '</div>', {'text': $(e).text(), 'name': name})
               );
        };
    };
    function f(e, field) {
        var input, model, object, url, value, dict = {};
        model = e.parentNode.parentNode.className;
        object = $(e).siblings('.AutoField').text();
        url = '/' + model + '/' + object;
        replr(e, field);
        $(e).removeAttr('onclick');
        input = e.firstElementChild.firstElementChild;
        $(input).focus();
        $(input).click();
        $(input).keypress(function(event){
            if (event.keyCode==13) {
                dict[field] = this.value;

                $.post(url, dict).done(function(){
                    $(input).focusout()
                }).fail(function(data){
                        $(input).focusout();
                        alert('wrong data');
                        $(e).click();
                    });
            }
        });
        $(input).focusout(function(){
            $(e).html(
                      this.value
                );
            e.setAttribute('onclick', "f(this, "+"'"+field+"'"+")");
        })

    }