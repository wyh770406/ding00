module HomeHelper
  
  #
  def show_friend_list
    render :partial => 'friend_list'
  end
  
  def show_mode_buttons( options = {} ) #no-doc
    options = { :mode => 'time' }.merge!( options )
    html = ''
    time_active = 'time'
    list_active = 'list'
    time_active << ' ' + options[:active] if options[:mode].eql?( 'time' )
    list_active << ' ' + options[:active] if options[:mode].eql?( 'list' )
    
    html << content_tag(:span, :class => time_active) do 
      link_to_remote '时间模式浏览', :url => { :action => options[:action], :mode => 'time' }, :update => options[:update],
        :before => options[:before], :success => options[:success], :failure => options[:failure]
    end
    
    html << content_tag(:span, :class => list_active) do
      link_to_remote '列表模式浏览', :url => { :action => options[:action], :mode => 'list' }, :update => options[:update],
        :before => options[:before], :success => options[:success], :failure => options[:failure]
    end
    
    html
  end

  def get_behaviour_type type_id,remark_id
    retoptions={}
    type_code = BehaviourType.find(type_id).code

    case type_code
      
    when BehaviourType::EVENT
      aremark = remark_id.split("@&$")
      begin
        @event=Event.find(aremark[0])
      rescue
        @event=nil
      end

      @event_link_val = aremark[1]
      @event_link_val = link_to @event.title,event_path(@event) unless @event.nil?
      retoptions={:desc=>"创建事件",:val=>@event_link_val}

    when BehaviourType::FOCUSON
      @user=User.find(remark_id)
      @user_name = (@user==current_user)?"我":@user.name if logged_in?
      @user_name_val = link_to @user_name,{:controller=>:home,:action=>:friend,:id=>@user} 
      retoptions={:desc=>"关注了",:val=>@user_name_val}

    when BehaviourType::DELEVENT
      @event_link_val = remark_id
      retoptions={:desc=>"删除事件",:val=>@event_link_val}

    when BehaviourType::CANCELFOCUSON
      @user=User.find(remark_id)
      @user_name = (@user==current_user)?"我":@user.name if logged_in?
      @user_name_val = link_to @user_name,{:controller=>:home,:action=>:friend,:id=>@user}
      retoptions={:desc=>"取消关注了",:val=>@user_name_val}

    else
      retoptions={}
    end
    retoptions
  end
end
