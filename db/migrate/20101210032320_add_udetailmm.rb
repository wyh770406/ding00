class AddUdetailmm < ActiveRecord::Migration
  def self.up
    add_column :user_details,      :mobile,					:string,   :null => false ,:default=>"",:limit=>20
    add_column :user_details,      :remark,					:text
  end

  def self.down
    remove_column :user_details, :mobile
    remove_column :user_details, :remark
  end
end
