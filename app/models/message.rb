class Message < ActiveRecord::Base
  DELETED_BY_RECEIVER   = 1
  DELETED_BY_SENDER     = 2
  READ_BY_RECEIVER      = 1
  READ_BY_SENDER        = 2
  REPLY_BY_RECEIVER     = 4
  
  has_one :receiver, :class_name => 'User', :primary_key => 'recv_id', :foreign_key => 'id'
  has_one :sender, :class_name => 'User', :primary_key => 'send_id', :foreign_key => 'id'
  
  validates_presence_of :recv_id, :message => '请在好友列表中选择好友'
  validates_presence_of :title, :message => '请输入站内信的主题' 
  validates_presence_of :content, :message => '请输入站内信的内容' 
  
  def self.find_sent_messages(send_id, page_options = {})
    page_options = { :page => 1, :per_page => 10 }.merge!( page_options )
    paginate :page => page_options[:page], :per_page => page_options[:per_page], 
      :conditions => ["send_id = ? AND NOT(remove & #{DELETED_BY_SENDER})", send_id], :order => 'created_at DESC'
    #find(:all, :conditions => ["send_id = ? AND NOT(remove & #{DELETED_BY_SENDER})", send_id], :limit => 10, :order => 'created_at DESC')
  end
  
  def self.find_recv_messages(recv_id, page_options = {})
    page_options = { :page => 1, :per_page => 10 }.merge!( page_options )
    logger.info( "[DING00 DEBUG] page_options => #{page_options}" )
    paginate :page => page_options[:page], :per_page => page_options[:per_page], 
      :conditions => ["recv_id = ? AND NOT(remove & #{DELETED_BY_RECEIVER})", recv_id], :order => 'created_at DESC'
    #find(:all, :conditions => ["recv_id = ? AND NOT(remove & #{DELETED_BY_RECEIVER})", recv_id], :limit => 10, :order => 'created_at DESC')
  end
  
  def self.empty_recv_box recv_id
    update_all( "remove = (remove | #{DELETED_BY_RECEIVER})", "recv_id = #{recv_id}" )
  end
  
  def self.empty_sent_box send_id
    update_all( "remove = (remove | #{DELETED_BY_SENDER})", "send_id = #{send_id}" )
  end
  
  def self.delete_all_recv ids
    update_all( "remove = (remove | #{DELETED_BY_RECEIVER})", "id IN (#{ids})" )
  end
  
  def self.delete_all_sent ids
    update_all( "remove = (remove | #{DELETED_BY_SENDER})", "id IN (#{ids})" )
  end
  
  def remove_recv
    update_attribute(:remove, self.remove | DELETED_BY_RECEIVER)
  end
    
  def remove_sent
    update_attribute(:remove, self.remove | DELETED_BY_SENDER)
  end
  
  def set_recv_readed
    update_attribute(:status, self.status | READ_BY_RECEIVER)
  end
  
  def set_sent_readed
    update_attribute(:status, self.status | READ_BY_SENDER)
  end
  
  def set_recv_replied
    update_attribute(:status, self.status | REPLY_BY_RECEIVER)
  end
  
  def is_readed_recv?
    return (self.status & READ_BY_RECEIVER) == READ_BY_RECEIVER
  end
    
  def is_readed_send?
    return (self.status & READ_BY_SENDER) == READ_BY_SENDER
  end
  
  def is_replied_recv?
    return (self.status & REPLY_BY_RECEIVER) == REPLY_BY_RECEIVER
  end
end
