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
        $('input[name="id"]').each(function() {
            $(this).val("");
        });
        if (App.getType() == 'vertical') {
            App.verticalsForm.show();
        } else {
            App.notesForm.show();
        }
    },
    showVerticals: function() {
        $.get('/api/vertical', function(data) {
            App.content.html("");
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
        });
    },
    showArticles: function() {
        $.get('/api/Notes', function(data) {
            App.content.html("");
            var ul = $('<ul class="list-group">').appendTo(App.content);
            $(data).each(function(index, item) {
                ul.append(
                    $('<li class="list-group-item">').text(item.name)
                );
            });
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
            url: '/api/' + this.getType() + '/' + id,
            type: 'DELETE',
            success: function(result) {
                App.showVerticals();
            }
        });
    },
    /**
     * functions
     */
    getWhere: function() {
        var id = App.verticalsForm.find('input[name="id"]').val();
        if (App.getType()) {
            id = App.notesForm.find('input[name="id"]').val();
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
        $('input').each(function() {
            $(this).val("");
        });
        $('textarea').each(function() {
            $(this).val("");
        });
        $('select').each(function() {
            $(this).val("");
        });
    },
    /**
     * submitting forms
     */
    formSubmit: function(form) {
        if (App.getType() == 'vertical') {
            App.verticalFormSubmit(form);
        } else {
            App.noteFormSubmit(form);
        }
        return false;
    },
    verticalFormSubmit: function() {
        $.post(
            "/api/vertical/upsertWithWhere?where=" + App.getWhere(),
            {
                name: App.verticalsForm.find('input[name="name"]').val()
            },
            function() {
                App.resetForms();
                App.showVerticals();
            }
        );
    },
    noteFormSubmit: function(form) {

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

    }
};