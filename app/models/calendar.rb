require 'system_core'
require 'Lunar_calendar'

class Calendar
  include WeekFormated
  
  def self.default_options
    @default_options ||= {
      :type => 'week',
      :test => 'text',
      :cols => 7,
      :rows => 5,
      :userid => 0
    }
  end
  
  def initialize options = {}
    @options = self.class.default_options.merge( options )
  end
  
  def options
    @options
  end
  
  def options= value
    @options = @options.merge( value )
  end
  
  def type= value
    self.options = { :type => value }
  end
  
  def today 
    Date.today
  end
  
  def current_day
    @current_day ||= today
  end
  
  def current_week
    current_day - monday
  end
  
  def current_week_name
    name_of_week current_week + 1  
  end
  
  def offset_day offset
    monday + offset
  end
  
  def offset_lunar offset = 0
    day = is_week?? (offset_day offset) : current_day
    lunar = Lunarcalendar.new( day )
    lunar.holidays.empty? ? lunar.day : lunar.holidays
  end
  
  def is_week?
    options[:type].eql?( 'week' )
  end
  
  def is_day?
    options[:type].eql?( 'day' )
  end
  
  def is_today? day
    day.eql?( today )
  end
  
  def move_prev
    day = current_day
    day -= is_week?? 7 : 1
    @current_day = day
  end
  
  def move_next
    day = current_day
    day += is_week?? 7 : 1
    @current_day = day
  end
  
  def set_current_day
    @current_day = Date.today
  end

  def monday
    current_day.at_beginning_of_week
  end
  
  def cols
    @options[:cols]
  end
  
  def rows
    @options[:rows]
  end
  
  def userid
    @options[:userid]
  end
  
  def userid= value
    @options[:userid] = value
  end
  
  protected
  
  @options
    
end