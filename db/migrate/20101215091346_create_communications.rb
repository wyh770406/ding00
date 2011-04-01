class CreateCommunications < ActiveRecord::Migration
  def self.up
    create_table (:communications, :options => 'ENGINE=InnoDB AUTO_INCREMENT=1 default charset=utf8') do |t|
      t.string   :subject
      t.text     :content
      t.integer   :parent_id
      t.integer  :sender_id
      t.integer  :recipient_id
      t.datetime :sender_deleted_at
      t.datetime :sender_read_at
      t.datetime :recipient_deleted_at
      t.datetime :recipient_read_at
      t.datetime :replied_at
      t.string   :message_type,:limit=>20,:null => false,:default=>''
      t.timestamps
    end
    add_index :communications, :message_type
    add_index :communications, :sender_id
    add_index :communications, :parent_id
    add_index :communications, :recipient_id
  end

  def self.down
    drop_table :communications
  end
end
