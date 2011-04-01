require 'digest/sha1'

class User < ActiveRecord::Base
  include Authentication
  include Authentication::ByPassword
  include Authentication::ByCookieToken


  #  validates_presence_of     :login
  #  validates_length_of       :login,    :within => 3..40
  #  validates_uniqueness_of   :login
  #  validates_format_of       :login,    :with => Authentication.login_regex, :message => Authentication.bad_login_message

  validates_presence_of     :name,     :message => '名字不能为空'
  validates_format_of       :name,     :with => Authentication.name_regex,  :message => Authentication.bad_name_message, :allow_nil => true
  validates_length_of       :name,     :maximum => 100

  validates_presence_of     :email,    :message => '邮箱不能为空'
  #validates_length_of       :email,    :allow_blank => true, :within => 6..100 #r@a.wk
  validates_uniqueness_of   :email,    :allow_blank => true, :message => '此邮箱已被注册'
  validates_format_of       :email,    :allow_blank => true, :with => Authentication.email_regex, :message => '请输入正确的邮箱地址'
  
  validates_presence_of     :password,                   :if => :password_required?, :message => '密码不能为空'
  validates_length_of       :password, :within => 6..40, :if => :password_required?, :too_short => '密码必须大于{{count}}位', :allow_blank => true, 
    :too_long => '密码必须小于{{count}}位'
  
  validates_presence_of     :password_confirmation,      :if => :password_required?, :message => '请再次确认密码'
  validate :password_equal_passwordconfirmation,         :if => :password_changed?
  
  # HACK HACK HACK -- how to do attr_accessible from here?
  # prevents a user from submitting a crafted form that bypasses activation
  # anything else you want your user to change should be added here.
  #  attr_accessible :login, :email, :name, :password, :password_confirmation
  attr_accessible :email, :name, :password, :password_confirmation
  attr_accessible :id, :sex, :year, :month, :day,:last_logout
  attr_accessible :avatar, :old_avatar_file_name
  attr_accessible :userdetail_attributes
  
  has_attached_file :avatar,# :styles => {:large=>"300x300>", :medium => "60x60>", :thumb => "28x28>" },
  :default_url => "/images/default_100x100.jpg"
  #  validates_attachment_presence :avatar
  validates_attachment_size :avatar, :allow_blank => true, :less_than => 5.megabytes
  # validates_attachment_content_type :avatar, :content_type => ['image/jpeg', 'image/png', 'image/gif']
  # Authenticates a user by their email name and unencrypted password.  Returns the user or nil.
  #
  has_many :events
  has_many :event_favorites
  has_one :userdetail, :class_name => 'UserDetail', :dependent => :destroy
  accepts_nested_attributes_for :userdetail, :allow_destroy => true

  has_many :behaviours,:order=>"behaviours.created_at DESC"
  has_many :notifications
  has_many :attentions
  has_many :fans, :class_name => 'Attention', :foreign_key => :attention_id
  has_many :all_attentions, :class_name => 'Attention', :finder_sql =>
    'SELECT DISTINCT * FROM attentions a WHERE a.user_id = #{id} ' +
    'AND EXISTS (SELECT 1 FROM attentions b WHERE a.attention_id = b.user_id AND a.user_id = b.attention_id)'
    
  has_many :friends_behaviours, :class_name => 'Behaviour',:finder_sql =>
    ' SELECT DISTINCT behaviours.*'+
    '  FROM  behaviours'+
    '  INNER JOIN attentions ON attentions.attention_id = behaviours.user_id'+
    '  AND attentions.user_id =#{id}'+
    '  ORDER BY behaviours.created_at DESC'+
    '  LIMIT 6'

  has_many :favorites, :class_name => 'Event',:finder_sql =>
    ' SELECT events.*'+
    '  FROM  events'+
    '  INNER JOIN event_favorites ON event_favorites.event_id = events.id'+
    '  AND event_favorites.user_id =#{id}'+
    '  ORDER BY events.created_at DESC'+
    '  LIMIT 8'
  # messages of user unread, count: unread_messages.size
  has_many :unread_messages, :class_name => 'Message', :conditions => ["status = 0 AND NOT(remove & 1)"], :foreign_key => :recv_id
 
  # uff.  this is really an authorization, not authentication routine.
  # We really need a Dispatch Chain here or something.
  # This will also let us return a human error message.
  #
  def self.authenticate(email, password)
    return nil if email.blank? || password.blank?
    u = find_by_email(email.downcase) # need to get the salt
    u && u.authenticated?(password) ? u : nil
  end

  #  def login=(value)
  #    write_attribute :login, (value ? value.downcase : nil)
  #  end

  def email=(value)
    write_attribute :email, (value ? value.downcase : nil)
  end
  
  def year=(value)
    new_value = value.to_i > 0 ? value.to_i : 1900
    self.birthday = valid_birthday.change( :year => new_value )
  end
  
  def year
    self.birthday.year
  end
  
  def month=(value)
    new_value = value.to_i > 0 ? value.to_i : 1
    self.birthday = valid_birthday.change( :month => new_value )
  end
  
  def month
    self.birthday.month
  end
  
  def day=(value)
    new_value = value.to_i > 0 ? value.to_i : 1
    self.birthday = valid_birthday.change( :day => new_value )
  end
  
  def day
    self.birthday.day
  end
  
  def sex_text
    self.sex ? '男' : '女'
  end
  
  def find_friends options = {}
    # HACK: get 5 user
    # TODO: by id get friends of current user
    User.find( :all, :limit => 5, :conditions => ['id <> ?', id] )
  end

  def find_message_friends options = {}
    # HACK: get 5 user
    # TODO: by id get friends of current user
    User.find( :all, :conditions => ['id <> ?', id] )
  end
  
  def find_attentions
    # HACK: get 5 user
    # TODO: by id get attention of current user
    User.find( :all, :limit => 5, :conditions => ['id <> ?', id] )
  end

  def avatar_url
    @avatar_url = "/images/default_100x100.jpg"
    @old_avatar_file_name = self.old_avatar_file_name
    if  @old_avatar_file_name
      finalurl = self.avatar.url(:original).split('?').first
      imgurl = 'public' + finalurl
      imgdir = File.dirname(Dir.pwd+"/"+imgurl).gsub('original', 'final')

      finalpath = imgdir + "/" + @old_avatar_file_name

      finalurl = finalurl.gsub('original', 'final')
      imgurlstr = finalurl.split("/").last
      finalurl = finalurl.gsub(imgurlstr, @old_avatar_file_name)

      if File.exists?(finalpath) #&& File.directory?(Dir.pwd+"/public/articlesimages/"+(self.id).to_s)
        @avatar_url = finalurl
      end
    end

    #FileUtils.mkdir_p Dir.pwd+"/public/articlesimages/"+(self.id).to_s unless
    @avatar_url
  end
  
  def userdetail_attributes=(attributes)
    if !self.userdetail.nil?
      attributes.delete :id
      self.userdetail.update_attributes attributes
    else
      self.userdetail = UserDetail.create attributes
      # TODO: validates
    end
  end
  
  def birthday_text
    valid_birthday.strftime( '%Y年%m月%d日' )
  end
  
  def attention person
    attentions.each do |attention|
      return attention if attention.attention_id.eql?( person.id )
    end
    nil
  end

  def secure_digest(*args)
    Digest::SHA1.hexdigest(args.flatten.join('--'))
  end

  def make_token
    secure_digest(Time.now, (1..10).map{ rand.to_s })
  end

  def password_reset_url
    "http://127.0.0.1:3000/users/reset_password/"+self.password_reset_token
  end

  def password_reset_exp_token?

    (!self.password_reset_token.blank?) &&
      self.password_reset_token_expires_at && (Time.now < self.password_reset_token_expires_at)
  end

  def rem_password_reset
    self.password_reset_token = make_token
    self.password_reset_token_expires_at = 10.minutes.from_now
    save(false)
  end

  def refresh_password_reset_token
    if password_reset_exp_token?
      self.password_reset_token = make_token
      save(false)
    end
  end

  protected
  
  def password_changed?
    return !password.blank?
  end
  
  def password_equal_passwordconfirmation
    if !password.eql?( password_confirmation ) and !password_confirmation.blank?
      errors.add( :password_confirmation, '密码与确认密码不一致')
    end
  end
  
  def valid_birthday
    self.birthday || Date.new(1900, 1, 1)
  end
 
end
