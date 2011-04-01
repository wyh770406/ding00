require 'system_core'
class Event < ActiveRecord::Base
  PUBLIC='0'
  PRIVATE='1'
  include WeekFormated
	belongs_to :user
	has_many :eventPhotos,:dependent=>:destroy
  accepts_nested_attributes_for :eventPhotos
  
  has_many :comments, :as => :commentable, :order => 'created_at DESC',:dependent=>:destroy

  named_scope :getevent, lambda {|*event| {:conditions=>[ "user_id=? and end_at >= ? and begin_at <= ?", event[0],event[1],event[2] ]}}
	has_many :eventInvitations, :dependent => :destroy
  named_scope :getinvite, lambda {|event| {
      :select => "events.*",
      :joins => ["INNER JOIN event_invitations ON events.id = event_invitations.event_id "],
      :conditions=>[ "event_invitations.invited_id=? and event_invitations.status = ? ", event,1 ]}}
  attr_accessor :begin_datetime,:end_datetime
	has_many :event_favorites, :dependent => :destroy
	def begin_datetime
    self.begin_at.to_s(:long)+" "+self.begin_time+":00"
  end
	
  def end_datetime
    self.end_at.to_s(:long)+" "+self.end_time+":00"
  end
	
  def begin_sdt 
    self.begin_at.strftime( '%Y年%m月%d日' )+" "+name_of_week(self.begin_at.wday)+" "+self.begin_time
  end
  
  def end_sdt 
    self.end_at.strftime( '%Y年%m月%d日' )+" "+name_of_week(self.begin_at.wday)+" "+self.end_time
  end

  def self.find_one_week_events options
    list = init_one_week_list
    begin_at = options[:begin_at]
    rows = options[:rows] || 0
    cols = options[:cols] || 0
    userid = options[:userid]
    
    cols.times do |day|
      events_of_day = []
      events_of_day = find(:all, :conditions => ['user_id = ? AND begin_at = ?', userid, begin_at + day], :limit => rows)
      events_of_day.each_index do |i|
        list[i][day] = events_of_day[i]
      end
    end
    
    list
  end
  
  def self.find_one_day_events options
    list = init_one_week_list
    begin_at = options[:begin_at]
    rows = options[:rows] || 0
    cols = options[:cols] || 0
    userid = options[:userid]
    
    events = find( :all, :conditions => ['user_id = ? AND begin_at = ?', userid, begin_at], :limit => rows * cols)
    
    index = 0
    rows.times do |row|
      cols.times do |col|
        break if index >= events.size
        list[row][col] = events[index]
        index += 1
      end
    end
    
    list
  end
  
  def invitations
    ids = []
    eventInvitations.each do |invi|
      ids << invi.invited_id
    end
    (ids * ',').to_s
  end
  
  def invitations=(ids)
    eventInvitations.destroy_all
    ids_arr = ids.split( ',' )
    ids_arr.each do |invited_id|
      eventInvitations << EventInvitation.new( { :event_id => id, :invited_id => invited_id, :status => 2 } )
    end
  end

  def can_favorite person
    person.attentions.each do |attention|
      return true if attention.user.eql?(self.user)
    end
    return false
  end

  def self_creator? person
    (self.user==person) ? true:false
  end

  def favorite_count
    self.event_favorites.size
  end

  def favorite_users
    favor_users = []
    self.event_favorites.each do |event_favorite|
      favor_users<<event_favorite.user
    end
    favor_users
  end

  def attending_count
    self.eventInvitations.find_all_by_status(EventInvitation::ACCEPT).size + 1
  end

  def attending_users
    attending_users = []
    attending_users<<self.user
    self.eventInvitations.find_all_by_status(EventInvitation::ACCEPT).each do |event_invitation|
      attending_users<<event_invitation.invited
    end

    attending_users
  end
  def type_name
    if self.private==''
      ""
    else
      (self.private=='0') ? "公共活动":"私人活动"
    end

  end

  def be_invited? person
    self.eventInvitations.find_by_event_id_and_invited_id(self.id,person.id).nil? ? false:true
  end

  def be_favorited? person
    self.event_favorites.find_by_event_id_and_user_id(self.id,person.id).nil? ? false:true
  end

  def past_deadline?

    8.hours.from_now.utc > str_to_datetime(self.end_at.to_s,self.end_time).utc
  end

  def is_selected? person
    unless self.eventInvitations.find_by_event_id_and_invited_id(self.id,person.id).nil?
      self.eventInvitations.find_by_event_id_and_invited_id(self.id,person.id).status != EventInvitation::PENDING
    else
      false
    end
  end

  def status_selected person
    unless self.eventInvitations.find_by_event_id_and_invited_id(self.id,person.id).nil?
      self.eventInvitations.find_by_event_id_and_invited_id(self.id,person.id).status
    else
      nil
    end
  end
  protected
  
  def self.init_one_week_list
    list = Array.new(5){ Array.new(7, nil) }
  end

  private

  def str_to_datetime(date_str,time_str)
    arr_date = date_str.split("-")
    arr_time = time_str.split(":")
    DateTime.new(arr_date[0].to_i,arr_date[1].to_i,arr_date[2].to_i,arr_time[0].to_i,arr_time[1].to_i,0)
  end
end
