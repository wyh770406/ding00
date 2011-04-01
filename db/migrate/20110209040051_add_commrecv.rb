class AddCommrecv < ActiveRecord::Migration
  def self.up
    add_column :comments, :recv_id, :integer
    add_index :comments, :recv_id
  end

  def self.down
    remove_column :comments, :recv_id
  end
end
