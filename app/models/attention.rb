class Attention < ActiveRecord::Base
  validates_uniqueness_of :user_id, :scope => :attention_id, :message => '您已关注对方'
  
  has_one :user, :primary_key => :attention_id, :foreign_key => :id
  has_one :fan, :class_name => 'User', :primary_key => :user_id, :foreign_key => :id
  #has_one :attention_user
  
  def self.find_by_user_and_user attention = {}
    if attention.has_key?(:user_id) and attention.has_key?(:attention_id)
      return find(:all, :conditions => ['user_id = ? AND attention_id = ?', attention[:user_id], attention[:attention_id]] )
    end
    nil
  end
end
