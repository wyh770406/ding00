class CreateMessages < ActiveRecord::Migration
  def self.up
    create_table :messages, :options => 'ENGINE=InnoDB AUTO_INCREMENT=1 default charset=utf8' do |t|
      t.column :send_id,            :integer,   :null => false
      t.column :recv_id,            :integer,   :null => false
      t.column :title,              :string,    :limit => 256,  :default => ''
      t.column :content,            :text
      t.column :status,             :integer,   :default => 0       # 0 - 未读, x | 1 - 发件人已读, x | 2 - 收件人已读...
      t.column :remove,             :integer,   :default => 0       # 0 - 未删除, x | 1 - 发件人删除, x | 2 - 收件人删除...
      t.timestamps
    end
    add_index :messages, :send_id
    add_index :messages, :recv_id
  end

  def self.down
    drop_table :messages
  end
end
