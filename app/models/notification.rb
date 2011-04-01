class Notification < ActiveRecord::Base
  belongs_to :user
  belongs_to :notification_type

  def self.save_notification opts = {}
      notification = self.new(opts)
      notification.save
  end
end

