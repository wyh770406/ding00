class AddNtdata < ActiveRecord::Migration
  def self.up
    NotificationType.create!(:code=>"001",:notification_remark=>"评论",:icon_class=>"comment")
    NotificationType.create!(:code=>"002",:notification_remark=>"活动邀请",:icon_class=>"event")
    NotificationType.create!(:code=>"003",:notification_remark=>"未读消息",:icon_class=>"message")
  end

  def self.down
    NotificationType.destroy_all
  end
end
