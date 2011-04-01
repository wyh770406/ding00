class AddPwdResetToken < ActiveRecord::Migration
  def self.up
    add_column :users, :password_reset_token, :string, :limit => 40
    add_column :users,:password_reset_token_expires_at, :datetime
  end

  def self.down
    remove_column :users, :password_reset_token
    remove_column :users, :password_reset_token_expires_at
  end
end
