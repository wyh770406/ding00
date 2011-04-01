class AttentionsController < ApplicationController
  before_filter :login_required
  
  def index
    
  end
  
  def mine
    @current_user = @user = self.current_user
  end
  
  def fans
    @current_user = @user = self.current_user
  end
  
  def all
    @current_user = @user = self.current_user
  end
  
  def create
    attention = Attention.new( params[:attention] )

    success = attention && attention.save

    if success && attention.errors.empty?
      options = {:user_id=>params[:attention][:user_id],
        :behaviour_type_id=>BehaviourType.behaviour_code(BehaviourType::FOCUSON),
        :remark=>params[:attention][:attention_id]}
      Behaviour.save_behaviour options
      msg = PageMessage.new( :text => '关注他，你可以收到他的所有动态。', :caption => '关注成功！' )
      render :partial => 'controls/tip_box', :locals => { :message => msg }
    else
      msg = PageMessage.new( :messages => attention.errors, :caption => '出错了' )
      render :partial => 'controls/tip_box', :locals => { :message => msg }, :status => 500
    end
  end
  
  def cancel
    begin
      attention = Attention.find( params[:id] )
      @attention_user_id=attention.user_id
      @attention_attention_id=attention.attention_id
      success = attention && attention.destroy
      
      if success && attention.errors.empty?
        if request.xhr?
          options = {:user_id=>@attention_user_id,
            :behaviour_type_id=>BehaviourType.behaviour_code(BehaviourType::CANCELFOCUSON),
            :remark=>@attention_attention_id}
          Behaviour.save_behaviour options
          msg = PageMessage.new( :text => '已取消关注，<br />对方的更新将不再出现您的首页。', :caption => '取消成功！' )
          render :partial => 'controls/tip_box', :locals => { :message => msg }
        end
        #    else
        #      if request.xhr?
        #        msg = PageMessage.new( :text => '取消关注操作失败，<br />请重试。', :caption => '出错了！' )
        #        render :partial => 'controls/tip_box', :locals => { :message => msg }, :status => 500
        #      end
      end
    rescue Exception => e
      logger.info( "Cancel attention (id: #{params[:id]}) failed. #{e.backtrace.first}" )
    else
      
    end
  end
  
  def updatecontrols
    begin
      current_user = User.find( params[:current_user_id] )
      user = User.find( params[:user_id] )
      
      if request.xhr?
        render :partial => 'controls/attention_ctrls', :layout => false, :locals => { :user => user, :current_user => current_user }
      else
        render :nothing => true
      end
    rescue Exception => e
      logger.info( "ATTENTIONS-updatecontrols error: #{e.backtrace}" )
    else
      logger.info( "ATTENTIONS-updatecontrols success." )
    end
  end
    
end
