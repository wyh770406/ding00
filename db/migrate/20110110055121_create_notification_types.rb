class CreateNotificationTypes < ActiveRecord::Migration
  def self.up
    create_table (:notification_types, :options => 'ENGINE=InnoDB AUTO_INCREMENT=1 default charset=utf8') do |t|
      t.column        :code,       :string,:limit=>3,   :null => false ,:default=>""
      t.column        :notification_remark,       :string,   :null => false ,:default=>""
      t.timestamps
    end
    add_index :notification_types, :code, :unique => true

  end

  def self.down
    drop_table :notification_types
  end
end
