class AddEventcurl < ActiveRecord::Migration
  def self.up
    add_column :events, :cover_url, :string,:null=>false,:default=>'/images/default_event_100x100.png',:limit=>100

  end

  def self.down
    remove_column :events, :cover_url
  end
end
