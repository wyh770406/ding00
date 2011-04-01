require 'active_record/fixtures'

class LoadTestUser < ActiveRecord::Migration
  def self.up
    down
    directory = File.join( File.dirname(__FILE__), 'data' )
    Fixtures.create_fixtures( directory, 'users' )
  end

  def self.down
    User.delete_all
  end
end
