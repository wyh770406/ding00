class CreateAttentions < ActiveRecord::Migration
  def self.up
    create_table :attentions, :options => 'ENGINE=InnoDB AUTO_INCREMENT=1 default charset=utf8' do |t|
      t.column  :user_id,                   :integer,           :null => false
      t.column  :attention_id,              :integer,           :null => false
      t.column  :created_at,                :datetime
      t.column  :updated_at,                :datetime
      
      t.timestamps
    end
    
    add_index :attentions, [:user_id, :attention_id], :unique  => true
  end

  def self.down
    remove_index :attentions, :column => [:user_id, :attention_id]
    drop_table :attentions
  end
end
