class CreateEventFavorites < ActiveRecord::Migration
  def self.up
    create_table (:event_favorites, :options => 'ENGINE=InnoDB AUTO_INCREMENT=1 default charset=utf8') do |t|
      t.integer :user_id
      t.integer :event_id

      t.timestamps
    end
    add_index :event_favorites, :user_id
    add_index :event_favorites, :event_id

    add_index :event_favorites, [:user_id, :event_id], :unique => true
  end

  def self.down
    drop_table :event_favorites
  end
end
