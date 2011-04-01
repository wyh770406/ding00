class CreateBehaviourTypes < ActiveRecord::Migration
  def self.up
    create_table (:behaviour_types, :options => 'ENGINE=InnoDB AUTO_INCREMENT=1 default charset=utf8') do |t|
      t.column        :code,       :string,:limit=>3,   :null => false ,:default=>""
      t.column        :behaviour_remark,       :string,   :null => false ,:default=>""
      t.timestamps
    end
    add_index :behaviour_types, :code, :unique => true
  end

  def self.down
    drop_table :behaviour_types
  end
end
