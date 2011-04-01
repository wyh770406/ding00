class NotificationType < ActiveRecord::Base
  has_many :notifications
  COMMENT = "001"
  EVENT = "002"
  MESSAGE = "003"

  def self.notification_code code
    self.find_by_code(code).id
  end

  def count_by_type recp_id
    self.notifications.find_all_by_recipient_id(recp_id).size

  end
end
