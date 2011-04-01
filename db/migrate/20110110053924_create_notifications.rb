class CreateNotifications < ActiveRecord::Migration
  def self.up
    create_table (:notifications, :options => 'ENGINE=InnoDB AUTO_INCREMENT=1 default charset=utf8') do |t|
      t.column        :user_id,       :integer
      t.column        :recipient_id,            :integer
      t.column        :notification_type_id,       :integer
      t.column        :remark,       :integer,   :null => false ,:default=>0

      t.timestamps
    end
    add_index :notifications, :user_id
    add_index :notifications, :recipient_id
    add_index :notifications, :notification_type_id
    add_index :notifications, :remark
    add_index :notifications, [:user_id, :recipient_id,:notification_type_id,:remark], :unique => true, :name => 'by_user_recp_noti_remark'
  end

  def self.down
    drop_table :notifications    
  end
end
