var KlassesView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

KlassesView = (function(_super) {

  __extends(KlassesView, _super);

  function KlassesView() {
    this.render = __bind(this.render, this);
    KlassesView.__super__.constructor.apply(this, arguments);
  }

  KlassesView.prototype.initialize = function(options) {
    this.views = [];
    this.klasses = options.klasses;
    this.curricula = options.curricula;
    return this.klasses.on("add remove change", this.render);
  };

  KlassesView.prototype.events = {
    'click .add': 'toggleAddForm',
    'click .cancel': 'toggleAddForm',
    'click .save': 'saveNewKlass',
    'click .goto_class': 'gotoKlass'
  };

  KlassesView.prototype.saveNewKlass = function() {
    var errors;
    errors = [];
    if ($.trim(this.$el.find("#year").val()) === "") errors.push(" - No year.");
    if ($.trim(this.$el.find("#grade").val()) === "") errors.push(" - No grade.");
    if ($.trim(this.$el.find("#stream").val()) === "") {
      errors.push(" - No stream.");
    }
    if (this.$el.find("#curriculum option:selected").val() === "_none") {
      errors.push(" - No curriculum selected.");
    }
    if (errors.length === 0) {
      return this.klasses.create({
        year: this.$el.find("#year").val(),
        grade: this.$el.find("#grade").val(),
        stream: this.$el.find("#stream").val(),
        curriculumId: this.$el.find("#curriculum option:selected").attr("data-id"),
        startDate: (new Date()).getTime()
      });
    } else {
      return alert("Please correct the following errors:\n\n" + (errors.join('\n')));
    }
  };

  KlassesView.prototype.gotoKlass = function(event) {
    return Tangerine.router.navigate("class/edit/" + $(event.target).attr("data-id"));
  };

  KlassesView.prototype.toggleAddForm = function() {
    this.$el.find("#add_form, .add").toggle();
    return this.$el.find("#year").focus();
  };

  KlassesView.prototype.renderKlasses = function() {
    var $ul, klass, view, _i, _len, _ref;
    this.closeViews();
    $ul = $("<ul>").addClass("klass_list");
    _ref = this.klasses.models;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      klass = _ref[_i];
      view = new KlassListElementView({
        klass: klass,
        curricula: this.curricula
      });
      view.render();
      this.views.push(view);
      $ul.append(view.el);
    }
    return this.$el.find("#klass_list_wrapper").append($ul);
  };

  KlassesView.prototype.render = function() {
    var curricula, curriculaOptionList, html, _i, _len, _ref;
    curriculaOptionList = "<option value='_none' disabled='disabled' selected='selected'>Select a curriculum</option>";
    _ref = this.curricula.models;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      curricula = _ref[_i];
      curriculaOptionList += "<option data-id='" + curricula.id + "'>" + (curricula.get('name')) + "</option>";
    }
    html = "      <h1>Classes</h1>      <div id='klass_list_wrapper'></div>      <button class='add command'>Add</button>      <div id='add_form' class='confirmation'>        <div class='menu_box'>           <div class='label_value'>            <label for='year'>Year</label>            <input id='year'>          </div>          <div class='label_value'>            <label for='grade'>Grade</label>            <input id='grade'>          </div>          <div class='label_value'>            <label for='stream'>Stream</label>            <input id='stream'>          </div>          <div class='label_value'>            <label for='curriculum'>Curriculum</label><br>            <select id='curriculum'>" + curriculaOptionList + "</select>          </div>          <button class='command save'>Save</button><button class='command cancel'>Cancel</button>        </div>      </div>    ";
    this.$el.html(html);
    this.renderKlasses();
    return this.trigger("rendered");
  };

  KlassesView.prototype.closeViews = function() {
    var view, _i, _len, _ref;
    _ref = this.views != null;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      view = _ref[_i];
      view.close();
    }
    return this.views = [];
  };

  KlassesView.prototype.onClose = function() {
    return this.closeViews();
  };

  return KlassesView;

})(Backbone.View);