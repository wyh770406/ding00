class AddUserBaseinfo < ActiveRecord::Migration
  def self.up
    add_column :users,      :sex,         :boolean,     :default => true # true = 男, false = 女
    add_column :users,      :birthday,    :date
  end

  def self.down
    remove_column :users, :sex
    remove_column :users, :birthday
  end
end
