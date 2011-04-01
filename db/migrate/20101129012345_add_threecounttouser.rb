class AddThreecounttouser < ActiveRecord::Migration
  def self.up
    add_column :users, :newmsgcount, :integer,:null=>false,:default=>0
    add_column :users, :newcommentcount, :integer,:null=>false,:default=>0
    add_column :users, :newsystemcount, :integer,:null=>false,:default=>0

  end

  def self.down
    remove_column :users, :newmsgcount
    remove_column :users, :newcommentcount
    remove_column :users, :newsystemcount

  end
end