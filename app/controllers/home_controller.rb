class HomeController < ApplicationController
  
  before_filter :login_required
  
  def index
    @current_user = @user = self.current_user
    
    session[:calendar] = nil
    @calendar = generate_calendar
    @calendar.userid = @user.id
    session[:calendar] = @calendar
    
    d = Date.today
    get_week_fdate(d)
    @userid=@current_user.id

    @friends_behaviours = @user.friends_behaviours
    @self_behaviours = @user.behaviours
    @self_favorites = @user.favorites
    @online_flag = true
  end
  
  def friend
    begin
      @user = User.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      @user = nil
    end
    if @user.nil?
      redirect_to :action => :index
    else
      @calendar = generate_calendar
      session[:calendar] = @calendar
      @current_user = self.current_user
      @calendar.userid = @user.id
      d = Date.today
      get_week_fdate(d)
      @userid=params[:id].to_i

      @friends_behaviours = @user.friends_behaviours
      @self_behaviours = @user.behaviours
      @self_favorites = @user.favorites
   #   session = ActiveRecord::SessionStore::Session.find(:first, :conditions => ["updated_at >= ?", 15.minutes.ago], :order => "updated_at DESC")

      sessions =  ActiveRecord::SessionStore::Session.find(:all, :conditions => ["updated_at >= ?", 15.minutes.ago], :order => "updated_at DESC")
      @online_flag = false

      sessions.each do |sess|
        if sess && sess.data[:user_id]
          if sess.data[:user_id]==@user.id
            if @user.last_logout.nil?
              @online_flag = true
              break
            else
              if @user.last_logout.utc <  sess.updated_at.utc
                @online_flag = true
                break
              end
            end
          end
        end
      end


    end
  end
  
  # About event detail method
  
  def edit_event_detail
    render :partial => 'event_detail', :layout => false
  end
  
  # TODO: move the follow method to new controller, eg: calendar_controller
  
  def change_view_mode #no-doc
    @calendar = generate_calendar

    d = Date.today
    get_week_fdate(d)
    @userid = @calendar.userid
    
    if params[:mode].eql?( 'time' )
      render :partial => 'events_time_mode'
    else
      update_calendar 'events_list_mode'
    end
  end
  
  def set_calendar_type
    @calendar = generate_calendar
    @calendar.type = params[:type]
    session[:calendar] = @calendar
    update_calendar 'events_list_mode'
  end
  
  def prev
    @calendar = generate_calendar
    @calendar.move_prev
    update_calendar 'events_list_mode'
  end
  
  def next
    @calendar = generate_calendar
    @calendar.move_next
    update_calendar 'events_list_mode'
  end
  
  def to_current_day
    @calendar = generate_calendar
    @calendar.set_current_day
    session[:calendar] = @calendar
    update_calendar 'events_list_mode'
  end

  #protected
  
  def update_calendar template_name
    calendar = generate_calendar
    options = { :cols => calendar.cols, :rows => calendar.rows, :userid => calendar.userid }
  
    if calendar.is_week?
      options[:begin_at] = calendar.monday
      events = Event.find_one_week_events options
    elsif calendar.is_day?
      options[:begin_at] = calendar.current_day
      events = Event.find_one_day_events options
    end
    
    render :partial => template_name, :locals => { :events_list => events }
  end
  
  def generate_calendar
    session[:calendar] || Calendar.new
  end
  
  def demo
    update = params[:update]
    #logger.info( "DEMO: update => #{params[:update]}" )
    respond_to_iframe :update => update, :template => 'controls/attention_ctrls', :locals => { :user => User.find(1), :current_user => User.find(2) }
  end
  
end
