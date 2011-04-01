class MessagesController < ApplicationController
  before_filter :login_required
  
  def index
    begin
    rescue Exception => e
      logger.info( "INFO: #{e.backtrace}" )
    else
    end
  end
  
  def sent
    @user = self.current_user
    @messages = Message.find_sent_messages(@user.id, :page => params[:page], :per_page => 10)
  end

  def recv
    @user = self.current_user
    @messages = Message.find_recv_messages(@user.id, :page => params[:page], :per_page => 10)
  end

  def reply
    update = params[:update]
    @user = self.current_user
    @message = Message.find(params[:id])
    @message.set_recv_readed
    @reply = Message.new(:send_id => @user.id)
    respond_to_iframe :update => update, :template => 'reply', :locals => { :message => @message }
  end
  
  def backrecv
    @user = self.current_user
    @messages = Message.find_recv_messages(@user.id, :page => params[:page], :per_page => 10)
    update = params[:update]
    respond_to_iframe :update => update, :template => 'recv', :locals => { :messages => @messages }
  end
  
  def backsent
    @user = self.current_user
    @messages = Message.find_sent_messages(@user.id, :page => params[:page], :per_page => 10)
    update = params[:update]
    respond_to_iframe :update => update, :template => 'sent', :locals => { :messages => @messages }
  end
  
  def read
    update = params[:update]
    @message = Message.find(params[:id])
    respond_to_iframe :update => update, :template => 'read', :locals => { :message => @message }
  end

  def new
    if (params[:recv_id])
      @recv = User.find(params[:recv_id])
    end
    @user = self.current_user
    @friends = @user.find_message_friends
    @message = Message.new(:send_id => @user.id)
  end
  
  def create
    begin
      if params[:replyto]
        @replyto = Message.find(params[:replyto])
        @replyto.set_recv_replied
      end
      
      @message = Message.new( params[:message] )
      success = @message && @message.save

      build_notification(@message,NotificationType::MESSAGE)

    rescue Exception => e
      error_text = "<span>发送站内信时发生错误</span>"
    else
      error_text = "<span>#{@message.errors.first[1]}</span>" if !@message.errors.empty?
    end
    
    if success && @message.errors.empty?
      respond_to_parent do
        if params[:replyto]
          redirect_to :action => :recv
        else
          redirect_to :action => :sent
        end
      end
    else
      respond_to_parent do
        render :update do |page|
          page.replace_html params[:errors], error_text
          page.show params[:errors]
        end
      end
    end
  end
  
  def destroy
    message = Message.find(params[:id])
    success = false
    @user = self.current_user
    
    begin
      case params[:template]
      when 'recv'
        success = message && message.remove_recv
        @messages = Message.find_recv_messages @user.id
      when 'sent'
        success = message && message.remove_sent
        @messages = Message.find_sent_messages @user.id
      end
    rescue Exeption => e
      render :nothing => true
      logger.info( "[DING00 ERROR] delete the message failure." )
    else
      respond_to_parent do
        render :update do |page| 
          page.replace_html params[:update], :partial => params[:template], :locals => { :messages => @messages }
        end
      end
    end
  end
  
  def empty_recv_box
    begin
      @user = self.current_user
      Message.empty_recv_box(@user.id)
      @messages = Message.find_recv_messages @user.id
    rescue Exception => e
      render :nothing => true
      logger.info( "[DING00 ERROR] empty the user(id:#{@user.id}) received box failed." )
    else
      respond_to_parent do
        render :update do |page|
          page.replace_html params[:update], :partial => 'recv', :locals => { :messages => @messages }
        end
      end
    end
  end
  
  def empty_sent_box
    begin
      @user = self.current_user
      Message.empty_sent_box(@user.id)
      @messages = Message.find_sent_messages @user.id
    rescue Exception => e
      render :nothing => true
      logger.info( "[DING00 ERROR] empty the user(id:#{@user.id}) sent box failed." )
    else
      respond_to_parent do
        render :update do |page|
          page.replace_html params[:update], :partial => 'sent', :locals => { :messages => @messages }
        end
      end
    end
  end
  
  def destroy_all
    begin
      @user = self.current_user
      logger.info( "[DING00 INFO] ids => #{params[:ids]}" )
      case params[:template]
      when 'recv'
        Message.delete_all_recv(params[:ids])
      when 'sent'
        Message.delete_all_sent(params[:ids])
      end
      @messages = Message.find_recv_messages @user.id
    rescue Exception => e
      # TODO: client selected empty error
      render :nothing => true
      logger.info( "[DING00 ERROR] delete selected messages (ids:#{params[:ids]}) of #{params[:template]} box failed." )
    else
      respond_to_parent do
        render :update do |page|
          page.replace_html params[:update], :partial => params[:template], :locals => { :messages => @messages }
        end
      end
    end
  end
end
