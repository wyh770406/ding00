module EventsHelper
  def add_uploader_link(name)
    link_to_function name,:class=>"orange" do |page|
      page.insert_html :bottom, :uploader_box, :partial => 'event_photo_uploader', :object => EventPhoto.new
    end
  end
end

