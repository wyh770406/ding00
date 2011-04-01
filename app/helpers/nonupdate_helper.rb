module NonupdateHelper
  
  private
  
  def convert_options_to_javascript!(html_options, url = '')
    confirm, popup = html_options.delete("confirm"), html_options.delete("popup")
    
    method, href = html_options.delete("method"), html_options['href']
    
    target = html_options.has_key?("target") ? html_options.delete("target") : nil
    
    success = html_options.has_key?("success") ? html_options.delete("success") : nil
    failure = html_options.has_key?("failure") ? html_options.delete("failure") : nil
    
    html_options["onclick"] = case
    when popup && method
      raise ActionView::ActionViewError, "You can't use :popup and :method in the same link"
    when confirm && popup
      "if (#{confirm_javascript_function(confirm)}) { #{popup_javascript_function(popup)} };return false;"
    when confirm && method
      "if (#{confirm_javascript_function(confirm)}) { #{method_javascript_function(method, '', nil, target, success, failure)} };return false;"
    when confirm
      "return #{confirm_javascript_function(confirm)};"
    when method
      "#{method_javascript_function(method, url, href, target, success, failure)}return false;"
    when popup
      popup_javascript_function(popup) + 'return false;'
    else
      html_options["onclick"]
    end
  end
    
  def method_javascript_function(method, url = '', href = nil, target = nil, success = nil, failure = nil) #:nodoc:
    action = (href && url.size > 0) ? "'#{url}'" : 'this.href'
    submit_function =
    "var f = document.createElement('form'); f.style.display = 'none'; " +
    "this.parentNode.appendChild(f); f.method = 'POST'; f.action = #{action};"
    
    if !target.nil? && target.kind_of?(String)
      submit_function << "f.target = '#{target}';"
      
      if !success.nil? && success.kind_of?(String)
        submit_function << "var u = document.createElement('input'); u.setAttribute('type', 'hidden'); "
        submit_function << "u.setAttribute('name', 'success'); u.setAttribute('value', '#{success}'); f.appendChild(u);"
      end
      
      if !success.nil? && success.kind_of?(String)
        submit_function << "var e = document.createElement('input'); e.setAttribute('type', 'hidden'); "
        submit_function << "e.setAttribute('name', 'failure'); e.setAttribute('value', '#{failure}'); f.appendChild(e);"
      end
    end
    
    unless method == :post
      submit_function << "var m = document.createElement('input'); m.setAttribute('type', 'hidden'); "
      submit_function << "m.setAttribute('name', '_method'); m.setAttribute('value', '#{method}'); f.appendChild(m);"
    end  
    
    if protect_against_forgery?
      submit_function << "var s = document.createElement('input'); s.setAttribute('type', 'hidden'); "
      submit_function << "s.setAttribute('name', '#{request_forgery_protection_token}'); s.setAttribute('value', '#{escape_javascript form_authenticity_token}'); f.appendChild(s);"
    end
    submit_function << "f.submit();"
  end
  
#    <div class="confirm-frame">
#        <p>确定删除这封信吗？</p>
#        <span><%= link_to_function '确定', '', :class => 'ctrl-button ctrl-ok-64x23' %></span>
#        <span><%= link_to_function '取消', '', :class => 'ctrl-button ctrl-ok-64x23' %></span>
#    </div>
  def confirm_javascript_function(confirm)
    
  end
#  def confirm_javascript_function(confirm, method, target = nil, success = nil, failure = nil)
#    confirm_function = "var c = document.createElement('div'); c.setAttribute('class', '#{confirm[:class]}');" +
#      "this.parentNode.appendChild(c); this.parentNode.style.position = 'relative'; c.style.position = 'absolute';" +
#      "c.style.top = '0'; c.style.right = '0';"
#    
#    content = confirm.delete(:content)
#    if content
#      confirm_function << "var p = document.createElement('p'); p.innerHTML = '#{content}'; c.appendChild(p);"
#    end
#    
#    method_of_function = method_javascript_function(method, '', nil, target, success, failure)
#    #ok_button = link_to_function '确定', escape_javascript(method_of_function), :class => confirm[:ok_class]
#    confirm_function << "var a = document.createElement('a'); a.setAttribute('class', '#{confirm[:ok_class]}'); a.setAttribute('href', this.href);" +
#      "a.setAttribute('onclick', '#{method_of_function}');"
#    cl_button = link_to_function '取消', 'this.parentNode.parentNode.removeNode(true);', :class => confirm[:cl_class]
#    
#    confirm_function << "var ok = document.createElement('span');" + 
#      "ok.innerHTML = a; ok.style.display = 'inline'; ok.setAttribute('href', this.href); c.appendChild(ok);"
#    confirm_function << "var cl = document.createElement('span');" + 
#      "cl.innerHTML = '#{cl_button}'; cl.style.display = 'inline'; c.appendChild(cl);"
#    
#    confirm_function << "return false;"
#    
#  end
  
end

ActionView::Helpers::UrlHelper.send :include, NonupdateHelper