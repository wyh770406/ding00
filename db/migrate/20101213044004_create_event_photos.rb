class CreateEventPhotos < ActiveRecord::Migration
  def self.up
    create_table (:event_photos, :options => 'ENGINE=InnoDB AUTO_INCREMENT=1 default charset=utf8') do |t|
      t.column        :event_id,       :integer
      t.column      :is_current,    :boolean,:null => false,:default=>false
      t.column :photo_file_name,					:string
      t.column :photo_content_type,					:string
      t.column :photo_file_size,					:integer
      t.column :photo_updated_at,					:datetime
      t.timestamps
    end
        add_index :event_photos,:event_id
  end

  def self.down
    drop_table :event_photos
  end
end
