class AddCommcount < ActiveRecord::Migration
  def self.up
    add_column :events, :comments_count, :integer
  end

  def self.down
    remove_column :events, :comments_count
  end
end
