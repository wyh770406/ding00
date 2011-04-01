class AddIconclass < ActiveRecord::Migration
  def self.up
        add_column :notification_types, :icon_class, :string,:limit=>50
  end

  def self.down
    remove_column :notification_types, :icon_class
  end
end
