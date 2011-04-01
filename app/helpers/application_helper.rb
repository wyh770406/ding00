# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  include CustomJson
  # set page title
  def pagetitle(page_title)
    content_for :title do
      "#{page_title} - 叮呤呤"
    end
  end
  
  # add stylesheet file into header tag
  def add_stylesheet name, yield_name = :stylesheet
    content_for yield_name, stylesheet_link_tag(name)
  end
    
  # add javascript file into header tag
  def add_javascript name, yield_name = :javascript
    content_for yield_name, javascript_include_tag(name)
  end
    
  def get_avatar_url(user)
    get_avatar(user)
  end
  
  # show logo bar
  def show_logo_bar
    render :partial => 'templates/logo_bar'
  end
  
  # nodoc
  def generate_logo_bars options = {}
    html = ''
    
    if options.has_key?( :bars )
      bars = options[:bars]
    end
    
    bars.each do |bar|
      html << content_tag(:span, :class => options[:class]) do
        link_to(bar[:caption], bar.has_key?(:link) ? bar[:link] : 'javascript:void(0)', :class => bar[:class])
      end
      if options[:separation] && bars.index( bar ) < bars.length - 1
        html << content_tag(:span, '', :class => options[:sepclass])
      end
    end
    
    html
  end
  
  # show user info
  # TODO: by user id
  def show_user_info(user)
    render :partial => 'templates/user_info', :object => user
  end
  
  # show calendar main frame
  def show_main_frame
    render :partial => 'templates/main_frame'
  end
  
  # generate the user information box for different page
  def generate_userinfo_ctrls(options = {})
    html = ''
    btns_html = ''
    
    options[:buttons].each do |button|
      btns_html << content_tag(:li) do
        if button[:ajax]
          link_to_remote button[:title], :url => button[:link],
            :update => 'tip_box',
            :success => 'show_tip_box(request)',
            :failure => 'show_tip_box(request)',
            :html => { :class => button.has_key?( :class ) ? button[:class] : options[:button_class] }
        else
          link_to button[:title], button.has_key?( :link ) ? button[:link] : 'javascript:void(0)',
            :class => button.has_key?( :class ) ? button[:class] : options[:button_class]
        end
      end
    end
    
    html << content_tag(:ul, btns_html)
  end
  
  # generate home tool bar template
  def generate_home_tool_bar
    render :partial => 'templates/home_tool_bar'
  end
  
  #
  def redirect_back_or_default( default )
    url_for( session[:return_to] || default )
  end
  
  # generate attention control
  def generate_attention_control opts
    html = ''
    
    html << content_tag(:div, :id => 'attention_ctrls') do
        render :partial => 'controls/attention_ctrls', :locals => { :current_user => opts[:current_user], :user => opts[:user] }
    end
    html
  end
  
  def generate_tabs options
    ul = ''
    lis = ''
    
    options[:tabs].each do |tab|
      tab_class = options[:link_class]
      tab_class += (' ' + options[:link_active_class]) if current_page?( :action => tab[:action] )
      
      lis << content_tag(:li) do
        link_to tab[:title], { :action => tab[:action] }, :class => tab_class
      end
    end
    
    ul << content_tag(:ul, lis)
  end

  # non-update request page
  #
  # usage: update_partial(:url => {:action => :demo}, :before => 'onbefore', :loaded => 'onloaded', :update => 'demo')
  # example:
  #  <%= image_tag 'loading.gif', :id => 'loading', :style => 'display: none;' %>
  #  <div id="demo"></div>
  #  <script type="text/javascript">
  #      function onloaded() { $('#loading').hide(); }
  #      function onbefore() { $('#demo').html(''); $('#loading').show(); }
  #  </script>
  #  <%= link_to_function 'FRAME', update_partial(:url => {:action => :demo}, :before => 'onbefore', :loaded => 'onloaded', :update => 'demo'), :href => 'javascript:void(0)' %>
  def update_partial options = {}
    options = {
      :url => {},
      :before => "function() {;}",
      :loaded => "function() {;}"
    }.merge!( options )
      
    "request_page( { onbefore : #{options[:before]}, onloaded : #{options[:loaded]}, url : '#{url_for(options[:url])}', update : '#{options[:update]}' } )"
  end
end
