class CreateEventInvitations < ActiveRecord::Migration
  def self.up
    create_table (:event_invitations, :options => 'ENGINE=InnoDB AUTO_INCREMENT=1 default charset=utf8') do |t|
      t.integer :event_id
      t.integer :invited_id
      t.integer :status
      t.timestamp :accepted_at

      t.timestamps
    end
        add_index :event_invitations, :event_id
    add_index :event_invitations, :invited_id
    add_index :event_invitations, [:event_id, :invited_id], :unique => true
  end

  def self.down
    drop_table :event_invitations
  end
end