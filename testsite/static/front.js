$(document).ready(function(){
    var date_field = $('.DateField');
    $('.link').click(function(event){
        event.preventDefault();
        $.get(this.href).done(function(response){
                    response['url'] = this.url;
                    console.log(this);
                    $('.records').html(
                            _.template(
                                            '<thead>' +
                                                '<tr>' +
                                                    '<% _.forEach(verbose_names, function(name) { %><td><%- name %></td><% }); %>' +
                                                '</tr>' +
                                            '</thead>' +
                                            '<tbody class=<%- model %>>' +
                                                '<% _.forEach(values, function(value) { %><tr>' +
                                                    '<% _.forEach(names, function(name) { %><td onclick="f(this, '+"'<%- name %>'"+')" class=<%- types[name] %>><%- value[name] %></td><% }); %></tr><% }); %>' +
                                            '</tbody>' , response)
                    );
                    $('.form_container').html(
                            _.template(
                                '<form class="form1" action="<%- url %>" method="POST">' +
                                    '<fieldset>' +
                                        '<legend>Новая Запись</legend>' +
                                    csrf +
                                    '<% _.forEach(names.slice(1), function(name) { %><div><%- verbose_names[names.indexOf(name)] %>: </div><p id=<%- name %> class=<%- types[name] %>></p><% }); %>' +
                                    '<input type="submit">' +
                                    '</fieldset>' +
                                '</form>', response
                            )
                    );
                    $('.form1 p').each(function() {
                        replr(this, this.id);
                    });
                    $('.form1').submit(function(event){
                        event.preventDefault();
                        $.post(this.action, $(this).serialize()).done(function(response){
                            var selector = '.' + response.model + ':last-child';
                            console.log(selector);
                            $(selector).after(
                                    _.template(
                                            '<tr>' +
                                                    '<% _.forEach(names, function(name) { %><td onclick="f(this, ' + "'<%- name %>'" + ')" class=<%- types[name] %>><%- value[name] %></td><% }); %>' +
                                            '</tr>', response
                                    )
                            );
                        })
                    })
                }
        ).fail(function(data){ console.log(data)});
    });
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
        console.log(field);
        var model, object, url, value, dict = {};
        model = e.parentNode.parentNode.className;
        object = $(e).siblings('.AutoField').text();
        url = '/' + model + '/' + object;
        replr(e, field);
        e.onclick = "";
        $(e.firstElementChild.firstElementChild).focus();
        $(e).keypress(function(event){
            if (event.keyCode==13) {
                $(e).html(
                      this.firstElementChild.firstElementChild.value
                );
                dict[field] = $(this).text();
                $.post(url, dict)
                e.setAttribute('onclick', "f(this, "+"'"+field+"'"+")");
            }
        });

    }
})