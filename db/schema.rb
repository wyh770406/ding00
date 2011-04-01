# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110209041531) do

  create_table "attentions", :force => true do |t|
    t.integer  "user_id",      :null => false
    t.integer  "attention_id", :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "attentions", ["user_id", "attention_id"], :name => "index_attentions_on_user_id_and_attention_id", :unique => true

  create_table "behaviour_types", :force => true do |t|
    t.string   "code",             :limit => 3, :default => "", :null => false
    t.string   "behaviour_remark",              :default => "", :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "behaviour_types", ["code"], :name => "index_behaviour_types_on_code", :unique => true

  create_table "behaviours", :force => true do |t|
    t.integer  "user_id"
    t.integer  "behaviour_type_id"
    t.string   "remark",            :default => "", :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "behaviours", ["behaviour_type_id"], :name => "index_behaviours_on_behaviour_type_id"
  add_index "behaviours", ["user_id"], :name => "index_behaviours_on_user_id"

  create_table "comments", :force => true do |t|
    t.integer  "commenter_id"
    t.integer  "parent_id"
    t.integer  "commentable_id"
    t.string   "commentable_type", :default => "", :null => false
    t.text     "body"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "recv_id"
  end

  add_index "comments", ["commentable_id", "commentable_type"], :name => "index_comments_on_commentable_id_and_commentable_type"
  add_index "comments", ["commenter_id"], :name => "index_comments_on_commenter_id"
  add_index "comments", ["recv_id"], :name => "index_comments_on_recv_id"

  create_table "communication_users", :force => true do |t|
    t.integer  "session_id"
    t.integer  "accepter_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "communication_users", ["accepter_id"], :name => "index_communication_users_on_accepter_id"
  add_index "communication_users", ["session_id", "accepter_id"], :name => "index_communication_users_on_session_id_and_accepter_id", :unique => true
  add_index "communication_users", ["session_id"], :name => "index_communication_users_on_session_id"

  create_table "communications", :force => true do |t|
    t.string   "subject"
    t.text     "content"
    t.integer  "parent_id"
    t.integer  "sender_id"
    t.integer  "recipient_id"
    t.datetime "sender_deleted_at"
    t.datetime "sender_read_at"
    t.datetime "recipient_deleted_at"
    t.datetime "recipient_read_at"
    t.datetime "replied_at"
    t.string   "message_type",         :limit => 20, :default => "", :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "communications", ["message_type"], :name => "index_communications_on_message_type"
  add_index "communications", ["parent_id"], :name => "index_communications_on_parent_id"
  add_index "communications", ["recipient_id"], :name => "index_communications_on_recipient_id"
  add_index "communications", ["sender_id"], :name => "index_communications_on_sender_id"

  create_table "delayed_jobs", :force => true do |t|
    t.integer  "priority",   :default => 0
    t.integer  "attempts",   :default => 0
    t.text     "handler"
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "delayed_jobs", ["priority", "run_at"], :name => "delayed_jobs_priority"

  create_table "event_favorites", :force => true do |t|
    t.integer  "user_id"
    t.integer  "event_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "event_favorites", ["event_id"], :name => "index_event_favorites_on_event_id"
  add_index "event_favorites", ["user_id", "event_id"], :name => "index_event_favorites_on_user_id_and_event_id", :unique => true
  add_index "event_favorites", ["user_id"], :name => "index_event_favorites_on_user_id"

  create_table "event_invitations", :force => true do |t|
    t.integer  "event_id"
    t.integer  "invited_id"
    t.integer  "status"
    t.datetime "accepted_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "deleted_at"
  end

  add_index "event_invitations", ["event_id", "invited_id"], :name => "index_event_invitations_on_event_id_and_invited_id", :unique => true
  add_index "event_invitations", ["event_id"], :name => "index_event_invitations_on_event_id"
  add_index "event_invitations", ["invited_id"], :name => "index_event_invitations_on_invited_id"

  create_table "event_notifications", :force => true do |t|
    t.integer  "event_id"
    t.integer  "num_minohour",                 :default => 0,     :null => false
    t.string   "minohour",       :limit => 50, :default => ""
    t.datetime "send_mail_at"
    t.boolean  "send_mail_flag",               :default => false, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "event_notifications", ["event_id"], :name => "index_event_notifications_on_event_id"

  create_table "event_photos", :force => true do |t|
    t.integer  "event_id"
    t.boolean  "is_current",         :default => false, :null => false
    t.string   "photo_file_name"
    t.string   "photo_content_type"
    t.integer  "photo_file_size"
    t.datetime "photo_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "event_photos", ["event_id"], :name => "index_event_photos_on_event_id"

  create_table "events", :force => true do |t|
    t.string   "title",                                                                          :null => false
    t.date     "begin_at"
    t.date     "end_at"
    t.string   "begin_time",     :limit => 5,   :default => "",                                  :null => false
    t.string   "end_time",       :limit => 5,   :default => "",                                  :null => false
    t.string   "address",                       :default => "",                                  :null => false
    t.text     "description",                                                                    :null => false
    t.integer  "user_id"
    t.string   "private",        :limit => 1,   :default => "",                                  :null => false
    t.string   "color",                         :default => "#333333",                           :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "cover_url",      :limit => 100, :default => "/images/default_event_100x100.png", :null => false
    t.integer  "comments_count"
  end

  add_index "events", ["begin_at"], :name => "index_events_on_begin_at"
  add_index "events", ["end_at"], :name => "index_events_on_end_at"
  add_index "events", ["user_id"], :name => "index_events_on_user_id"

  create_table "messages", :force => true do |t|
    t.integer  "send_id",                                   :null => false
    t.integer  "recv_id",                                   :null => false
    t.string   "title",      :limit => 256, :default => ""
    t.text     "content"
    t.integer  "status",                    :default => 0
    t.integer  "remove",                    :default => 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "messages", ["recv_id"], :name => "index_messages_on_recv_id"
  add_index "messages", ["send_id"], :name => "index_messages_on_send_id"

  create_table "notification_types", :force => true do |t|
    t.string   "code",                :limit => 3,  :default => "", :null => false
    t.string   "notification_remark",               :default => "", :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "icon_class",          :limit => 50
  end

  add_index "notification_types", ["code"], :name => "index_notification_types_on_code", :unique => true

  create_table "notifications", :force => true do |t|
    t.integer  "user_id"
    t.integer  "recipient_id"
    t.integer  "notification_type_id"
    t.integer  "remark",               :default => 0, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "notifications", ["notification_type_id"], :name => "index_notifications_on_notification_type_id"
  add_index "notifications", ["recipient_id"], :name => "index_notifications_on_recipient_id"
  add_index "notifications", ["remark"], :name => "index_notifications_on_remark"
  add_index "notifications", ["user_id", "recipient_id", "notification_type_id", "remark"], :name => "by_user_recp_noti_remark", :unique => true
  add_index "notifications", ["user_id"], :name => "index_notifications_on_user_id"

  create_table "sessions", :force => true do |t|
    t.string   "session_id", :null => false
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sessions", ["session_id"], :name => "index_sessions_on_session_id"
  add_index "sessions", ["updated_at"], :name => "index_sessions_on_updated_at"

  create_table "user_details", :force => true do |t|
    t.integer  "user_id"
    t.string   "now_country",  :limit => 10, :default => "", :null => false
    t.string   "now_province", :limit => 20, :default => "", :null => false
    t.string   "now_city",     :limit => 20, :default => "", :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "mobile",       :limit => 20, :default => "", :null => false
    t.text     "remark"
  end

  add_index "user_details", ["user_id"], :name => "index_user_details_on_user_id"

  create_table "users", :force => true do |t|
    t.string   "name",                            :limit => 100, :default => ""
    t.string   "email",                           :limit => 100
    t.string   "crypted_password",                :limit => 40
    t.string   "salt",                            :limit => 40
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "remember_token",                  :limit => 40
    t.datetime "remember_token_expires_at"
    t.boolean  "sex",                                            :default => true
    t.date     "birthday"
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.string   "old_avatar_file_name"
    t.integer  "newmsgcount",                                    :default => 0,    :null => false
    t.integer  "newcommentcount",                                :default => 0,    :null => false
    t.integer  "newsystemcount",                                 :default => 0,    :null => false
    t.datetime "last_logout"
    t.string   "password_reset_token",            :limit => 40
    t.datetime "password_reset_token_expires_at"
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true

end
