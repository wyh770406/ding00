# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.
  
require 'pagemessage'
include AuthenticatedSystem
require 'system_core'
class ApplicationController < ActionController::Base

  helper :all # include all helpers, all the time
  protect_from_forgery # See ActionController::RequestForgeryProtection for details
  include CustomJson
  include FolderImgfilelist
  include SendNotification
  include PasswordResethc
  # Scrub sensitive parameters from your log
  # filter_parameter_logging :password
  
  protected
  
  def respond_to_iframe opts = {}
    begin
      #logger.info( "[DING00 DEBUG] update: #{opts.to_s}" )
      if opts.has_key?(:update) && opts.has_key?(:template) && !opts[:update].empty?
        responds_to_parent do
          render :update do |page|
            page.replace_html opts[:update], :partial => opts[:template], :locals => opts[:locals]
          end
        end
      else
        render :nothing => true
      end
    rescue Exception => e
      logger.error( "[DING00 ERROR] response_to_iframe failed. (#{e.backtrace}" )
    else
      ''
    end
  end
  
  def redirect_to_home
    p "dddhhhjjj"
    p "sadfasf"
    redirect_to :controller => :home, :action => :index
  end
  
  def getFileName(filename)   
    if !filename.nil?   
      Time.now.strftime("%Y_%m_%d_%H_%M_%S") + '_' + filename   
    end   
  end
  
  def uploadFile(file, opts = {})
    options = {:path => 'upload', :timename => false}.merge!(opts)
    if !file.original_filename.empty?
      filepath = "#{RAILS_ROOT}/public/#{options[:path]}"
      filename = options[:timename] ? getFileName(file.original_filename) : file.original_filename
      #logger.info( "[ding00 INFO] #{RAILS_ROOT}/public/#{options[:path]}/#{filename}" )
      if !File.directory?(filepath)
        FileUtils.mkdir_p(filepath)
      end
      
      File.open("#{filepath}/#{filename}", "wb") do |f|
        f.write(file.read)
      end
    end
  end
  
end

class Object
  def as_(string, *args)
    # p "called"
    if string
      r = I18n.t(string,*args)
      if (r =~ /^translation missing/)
        return string
      end
      return r
    else
      return string
    end
  rescue
    return string
  end
end