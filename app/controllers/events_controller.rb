class EventsController < ApplicationController
  before_filter :login_required

  def get_eventjson
    d = Date.new(params[:eventy].to_i, params[:eventm].to_i, params[:eventd].to_i)

    @events=Event.getevent(params[:userid].to_i,d,d+6)

    render :text=>to_convert_json("Event",{:obja=>@events})

  end

  def quick_create
    cdt = Date.new(params[:cdty].to_i, params[:cdtm].to_i, params[:cdtd].to_i)
    params[:titleInput]="新事件" if params[:titleInput].nil?
    params[:titleInput]="新事件" if params[:titleInput].strip=="" unless params[:titleInput].nil?
    @user = self.current_user
    @event=Event.create!(
      {:user=>@user,
        :title=>params[:titleInput],
        :begin_at=>cdt,
        :end_at=>cdt,
        :begin_time=>params[:cdtbt],
        :end_time=>params[:cdtet],
        :address=>"",
        :description=>"",
        :color=>"#333333"
      })

    options = {:user_id=>@user.id,
      :behaviour_type_id=>BehaviourType.behaviour_code(BehaviourType::EVENT),
      :remark=>@event.id.to_s+"@&$"+@event.title}
    Behaviour.save_behaviour options

    @eventary = Array.new
    @eventary << @event
    render :text=>to_convert_json("Event",{:obja=>@eventary})
  end

  def destroy
    @event=Event.find(params[:id])

    options = {:user_id=>self.current_user.id,
      :behaviour_type_id=>BehaviourType.behaviour_code(BehaviourType::DELEVENT),
      :remark=>@event.title}

    Behaviour.save_behaviour options 

    @event.destroy


    render :nothing=>true
  end
  
  # create a new event
  def new
    @user = self.current_user
   
    if request.post?
      title = params[:titleInput]
      begin_at = end_at = Date.new( params[:cdty].to_i, params[:cdtm].to_i, params[:cdtd].to_i )
      begin_time = params[:cdtbt]
      end_time = params[:cdtet]
      
      new_options = { 
        :title => title,
        :begin_at => begin_at,
        :end_at => end_at,
        :begin_time => begin_time,
        :end_time => end_time
      }
      
      @event = Event.new( new_options )
      #  @eventphotoobj=@event.eventPhotos.build
    else
      redirect_to_home
    end
  end
  
  # create a event
  def create
    @event = Event.new( params[:event] )
    @user = current_user
    @event.user = @user

    success = @event && @event.save 


    if success && @event.errors.empty?
      options = {:user_id=>@user.id,
        :behaviour_type_id=>BehaviourType.behaviour_code(BehaviourType::EVENT),
        :remark=>@event.id.to_s+"@&$"+@event.title}
      Behaviour.save_behaviour options

      build_notification(@event,NotificationType::EVENT)
      #      invited_ids = params[:event][:invitations]
      #      arr_invited_ids = invited_ids.split(",")
      #      arr_invited_ids.each  do |invited_id|
      #        EventInvitation.create!({:event_id=>@event.id,:invited_id=>invited_id,:status=>2})
      #      end


      respond_to do |format|
        format.js do
          responds_to_parent do
            render :update do |page|
              #page.alert("success")
              page.redirect_to :controller => :home, :action => :index
            end
          end
        end
      end
      # redirect_to :controller => :home, :action => :index
    else
      logger.info("[ding00] #{@event.errors.full_messages}")
      redirect_to :back
    end
  end
  
  # show a event detail
  def show
    @current_user = self.current_user
    begin
      @event = Event.find( params[:id] )
    rescue
      redirect_back_or_default( :controller => :home )
    else
    end
  end
  
  # edit event
  def edit
    @current_user = self.current_user
    begin
      @event = Event.find( params[:id] )
    rescue
      redirect_back_or_default( :controller => :home )
    else
    end
  end
  
  # nodoc
  def update
    begin
      @event = Event.find( params[:id] )
      success = @event && @event.update_attributes( params[:event] )
      if success && @event.errors.empty?
        build_notification(@event,NotificationType::EVENT)
        if request.xhr?
          # TODO: to reponse the ajax request
        else
          logger.info( "Update event (id: #{@event.id}) success!" )
          redirect_back_or_default( :controller => :home )
        end
      else
        # TODO: response errors to client
      end
    rescue Exception => e
      # TODO: error message
      logger.error( "Update event error: #{e.backtrace.first}" )
      redirect_to :back
    else
      
    end
  end
  
  def update_eventdt
    @event=Event.find(params[:id])
    @begin_at=Date.new(params[:sdy].to_i, params[:sdm].to_i, params[:sdd].to_i)
    @end_at=Date.new(params[:edy].to_i, params[:edm].to_i, params[:edd].to_i)
    @event.update_attributes!({:begin_at=>@begin_at,:end_at=>@end_at,:begin_time=>params[:sdt],:end_time=>params[:edt]})
    @eventary = Array.new
    @eventary << @event
    render :text=>to_convert_json("Event",{:obja=>@eventary})
  end

  def update_eventedt
    @event=Event.find(params[:id])

    @end_at=Date.new(params[:edy].to_i, params[:edm].to_i, params[:edd].to_i)
    @event.update_attributes!({:end_at=>@end_at,:end_time=>params[:edt]})
    @eventary = Array.new
    @eventary << @event
    render :text=>to_convert_json("Event",{:obja=>@eventary})
  end

  def add_to_favorite
    @current_user=self.current_user
    @event = Event.find(params[:id])
    if @event.can_favorite(@current_user)
      begin
        @event_favorite = EventFavorite.new(:user_id=>@current_user.id,:event_id=>params[:id])
        success = @event_favorite.save!
        if request.xhr?

          if success && @event_favorite.errors.empty?
            render :text => '收藏事件成功.'
          else
            render :text => @event_favorite.errors.first, :status => 500
          end
        end
      rescue ActiveRecord::RecordInvalid => invalid
        render :text => '已收藏, 不能重复操作.', :status => 500
      end
    else
      render :text => '收藏事件前,你必须先关注该事件的发起人!', :status => 500
    end
  end

  def attending_to_event
    @current_user=self.current_user
    @event = Event.find(params[:id])
    
    if !@event.past_deadline?
      if !@event.be_invited?(@current_user)

        if @event.private == Event::PUBLIC
          render :text => '这是公共活动,请等待活动发起人的确认来决定你是否有权参加!', :status => 500
        else
          render :text => '对不起,这是私人活动,因为你没有被邀请,所以你无权参加!', :status => 500
        end

      else
        if @event.status_selected(@current_user)!=EventInvitation::ACCEPT
          @event_invitation = EventInvitation.find_by_event_id_and_invited_id(params[:id],@current_user.id)
          @event_invitation.status = EventInvitation::ACCEPT
          @event_invitation.accepted_at = Time.now
          success = @event_invitation.save!
          if request.xhr?

            if success && @event_invitation.errors.empty?
              render :text => '你已接受该活动的邀请!'
            else
              render :text => '接受邀请时发生错误!', :status => 500
            end
          end
        else
          render :text => '你已接受该活动请求!', :status => 500
        end
      end
    else
      render :text => '该活动已过最后期限!', :status => 500
    end
  end

  def refuse_to_event
    @current_user=self.current_user
    @event = Event.find(params[:id])
    if !@event.past_deadline?
      if @event.status_selected(@current_user)!=EventInvitation::REFUSE
        @event_invitation = EventInvitation.find_by_event_id_and_invited_id(params[:id],@current_user.id)
        @event_invitation.status = EventInvitation::REFUSE
        @event_invitation.accepted_at = Time.now
        success = @event_invitation.save!
        if request.xhr?

          if success && @event_invitation.errors.empty?
            render :text => '你拒绝参加该活动!'
          else
            render :text => '你拒绝参加该活动时发生错误!', :status => 500
          end
        end
      else
        render :text => '你已拒绝该活动请求!', :status => 500
      end
    else
      render :text => '该活动已过最后期限!', :status => 500
    end
  end

  def back_to_event
    @current_user=self.current_user
    @event = Event.find(params[:id])
    if !@event.past_deadline?
      if @event.status_selected(@current_user)!=EventInvitation::PENDING
        @event_invitation = EventInvitation.find_by_event_id_and_invited_id(params[:id],@current_user.id)
        @event_invitation.status = EventInvitation::PENDING
        @event_invitation.accepted_at = Time.now
        success = @event_invitation.save!
        if request.xhr?

          if success && @event_invitation.errors.empty?
            render :text => '你反悔参加该活动!'
          else
            render :text => '你反悔参加该活动时发生错误!', :status => 500
          end
        end
      else
        render :text => '你已反悔参加该活动请求!', :status => 500
      end
    else
      render :text => '该活动已过最后期限!', :status => 500
    end
  end
  
  def favorite_count
    if request.xhr?
      @event = Event.find(params[:id])
      render :text => @event.favorite_count
    else
      render :nothing => true
    end
  end
  
  def favorite_users
    if request.xhr?
      @event = Event.find(params[:id])
      render :partial=>"favorite_users", :locals => {:favorite_users=>@event.favorite_users}
    else
      render :nothing => true
    end
  end
    
  def attending_count
    if request.xhr?
      @event = Event.find(params[:id])
      render :text => @event.attending_count
    else
      render :nothing => true
    end
  end

  def attending_users
    if request.xhr?
      @event = Event.find(params[:id])
      render :partial=>"attending_users", :locals => {:attending_users=>@event.attending_users}
    else
      render :nothing => true
    end
  end
  
  def event_status
    if request.xhr?
      status = json_event_status(params[:id])
      render :json => status
    else
      render :nothing => true
    end
  end
end
