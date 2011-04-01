class CreateCommunicationUsers < ActiveRecord::Migration
  def self.up
        create_table (:communication_users, :options => 'ENGINE=InnoDB AUTO_INCREMENT=1 default charset=utf8 ') do |t|
            t.column        :session_id,      :integer
            t.column        :accepter_id,      :integer

            t.timestamps
        end
        add_index :communication_users, :session_id
        add_index :communication_users, :accepter_id
        add_index :communication_users, [:session_id, :accepter_id], :unique => true
  end

  def self.down
        drop_table :communication_users
  end
end
