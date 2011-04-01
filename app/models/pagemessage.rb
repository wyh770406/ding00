class PageMessage
  
  def initialize options = {}
    @text = options[:text] 
    @caption = options[:caption]
    @messages = []
    
    options[:messages].each { |attr, msg| @messages << msg } if options.has_key?( :messages )
    
    if options.has_key?(:text)
      @messages << options[:text]
    end
  end
  
  def caption
    @caption
  end
  
  def each
    @messages.each { |msg| yield msg }
  end
  
end