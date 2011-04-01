class Behaviour < ActiveRecord::Base
  belongs_to :user
  belongs_to :behaviour_type

  def self.save_behaviour opts = {}
      behaviour = self.new(opts)
      behaviour.save
  end
end
