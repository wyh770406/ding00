class CreateBehaviours < ActiveRecord::Migration
  def self.up

    create_table (:behaviours, :options => 'ENGINE=InnoDB AUTO_INCREMENT=1 default charset=utf8') do |t|
      t.column        :user_id,       :integer
      t.column        :behaviour_type_id,       :integer
      t.column        :remark,       :string,   :null => false ,:default=>""

      t.timestamps
    end
    add_index :behaviours, :user_id
    add_index :behaviours, :behaviour_type_id
  end

  def self.down
    drop_table :behaviours
  end
end
