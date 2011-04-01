class CreateEventNotifications < ActiveRecord::Migration
  def self.up
    create_table (:event_notifications, :options => 'ENGINE=InnoDB AUTO_INCREMENT=1 default charset=utf8') do |t|
      t.column        :event_id,       :integer
      t.column :num_minohour,            :integer,   :null => false ,:default=>0
      t.column :minohour,              :string,    :limit => 50,  :default => ''
      t.column :send_mail_at,					:datetime
      t.column :send_mail_flag,					:boolean,:null=>false, :default=>false
      t.timestamps
    end
    add_index :event_notifications,:event_id
  end

  def self.down
    drop_table :event_notifications
  end
end
