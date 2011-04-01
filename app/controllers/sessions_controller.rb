# This controller handles the login/logout function of the site.  
class SessionsController < ApplicationController
  # Be sure to include AuthenticationSystem in Application Controller instead
  #include AuthenticatedSystem

  # render new.rhtml
  def new
  end

  def create
    logout_keeping_session!
    user = User.authenticate(params[:email], params[:password])
    if user
      # Protects against session fixation attacks, causes request forgery
      # protection if user resubmits an earlier form using back
      # button. Uncomment if you understand the tradeoffs.
      # reset_session
      self.current_user = user

      @remember_me = params[:remember_me].nil? ? "0":"1"
      new_cookie_flag = (@remember_me == "1")
		  self.current_user.remember_me if new_cookie_flag
      handle_remember_cookie! new_cookie_flag
      respond_to_parent do
        redirect_back_or_default( { :controller => :home, :action => :index } )
      end
      flash[:notice] = "Logged in successfully"
    else
      note_failed_signin
      @login       = params[:login]
      @remember_me = params[:remember_me]
      #redirect_to :controller => :home, :action => :index
      
      if params[:email].nil? or params[:email].empty?
        err_text = "<span>邮箱地址不能为空，请输入邮箱地址。</span>"
      elsif params[:password].nil? or params[:password].empty?
        err_text = "<span>密码不能为空，请输入您的密码。</span>"
      else
        err_text = "<span>邮箱地址或密码不正确，请重新输入。</span>"
      end
      
      respond_to_parent do
        render :update do |page|
          page.replace_html params[:errors], err_text
          page.show params[:errors]
        end
      end
    end
  end

  def destroy
    @user = User.find(session[:user_id])
    @user.update_attributes({:last_logout=>Time.now})
    @suser_id = session[:user_id].to_s
    self.current_user.forget_me if logged_in?
    logout_killing_session!
    session[:suser_id] = @suser_id
    flash[:notice] = "You have been logged out."
    redirect_back_or_default('/')
  end

protected
  # Track failed login attempts
  def note_failed_signin
    flash[:error] = "Couldn't log you in as '#{params[:login]}'"
    logger.warn "Failed login for '#{params[:login]}' from #{request.remote_ip} at #{Time.now.utc}"
  end
end
