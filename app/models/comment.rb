class Comment < ActiveRecord::Base

  belongs_to :commentable, :polymorphic => true
  belongs_to :commenter, :class_name => "User",
    :foreign_key => "commenter_id"

  belongs_to :recver, :class_name => "User",
    :foreign_key => "recv_id"

  belongs_to :parent_comment, :class_name => "Comment",
    :foreign_key => "parent_id"

  belongs_to :event, :counter_cache => true


  def to_json(options = {})

    @recv=recver.nil? ? "":recver.name

    @recvid=recver.nil? ? "":recver.id
    %Q({"id":"#{id}","avatar":"#{commenter.avatar_url}","replyid":"#{commenter.id}","reply":"#{commenter.name}","recvid":"#{@recvid}","recv":"#{@recv}","date":"#{created_at.to_s(:db)}"
      ,"content":"#{body.gsub(/(\r)?\n/, '<br />') }"})
  end

  def self.find_event_comments(event_id, page_options = {})
    page_options = { :page => 1, :per_page => 10 }.merge!( page_options )
    paginate :page => page_options[:page], :per_page => page_options[:per_page],
      :conditions => ["commentable_id = ? AND commentable_type = 'Event'", event_id], :order => 'created_at DESC'
  end

  def notify_user
    @the_commenter = self.commenter
    if self.recv_id.nil?
      @event_creator = self.commentable.user

      if @the_commenter != @event_creator
        @event_creator.id
      else
        nil
      end

    else

      @the_recver = self.recver
      if @the_commenter != @the_recver
        @the_recver.id
      else
        nil
      end
    end

  end
end
