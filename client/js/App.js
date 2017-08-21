var App = {
    content: null,
    verticalsForm: null,
    notesForm: null,
    init: function() {
        this.content = $('#content');
        this.verticalsForm = $('#verticals-form');
        this.notesForm = $('#notes-form');
        this.initEvents();
        this.showArticles();
    },
    initEvents: function() {
        $(".nav-link").on('click', function() {
            $(".nav-item").removeClass('active');
            $(this).parent().addClass('active');
        });
        $("#verticals-list").on('click', function() {
            App.resetForms();
            App.showVerticals();
        });
        $("#articles-list").on('click', function() {
            App.resetForms();
            App.showArticles();
        });
        $("#show-add-form").on('click', function() {
            App.resetForms();
            App.showFrom();
        });
        $('form').on('submit', App.formSubmit);
    },
    /**
     * show content functions
     */
    showFrom: function() {
        $(".is-invalid").removeClass('is-invalid');
        $('input[name="id"]').each(function() {
            $(this).val("");
        });
        if (App.getType() == 'vertical') {
            App.verticalsForm.show();
            App.verticalsForm.find('input[name="name"]').focus();
        } else {
            App.notesForm.show();
            App.fillVerticalsInForm();
            App.notesForm.find('input[name="name"]').focus();
        }
    },
    showList: function () {
        if (App.getType() == 'vertical') {
            App.showVerticals();
        } else {
            App.showArticles();
        }
    },
    showVerticals: function() {
        $.get('/api/vertical', function(data) {
            App.content.html("");
            if (data.length) {
                var tr;
                var table = $('<table class="table">').appendTo(App.content);
                table.append($("<tr>"
                    + "<th>#</th>"
                    + "<th>Name</th>"
                    + "<th>Actions</th>"
                    + "</tr>"));
                $(data).each(function(index, item) {
                    tr = $("<tr>");
                    tr.append($('<th scope="row"></th>').text(item.id));
                    tr.append($('<td>').text(item.name));
                    table.append(tr);
                });
                App.addActionButtons();
            }
        });
    },
    showArticles: function() {
        $.get('/api/Notes', function(data) {
            App.content.html("");
            if (data.length) {
                var tr;
                var table = $('<table class="table">').appendTo(App.content);
                table.append($("<tr>"
                    + "<th>#</th>"
                    + "<th>Subject</th>"
                    + "<th>Name</th>"
                    + "<th>Description</th>"
                    + "<th>Email</th>"
                    + "<th>Tags</th>"
                    + "<th>Created at</th>"
                    + "<th>Age</th>"
                    + "</tr>"));
                $(data).each(function(index, item) {
                    tr = $("<tr>");
                    tr.append($('<th scope="row"></th>').text(item.id));
                    tr.append($('<td>').text(item.vertical));
                    tr.append($('<td>').text(item.name));
                    tr.append($('<td>').text(item.content));
                    tr.append($('<td>').text(item.email));
                    tr.append($('<td>').text(item.tags));
                    tr.append($('<td>').text(item.created_at));
                    tr.append($('<td>').text(item.age));
                    table.append(tr);
                });
                App.addActionButtons();
            }
        });
    },
    addActionButtons: function() {
        $('tr:gt(0)').each(function(item, index){
            $(this).append(
                $('<td><button class="btn edit">Edit</button> | <button class="btn delete">Delete</button></td>')
            );
        });
        $('.edit').on('click', App.edit);
        $('.delete').on('click', App.delete);
    },
    /**
     * item actions
     */
    edit: function() {
        var id = App.getId(this);
        App.showFrom();
        App.fillForm(id);
    },
    delete: function() {
        var id = App.getId(this);
        $.ajax({
            url: '/api/' + App.getType() + '/' + id,
            type: 'DELETE',
            success: function(result) {
                App.showList();
            }
        });
    },
    /**
     * functions
     */
    getWhere: function(debug) {
        var id = App.verticalsForm.find('input[name="id"]').val();
        if (App.getType() == 'Notes') {
            id = App.notesForm.find('input[name="id"]').val();
        }
        if (debug) {
            console.log({id: id});
        }
        return encodeURIComponent(JSON.stringify({id: id}));
    },
    getType: function() {
        return $('.nav-item.active').data('type');
    },
    getId: function(item) {
        return $(item).parent().parent().find('th').text();
    },
    resetForms: function() {
        $('.hidden').hide();
        $('input, textarea, select').each(function() {
            $(this).val("");
        });
    },
    /**
     * submitting forms
     */
    formSubmit: function() {
        $(".is-invalid").removeClass('is-invalid');
        var type = App.getType();
        var form = type == 'vertical' ? App.verticalsForm : App.notesForm;
        var data = {};
        form.find("select, input, textarea").each(function() {
            if ($(this).val() && $(this).attr('name')) {
                data[$(this).attr('name')] = $(this).val();
            }
        });
        console.log(type);
        console.log(data);
        console.log(App.getWhere(true));
        $.post(
            "/api/" + type + "/upsertWithWhere?where=" + App.getWhere(),
            data,
            function(data) {
                if (data.length) {
                    $(data).each(function() {
                        $('input[name="' + $(this)[0].path + '"]').addClass("is-invalid");
                    });
                } else {
                    App.resetForms();
                    App.showList();
                }
            },
            'json'
        );
        return false;
    },
    /**
     * filling forms
     */
    fillForm: function(id) {
        if (App.getType() == 'vertical') {
            App.verticalFormFill(id);
        } else {
            App.noteFormFill(id);
        }
    },
    verticalFormFill: function(id) {
        $.get('/api/vertical/' + id, function(data) {
            for (var key in data) {
                App.verticalsForm.find('input[name="' + key + '"]').val(data[key]);
            }
        });
    },
    noteFormFill: function(id) {
        $.get('/api/Notes/' + id, function(data) {
            for (var key in data) {
                App.notesForm.find('input[name="' + key + '"]').val(data[key]);
                App.notesForm.find('textarea[name="' + key + '"]').val(data[key]);
                App.notesForm.find('select[name="' + key + '"]').val(data[key]);
            }
        });
    },
    fillVerticalsInForm: function() {
        $.get('/api/vertical', function(data) {
            $("#subject").find('option').remove();
            if (data.length) {
                $(data).each(function(index, item) {
                    $("#subject").append($('<option>').val(item.id).text(item.name));
                });
            }
        });
    }
};