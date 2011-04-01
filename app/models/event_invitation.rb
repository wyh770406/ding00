class EventInvitation < ActiveRecord::Base
  REFUSE=0
  ACCEPT=1
  PENDING=2

  belongs_to :invited, :class_name => "User",
    :foreign_key => "invited_id"
  named_scope :getinvited, lambda {|event| {:conditions=>[ "event_id=? ", event ]}}
  belongs_to :event

  def self.find_event_invitations(invite_id, page_options = {})
    page_options = { :page => 1, :per_page => 10 }.merge!( page_options )
    paginate :page => page_options[:page], :per_page => page_options[:per_page],
      :conditions => ["invited_id = ? AND deleted_at IS NULL", invite_id], :order => 'created_at DESC'
  end
end