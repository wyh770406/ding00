require 'RMagick'
include Magick

class UsersController < ApplicationController
  # Be sure to include AuthenticationSystem in Application Controller instead
  #include AuthenticatedSystem
  
  before_filter :login_required, :only => [ :baseinfo, :avatar, :edit ]

  # render new.rhtml
  def new
    @user = User.new
  end
  
  # show user information
  def show
    @user = User.find(params[:id])
    @user.userdetail = UserDetail.new( :user_id => @user.id ) if @user.userdetail.nil?
    @current_user = self.current_user
    @attention = @current_user.attention @user
  end
  
  # edit user information
  def edit
    @user = User.find(params[:id])
    @user.userdetail = UserDetail.create :user_id => @user.id if @user.userdetail.nil?
    @current_user = self.current_user
  end
  
  # render user base-information
  def baseinfo
    @user = User.find(params[:id])
  end
  
  # render user avatar UI
  def avatar
    @user = self.current_user
  end
 
  def create
    logout_keeping_session!
    @user = User.new(params[:user])
    success = @user && @user.save
    if success && @user.errors.empty?
      # Protects against session fixation attacks, causes request forgery
      # protection if visitor resubmits an earlier form using back
      # button. Uncomment if you understand the tradeoffs.
      # reset session
      self.current_user = @user # !! now logged in
      redirect_back_or_default( baseinfo_users_path( :id => @user.id ) )
      #flash[:notice] = "Thanks for signing up!  We're sending you an email with your activation code."
    else
      #flash[:error]  = "We couldn't set up that account, sorry.  Please try again, or contact an admin (link is above)."
      #render :controller => :users, :action => :new, :layout => false
      #redirect_to new_user_path
      logger.error( "[DING00 ERROR] create user failure: #{@user.errors.full_messages}" )
    end
  end
  
  def update_baseinfo
    values = params[:user]
    user = User.update(params[:id], values)
    
    if user.errors.empty?
      redirect_to :action => :avatar
    else
      render :nothing => true
    end
  end
  
  def update
    @user = User.find( params[:id] )
    success = @user && @user.update_attributes( params[:user] )
    if request.xhr?
      if success && @user.errors.empty?
        msg = PageMessage.new( :caption => '详细资料编辑成功' )
        render :partial => 'controls/tip_box', :locals => { :message => msg }
      else
        msg = PageMessage.new( :messages => @user.errors, :caption => '出错了' )
        render :partial => 'controls/tip_box', :locals => { :message => msg }, :status => 500
      end
    end
  end
  
  # validate the email format
  def validate_password_confirmation
    user = User.create( :password => params[:pwd], :password_confirmation => params[:pwd_confirmation] )
    
    if user.errors.invalid?( :password_confirmation )
      render :text => user.errors.on( :password_confirmation ), :status => 500
    else 
      render :nothing => true
    end
  end
  
  # validate the name field
  def validate_field
    field_name = params[:field]
    user = User.create( field_name.to_sym => params[:value] )
    
    if user.errors.invalid?( field_name.to_sym )
      render :text => user.errors.on( field_name.to_sym ), :status => 500
    else  
      render :nothing => true
    end
  end

  def upload_icon
    @user = self.current_user
    success = @user.update_attributes( params[:user] )
    update = params[:update]
    template = params[:template]
    
    if success && @user.errors.empty?
      respond_to do |format|
        format.js do
          responds_to_parent do
            render :update do |page|
              page.replace_html update, :partial => template
              page.call 'start_edit', @user.avatar.url
            end
          end
        end
      end
    else
      render :nothing => true
    end
  end
  
  def photoeditor
    @user = self.current_user
    scale = params[:scale].to_f
    x = params[:x].to_i
    y = params[:y].to_i
    w = params[:w].to_i
    h = params[:h].to_i
    
    imgurl = @user.avatar.url(:original).split('?').first
    imgurl = 'public' + imgurl
    saveurl = imgurl.gsub('original', 'final')
    imgname = File.basename(Dir.pwd+"/"+imgurl)

    savedir = File.dirname(Dir.pwd+"/"+imgurl).gsub('original', 'final')

    if !File.exists?(savedir)
      FileUtils.mkdir_p savedir
    end

    image = Magick::Image::read(imgurl).first
    
    image.resize!(scale)
    image.crop!(x, y, w, h)
    image.write(saveurl)

    success = @user.update_attributes( :old_avatar_file_name => imgname )

    if success && @user.errors.empty?
      if params[:update_type] && params[:update_type].eql?( 'img' )
        render :text => @user.avatar_url + '?' + Time.now.to_i.to_s
      else
        render :update do |page|
          page.replace_html 'avatar_view_box', :partial => 'current_avatar'
        end
      end
    else
      render :nothing => true
    end
  end
  
  def cancel_edit_avatar
    @user = self.current_user

    render :update, :nothing => true do |page|
      page.replace_html 'avatar_view_box', :partial => 'current_avatar'
      page[:upload_form].reset
    end
  end

  def load_event_friends_list #nodoc
    user = User.find( params[:id] )
    friends = user.find_message_friends

    respond_to do |format|
     # format.html { render :partial => 'templates/home_friend_list', :object => friends }
      format.json { render :json => friends.to_json( :only => [:id, :name], :methods => [:avatar_url] ) }
    end
  end

  def load_friends_list #nodoc
    user = User.find( params[:id] )
    friends = user.find_friends
    
    respond_to do |format|
      format.html { render :partial => 'templates/home_friend_list', :object => friends }
      format.json { render :json => friends.to_json( :only => [:id, :name], :methods => [:avatar_url] ) }
    end
  end

  def load_attention_list #no-doc
    @user = User.find( params[:id] )
    render :partial => 'templates/home_attention_list', :locals => { :attentions => @user.all_attentions }
  end
  
  def upload_image
    begin
      #logger.info( "[ding00 INOF] #{params[:image]}" )
      user = self.current_user
      unless request.get?
        uploadFile(params[:image], :path => "system/photos/#{user.id}")
      end
    rescue Exception => e
      logger.error( "[ding00 ERROR] occur error when upload image." )
      text = %Q({"success": "false", "text": "上传图片时发生内部错误."})
      render :text => text
    else
      text = %Q({"success": "true", "text": "上传图片成功."})
      render :text => text
    end
  end
  
  def delete_image
    begin
      url = params[:image]
      filename = "#{RAILS_ROOT}/public#{url}"
      File.unlink(filename)
    rescue Exception => e
      logger.error( "[ding00 ERROR] delete image file failure.(#{filename})" )
      raise '删除图片时发生内部错误.'
    else
      render :nothing => true
    end
  end
  
  def image_list #no-doc
    begin
      user = self.current_user
      folder_path = "/public/system/photos/#{user.id}"
      lists = imgf_name_list(folder_path)
      render :json => lists
    rescue Exception => e
      logger.error( "[ding00 ERROR] get image list failure." )
      render :text => e.backtrace, :status => 500
    else
      #logger.info( "[ding00 INFO] #{lists}" )
    end
  end

  def reset_password

    if password_reset_from_cookie?

      flash[:notice]="没过期"
    else
      flash[:notice]="已过期"
    end

    kill_password_reset_cookie!
  end

  def kill_password_reset_cookie!
    cookies.delete :pwd_reset_auth_token
  end

  def password_reset_from_cookie?

    exist_password_reset_user = !cookies[:pwd_reset_auth_token].blank? && !User.find_by_password_reset_token(cookies[:pwd_reset_auth_token]).nil?
    password_reset_user = User.find_by_password_reset_token(cookies[:pwd_reset_auth_token]) if exist_password_reset_user

    if exist_password_reset_user && password_reset_user.password_reset_exp_token?
      handle_password_reset_cookie!(password_reset_user) # freshen cookie token (keeping date)
      return true
    else
      return false
    end
  end
end
