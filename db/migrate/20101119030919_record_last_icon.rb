class RecordLastIcon < ActiveRecord::Migration
  def self.up
        add_column :users,      :old_avatar_file_name,					:string
  end

  def self.down
        remove_column :users, :old_avatar_file_name
  end
end
