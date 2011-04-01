class AddBtdata < ActiveRecord::Migration
  def self.up
    BehaviourType.create!(:code=>"001",:behaviour_remark=>"创建事件")
    BehaviourType.create!(:code=>"002",:behaviour_remark=>"添加关注")
    BehaviourType.create!(:code=>"003",:behaviour_remark=>"删除事件")
    BehaviourType.create!(:code=>"004",:behaviour_remark=>"取消关注")
  end

  def self.down
    BehaviourType.destroy_all
  end
end
