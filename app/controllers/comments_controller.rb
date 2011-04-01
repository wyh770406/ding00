class CommentsController < ApplicationController
  before_filter :login_required

  def index
    @event=Event.find(params[:event_id])
    @total_comments_count = @event.comments.size

    @start_pos=params[:start].to_i
    @per_page_num = params[:limit].to_i
    @curr_page = @start_pos/@per_page_num + 1

    @event_comments = Comment.find_event_comments(params[:event_id], {:page => @curr_page, :per_page =>@per_page_num })
    render :json=>{:totalCount=>@total_comments_count, :comments=>@event_comments}.to_json
  end

  def new

  end

  def create

    begin
      @current_user=self.current_user
      @event=Event.find(params[:event_id])

      @comment=Comment.create({:commenter=>@current_user ,
          :body=>params[:comment_body] ,
          :commentable=>@event})
      if @comment && @comment.errors.empty?
        build_notification(@comment,NotificationType::COMMENT)
        render :json => {:success => true, :comment => @comment}.to_json
      else
        render :json => {:success => false, :error => @comment.errors}.to_json
      end
    rescue Exception => e
      logger.error "Error Occured:"+e.inspect
      render :json => {:success => false, :error => '提交评论时发生内部错误'}.to_json
    end
   
  end

  def reply
    begin
      @current_user=self.current_user
      @comment = Comment.find(params[:comment_id])
      @commentable = @comment.commentable

      @reply_comment=Comment.create!({:commenter=>@current_user,
          :body=>params[:reply_comment_body],
          :parent_id=>@comment.id,
          :recv_id=>@comment.commenter_id,
          :commentable=>@commentable})

      if @reply_comment && @reply_comment.errors.empty?
        build_notification(@reply_comment,NotificationType::COMMENT)
        render :json => {:success => true, :comment => @reply_comment}.to_json
      else
        render :json => {:success => false, :error => @reply_comment.errors}.to_json
      end
    rescue Exception => e
      logger.error "Error Occured:"+e.inspect
      render :json => {:success => false, :error => '回复评论时发生内部错误'}.to_json
    end
  end
end
