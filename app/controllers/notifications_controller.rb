class NotificationsController < ApplicationController
  before_filter :login_required

  def view_detail
    @current_user = self.current_user
    respond_to do |format|
      format.html {
        case params[:id]
        when NotificationType::COMMENT
          Notification.delete_all(["recipient_id = ? and notification_type_id = ?",@current_user.id, NotificationType.notification_code(NotificationType::COMMENT)])
          redirect_to :back
        when NotificationType::EVENT
          Notification.delete_all(["recipient_id = ? and notification_type_id = ?",@current_user.id, NotificationType.notification_code(NotificationType::EVENT)])
          redirect_to invitations_notifications_url
        when NotificationType::MESSAGE
          Notification.delete_all(["recipient_id = ? and notification_type_id = ?",@current_user.id, NotificationType.notification_code(NotificationType::MESSAGE)])
          redirect_to recv_messages_url
        end
      }
    end
  end
  
  def ignore_detail
    @current_user = self.current_user
    respond_to do |format|
      format.html {
        case params[:id]
        when NotificationType::COMMENT
          Notification.delete_all(["recipient_id = ? and notification_type_id = ?",@current_user.id, NotificationType.notification_code(NotificationType::COMMENT)])
        when NotificationType::EVENT
          Notification.delete_all(["recipient_id = ? and notification_type_id = ?",@current_user.id, NotificationType.notification_code(NotificationType::EVENT)])
        when NotificationType::MESSAGE
          Notification.delete_all(["recipient_id = ? and notification_type_id = ?",@current_user.id, NotificationType.notification_code(NotificationType::MESSAGE)])
        end
        render :nothing=>true
      }
    end
  end
  
  def getall
    if request.xhr?
      render :json => json_type_notification
    else
      render :nothing => true
    end
  end
  
  def getinvitations
    #if request.xhr?
      render :text => json_event_invitation(:page => 1, :per_page => 10)
    #else
    #  render :nothing => true
    #end
  end
end
