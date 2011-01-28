#TODO add QUNIT tests

class Template

Template.JQueryMobilePage = () ->  "
<div data-role='page' id='{{{page_id}}'>
  <div data-role='header'>
    {{{header}}}
  </div><!-- /header -->
  <div data-role='content'>	
    {{{content}}}
  </div><!-- /content -->
  <div data-role='footer'>
    {{{footer_text}}}
  </div><!-- /header -->
</div><!-- /page -->
"

Template.JQueryCheckbox = () -> "
<input type='checkbox' name='{{unique_name}}' id='{{unique_name}}' class='custom' />
<label for='{{unique_name}}'>{{{content}}}</label>
"

Template.JQueryLogin = () -> "
<form>
  <div data-role='fieldcontain'>
    <label for='username'>Username:</label>
    <input type='text' name='username' id='username' value='Enumia' />
    <label for='password'>Password (not needed for demo):</label>
    <input type='password' name='password' id='password' value='' />
  </div>
</form>
"

Template.Timer = () -> "
<div>
  <span id='{{id}}'>{{seconds}}</span>
  <a href='#' data-role='button'>start</a>
  <a href='#' data-role='button'>stop</a>
  <a href='#' data-role='button'>reset</a>
</div>
"

Template.Scorer = () -> "
<div>
  <small>
  Completed:<span id='completed'></span>
  Wrong:<span id='wrong'></span>
  </small>
</div>
"

class JQueryMobilePage
  render: ->
    @footer_text = @footer ? ("<a href='##{@next_page.page_id}'>#{@next_page.page_id}</a>" if @next_page?)
    Mustache.to_html(Template.JQueryMobilePage(),this)

class JQueryCheckbox
  render: ->
    Mustache.to_html(Template.JQueryCheckbox(),this)

class JQueryCheckboxGroup
  render: ->
    @fieldset_size ?= 10
    fieldset_open = "<fieldset data-role='controlgroup' data-type='horizontal' data-role='fieldcontain'>"
    fieldset_close = "</fieldset>"
    fieldsets = ""

    for checkbox,index in @checkboxes
      fieldsets += fieldset_open if index % @fieldset_size == 0
      fieldsets += checkbox.render()
      fieldsets += fieldset_close if ((index + 1) % @fieldset_size == 0 or index == @checkboxes.length-1)
    
    "
<div data-role='content'>	
  <form>
    #{fieldsets}
  </form>
</div>
    "

  three_way_render: ->
    @first_click_color ?= "#FF0000"
    @second_click_color ?= "#009900"

    this.render() +
# TODO rewrite as coffeescript and use jquery .live for binding click event
    "<script>
    $(':checkbox').click(function(){
      var button = $($(this).siblings()[0]);
      button.removeClass('ui-btn-active');
      button.toggleClass(function(){
        button = $(this);
        if(button.is('.first_click')){
          button.removeClass('first_click');
          return 'second_click';
        }
        else if(button.is('.second_click')){
          button.removeClass('second_click');
          return '';
        }
        else{
          return 'first_click';
        }
      });
    });
    </script>
    <style>
      #Letters label.first_click{
        background-image: -moz-linear-gradient(top, #FFFFFF, #{@first_click_color}); 
        background-image: -webkit-gradient(linear,left top,left bottom,color-stop(0, #FFFFFF),color-stop(1, #{@first_click_color}));   -ms-filter: \"progid:DXImageTransform.Microsoft.gradient(startColorStr='#FFFFFF', EndColorStr='#{@first_click_color}')\"; 
      }
      #Letters label.second_click{
        background-image: -moz-linear-gradient(top, #FFFFFF, #{@second_click_color}); 
        background-image: -webkit-gradient(linear,left top,left bottom,color-stop(0, #FFFFFF),color-stop(1, #{@second_click_color}));   -ms-filter: \"progid:DXImageTransform.Microsoft.gradient(startColorStr='#FFFFFF', EndColorStr='#{@second_click_color}')\";
      }
      #Letters .ui-btn-active{
        background-image: none;
      }
    </style>
    "

class JQueryLogin
  render: ->
    Mustache.to_html(Template.JQueryLogin(),this)

class Timer
  start: ->
    return if @running
    @running = true
    @tick_value = 1
# Note that we are using => not ->. This lets the decrement function have access @seconds.
    decrement = =>
      @seconds -= @tick_value
      clearInterval(@intervalId) if @seconds == 0
      $(@element_location).html(@seconds)
    @intervalId = setInterval(decrement,@tick_value*1000)

  stop: ->
    @running = false
    clearInterval(@intervalId)

  reset: ->
    @seconds = 60
    $(@element_location).html(@seconds)

  render: ->
    @id = "timer"
    @element_location = "##{@id}"
    @seconds = 60
    Mustache.to_html(Template.Timer(),this)

 
class Scorer
  update: ->
    completed = wrong = 0
    for element in $('.ui-page-active .ui-checkbox label.ui-btn')
      element = $(element)
      wrong++ if element.is('.first_click')
      completed++
      break if element.is('.second_click')
    $('#completed').html(completed)
    $('#wrong').html(wrong)

  render: ->
    @id = "scorer"
    setInterval( this.update, 500)
    Mustache.to_html(Template.Scorer(),this)
