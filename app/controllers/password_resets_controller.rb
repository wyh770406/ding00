class PasswordResetsController < ApplicationController
  layout 'users'
  def new
  end

  def create
    user = User.find_by_email(params[:user][:email])
    respond_to do |format|
      format.html do
        if user.nil?
          flash[:notice] = "无效的邮件地址!"
          render :action => "new"
        else
          handle_password_reset_cookie!(user)
          PersonMailer.deliver_password_reset(user)
          flash[:notice] = "请查收你的邮件,继续重置密码!"
          render :action => "new"
        end
      end
    end
  end






end
