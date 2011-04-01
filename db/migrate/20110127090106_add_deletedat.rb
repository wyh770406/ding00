class AddDeletedat < ActiveRecord::Migration
  def self.up
    add_column :event_invitations, :deleted_at, :datetime
  end

  def self.down
    remove_column :event_invitations, :deleted_at
  end
end
