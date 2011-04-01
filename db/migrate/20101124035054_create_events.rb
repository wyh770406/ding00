class CreateEvents < ActiveRecord::Migration
  def self.up
    create_table (:events, :options => 'ENGINE=InnoDB AUTO_INCREMENT=1 default charset=utf8') do |t|
      t.column        :title,          :string,    :null => false
      t.column        :begin_at,       :date
      t.column        :end_at,       :date
      t.column        :begin_time,          :string,    :null => false   ,:limit=>5  ,:default=>""
      t.column        :end_time,          :string,    :null => false   ,:limit=>5  ,:default=>""
      t.column        :address,       :string,   :null => false ,:default=>""
      t.column        :description,       :text,   :null => false ,:default=>""
      t.column        :user_id,       :integer

      t.column        :private,      :string,    :null => false   ,:limit=>1  ,:default=>""
      t.column        :color,  :string, :null=>false, :default=>"#333333"
      t.timestamps
    end

    add_index :events,:user_id
    add_index :events, :begin_at
    add_index :events, :end_at
  end

  def self.down
    drop_table :events
  end
end
