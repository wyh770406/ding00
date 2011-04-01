class BehaviourType < ActiveRecord::Base
  has_many :behaviours
  EVENT = "001"
  FOCUSON = "002"
  DELEVENT = "003"
  CANCELFOCUSON = "004"

  def self.behaviour_code code
    self.find_by_code(code).id
  end
end