var AssessmentListElementView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

AssessmentListElementView = (function(_super) {

  __extends(AssessmentListElementView, _super);

  function AssessmentListElementView() {
    this.assessmentDelete = __bind(this.assessmentDelete, this);
    this.updateResultCount = __bind(this.updateResultCount, this);
    AssessmentListElementView.__super__.constructor.apply(this, arguments);
  }

  AssessmentListElementView.prototype.className = "AssessmentListElementView";

  AssessmentListElementView.prototype.tagName = "li";

  AssessmentListElementView.prototype.events = {
    'click .assessment_menu_toggle': 'assessmentMenuToggle',
    'click .admin_name': 'assessmentMenuToggle',
    'click .assessment_delete': 'assessmentDeleteToggle',
    'click .assessment_delete_cancel': 'assessmentDeleteToggle',
    'click .assessment_delete_confirm': 'assessmentDelete',
    'click .copy': 'copyToGroup',
    'click .duplicate': 'duplicate',
    'click .archive': 'archive',
    'click .update': 'update',
    'click .result_count': 'getResultCount'
  };

  AssessmentListElementView.prototype.blankResultCount = "-";

  AssessmentListElementView.prototype.initialize = function(options) {
    options.model.on("resultCount", this.updateResultCount);
    this.model = options.model;
    this.parent = options.parent;
    this.group = options.group;
    this.homeGroup = options.homeGroup;
    this.isPublic = options.model.get("group") === "public" && this.homeGroup !== "public";
    this.resultCount = this.model.resultCount != null ? this.model.resultCount : this.blankResultCount;
    this.resultCount = Math.commas(this.resultCount);
    return this.isAdmin = Tangerine.user.isAdmin();
  };

  AssessmentListElementView.prototype.duplicate = function() {
    var newName,
      _this = this;
    newName = "Copy of " + this.model.get("name");
    return this.model.duplicate({
      name: newName
    }, null, null, function(assessment) {
      return _this.model.trigger("new", assessment);
    });
  };

  AssessmentListElementView.prototype.copyToGroup = function() {
    var _this = this;
    return this.model.duplicate({
      group: this.homeGroup
    }, null, null, function(assessment) {
      return _this.model.trigger("new", assessment);
    });
  };

  AssessmentListElementView.prototype.update = function() {
    var _this = this;
    this.model.updateFromServer();
    return this.model.on("status", function(message) {
      if (message === "import success") {
        return Utils.midAlert("Updated");
      } else if (message === "import error") {
        return Utils.midAlert("Update failed");
      }
    });
  };

  AssessmentListElementView.prototype.getResultCount = function() {
    if (Tangerine.settings.context === "mobile") return;
    this.$el.find(".result_count").html("Results <b>" + this.blankResultCount + "</b>");
    return this.model.getResultCount();
  };

  AssessmentListElementView.prototype.updateResultCount = function() {
    this.resultCount = Math.commas(this.model.resultCount);
    return this.$el.find(".result_count").html("Results <b>" + this.resultCount + "</b>");
  };

  AssessmentListElementView.prototype.archive = function() {
    var result;
    result = this.$el.find(".archive :selected").val() === "true";
    if (result === true) {
      this.$el.find(".admin_name").addClass("archived_assessment");
    } else {
      this.$el.find(".admin_name").removeClass("archived_assessment");
    }
    this.model.save({
      archived: result
    });
    return true;
  };

  AssessmentListElementView.prototype.assessmentMenuToggle = function() {
    this.$el.find('.assessment_menu_toggle').toggleClass('icon_down');
    return this.$el.find('.assessment_menu').fadeToggle(250);
  };

  AssessmentListElementView.prototype.assessmentDeleteToggle = function() {
    this.$el.find(".assessment_delete_confirm").fadeToggle(250);
    return false;
  };

  AssessmentListElementView.prototype.assessmentDelete = function() {
    return this.model.destroy();
  };

  AssessmentListElementView.prototype.render = function() {
    var adminName, adminResultCount, archiveClass, archiveSwitch, copyButton, deleteButton, deleteConfirm, downloadKey, duplicateButton, editButton, html, isArchived, name, printButton, resultCount, resultsButton, runButton, selected, toggleButton, updateButton;
    isArchived = this.model.getBoolean('archived');
    if (!this.isAdmin && isArchived && Tangerine.settings.get("context") === "mobile") {
      return;
    }
    toggleButton = "<span class='assessment_menu_toggle icon_ryte'> </span>";
    name = "<span class='name clickable '>" + (this.model.get('name')) + "</span>";
    adminName = "<span class='admin_name clickable " + archiveClass + "'>" + (this.model.get('name')) + "</span>";
    adminResultCount = "<label class='result_count small_grey no_help' title='Result count. Click to update.'>Results <b>" + this.resultCount + "</b></label>";
    resultCount = "<span class='result_count no_help'>Results <b>" + this.resultCount + "</b></span>";
    archiveClass = isArchived ? " archived_assessment" : "";
    selected = " selected='selected'";
    editButton = "<a href='#edit/" + this.model.id + "'><img class='link_icon edit' title='Edit' src='images/icon_edit.png'></a>";
    runButton = "<a href='#run/" + this.model.id + "'><img class='link_icon run' title='Run' src='images/icon_run.png'></a>";
    resultsButton = "<a href='#results/" + this.model.id + "'><img class='link_icon results' title='Results' src='images/icon_results.png'></a>";
    printButton = "<a href='#print/" + this.model.id + "'><img class='link_icon print' title='Print' src='images/icon_print.png'></a>";
    copyButton = "<button class='copy command'>Copy to group</button>";
    deleteButton = "<img class='assessment_delete link_icon' title='Delete' src='images/icon_delete.png'>";
    deleteConfirm = "<span class='assessment_delete_confirm'><div class='menu_box'>Confirm <button class='assessment_delete_yes command_red'>Delete</button> <button class='assessment_delete_cancel command'>Cancel</button></div></span>";
    duplicateButton = "<img class='link_icon duplicate' title='Duplicate' src='images/icon_duplicate.png'>";
    updateButton = "<img class='link_icon update' title='Update' src='images/icon_sync.png'>";
    downloadKey = "<span class='download_key small_grey'>Download key <b>" + (this.model.id.substr(-5, 5)) + "</b></span>";
    archiveSwitch = "    <select class='archive'>      <option value='false' " + (isArchived ? selected : '') + ">Active</option>      <option value='true'  " + (isArchived ? selected : '') + ">Archived</option>    </select>    ";
    if (this.isAdmin) {
      html = "        <div>          " + toggleButton + "          " + adminName + "        </div>      ";
      if (Tangerine.settings.get("context") === "mobile") {
        html += "          <div class='assessment_menu'>            " + runButton + "            " + resultsButton + "            " + updateButton + "          </div>        ";
      } else {
        if (this.isPublic) {
          html += "            <div class='assessment_menu'>              " + copyButton + "            </div>          ";
        } else {
          html += "            <div class='assessment_menu'>              " + runButton + "              " + resultsButton + "              " + editButton + "              " + printButton + "              " + duplicateButton + "              " + deleteButton + "              " + downloadKey + "              " + deleteConfirm + "              " + adminResultCount + "            </div>          ";
        }
      }
    } else {
      html = "<div>" + runButton + name + " " + resultsButton + "</div>";
    }
    return this.$el.html(html);
  };

  return AssessmentListElementView;

})(Backbone.View);
