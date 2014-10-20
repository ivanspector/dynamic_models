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
})